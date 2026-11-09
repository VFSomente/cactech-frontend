import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../product/product.service';

/** Favoritos salvos no navegador, compartilhados entre cabeçalho, vitrine e página de favoritos. */
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  // Chave nova: os ids mudaram quando o catálogo passou a vir da API
  private readonly storageKey = 'cactech:favorites';
  private readonly subject = new BehaviorSubject<Product[]>(this.read());
  readonly favorites$ = this.subject.asObservable();

  get favorites(): Product[] {
    return this.subject.value;
  }

  isFavorite(id: number): boolean {
    return this.subject.value.some((p) => p.id === id);
  }

  /** Alterna o produto e retorna `true` se ele passou a ser favorito. */
  toggle(product: Product): boolean {
    if (this.isFavorite(product.id)) {
      this.remove(product.id);
      return false;
    }
    this.save([...this.subject.value, product]);
    return true;
  }

  remove(id: number): void {
    this.save(this.subject.value.filter((p) => p.id !== id));
  }

  private save(list: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
    this.subject.next(list);
  }

  private read(): Product[] {
    localStorage.removeItem('favorites'); // formato antigo (ids 0–27)
    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }
}
