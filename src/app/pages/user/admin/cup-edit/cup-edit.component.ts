import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CopaService } from '../../../../core/services/copa.service';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CopaStatus } from '../../../../core/interfaces/models/copa/copa-status.enum';
import { ICopa } from '../../../../core/interfaces/models/copa/copa';
import { firstValueFrom } from 'rxjs';
import { EquipeService } from '../../../../core/services/equipe.service';
import { IEquipeInscricao } from '../../../../core/interfaces/models/equipe/equipe-inscricao';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICopaImagemLogo } from '../../../../core/interfaces/models/copa/copa-imagem-logo';

@Component({
  selector: 'app-cup-edit',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './cup-edit.component.html',
  styleUrl: './cup-edit.component.css'
})
export class CupEditComponent implements OnInit {
  readonly formEdit: FormGroup<{
    nomeCopa: FormControl<string>;
    status: FormControl<CopaStatus>;
    logoCopa: FormControl<string>;
    dataInicio: FormControl<string>;
    dataTermino: FormControl<string>;
    descricao: FormControl<string>;
    minimoIntegrantes: FormControl<number>;
    pontuacaoMinima: FormControl<number>;
    pontuacaoPrimeiroLugar: FormControl<number>;
    pontuacaoSegundoLugar: FormControl<number>;
    pontuacaoTerceiroLugar: FormControl<number>;
  }>

  copa: ICopa = {
    id: '',
    nomeCopa: '',
    status: CopaStatus.InscricoesAbertas,
    imagemLogo: {
      nome: '',
      caminho: ''
    },
    dataInicio: '',
    dataTermino: '',
    descricao: '',
    preRequisito: {
      minimoIntegrantes: 0,
      pontuacaoMinima: 0
    },
    pontosAdicionais: {
      primeiroLugar: 0,
      segundoLugar: 0,
      terceiroLugar: 0
    },
    equipes: []
  }

  imagens: ICopaImagemLogo[] = []
  habilitaBotao: boolean = false;
  idCopa: string = '';

  constructor(
    private copaService: CopaService,
    private equipeService: EquipeService,
    private route: ActivatedRoute,
    private fb: NonNullableFormBuilder,
    private modal: NgbModal
  ) {
    this.formEdit = this.fb.group({
      nomeCopa: ['', [Validators.required]],
      status: [CopaStatus.InscricoesAbertas, [Validators.required]],
      logoCopa: ['', [Validators.required]],
      dataInicio: ['', [Validators.required]],
      dataTermino: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      minimoIntegrantes: [0, [Validators.required, Validators.min(3)]],
      pontuacaoMinima: [0, [Validators.required, Validators.min(0)]],
      pontuacaoPrimeiroLugar: [0, [Validators.required, Validators.min(0)]],
      pontuacaoSegundoLugar: [0, [Validators.required, Validators.min(0)]],
      pontuacaoTerceiroLugar: [0, [Validators.required, Validators.min(0)]]
    })
  }

  ngOnInit(): void {
    this.idCopa = this.route.snapshot.paramMap.get('id')!;

    this.copaService.buscarCopaPorId(this.idCopa).subscribe({
      next: (copa) => {
        this.copaService.listarImagens().subscribe({
          next: (imagens) => {
            this.imagens = imagens;
            console.log(imagens)
            this.copa = copa;

            this.formEdit.patchValue({
              nomeCopa: copa.nomeCopa,
              status: copa.status,
              logoCopa: copa.imagemLogo.caminho,
              dataInicio: copa.dataInicio,
              dataTermino: copa.dataTermino,
              descricao: copa.descricao,
              minimoIntegrantes: copa.preRequisito.minimoIntegrantes,
              pontuacaoMinima: copa.preRequisito.pontuacaoMinima,
              pontuacaoPrimeiroLugar: copa.pontosAdicionais.primeiroLugar,
              pontuacaoSegundoLugar: copa.pontosAdicionais.segundoLugar,
              pontuacaoTerceiroLugar: copa.pontosAdicionais.terceiroLugar,
            });

            console.log(this.formEdit.controls.logoCopa.value)

            const valorInicialForm = this.formEdit.getRawValue();

            this.formEdit.valueChanges.subscribe({
              next: () => {
                const valorAtualForm = this.formEdit.getRawValue();

                this.habilitaBotao = this.temMudanca(valorInicialForm, valorAtualForm);
              }
            })
          }
        })
      }
    })
  }

  temMudanca(a: any, b: any): boolean {
    return (
      a.nomeCopa !== b.nomeCopa ||
      a.status !== b.status ||
      a.logoCopa !== b.logoCopa ||
      a.dataInicio !== b.dataInicio ||
      a.dataTermino !== b.dataTermino ||
      a.descricao !== b.descricao ||
      a.minimoIntegrantes !== b.minimoIntegrantes ||
      a.pontuacaoMinima !== b.pontuacaoMinima ||
      a.pontuacaoPrimeiroLugar !== b.pontuacaoPrimeiroLugar ||
      a.pontuacaoSegundoLugar !== b.pontuacaoSegundoLugar ||
      a.pontuacaoTerceiroLugar !== b.pontuacaoTerceiroLugar
    )
  }

  async atualizarCopa(): Promise<void> {
    if (this.formEdit.invalid || !this.habilitaBotao) {
      return;
    }

    const logoCopa = this.imagens.find((imagem) => imagem.caminho === this.formEdit.controls.logoCopa.value)!

    const novosValores: ICopa = {
      id: this.idCopa,
      nomeCopa: this.formEdit.controls.nomeCopa.value,
      status: this.formEdit.controls.status.value,
      imagemLogo: {
        nome: logoCopa.nome,
        caminho: logoCopa.caminho
      },
      dataInicio: this.formEdit.controls.dataInicio.value,
      dataTermino: this.formEdit.controls.dataTermino.value,
      descricao: this.formEdit.controls.descricao.value,
      preRequisito: {
        minimoIntegrantes: this.formEdit.controls.minimoIntegrantes.value,
        pontuacaoMinima: this.formEdit.controls.pontuacaoMinima.value
      },
      pontosAdicionais: {
        primeiroLugar: this.formEdit.controls.pontuacaoPrimeiroLugar.value,
        segundoLugar: this.formEdit.controls.pontuacaoSegundoLugar.value,
        terceiroLugar: this.formEdit.controls.pontuacaoTerceiroLugar.value
      },
      equipes: this.copa.equipes
    };

    const copaAtualizada = await firstValueFrom(this.copaService.atualizarCopa(this.idCopa, novosValores));

    for (const equipe of copaAtualizada.equipes) {
      const equipePorId = await firstValueFrom(this.equipeService.buscarEquipePorId(equipe.idEquipe));

      const inscricoesAtualizadas = equipePorId.inscricoes.map((inscricao) => {
        if (inscricao.id !== this.idCopa) {
          return inscricao;
        }

        return {
          ...inscricao,
          nomeCopa: copaAtualizada.nomeCopa,
          status: copaAtualizada.status,
          imagemLogo: copaAtualizada.imagemLogo,
          dataInicio: copaAtualizada.dataInicio,
          dataTermino: copaAtualizada.dataTermino,
          descricao: copaAtualizada.descricao,

          preRequisito: { ...copaAtualizada.preRequisito },
          pontosAdicionais: { ...copaAtualizada.pontosAdicionais }
        }
      });

      await firstValueFrom(
        this.equipeService.atualizarInscricoesDasCopas(equipePorId.id, inscricoesAtualizadas)
      )
    }

    this.ngOnInit();
  }
}