import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  message: string | null = null;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.currentMessage.subscribe(msg => {
      this.message = msg;
    });
  }
}
