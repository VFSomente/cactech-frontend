import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type MetodoPagamento = 'pix' | 'boleto' | 'cartao';

export interface ItemPedido {
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

export interface CriarPedidoRequest {
  itens: ItemPedido[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  criarPedido(payload: CriarPedidoRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pedidos`, payload);
  }

  processarPagamento(pedidoId: number, metodo: MetodoPagamento): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pagamentos/${metodo}/${pedidoId}`, {});
  }
}