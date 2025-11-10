import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  selectedMethod: 'cartao' | 'boleto' | 'pix' | null = null;
  pixCode: string = '';
  cartItems: any[] = [];
  total = 0;

  constructor(private router: Router, private cartService: CartService) {
    const navigation = this.router.getCurrentNavigation();
    this.cartItems = navigation?.extras.state?.['cartItems'] || [];
  }



  // método cartão de crédito
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';
  isBackVisible = false;

  updateName(event: any) {
    this.cardName = event.target.value.toUpperCase();
  }

  updateExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    this.cardExpiry = value;
  }

  updateCvv(event: any) {
    this.cardCvv = event.target.value;
  }

  flipCard(flip: boolean) {
    this.isBackVisible = flip;
  }

cardBrand: string = '';


/** retorna a bandeira: 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | '' */
detectCardBrand(rawNumber: string): string {
  const num = (rawNumber || '').replace(/\D/g, '');
  if (!num) return '';

  const bin6 = num.slice(0, 6);
  const bin4 = num.slice(0, 4);
  const bin2 = num.slice(0, 2);
  const bin1 = num.slice(0, 1);
  const bin6num = parseInt(bin6);

  // VISA
  if (/^4/.test(num)) return 'visa';

  // MASTERCARD (51-55 e 2221-2720)
  if (/^5[1-5]/.test(num) || (Number(bin4) >= 2221 && Number(bin4) <= 2720)) return 'mastercard';

  // AMEX
  if (/^3[47]/.test(num)) return 'amex';

  // HIPERCARD (alguns prefixos conhecidos)
  const hipercardPrefixes = ['606282','384100','384140','384160','384120'];
  if (hipercardPrefixes.includes(bin6) || hipercardPrefixes.includes(bin4)) return 'hipercard';

    // 🔷 ELO (versão completa e confiável)
  const eloBins = [
    '401178','401179','431274','438935','451416','457393','457631','457632','504175','506699','506770','506771',
    '506772','506773','506774','506775','506776','506777','506778','509000','509001','509002','509003','509004',
    '509005','509006','509007','509008','509009','509010','509011','509012','509013','509014','509015','509016',
    '509017','509018','509019','509020','509021','509022','509023','509024','509025','509026','509027','509028',
    '509029','509030','509031','509032','509033','509034','509035','509036','509037','509038','509039','509040',
    '509041','509042','509043','509044','509045','509046','509047','509048','509049','509050','509051','509052',
    '509053','509054','509055','509056','509057','509058','509059','509060','509061','509062','509063','509064',
    '509065','509066','509067','509068','509069','509070','509071','509072','509073','627780','636297','636368'
  ];
  if (eloBins.includes(bin6)) return 'elo';

  // Ranges numéricos Elo adicionais (abrangência estendida)
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
    [655000, 655019],
    [655021, 655058],
  ];

  for (const [start, end] of eloRanges) {
    if (bin6num >= start && bin6num <= end) return 'elo';
  }

  console.debug('Bandeira não detectada:', bin6);
  return '';
}

updateNumber(event: any) {
  let input = event.target.value || '';
  // opcional: formata com espaços a cada 4 dígitos
  let digits = input.replace(/\D/g, '');
  const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
  this.cardNumber = formatted;

  // detecta passando a string com dígitos (a função limpa de novo, mas ok)
  this.cardBrand = this.detectCardBrand(digits);
}



////////////////////////////////////////////////////////////////////////////////
    loadCart(): void {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();
  }

  selectMethod(method: 'cartao' | 'boleto' | 'pix') {
    this.selectedMethod = method;
    if (method === 'pix') {
      this.pixCode = '00020126580014BR.GOV.BCB.PIX0136pix@cactech.com520400005303986540512.345802BR5920CacTech LTDA6009SAO PAULO62100506ABC1236304ABCD';
    }
  }

  gerarBoleto() {
    alert('✅ Boleto gerado com sucesso!');
  }

  copiarPix() {
    navigator.clipboard.writeText(this.pixCode);
    alert('📋 Código Pix copiado!');
  }

  finalizarCompra() {
    alert('🎉 Compra finalizada com sucesso!');
  }

    getTotalPrice(): number {
    return this.cartService.getTotal();
  }
}
