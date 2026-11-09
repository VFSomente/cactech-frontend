import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { ToastService } from '../services/toast/toast.service';
import { FavoritesService } from '../services/favorites/favorites.service';
import { Department, Product, ProductService } from '../services/product/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, RouterLink, ProductCardComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private favoritesService = inject(FavoritesService);
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  productId!: number;
  product: Product | undefined;
  department: Department | undefined;
  related: Product[] = [];
  favoriteIds = new Set<number>();
  loading = true;
  loadError = false;

  readonly pixDiscount = 0.1;

  ngOnInit(): void {
    // paramMap (e não snapshot) para atualizar ao navegar entre produtos relacionados
    this.route.paramMap
      .pipe(
        tap((params) => {
          this.productId = Number(params.get('id'));
          this.loading = true;
          this.loadError = false;
          this.related = [];
        }),
        switchMap(() =>
          this.productService.getById(this.productId).pipe(
            catchError(() => {
              this.loadError = true;
              return of(undefined);
            })
          )
        ),
        tap((product) => {
          this.product = product;
          this.department = this.productService.getDepartment(product?.department);
          this.loading = false;
        }),
        switchMap((product) =>
          product ? this.productService.related(product).pipe(catchError(() => of([] as Product[]))) : of([] as Product[])
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((related) => (this.related = related));

    this.favoritesService.favorites$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => (this.favoriteIds = new Set(list.map((p) => p.id))));
  }

  get code(): string {
    return String(this.productId).padStart(5, '0');
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.show(`${product.name} foi adicionado ao carrinho.`);
  }

  buyNow(product: Product): void {
    this.cartService.addToCart(product);
    this.router.navigate(['/cart']);
  }

  toggleFavorite(product: Product): void {
    const added = this.favoritesService.toggle(product);
    this.toastService.show(added ? 'Produto salvo nos favoritos.' : 'Produto removido dos favoritos.', 'info');
  }
}
