import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { ToastService } from '../services/toast/toast.service';
import { FavoritesService } from '../services/favorites/favorites.service';
import { DEPARTMENTS, Department, DepartmentSlug, Product, ProductService } from '../services/product/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

type SortOption = 'relevance' | 'price-asc' | 'price-desc';

interface HeroSlide {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  department: DepartmentSlug;
  product: Product;
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
  sort: SortOption = 'relevance';
  products: Product[] = [];
  favoriteIds = new Set<number>();

  get isFiltered(): boolean {
    return !!this.query || !!this.department;
  }

  get listingTitle(): string {
    if (this.query) return `Resultados para "${this.query}"`;
    return this.department?.label ?? 'Todos os produtos';
  }

  // ---------- Banner ----------
  readonly slides: HeroSlide[] = [
    {
      eyebrow: 'Computadores',
      title: 'PCs gamer montados e prontos para jogar',
      text: 'Configurações com AMD Ryzen, Intel Core e placas GeForce RTX para todos os orçamentos.',
      cta: 'Ver computadores',
      department: 'computadores',
      product: this.productService.getById(26)!
    },
    {
      eyebrow: 'Hardware',
      title: 'Mais FPS para o seu setup',
      text: 'Placas de vídeo, processadores, memórias e fontes das principais marcas.',
      cta: 'Ver hardware',
      department: 'hardware',
      product: this.productService.getById(12)!
    },
    {
      eyebrow: 'Monitores',
      title: 'Imagem rápida, fluida e sem borrões',
      text: 'Monitores gamer de 21" a 49", com taxas de atualização de 100 Hz a 310 Hz.',
      cta: 'Ver monitores',
      department: 'monitores',
      product: this.productService.getById(16)!
    }
  ];
  currentSlide = 0;
  private sliderTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.query = (params.get('q') ?? '').trim();
      this.department = this.productService.getDepartment(params.get('dep'));
      this.applyFilters();
    });

    this.favoritesService.favorites$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => (this.favoriteIds = new Set(list.map((p) => p.id))));

    this.startSlider();
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  countIn(slug: DepartmentSlug): number {
    return this.productService.countByDepartment(slug);
  }

  onSortChange(value: string): void {
    this.sort = value as SortOption;
    this.applyFilters();
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

  private applyFilters(): void {
    const list = [...this.productService.search(this.query, this.department?.slug)];
    if (this.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (this.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    this.products = list;
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
