import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];
  
  // 🔹 Observables para contagem e itens do carrinho
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    this.cart = savedCart ? JSON.parse(savedCart) : [];
    this.updateCartState();
  }

  // 🔹 Retorna o carrinho atual
  getCart() {
    return this.cart;
  }

  // 🔹 Adiciona um item
  addToCart(product: any) {
    this.cart.push(product);
    this.updateCartState();
  }

  // 🔹 Remove apenas uma ocorrência do produto
  removeFromCart(item: any) {
    const index = this.cart.findIndex(cartItem => cartItem.id === item.id);
    if (index !== -1) {
      this.cart.splice(index, 1);
      this.updateCartState();
    }
  }

  // 🔹 Limpa o carrinho
  clearCart() {
    this.cart = [];
    this.updateCartState();
  }

  // 🔹 Total do carrinho
  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.price, 0);
  }

  // 🔹 Total de itens
  getTotalItems() {
    return this.cart.length;
  }

  // ===========================================================
  // 🔧 MÉTODOS AUXILIARES INTERNOS
  // ===========================================================

  private updateCartState() {
    this.saveCart();
    this.cartCount.next(this.cart.length);
    this.cartItemsSubject.next([...this.cart]); // 🔹 emite nova cópia do carrinho
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
}
