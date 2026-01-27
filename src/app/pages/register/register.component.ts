import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
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
  nome: FormControl<string>;
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
  
  constructor(
    private fb: NonNullableFormBuilder,
    private equipeService: EquipeService
  ) {
    this.formCadastrar = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required]],
      senha: ['', [Validators.required]],
      confirmarSenha: ['', [Validators.required]],
      nomeEquipe: ['', [Validators.required]],
      categoria: [EquipeCategoria.Pista, [Validators.required]],
      qtdeParticipantes: [{value: 3, disabled: true }, [Validators.required, Validators.min(3)]],
      participantes: this.fb.array<Participantes>([
        this.criarParticipante(),
        this.criarParticipante(),
        this.criarParticipante()
      ])
    })
  }

  get participantes(): FormArray<Participantes> {
    return this.formCadastrar.controls.participantes;
  }

  private criarParticipante(): Participantes {
    return this.fb.group({
      nomeParticipante: ['', [Validators.required]],
      funcao: ['', [Validators.required]],
      status: [EquipeStatus.Ativo, [Validators.required]]
    })
  }

  adicionaParticipante(): void {
    this.participantes.push(this.criarParticipante());
    this.formCadastrar.controls.qtdeParticipantes.setValue(this.participantes.controls.length);
    this.formCadastrar.updateValueAndValidity();
    this.participantes.updateValueAndValidity();
  }
  
  excluirParticipante(i: number): void {
    if (this.participantes.length <= 3) {
      return;
    }
    
    this.participantes.removeAt(i);
    this.formCadastrar.controls.qtdeParticipantes.setValue(this.participantes.controls.length);
    this.formCadastrar.updateValueAndValidity();
    this.participantes.updateValueAndValidity();
  }

  cadastrarEquipe(): void {
    const idUsuario = crypto.randomUUID();
    const idEquipe = crypto.randomUUID();
    
    const participantesForm = this.formCadastrar.controls.participantes.getRawValue();

    const participantes = participantesForm.map((participante) => {
      return {
        id: crypto.randomUUID(),
        nome: participante.nomeParticipante,
        funcao: participante.funcao,
        status: participante.status
      }
    });
    
    console.log(participantesForm)

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

      }
    })
  }
}
