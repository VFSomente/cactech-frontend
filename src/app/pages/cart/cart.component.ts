import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { Product } from '../services/product/product.service';

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

  cartItems: Product[] = [];
  total = 0;

  ngOnInit(): void {
    this.cartService.cartItems$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((items) => {
      this.cartItems = items;
      this.total = items.reduce((sum, item) => sum + item.price, 0);
    });
  }

  removeFromCart(index: number): void {
    this.cartService.removeAt(index);
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
