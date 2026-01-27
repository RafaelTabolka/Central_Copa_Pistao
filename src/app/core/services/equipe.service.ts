import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEquipe } from '../interfaces/models/equipe/equipe';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private readonly baseUrl = '/api/equipes';

  constructor(private http: HttpClient) { }

  listarEquipes(): Observable<IEquipe[]> {
    return this.http.get<IEquipe[]>(this.baseUrl);
  }

  cadastrarEquipe(equipe: IEquipe): Observable<IEquipe> {
    return this.http.post<IEquipe>(this.baseUrl, equipe);
  }
}
