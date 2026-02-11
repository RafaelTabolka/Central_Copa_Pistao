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
    imagemLogo: '',
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

  nomeImagem: string = '';
  mudouImagem: boolean = false;
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
        this.copa = copa;

        this.nomeImagem = copa.imagemLogo.split('/').pop() ?? '';

        this.formEdit.patchValue({
          nomeCopa: copa.nomeCopa,
          status: copa.status,
          logoCopa: copa.imagemLogo,
          dataInicio: copa.dataInicio,
          dataTermino: copa.dataTermino,
          descricao: copa.descricao,
          minimoIntegrantes: copa.preRequisito.minimoIntegrantes,
          pontuacaoMinima: copa.preRequisito.pontuacaoMinima,
          pontuacaoPrimeiroLugar: copa.pontosAdicionais.primeiroLugar,
          pontuacaoSegundoLugar: copa.pontosAdicionais.segundoLugar,
          pontuacaoTerceiroLugar: copa.pontosAdicionais.terceiroLugar,
        });

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

  aoMudarLogo(evento: Event): void {
    this.mudouImagem = false;

    const input = evento.target as HTMLInputElement; // Pega o evento atual do input file

    if (!input.files) { // Verifica se tem imagem
      return;
    }

    const arquivo = input.files[0]; // No array retornado, pega a primeira posição

    this.nomeImagem = arquivo.name; // Acessado a primeira posição, pega o nome da imagem para que o botão fique com esse nome

    this.mudouImagem = true;

    const leitor = new FileReader(); // Cria um novo objeto leitor que contém as propriedades de FileReader()

    // Função que define o que acontece quando a leitura acabar
    leitor.onload = () => { // onload é assíncrono, por isso a lógica fica dentro dele
      const base64 = leitor.result as string;
      console.log('tamanho base64:', base64.length);
      this.formEdit.controls.logoCopa.setValue(leitor.result as string); // Quando a leitura acabar, troca o valor do form para o resultado do leitor
      // console.log(this.formEdit.controls.logoCopa.value)
    };

    // Aqui está dizendo o seguinte: leia a variável arquivo, converte para Data URL (base64 + prefixo) e quando terminar chama o leitor.onload
    // Essa função dispara a leitura do arquivo
    leitor.readAsDataURL(arquivo);
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
      a.pontuacaoTerceiroLugar !== b.pontuacaoTerceiroLugar ||
      this.mudouImagem
    )
  }

  async atualizarCopa(): Promise<void> {
    if (this.formEdit.invalid || !this.habilitaBotao) {
      return;
    }

    const novosValores: ICopa = {
      id: this.idCopa,
      nomeCopa: this.formEdit.controls.nomeCopa.value,
      status: this.formEdit.controls.status.value,
      imagemLogo: this.formEdit.controls.logoCopa.value,
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