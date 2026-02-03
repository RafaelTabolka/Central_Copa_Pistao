import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEquipe } from '../interfaces/models/equipe/equipe';
import { IEquipeInscricao } from '../interfaces/models/equipe/equipe-inscricao';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private readonly baseUrl = '/api/equipes';

  constructor(private http: HttpClient) { }

  listarEquipes(): Observable<IEquipe[]> {
    return this.http.get<IEquipe[]>(this.baseUrl);
  }

  buscarEquipePorId(idEquipe: string): Observable<IEquipe> {
    return this.http.get<IEquipe>(`${this.baseUrl}/${idEquipe}`);
  }

  cadastrarEquipe(equipe: IEquipe): Observable<IEquipe> {
    return this.http.post<IEquipe>(this.baseUrl, equipe);
  }

  atualizarInscricoesDasCopas(idEquipe: string, inscricoes: IEquipeInscricao[]): Observable<IEquipe> {
    return this.http.patch<IEquipe>(`${this.baseUrl}/${idEquipe}`, { inscricoes });
  }

  modificarStatusEquipe(equipe: IEquipe): Observable<IEquipe> {
    return this.http.put<IEquipe>(`${this.baseUrl}/${equipe.id}`, equipe);
  }
}
