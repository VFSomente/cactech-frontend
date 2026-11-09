import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../services/favorites/favorites.service';
import { CartService } from '../services/cart/cart.service';
import { ToastService } from '../services/toast/toast.service';
import { Product } from '../services/product/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [AsyncPipe, RouterLink, ProductCardComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  favorites$ = this.favoritesService.favorites$;

  remove(product: Product): void {
    this.favoritesService.remove(product.id);
    this.toastService.show('Produto removido dos favoritos.', 'info');
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.show(`${product.name} foi adicionado ao carrinho.`);
  }
}
