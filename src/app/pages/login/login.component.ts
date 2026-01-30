import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  readonly formLogin: FormGroup<{
    email: FormControl<string>,
    senha: FormControl<string>
  }>

  mensagemSemCadastro: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required]],
      senha: ['', [Validators.required]]
    })
  }

  fazerLogin(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        const email: String = this.formLogin.controls.email.value.trim().toLocaleLowerCase();
        const senha: string = this.formLogin.controls.senha.value.trim();

        this.mensagemSemCadastro = false;

        const temCadastro = usuarios.find((usuario) => usuario.email === email && usuario.senha === senha);

        // console.log(temCadastro)

        if (temCadastro === undefined) {
          this.mensagemSemCadastro = true;
          return;
        }

        if (temCadastro.perfil === 'admin') {
          this.router.navigateByUrl('/admin/cups', {replaceUrl: true});
        } else {
          this.router.navigateByUrl('/competitor/available-cups', {replaceUrl: true});
          localStorage.setItem('idEquipe', temCadastro.equipe!.id);
          localStorage.setItem('nomeEquipe', temCadastro.equipe!.nomeEquipe);
        }

        localStorage.setItem('nomeUsuario', temCadastro.nomeUsuario);
        localStorage.setItem('accessToken', 'Tem token de acesso');
      }
    })
  }
}
