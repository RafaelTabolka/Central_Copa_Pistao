import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipeService } from '../../../core/services/equipe.service';
import { IEquipe } from '../../../core/interfaces/models/equipe/equipe';
import { EquipeStatus } from '../../../core/interfaces/models/equipe/equipe-status.enum';
import { EquipeCategoria } from '../../../core/interfaces/models/equipe/equipe-categoria.enum';
import { ActivatedRoute } from '@angular/router';
import { CopaService } from '../../../core/services/copa.service';
import { ICopa } from '../../../core/interfaces/models/copa/copa';
import { CopaStatus } from '../../../core/interfaces/models/copa/copa-status.enum';
import { IEquipeInscricao } from '../../../core/interfaces/models/equipe/equipe-inscricao';
import { ICopaInscricaoEquipe } from '../../../core/interfaces/models/copa/copa-inscricao';

type Requisitos = { texto: string, classe: string, icon: string };
type StatusInscricao = { ok: boolean, texto: string, classe: string, icon: string };

@Component({
  selector: 'app-subscribe',
  imports: [],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.css'
})
export class SubscribeComponent implements OnInit {
  @Input() titulo: string = 'Fazer inscrição';
  @Input() mensagem: string = 'Detalhes';

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

  inscricaoLiberada: boolean = false;
  copaId: string = '';

  constructor(
    private modalAtivo: NgbActiveModal,
    private equipeService: EquipeService,
    private copaService: CopaService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.equipeService.buscarEquipePorId(localStorage.getItem('idEquipe')!).subscribe({
      next: (equipe) => {
        this.equipe = equipe;
      }
    });

    this.copaId = this.route.snapshot.queryParamMap.get('inscrever')!;

    this.copaService.buscarCopaPorId(this.copaId).subscribe({
      next: (copa) => {
        this.copa = copa;
        // console.log(this.copa)
      }
    })
  }

  fazerInscricao(): void {
    // this.modalAtivo.close(true);

    const inscricao: IEquipeInscricao = {
      id: this.copa.id,
      nomeCopa: this.copa.nomeCopa,
      status: this.copa.status,
      imagemLogo: this.copa.imagemLogo,
      dataInicio: this.copa.dataInicio,
      dataTermino: this.copa.dataTermino,
      descricao: this.copa.descricao,
      preRequisito: {
        minimoIntegrantes: this.copa.preRequisito.minimoIntegrantes,
        pontuacaoMinima: this.copa.preRequisito.pontuacaoMinima
      },
      posicaoEquipe: null,
      pontosAdicionais: {
        primeiroLugar: this.copa.pontosAdicionais.primeiroLugar,
        segundoLugar: this.copa.pontosAdicionais.segundoLugar,
        terceiroLugar: this.copa.pontosAdicionais.terceiroLugar
      },
      pontuacaoEquipe: null
    }

    const equipe: ICopaInscricaoEquipe = {
      idEquipe: localStorage.getItem('idEquipe')!,
      nomeEquipe: localStorage.getItem('nomeEquipe')!
    };

    const novasInscricoes = [...this.equipe.inscricoes, inscricao];
    const novasEquipes = [...this.copa.equipes, equipe];

    this.equipeService.fazerInscricao(localStorage.getItem('idEquipe')!, novasInscricoes).subscribe({
      next: (equipe) => {
        console.log(equipe)
      }
    })

    this.copaService.adicionaParticipante(this.copa.id, novasEquipes).subscribe({
      next: (copa) => {
        console.log(copa)
      }
    })

  }

  cancelar(): void {
    this.modalAtivo.close(false);
  }

  requisitos(ok: boolean): Requisitos {
    if (ok === true) {
      return {
        texto: 'Atendido',
        classe: 'section-modal__span-atendido',
        icon: 'bi bi-check-circle'
      }
    }

    else {
      return {
        texto: 'Pendente',
        classe: 'section-modal__span-pendente',
        icon: 'bi bi-exclamation-circle'
      }
    }
  }

  mensagemInscricao(): StatusInscricao {
    const inscricaoLiberada = this.statusInscricao();

    return inscricaoLiberada ?
      {
        ok: true,
        texto: 'Inscrição Liberada',
        classe: 'section-modal__span-abertas',
        icon: 'bi bi-check-circle'
      } :

      {
        ok: false,
        texto: 'Inscrição Indisponível',
        classe: 'section-modal__span',
        icon: 'bi bi-exclamation-circle'
      }
  }

  statusInscricao(): boolean {
    const inscricaoLiberada =
      this.equipe.qtdeIntegrantes >= this.copa.preRequisito.minimoIntegrantes &&
      this.equipe.pontuacaoTotal >= this.copa.preRequisito.pontuacaoMinima &&
      this.equipe.status === 'ativo';

    return inscricaoLiberada;
  }
}
