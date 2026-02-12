import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICopa } from '../interfaces/models/copa/copa';
import { ICopaInscricaoEquipe } from '../interfaces/models/copa/copa-inscricao';
import { CopaStatus } from '../interfaces/models/copa/copa-status.enum';
import { ICopaImagemLogo } from '../interfaces/models/copa/copa-imagem-logo';

@Injectable({
  providedIn: 'root'
})
export class CopaService {
  private readonly baseUrl = '/api/copas';
  private readonly baseUrlImagem = '/api/logoCopas'

  constructor(private http: HttpClient) { }

  listarCopas(): Observable<ICopa[]> {
    return this.http.get<ICopa[]>(this.baseUrl);
  }

  listarImagens(): Observable<ICopaImagemLogo[]> {
    return this.http.get<ICopaImagemLogo[]>(this.baseUrlImagem)
  }

  buscarCopaPorId(idCopa: string): Observable<ICopa> {
    return this.http.get<ICopa>(`${this.baseUrl}/${idCopa}`);
  }

  atualizarCopa(idCopa: string, novosValores: ICopa): Observable<ICopa> {
    return this.http.put<ICopa>(`${this.baseUrl}/${idCopa}`, novosValores);
  }

  atualizarEquipesDaCopa(idCopa: string, equipes: ICopaInscricaoEquipe[]): Observable<ICopa> {
    return this.http.patch<ICopa>(`${this.baseUrl}/${idCopa}`, { equipes });
  }

  atualizarStatusCopa(idCopa: string, novoStatus: CopaStatus): Observable<ICopa> {
    return this.http.patch<ICopa>(`${this.baseUrl}/${idCopa}`, { status: novoStatus })
  }

  cadastrarCopa(dadosCopa: ICopa): Observable<ICopa> {
    return this.http.post<ICopa>(this.baseUrl, dadosCopa);
  }
}
