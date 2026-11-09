import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartItem, CartService } from '../services/cart/cart.service';
import { MetodoPagamento, PedidoService } from '../services/pedido/pedido.service';
import { ToastService } from '../services/toast/toast.service';

interface PaymentOption {
  id: MetodoPagamento;
  label: string;
  hint: string;
  icon: string;
  action: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  readonly paymentOptions: PaymentOption[] = [
    { id: 'cartao', label: 'Cartão de crédito', hint: 'Até 12x sem juros', icon: 'fa-regular fa-credit-card', action: 'Pagar com cartão' },
    { id: 'pix', label: 'Pix', hint: 'Código copia e cola', icon: 'fa-solid fa-qrcode', action: 'Gerar código Pix' },
    { id: 'boleto', label: 'Boleto bancário', hint: 'Vence em 3 dias', icon: 'fa-solid fa-barcode', action: 'Gerar boleto' }
  ];
  private readonly brandImages = ['visa', 'mastercard', 'elo', 'hipercard'];

  selectedMethod: MetodoPagamento | null = null;
  pixCode = '';
  boletoLinhaDigitavel = '';
  paymentMessage = '';
  paymentError = false;
  cartItems: CartItem[] = [];
  processing = false;
  /** Pedido concluído (pagamento registrado). */
  orderId?: number;
  /** Pedido criado cujo pagamento ainda não deu certo. */
  private pendingOrderId?: number;

  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';
  isBackVisible = false;
  cardBrand = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private pedidoService: PedidoService,
    private toastService: ToastService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.cartItems = navigation?.extras.state?.['cartItems'] || this.cartService.getCart();
  }

  get selectedOption(): PaymentOption | undefined {
    return this.paymentOptions.find((o) => o.id === this.selectedMethod);
  }

  get brandImage(): string {
    return this.brandImages.includes(this.cardBrand) ? `assets/images/payments/${this.cardBrand}.png` : '';
  }

  updateName(event: Event): void {
    this.cardName = (event.target as HTMLInputElement).value.toUpperCase();
  }

  updateExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    this.cardExpiry = value;
    input.value = value;
  }

  updateCvv(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.cardCvv = input.value.replace(/\D/g, '');
    input.value = this.cardCvv;
  }

  flipCard(flip: boolean): void {
    this.isBackVisible = flip;
  }

  detectCardBrand(rawNumber: string): string {
    const num = (rawNumber || '').replace(/\D/g, '');
    if (!num) return '';
    const bin6 = num.slice(0, 6);
    const bin4 = num.slice(0, 4);
    const bin6num = parseInt(bin6, 10);

    const hipercardPrefixes = ['606282', '384100', '384140', '384160', '384120'];
    if (hipercardPrefixes.includes(bin6) || hipercardPrefixes.includes(bin4)) return 'hipercard';

    const eloBins = ['401178', '401179', '431274', '438935', '451416', '457393', '457631', '457632', '504175', '506699', '627780', '636297', '636368'];
    if (eloBins.includes(bin6)) return 'elo';

    const eloRanges = [
      [506699, 506778],
      [509000, 509999],
      [650031, 650033],
      [650035, 650051],
      [650405, 650439],
      [650485, 650538],
      [650541, 650598],
      [650700, 650718],
      [650720, 650727],
      [650901, 650920],
      [651652, 651679],
      [655000, 655058]
    ];
    for (const [start, end] of eloRanges) {
      if (bin6num >= start && bin6num <= end) return 'elo';
    }

    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num) || (Number(bin4) >= 2221 && Number(bin4) <= 2720)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return '';
  }

  updateNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = (input.value || '').replace(/\D/g, '').slice(0, 16);
    this.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
    this.cardBrand = this.detectCardBrand(digits);
    input.value = this.cardNumber;
  }

  selectMethod(method: MetodoPagamento): void {
    if (this.orderId) return; // pedido já concluído
    this.selectedMethod = method;
    this.pixCode = '';
    this.boletoLinhaDigitavel = '';
    this.paymentMessage = '';
    this.paymentError = false;
  }

  copiarPix(): void {
    if (!this.pixCode) return;
    navigator.clipboard.writeText(this.pixCode).then(
      () => this.toastService.show('Código Pix copiado.'),
      () => this.toastService.show('Não foi possível copiar o código.', 'error')
    );
  }

  finalizarCompra(): void {
    if (!this.selectedMethod || this.cartItems.length === 0 || this.processing || this.orderId) return;

    this.processing = true;
    this.pixCode = '';
    this.boletoLinhaDigitavel = '';
    this.paymentMessage = '';
    this.paymentError = false;

    // Se o pedido já foi criado e só o pagamento falhou, reaproveita o mesmo pedido
    if (this.pendingOrderId) {
      this.pagar(this.pendingOrderId);
      return;
    }

    const itens = this.cartItems.map((item) => ({
      produtoId: item.id,
      nomeProduto: item.name,
      quantidade: item.quantity,
      precoUnitario: item.price
    }));

    this.pedidoService.criarPedido({ itens }).subscribe({
      next: (pedidoResponse) => {
        const pedidoId = Number(pedidoResponse?.id);
        if (!pedidoId) {
          this.processing = false;
          this.fail('Pedido criado, mas o número do pedido não foi retornado.');
          return;
        }
        this.pendingOrderId = pedidoId;
        this.pagar(pedidoId);
      },
      error: () => {
        this.processing = false;
        this.fail('Não foi possível criar o pedido. Tente novamente.');
      }
    });
  }

  private pagar(pedidoId: number): void {
    const method = this.selectedMethod as MetodoPagamento;
    this.pedidoService.processarPagamento(pedidoId, method).subscribe({
      next: (pagamentoResponse) => {
        this.processing = false;
        this.orderId = pedidoId;
        this.pendingOrderId = undefined;
        this.cartService.clearCart();
        this.handlePagamentoResponse(method, pagamentoResponse);
      },
      error: () => {
        this.processing = false;
        this.fail('Não foi possível processar o pagamento. Tente novamente.');
      }
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private fail(message: string): void {
    this.paymentError = true;
    this.paymentMessage = message;
  }

  private handlePagamentoResponse(method: MetodoPagamento, response: any): void {
    if (method === 'pix') {
      this.pixCode = response?.codigoPix ?? response?.pixCode ?? response?.codigo ?? 'PIX gerado.';
      this.paymentMessage = 'Código Pix gerado com sucesso.';
      return;
    }

    if (method === 'boleto') {
      this.boletoLinhaDigitavel = response?.linhaDigitavel ?? response?.boleto ?? response?.codigoBarras ?? 'Boleto gerado.';
      this.paymentMessage = 'Boleto gerado com sucesso.';
      return;
    }

    this.paymentMessage = response?.mensagem ?? response?.status ?? 'Pagamento com cartão processado com sucesso.';
  }
}
