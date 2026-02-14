import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { EquipeCategoria } from '../../core/interfaces/models/equipe/equipe-categoria.enum';
import { EquipeStatus } from '../../core/interfaces/models/equipe/equipe-status.enum';
import { IEquipe } from '../../core/interfaces/models/equipe/equipe';
import { EquipeService } from '../../core/services/equipe.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { IUsuario } from '../../core/interfaces/models/usuarios/usuario';

type Integrantes = FormGroup<{
  nomeIntegrante: FormControl<string>;
  funcao: FormControl<string>;
  status: FormControl<EquipeStatus>;
}>

type FormCadastrar = FormGroup<{
  nomeUsuario: FormControl<string>;
  email: FormControl<string>;
  senha: FormControl<string>;
  confirmarSenha: FormControl<string>;
  nomeEquipe: FormControl<string>;
  categoria: FormControl<EquipeCategoria>;
  qtdeIntegrantes: FormControl<number>;
  integrantes: FormArray<Integrantes>
}>

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  readonly formCadastrar: FormCadastrar;
  readonly equipeStatus = EquipeStatus;
  readonly equipeCategoria = EquipeCategoria;
  
  readonly regexEmail: RegExp = /^[a-z]{1,}[a-zA-Z0-9#_\.\-\+]{1,}[@][a-z]{1,}\.\w{3}(\.[a-z]{2})?$/;
  readonly regexSenha: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

  senhasDiferentes = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private equipeService: EquipeService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.formCadastrar = this.fb.group({
      nomeUsuario: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.regexEmail)]],
      senha: ['', [Validators.required, Validators.pattern(this.regexSenha)]],
      confirmarSenha: ['', [Validators.required, Validators.pattern(this.regexSenha)]],
      nomeEquipe: ['', [Validators.required]],
      categoria: [EquipeCategoria.Pista, [Validators.required]],
      qtdeIntegrantes: [{value: 3, disabled: true }, [Validators.required, Validators.min(3)]],
      integrantes: this.fb.array<Integrantes>([
        this.criarParticipante(),
        this.criarParticipante(),
        this.criarParticipante()
      ])
    });
  };

  get integrantes(): FormArray<Integrantes> {
    return this.formCadastrar.controls.integrantes;
  };

  private criarParticipante(): Integrantes {
    return this.fb.group({
      nomeIntegrante: ['', [Validators.required]],
      funcao: ['', [Validators.required]],
      status: [EquipeStatus.Ativo, [Validators.required]]
    });
  };

  adicionaParticipante(): void {
    this.integrantes.push(this.criarParticipante());
    this.formCadastrar.controls.qtdeIntegrantes.setValue(this.integrantes.controls.length);
    this.formCadastrar.updateValueAndValidity();
    this.integrantes.updateValueAndValidity();
  };
  
  excluirParticipante(i: number): void {
    if (this.integrantes.length <= 3) {
      return;
    }
    
    this.integrantes.removeAt(i);
    this.formCadastrar.controls.qtdeIntegrantes.setValue(this.integrantes.controls.length);
    this.formCadastrar.updateValueAndValidity();
    this.integrantes.updateValueAndValidity();
  };

  cadastrarEquipe(): void {
    this.senhasDiferentes = false;
    
    console.log(this.formCadastrar.controls.senha);
    console.log(this.formCadastrar.controls.confirmarSenha);

    if (this.formCadastrar.controls.senha.value !== this.formCadastrar.controls.confirmarSenha.value) {
      this.senhasDiferentes = true;
      console.log('Entrou no if')
      return;
    }
    
    const idUsuario = crypto.randomUUID();
    const idEquipe = crypto.randomUUID();
    
    const integrantesForm = this.formCadastrar.controls.integrantes.getRawValue();

    const integrantes = integrantesForm.map((integrante) => {
      return {
        id: crypto.randomUUID(),
        nome: integrante.nomeIntegrante,
        funcao: integrante.funcao,
        status: integrante.status
      };  
    });

    const equipe: IEquipe = {
      id: idEquipe,
      idUsuario: idUsuario,
      nomeEquipe: this.formCadastrar.controls.nomeEquipe.value.trim(),
      status: this.equipeStatus.Ativo,
      categoria: this.formCadastrar.controls.categoria.value,
      qtdeIntegrantes: this.formCadastrar.controls.qtdeIntegrantes.value,
      integrantes: integrantes,
      pontuacaoTotal: 0,
      inscricoes: []
    };

    const usuario: IUsuario = {
      id: idUsuario,
      nomeUsuario: this.formCadastrar.controls.nomeUsuario.value.trim(),
      email: this.formCadastrar.controls.email.value.trim(),
      senha: this.formCadastrar.controls.senha.value,
      perfil: 'competidor',
      equipe: {
        id: idEquipe,
        nomeEquipe: equipe.nomeEquipe
      }
    };

    this.equipeService.cadastrarEquipe(equipe).subscribe({
      next: () => {
        localStorage.setItem('idEquipe', idEquipe);
        localStorage.setItem('nomeEquipe', equipe.nomeEquipe);
        localStorage.setItem('nomeUsuario', this.formCadastrar.controls.nomeUsuario.value);
        localStorage.setItem('idUsuario', equipe.idUsuario);
        localStorage.setItem('perfil', usuario.perfil);
        // localStorage.setItem('accessToken', 'Tem Token aqui');

        // console.log('cadastrou')
        this.router.navigateByUrl('/competitor/available-cups', {replaceUrl: true});

        this.usuarioService.cadastrarUsuario(usuario).subscribe({
          next: () => {}
        });
      }
    });
  };
}
