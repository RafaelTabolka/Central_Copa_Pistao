import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICopa } from '../interfaces/models/copa/copa';
import { ICopaInscricaoEquipe } from '../interfaces/models/copa/copa-inscricao';
import { CopaStatus } from '../interfaces/models/copa/copa-status.enum';

@Injectable({
  providedIn: 'root'
})
export class CopaService {
  private readonly baseUrl = '/api/copas';

  constructor(private http: HttpClient) { }

  listarCopas(): Observable<ICopa[]> {
    return this.http.get<ICopa[]>(this.baseUrl);
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
}
