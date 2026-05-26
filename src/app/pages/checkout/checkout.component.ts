import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { MetodoPagamento, PedidoService } from '../services/pedido/pedido.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  selectedMethod: 'cartao' | 'boleto' | 'pix' | null = null;
  pixCode = '';
  boletoLinhaDigitavel = '';
  paymentMessage = '';
  cartItems: any[] = [];
  total = 0;
  processing = false;

  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';
  isBackVisible = false;
  cardBrand = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private pedidoService: PedidoService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.cartItems = navigation?.extras.state?.['cartItems'] || this.cartService.getCart();
  }

  updateName(event: any): void {
    this.cardName = event.target.value.toUpperCase();
  }

  updateExpiry(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    this.cardExpiry = value;
  }

  updateCvv(event: any): void {
    this.cardCvv = event.target.value;
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

    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num) || (Number(bin4) >= 2221 && Number(bin4) <= 2720)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';

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
    return '';
  }

  updateNumber(event: any): void {
    const digits = (event.target.value || '').replace(/\D/g, '');
    this.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
    this.cardBrand = this.detectCardBrand(digits);
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();
  }

  selectMethod(method: 'cartao' | 'boleto' | 'pix'): void {
    this.selectedMethod = method;
    this.pixCode = '';
    this.boletoLinhaDigitavel = '';
    this.paymentMessage = '';
  }

  gerarBoleto(): void {
    this.finalizarCompra();
  }

  copiarPix(): void {
    if (!this.pixCode) return;
    navigator.clipboard.writeText(this.pixCode);
  }

  finalizarCompra(): void {
    if (!this.selectedMethod || this.cartItems.length === 0 || this.processing) return;

    this.processing = true;
    this.pixCode = '';
    this.boletoLinhaDigitavel = '';
    this.paymentMessage = '';

    const itens = this.cartItems.map((item) => ({
      nomeProduto: item.name,
      quantidade: 1,
      precoUnitario: item.price
    }));

    this.pedidoService.criarPedido({ itens }).subscribe({
      next: (pedidoResponse) => {
        const pedidoId = pedidoResponse?.id ?? pedidoResponse?.pedidoId ?? pedidoResponse?.data?.id;
        if (!pedidoId) {
          this.processing = false;
          this.paymentMessage = 'Pedido criado, mas o ID nao foi retornado.';
          return;
        }

        this.pedidoService.processarPagamento(Number(pedidoId), this.selectedMethod as MetodoPagamento).subscribe({
          next: (pagamentoResponse) => {
            this.processing = false;
            this.handlePagamentoResponse(this.selectedMethod as MetodoPagamento, pagamentoResponse);
          },
          error: () => {
            this.processing = false;
            this.paymentMessage = 'Falha ao processar pagamento.';
          }
        });
      },
      error: () => {
        this.processing = false;
        this.paymentMessage = 'Falha ao criar pedido.';
      }
    });
  }

  getTotalPrice(): number {
    return this.cartService.getTotal();
  }

  private handlePagamentoResponse(method: MetodoPagamento, response: any): void {
    if (method === 'pix') {
      this.pixCode = response?.codigoPix ?? response?.pixCode ?? response?.codigo ?? 'PIX gerado.';
      this.paymentMessage = 'Pagamento PIX gerado com sucesso.';
      return;
    }

    if (method === 'boleto') {
      this.boletoLinhaDigitavel = response?.linhaDigitavel ?? response?.boleto ?? response?.codigoBarras ?? 'Boleto gerado.';
      this.paymentMessage = 'Boleto gerado com sucesso.';
      return;
    }

    this.paymentMessage = response?.mensagem ?? response?.status ?? 'Pagamento com cartao processado com sucesso.';
  }
}