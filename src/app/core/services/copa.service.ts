import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICopa } from '../interfaces/models/copa/copa';
import { ICopaInscricaoEquipe } from '../interfaces/models/copa/copa-inscricao';

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

  atualizarEquipesDaCopa(idCopa: string, equipes: ICopaInscricaoEquipe[]): Observable<ICopa> {
    return this.http.patch<ICopa>(`${this.baseUrl}/${idCopa}`, { equipes });
  }
}
