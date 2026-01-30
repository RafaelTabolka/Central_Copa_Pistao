import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUsuario } from '../interfaces/models/usuarios/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly baseUrl = '/api/usuarios';

  constructor(private http: HttpClient) { }

  listarUsuarios(): Observable<IUsuario[]> {
    return this.http.get<IUsuario[]>(this.baseUrl);
  }

  cadastrarUsuario(usuario: IUsuario): Observable<IUsuario> {
    return this.http.post<IUsuario>(this.baseUrl, usuario);
  }
}
