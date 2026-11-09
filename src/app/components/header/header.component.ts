import { Component, DestroyRef, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { LogoComponent } from '../logo/logo.component';
import { CartService } from '../../pages/services/cart/cart.service';
import { FavoritesService } from '../../pages/services/favorites/favorites.service';
import { AuthService } from '../../pages/services/auth/auth.service';
import { UserProfile, UserService } from '../../pages/services/user/user.service';
import { DEPARTMENTS } from '../../pages/services/product/product.service';

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterLink, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private host = inject(ElementRef<HTMLElement>);

  readonly departments = DEPARTMENTS;

  cartCount = 0;
  favoritesCount = 0;
  currentUser: UserProfile | null = null;
  menuOpen = false;
  searchTerm = '';
  activeDepartment: string | null = null;
  isHome = true;

  ngOnInit(): void {
    this.cartService.cartCount$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((count) => (this.cartCount = count));

    this.favoritesService.favorites$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => (this.favoritesCount = list.length));

    this.userService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => (this.currentUser = user));

    this.userService.refreshMeIfToken(this.authService.getToken());

    // Mantém a busca e o departamento ativo em sincronia com a URL
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const tree = this.router.parseUrl(this.router.url);
        const path = this.router.url.split(/[?#]/)[0];
        this.isHome = path === '/' || path === '';
        this.searchTerm = this.isHome ? tree.queryParams['q'] ?? '' : '';
        this.activeDepartment = this.isHome ? tree.queryParams['dep'] ?? null : null;
        this.menuOpen = false;
      });
  }

  get isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  /** Primeiro nome do usuário, ou vazio enquanto os dados não carregaram. */
  get userName(): string {
    const u = this.currentUser;
    const full = (u?.nome || u?.nomeCompleto || u?.username || '').trim();
    return full.split(/\s+/)[0];
  }

  get userAvatar(): string {
    return this.currentUser?.avatarUrl || '';
  }

  search(): void {
    const q = this.searchTerm.trim();
    this.router.navigate(['/'], { queryParams: q ? { q } : {} });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.clearToken();
    this.userService.clearCurrentUser();
    this.menuOpen = false;
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: MouseEvent): void {
    if (!this.menuOpen) return;
    const menu = this.host.nativeElement.querySelector('.user-menu');
    if (menu && !menu.contains(event.target as Node)) {
      this.menuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  closeMenuOnEscape(): void {
    this.menuOpen = false;
  }
}
