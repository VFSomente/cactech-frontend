import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface UserProfile {
  nome?: string;
  nomeCompleto?: string;
  username: string;
  email: string;
  telefone?: string;
  endereco?: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = environment.apiUrl;
  private readonly apiHost = this.baseUrl.replace(/\/api\/?$/, '');
  private readonly currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  getMe(): Observable<UserProfile> {
    return this.http
      .get<UserProfile>(`${this.baseUrl}/auth/me`)
      .pipe(tap((user) => this.currentUserSubject.next(this.normalizeUser(user))));
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http
      .put<UserProfile>(`${this.baseUrl}/usuarios/perfil`, data)
      .pipe(tap((user) => this.currentUserSubject.next(this.normalizeUser(user))));
  }

  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ avatarUrl: string }>(`${this.baseUrl}/usuarios/avatar`, formData).pipe(
      tap((response) => {
        const current = this.currentUserSubject.value;
        if (current) {
          this.currentUserSubject.next({
            ...current,
            avatarUrl: this.resolveAvatarUrl(response.avatarUrl)
          });
        }
      })
    );
  }

  refreshMeIfToken(token: string | null): void {
    if (!token) {
      this.currentUserSubject.next(null);
      return;
    }
    this.getMe().subscribe({
      error: () => this.currentUserSubject.next(null)
    });
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }

  resolveAvatarUrl(url?: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${this.apiHost}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  private normalizeUser(user: UserProfile): UserProfile {
    return {
      ...user,
      avatarUrl: this.resolveAvatarUrl(user.avatarUrl)
    };
  }
}