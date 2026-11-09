import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { Pedido, PedidoService } from '../services/pedido/pedido.service';
import { Product, ProductService } from '../services/product/product.service';
import { ToastService } from '../services/toast/toast.service';

type StatusTone = 'success' | 'warning' | 'muted';

@Component({
  selector: 'app-orders',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  orders: Pedido[] = [];
  loading = true;
  loadError = false;
  expanded = new Set<number>();
  private products = new Map<number, Product>();

  readonly methodLabels: Record<string, string> = {
    PIX: 'Pix',
    BOLETO: 'Boleto bancário',
    CARTAO: 'Cartão de crédito'
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError = false;
    forkJoin({
      orders: this.pedidoService.meusPedidos(),
      // Catálogo só para mostrar fotos; se falhar, a lista aparece sem imagens
      products: this.productService.getAll().pipe(catchError(() => of([] as Product[])))
    }).subscribe({
      next: ({ orders, products }) => {
        this.products = new Map(products.map((p) => [p.id, p]));
        this.orders = orders;
        // O pedido mais recente já aparece aberto
        if (orders.length) this.expanded.add(orders[0].id);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  toggle(id: number): void {
    if (this.expanded.has(id)) this.expanded.delete(id);
    else this.expanded.add(id);
  }

  product(id: number | null): Product | undefined {
    return id != null ? this.products.get(id) : undefined;
  }

  itemCount(order: Pedido): number {
    return order.itens.reduce((sum, i) => sum + i.quantidade, 0);
  }

  status(order: Pedido): { label: string; tone: StatusTone; icon: string } {
    if (order.status === 'PAGO') return { label: 'Pago', tone: 'success', icon: 'fa-solid fa-circle-check' };
    if (order.status === 'CANCELADO') return { label: 'Cancelado', tone: 'muted', icon: 'fa-solid fa-ban' };
    if (order.pagamento?.status === 'REJEITADO') {
      return { label: 'Pagamento recusado', tone: 'muted', icon: 'fa-solid fa-circle-xmark' };
    }
    return { label: 'Aguardando pagamento', tone: 'warning', icon: 'fa-regular fa-clock' };
  }

  copy(text: string, label: string): void {
    navigator.clipboard.writeText(text).then(
      () => this.toastService.show(`${label} copiado.`),
      () => this.toastService.show('Não foi possível copiar.', 'error')
    );
  }
}
