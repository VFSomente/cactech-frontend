import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../product/product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Product[] = [];

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private cartItemsSubject = new BehaviorSubject<Product[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem('cart') || '[]');
      this.cart = Array.isArray(saved) ? saved : [];
    } catch {
      this.cart = [];
    }
    this.updateCartState();
  }

  getCart(): Product[] {
    return this.cart;
  }

  addToCart(product: Product): void {
    this.cart.push(product);
    this.updateCartState();
  }

  /** Remove o item na posição indicada (funciona mesmo para itens antigos sem id). */
  removeAt(index: number): void {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
      this.updateCartState();
    }
  }

  clearCart(): void {
    this.cart = [];
    this.updateCartState();
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price, 0);
  }

  getTotalItems(): number {
    return this.cart.length;
  }

  private updateCartState(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartCount.next(this.cart.length);
    this.cartItemsSubject.next([...this.cart]);
  }
}
