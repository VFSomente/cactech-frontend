import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type MetodoPagamento = 'pix' | 'boleto' | 'cartao';

export type PedidoStatus = 'PENDENTE' | 'PAGO' | 'CANCELADO';
export type PagamentoStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO';

export interface ItemPedido {
  produtoId?: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

export interface CriarPedidoRequest {
  itens: ItemPedido[];
}

export interface PagamentoResumo {
  metodo: 'PIX' | 'BOLETO' | 'CARTAO';
  status: PagamentoStatus;
  data: string | null;
  codigoPix: string | null;
  linhaDigitavel: string | null;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  itens: (ItemPedido & { id: number; produtoId: number | null })[];
  total: number;
  status: PedidoStatus;
  dataCriacao: string;
  pagamento: PagamentoResumo | null;
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

  /** Pedidos do usuário logado, do mais recente para o mais antigo. */
  meusPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/pedidos`);
  }
}
