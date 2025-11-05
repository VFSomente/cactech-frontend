import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCount.asObservable();
  private cart: any[] = [];

  constructor() {
    // Recupera do localStorage ao iniciar
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cartItems = JSON.parse(saved);
      this.cartCount.next(this.cartItems.length);
    }
  }

  addToCart(product: any) {
    this.cartItems.push(product);
    this.updateStorage();
  }

  removeFromCart(id: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.updateStorage();
  }

  clearCart() {
    this.cartItems = [];
    this.updateStorage();
  }

  getCart() {
    return this.cartItems;
  }

    getTotalItems() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  private updateStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartCount.next(this.cartItems.length);
  }
}
