import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastMessage {
  text: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSource = new BehaviorSubject<ToastMessage | null>(null);
  currentMessage = this.messageSource.asObservable();
  private timer?: ReturnType<typeof setTimeout>;

  show(text: string, type: ToastType = 'success'): void {
    clearTimeout(this.timer); // uma nova mensagem reinicia a contagem
    this.messageSource.next({ text, type });
    this.timer = setTimeout(() => this.clear(), 3500);
  }

  clear(): void {
    clearTimeout(this.timer);
    this.messageSource.next(null);
  }
}
