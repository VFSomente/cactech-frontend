import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  private toastService = inject(ToastService);
  message$ = this.toastService.currentMessage;

  readonly icons = {
    success: 'fa-solid fa-circle-check',
    info: 'fa-solid fa-circle-info',
    error: 'fa-solid fa-circle-exclamation'
  };

  close(): void {
    this.toastService.clear();
  }
}
