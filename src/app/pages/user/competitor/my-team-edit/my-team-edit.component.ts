import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { EquipeService } from '../../../../core/services/equipe.service';
import { IEquipe } from '../../../../core/interfaces/models/equipe/equipe';
import { EquipeStatus } from '../../../../core/interfaces/models/equipe/equipe-status.enum';
import { EquipeCategoria } from '../../../../core/interfaces/models/equipe/equipe-categoria.enum';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IEquipeAtualizar } from '../../../../core/interfaces/models/equipe/equipe-atualizar';

type Integrantes = FormGroup<{
  id: FormControl<string>;
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
  temMudanca: boolean = false;
  nomeEquieVazio: boolean = false;

  constructor(
    private equipeService: EquipeService,
    private fb: NonNullableFormBuilder,
    private router: Router) {
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

        this.integrantes.clear();

        equipe.integrantes.forEach((integrante) => {
          const formArray = this.criarParticipantes();
          formArray.patchValue({
            id: integrante.id,
            nomeIntegrante: integrante.nome,
            funcao: integrante.funcao,
            status: integrante.status
          });
          this.integrantes.push(formArray);
        });



        const valorInicialFormEdit = this.formEdit.getRawValue();

        this.formEdit.valueChanges.subscribe({
          next: () => {
            const valorAtualFormEdit = this.formEdit.getRawValue()

            this.temMudanca = this.temMudancaNoFormulario(valorAtualFormEdit, valorInicialFormEdit);
          }
        })
      }
    })
  }

  private temMudancaNoFormulario(a: any, b: any): boolean {
    const mudouDadosEquipe = a.nomeEquipe !== b.nomeEquipe ||
      a.categoria !== b.categoria ||
      a.qtdeIntegrantes !== b.qtdeIntegrantes;

    if (mudouDadosEquipe) {
      return true;
    }

    if (a.integrantes.length !== b.integrantes.length) {
      return true;
    }

    const mudouIntegrantes = a.integrantes.some((integranteA: any, i: number) => {
      const integranteB = b.integrantes[i];

      return (
        integranteA.nomeIntegrante !== integranteB.nomeIntegrante ||
        integranteA.funcao !== integranteB.funcao ||
        integranteA.status !== integranteB.status
      )
    });

    return mudouIntegrantes;
  }

  get integrantes() {
    return this.formEdit.controls.integrantes;
  }

  integranteFormGroup(i: number) {
    return this.integrantes.at(i)
  }

  integranteCopia(i: number, nome: 'nomeIntegrante' | 'funcao' | 'status') {
    return this.integranteFormGroup(i).get(nome);
  }

  private criarParticipantes(): Integrantes {
    return this.fb.group({
      id: [crypto.randomUUID() as string, [Validators.required]],
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

  atualizarEquipe(): void {
    const idEquipe = localStorage.getItem('idEquipe')!;

    const integrantes = this.integrantes.getRawValue().map((integrante, i) => ({
      id: integrante.id,
      nome: integrante.nomeIntegrante,
      funcao: integrante.funcao,
      status: integrante.status
    }));

    const dadosEquipe: IEquipeAtualizar = {
      nomeEquipe: this.formEdit.controls.nomeEquipe.value.trim(),
      categoria: this.formEdit.controls.categoria.value,
      qtdeIntegrantes: this.formEdit.controls.qtdeIntegrantes.value,
      integrantes: integrantes
    }

    this.equipeService.atualizarEquipe(idEquipe, dadosEquipe).subscribe({
      next: (equipe) => {
        this.equipe = equipe;
      }
    });
  }
}
