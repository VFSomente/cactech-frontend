import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSource = new BehaviorSubject<string | null>(null);
  currentMessage = this.messageSource.asObservable();

  show(message: string) {
    this.messageSource.next(message);
    setTimeout(() => this.clear(), 3000); // desaparece após 3s
  }

  clear() {
    this.messageSource.next(null);
  }
}
