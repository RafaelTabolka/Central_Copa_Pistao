import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { EquipeService } from '../../../../core/services/equipe.service';
import { IEquipe } from '../../../../core/interfaces/models/equipe/equipe';
import { EquipeStatus } from '../../../../core/interfaces/models/equipe/equipe-status.enum';
import { EquipeCategoria } from '../../../../core/interfaces/models/equipe/equipe-categoria.enum';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type Integrantes = FormGroup<{
  nomeIntegrante: FormControl<string>;
  funcao: FormControl<string>;
  status: FormControl<EquipeStatus>;
}>

@Component({
  selector: 'app-my-team-edit',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './my-team-edit.component.html',
  styleUrl: './my-team-edit.component.css'
})
export class MyTeamEditComponent implements OnInit {
  readonly formEdit: FormGroup<{
    nomeEquipe: FormControl<string>;
    categoria: FormControl<EquipeCategoria>;
    qtdeIntegrantes: FormControl<number>;
    integrantes: FormArray<Integrantes>;
  }>

  equipe: IEquipe = {
    id: '',
    idUsuario: '',
    nomeEquipe: '',
    status: EquipeStatus.Ativo,
    categoria: EquipeCategoria.Pista,
    qtdeIntegrantes: 0,
    integrantes: [],
    pontuacaoTotal: 0,
    inscricoes: []
  };

  readonly equipeCategoria = EquipeCategoria;

  private idEquipe: string = localStorage.getItem('idEquipe')!;

  constructor(
    private equipeService: EquipeService,
    private fb: NonNullableFormBuilder) {
    this.formEdit = this.fb.group({
      nomeEquipe: ['', [Validators.required]],
      categoria: [EquipeCategoria.Pista],
      qtdeIntegrantes: [{ value: 1, disabled: true }, [Validators.required]],
      integrantes: this.fb.array<Integrantes>([
        this.criarParticipantes()
      ])
    })
  }

  ngOnInit(): void {
    this.equipeService.buscarEquipePorId(this.idEquipe).subscribe({
      next: (equipe) => {
        this.equipe = equipe;

        this.formEdit.patchValue({
          nomeEquipe: equipe.nomeEquipe,
          categoria: equipe.categoria,
          qtdeIntegrantes: equipe.qtdeIntegrantes
        });

        const integrantesArray = this.fb.array(
          equipe.integrantes.map((integrante) => {
            return this.fb.group({
              nomeIntegrante: integrante.nome,
              funcao: integrante.funcao,
              status: integrante.status
            })
          })
        )

        this.formEdit.setControl('integrantes', integrantesArray);
      }
    })
  }

  get integrantes() {
    return this.formEdit.controls.integrantes;
  }

  private criarParticipantes(): Integrantes {
    return this.fb.group({
      nomeIntegrante: ['', [Validators.required]],
      funcao: ['', [Validators.required]],
      status: [EquipeStatus.Ativo]
    })
  }

  adicionarParticipante(): void {
    this.integrantes.push(this.criarParticipantes());
    this.formEdit.controls.qtdeIntegrantes.setValue(this.integrantes.controls.length);
    this.formEdit.updateValueAndValidity();
    this.integrantes.updateValueAndValidity();
  }
  
  excluirParticipante(i: number): void {
    this.integrantes.removeAt(i);
    this.formEdit.controls.qtdeIntegrantes.setValue(this.integrantes.controls.length);
    this.formEdit.updateValueAndValidity();
    this.integrantes.updateValueAndValidity();
  }

}
