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

  constructor(private router: Router, private cartService: CartService,) {
    const navigation = this.router.getCurrentNavigation();
    this.cartItems = navigation?.extras.state?.['cartItems'] || [];
  }

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
