import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { CartService } from '../services/cart/cart.service';
import { ToastService } from '../services/toast/toast.service';
import { FavoritesService } from '../services/favorites/favorites.service';
import {
  DEPARTMENTS,
  Department,
  DepartmentSlug,
  Product,
  ProductService,
  ProductSort
} from '../services/product/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

interface HeroSlide {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  department: DepartmentSlug;
  /** Categoria usada para escolher o produto em destaque (o mais caro dela). */
  category?: string;
  product?: Product;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, ProductCardComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  readonly departments = DEPARTMENTS;

  // ---------- Vitrine ----------
  query = '';
  department: Department | undefined;
  sort: ProductSort = 'relevance';
  private sort$ = new BehaviorSubject<ProductSort>('relevance');
  products: Product[] = [];
  loading = true;
  loadError = false;
  favoriteIds = new Set<number>();
  departmentCounts: Partial<Record<DepartmentSlug, number>> = {};

  get isFiltered(): boolean {
    return !!this.query || !!this.department;
  }

  get listingTitle(): string {
    if (this.query) return `Resultados para "${this.query}"`;
    return this.department?.label ?? 'Todos os produtos';
  }

  // ---------- Banner ----------
  slides: HeroSlide[] = [
    {
      eyebrow: 'Computadores',
      title: 'PCs gamer montados e prontos para jogar',
      text: 'Configurações com AMD Ryzen, Intel Core e placas GeForce RTX para todos os orçamentos.',
      cta: 'Ver computadores',
      department: 'computadores'
    },
    {
      eyebrow: 'Hardware',
      title: 'Mais FPS para o seu setup',
      text: 'Placas de vídeo, processadores, memórias e fontes das principais marcas.',
      cta: 'Ver hardware',
      department: 'hardware',
      category: 'Placa de vídeo'
    },
    {
      eyebrow: 'Monitores',
      title: 'Imagem rápida, fluida e sem borrões',
      text: 'Monitores gamer de 21" a 49", com taxas de atualização de 100 Hz a 310 Hz.',
      cta: 'Ver monitores',
      department: 'monitores'
    }
  ];
  currentSlide = 0;
  private sliderTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Lista da vitrine: reage à URL (?q= / ?dep=) e à ordenação
    combineLatest([this.route.queryParamMap, this.sort$])
      .pipe(
        tap(([params]) => {
          this.query = (params.get('q') ?? '').trim();
          this.department = this.productService.getDepartment(params.get('dep'));
          this.loading = true;
          this.loadError = false;
        }),
        switchMap(([, sort]) =>
          this.productService.search(this.query, this.department?.slug, sort).pipe(
            catchError(() => {
              this.loadError = true;
              return of([] as Product[]);
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((list) => {
        this.products = list;
        this.loading = false;
      });

    // Catálogo completo: destaques do banner e contagem por departamento
    this.productService
      .getAll()
      .pipe(
        catchError(() => of([] as Product[])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((all) => this.buildHighlights(all));

    this.favoritesService.favorites$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => (this.favoriteIds = new Set(list.map((p) => p.id))));

    this.startSlider();
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  onSortChange(value: string): void {
    this.sort = value as ProductSort;
    this.sort$.next(this.sort);
  }

  retry(): void {
    this.sort$.next(this.sort);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.show(`${product.name} foi adicionado ao carrinho.`);
  }

  toggleFavorite(product: Product): void {
    const added = this.favoritesService.toggle(product);
    this.toastService.show(added ? 'Produto salvo nos favoritos.' : 'Produto removido dos favoritos.', 'info');
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.startSlider(); // reinicia a contagem após clique manual
  }

  private buildHighlights(all: Product[]): void {
    this.departmentCounts = {};
    for (const p of all) {
      this.departmentCounts[p.department] = (this.departmentCounts[p.department] ?? 0) + 1;
    }

    this.slides = this.slides.map((slide) => {
      const candidates = all.filter(
        (p) => p.department === slide.department && (!slide.category || p.category === slide.category)
      );
      const product = candidates.reduce<Product | undefined>((best, p) => (!best || p.price > best.price ? p : best), undefined);
      return { ...slide, product };
    });
  }

  private startSlider(): void {
    this.stopSlider();
    this.sliderTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 6000);
  }

  private stopSlider(): void {
    if (this.sliderTimer) {
      clearInterval(this.sliderTimer);
      this.sliderTimer = undefined;
    }
  }
}
