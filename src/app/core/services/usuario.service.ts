import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUsuario } from '../interfaces/models/usuarios/usuario';
import { IUsuarioAtualizar } from '../interfaces/models/usuarios/usuario-atualizar';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly baseUrl = '/api/usuarios';

  constructor(private http: HttpClient) { }

  listarUsuarios(): Observable<IUsuario[]> {
    return this.http.get<IUsuario[]>(this.baseUrl);
  }

  encontrarUsuarioPeloId(idUsuario: string): Observable<IUsuario> {
    return this.http.get<IUsuario>(`${this.baseUrl}/${idUsuario}`);
  }

  cadastrarUsuario(usuario: IUsuario): Observable<IUsuario> {
    return this.http.post<IUsuario>(this.baseUrl, usuario);
  }

  atualizarUsuario(idUsuario: string, dadosUsuario: IUsuarioAtualizar): Observable<IUsuario> {
    return this.http.patch<IUsuario>(`${this.baseUrl}/${idUsuario}`, dadosUsuario);2
  }
}
