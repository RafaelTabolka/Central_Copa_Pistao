import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { EquipeCategoria } from '../../core/interfaces/models/equipe/equipe-categoria.enum';
import { EquipeStatus } from '../../core/interfaces/models/equipe/equipe-status.enum';
import { IEquipe } from '../../core/interfaces/models/equipe/equipe';
import { EquipeService } from '../../core/services/equipe.service';

type Participantes = FormGroup<{
  nomeParticipante: FormControl<string>;
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
  qtdeParticipantes: FormControl<number>;
  participantes: FormArray<Participantes>
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
    private router: Router
  ) {
    this.formCadastrar = this.fb.group({
      nomeUsuario: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.regexEmail)]],
      senha: ['', [Validators.required, Validators.pattern(this.regexSenha)]],
      confirmarSenha: ['', [Validators.required, Validators.pattern(this.regexSenha)]],
      nomeEquipe: ['', [Validators.required]],
      categoria: [EquipeCategoria.Pista, [Validators.required]],
      qtdeParticipantes: [{value: 3, disabled: true }, [Validators.required, Validators.min(3)]],
      participantes: this.fb.array<Participantes>([
        this.criarParticipante(),
        this.criarParticipante(),
        this.criarParticipante()
      ])
    });
  };

  get participantes(): FormArray<Participantes> {
    return this.formCadastrar.controls.participantes;
  };

  private criarParticipante(): Participantes {
    return this.fb.group({
      nomeParticipante: ['', [Validators.required]],
      funcao: ['', [Validators.required]],
      status: [EquipeStatus.Ativo, [Validators.required]]
    });
  };

  adicionaParticipante(): void {
    this.participantes.push(this.criarParticipante());
    this.formCadastrar.controls.qtdeParticipantes.setValue(this.participantes.controls.length);
    this.formCadastrar.updateValueAndValidity();
    this.participantes.updateValueAndValidity();
  };
  
  excluirParticipante(i: number): void {
    if (this.participantes.length <= 3) {
      return;
    }
    
    this.participantes.removeAt(i);
    this.formCadastrar.controls.qtdeParticipantes.setValue(this.participantes.controls.length);
    this.formCadastrar.updateValueAndValidity();
    this.participantes.updateValueAndValidity();
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
    
    const participantesForm = this.formCadastrar.controls.participantes.getRawValue();

    const participantes = participantesForm.map((participante) => {
      return {
        id: crypto.randomUUID(),
        nome: participante.nomeParticipante,
        funcao: participante.funcao,
        status: participante.status
      };  
    });

    const equipe: IEquipe = {
      id: idEquipe,
      idUsuario: idUsuario,
      nomeEquipe: this.formCadastrar.controls.nomeEquipe.value,
      status: this.equipeStatus.Ativo,
      categoria: this.formCadastrar.controls.categoria.value,
      qtdeParticipantes: this.formCadastrar.controls.qtdeParticipantes.value,
      participantes: participantes,
      pontuacaoTotal: 0,
      inscricoes: []
    };

    this.equipeService.cadastrarEquipe(equipe).subscribe({
      next: () => {
        localStorage.setItem('idEquipe', idEquipe);
        localStorage.setItem('nomeUsuario', this.formCadastrar.controls.nomeUsuario.value);
        localStorage.setItem('accessToken', 'Tem Token aqui');
        // console.log('cadastrou')
        this.router.navigateByUrl('/competitor/available-cups', {replaceUrl: true});
      }
    })
  };
}
