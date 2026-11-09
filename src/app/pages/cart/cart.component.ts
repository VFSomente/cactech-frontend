import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { CartItem, CartService, MAX_QUANTITY } from '../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly maxQuantity = MAX_QUANTITY;

  cartItems: CartItem[] = [];
  total = 0;
  unitCount = 0;

  ngOnInit(): void {
    this.cartService.cartItems$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((items) => {
      this.cartItems = items;
      this.total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      this.unitCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  increment(item: CartItem): void {
    this.cartService.increment(item.id);
  }

  decrement(item: CartItem): void {
    this.cartService.decrement(item.id);
  }

  remove(item: CartItem): void {
    this.cartService.remove(item.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  finalizarCompra(): void {
    this.router.navigate(['/checkout'], {
      state: { cartItems: this.cartItems }
    });
  }
}
