import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type DepartmentSlug = 'computadores' | 'kit-upgrade' | 'hardware' | 'monitores';

export type ProductSort = 'relevance' | 'price-asc' | 'price-desc';

export interface Department {
  slug: DepartmentSlug;
  label: string;
  icon: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  department: DepartmentSlug;
  category: string;
  description?: string;
}

/** Formato devolvido por GET /api/produtos. */
interface ProdutoApi {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  imagem: string;
  departamento: DepartmentSlug;
  categoria: string;
}

export const DEPARTMENTS: Department[] = [
  { slug: 'computadores', label: 'Computadores', icon: 'fa-solid fa-desktop', description: 'PCs gamer e de escritório prontos para usar' },
  { slug: 'kit-upgrade', label: 'Kits Upgrade', icon: 'fa-solid fa-layer-group', description: 'Processador e placa-mãe que já funcionam juntos' },
  { slug: 'hardware', label: 'Hardware', icon: 'fa-solid fa-microchip', description: 'Placas de vídeo, processadores, memórias e fontes' },
  { slug: 'monitores', label: 'Monitores', icon: 'fa-solid fa-display', description: 'Monitores gamer de 100 Hz a 310 Hz' }
];

const SORT_PARAM: Record<ProductSort, string | null> = {
  relevance: null,
  'price-asc': 'menor-preco',
  'price-desc': 'maior-preco'
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/produtos`;
  private catalog$?: Observable<Product[]>;

  /** Catálogo completo, buscado uma vez e reaproveitado (nova tentativa automática se der erro). */
  getAll(): Observable<Product[]> {
    if (!this.catalog$) {
      this.catalog$ = this.http.get<ProdutoApi[]>(this.baseUrl).pipe(
        map((list) => list.map(toProduct)),
        shareReplay(1)
      );
    }
    return this.catalog$;
  }

  /** Busca no servidor por texto e/ou departamento, já ordenada. */
  search(query: string, department?: DepartmentSlug, sort: ProductSort = 'relevance'): Observable<Product[]> {
    let params = new HttpParams();
    if (query) params = params.set('busca', query);
    if (department) params = params.set('departamento', department);
    const ordenar = SORT_PARAM[sort];
    if (ordenar) params = params.set('ordenar', ordenar);

    return this.http.get<ProdutoApi[]>(this.baseUrl, { params }).pipe(map((list) => list.map(toProduct)));
  }

  /** Retorna `undefined` se o produto não existir (404); outros erros seguem adiante. */
  getById(id: number): Observable<Product | undefined> {
    if (!Number.isInteger(id) || id < 1) return of(undefined);
    return this.http.get<ProdutoApi>(`${this.baseUrl}/${id}`).pipe(
      map(toProduct),
      catchError((err: HttpErrorResponse) => (err.status === 404 ? of(undefined) : throwError(() => err)))
    );
  }

  related(product: Product, limit = 4): Observable<Product[]> {
    return this.search('', product.department).pipe(
      map((list) => list.filter((p) => p.id !== product.id).slice(0, limit))
    );
  }

  getDepartment(slug: string | null | undefined): Department | undefined {
    return DEPARTMENTS.find((d) => d.slug === slug);
  }
}

function toProduct(p: ProdutoApi): Product {
  return {
    id: p.id,
    name: p.nome,
    price: Number(p.preco),
    image: p.imagem,
    department: p.departamento,
    category: p.categoria,
    description: p.descricao ?? undefined
  };
}
