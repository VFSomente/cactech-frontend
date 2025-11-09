import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favorites');
    this.favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  removeFavorite(productId: number): void {
    this.favorites = this.favorites.filter(p => p.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
  goToProducts(): void {
  this.router.navigate(['/']);
}
}
