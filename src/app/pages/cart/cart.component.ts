import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // 🔁 Carrega carrinho e total do serviço
  loadCart(): void {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();
  }

  // ⬅️ Voltar à página inicial
  voltar(): void {
    this.router.navigate(['/']);
  }

  // ❌ Remover item
  removeFromCart(item: any): void {
    this.cartService.removeFromCart(item);
    this.loadCart();
  }

  // 🧹 Limpar tudo
  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  // 📊 Totais
  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }

  getTotalPrice(): number {
    return this.cartService.getTotal();
  }

  // ✅ Finalizar compra
  finalizarCompra() {
    // 🔹 Navega para o checkout com os produtos no estado da rota
    this.router.navigate(['/checkout'], {
      state: { cartItems: this.cartItems }
    });
  }
}
