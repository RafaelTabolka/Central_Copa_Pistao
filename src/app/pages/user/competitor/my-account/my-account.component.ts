import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUsuarioAtualizar } from '../../../../core/interfaces/models/usuarios/usuario-atualizar';

@Component({
  selector: 'app-my-account',
  imports: [ReactiveFormsModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent implements OnInit {
  readonly formEdit: FormGroup<{
    nome: FormControl<string>;
    email: FormControl<string>;
    senha: FormControl<string>;
    confirmarSenha: FormControl<string>;
  }>

  private formEditInicial!: {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
  };

  idUsuario: string = localStorage.getItem('idUsuario')!;
  temMudancao: boolean = false;

  readonly regexEmail: RegExp = /^[a-z]{1,}[a-zA-Z0-9#_\.\-\+]{1,}[@][a-z]{1,}\.\w{3}(\.[a-z]{2})?$/;
  readonly regexSenha: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

  constructor(
    private usuarioService: UsuarioService,
    private fb: NonNullableFormBuilder) {
    this.formEdit = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.regexEmail)]],
      senha: ['', [Validators.required, Validators.pattern(this.regexSenha)]],
      confirmarSenha: ['', [Validators.required, Validators.pattern(this.regexSenha)]]
    })
  }

  ngOnInit(): void {
    this.usuarioService.encontrarUsuarioPeloId(this.idUsuario).subscribe({
      next: (usuario) => {

        this.formEdit.patchValue({
          nome: usuario.nomeUsuario,
          email: usuario.email,
          senha: usuario.senha,
          confirmarSenha: usuario.senha
        });

        this.formEditInicial = this.formEdit.getRawValue();
        this.temMudancao = false;
        this.formEdit.markAsPristine();

        this.formEdit.valueChanges.subscribe({
          next: () => {
            const formEditAtual = this.formEdit.getRawValue();

            this.temMudancao = this.verificaSeTemMudanca(this.formEditInicial, formEditAtual) &&
              formEditAtual.senha === formEditAtual.confirmarSenha;
          }
        });
      }
    });
  }

  verificaSeTemMudanca(a: any, b: any): boolean {
    return (
      a.nome !== b.nome ||
      a.email !== b.email ||
      a.senha !== b.senha ||
      a.confirmarSenha !== b.confirmarSenha
    )
  }

  atualizarUsuario(): void {
    const dadosUsuario: IUsuarioAtualizar = {
      nomeUsuario: this.formEdit.controls.nome.value,
      email: this.formEdit.controls.email.value,
      senha: this.formEdit.controls.senha.value
    }

    this.usuarioService.atualizarUsuario(this.idUsuario, dadosUsuario).subscribe({
      next: () => {
        this.formEditInicial = this.formEdit.getRawValue();
        this.temMudancao = false;
        this.formEdit.markAsPristine()
      }
    })
  }
}