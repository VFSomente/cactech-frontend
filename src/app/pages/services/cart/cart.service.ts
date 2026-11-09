import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../product/product.service';

export interface CartItem extends Product {
  quantity: number;
}

/** Limite por produto, para evitar pedidos acidentais enormes. */
export const MAX_QUANTITY = 10;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = [];

  /** Quantidade total de unidades (soma das quantidades). */
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  // Chave nova: os ids mudaram quando o catálogo passou a vir da API
  private readonly storageKey = 'cactech:cart';

  constructor() {
    localStorage.removeItem('cart'); // formato antigo (ids 0–27)
    this.cart = this.read();
    this.updateCartState();
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  /** Adiciona uma unidade; se o produto já estiver no carrinho, soma na quantidade. */
  addToCart(product: Product): void {
    const existing = this.cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + 1, MAX_QUANTITY);
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.updateCartState();
  }

  increment(productId: number): void {
    this.setQuantity(productId, (this.find(productId)?.quantity ?? 0) + 1);
  }

  /** Diminui uma unidade, sem passar de 1 (para tirar o item, use remove). */
  decrement(productId: number): void {
    this.setQuantity(productId, (this.find(productId)?.quantity ?? 1) - 1);
  }

  remove(productId: number): void {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.updateCartState();
  }

  clearCart(): void {
    this.cart = [];
    this.updateCartState();
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTotalItems(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  private find(productId: number): CartItem | undefined {
    return this.cart.find((item) => item.id === productId);
  }

  private setQuantity(productId: number, quantity: number): void {
    const item = this.find(productId);
    if (!item) return;
    item.quantity = Math.max(1, Math.min(quantity, MAX_QUANTITY));
    this.updateCartState();
  }

  /** Lê o carrinho salvo; carrinhos antigos (um registro por unidade) são agrupados por produto. */
  private read(): CartItem[] {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      if (!Array.isArray(saved)) return [];
      const grouped = new Map<number, CartItem>();
      for (const entry of saved) {
        if (entry?.id == null) continue;
        const qty = Number.isInteger(entry.quantity) && entry.quantity > 0 ? entry.quantity : 1;
        const current = grouped.get(entry.id);
        if (current) current.quantity = Math.min(current.quantity + qty, MAX_QUANTITY);
        else grouped.set(entry.id, { ...entry, quantity: Math.min(qty, MAX_QUANTITY) });
      }
      return [...grouped.values()];
    } catch {
      return [];
    }
  }

  private updateCartState(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
    this.cartCount.next(this.getTotalItems());
    this.cartItemsSubject.next(this.cart.map((item) => ({ ...item })));
  }
}
