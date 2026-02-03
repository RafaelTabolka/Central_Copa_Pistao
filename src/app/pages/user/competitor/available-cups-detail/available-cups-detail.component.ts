import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CopaService } from '../../../../core/services/copa.service';
import { ICopa } from '../../../../core/interfaces/models/copa/copa';
import { CopaStatus } from '../../../../core/interfaces/models/copa/copa-status.enum';
import { NgClass } from '@angular/common';
import { DatePipe } from '@angular/common';
import { IEquipe } from '../../../../core/interfaces/models/equipe/equipe';
import { EquipeStatus } from '../../../../core/interfaces/models/equipe/equipe-status.enum';
import { EquipeCategoria } from '../../../../core/interfaces/models/equipe/equipe-categoria.enum';
import { EquipeService } from '../../../../core/services/equipe.service';
import { ICopaInscricaoEquipe } from '../../../../core/interfaces/models/copa/copa-inscricao';
import { IEquipeInscricao } from '../../../../core/interfaces/models/equipe/equipe-inscricao';

type Requisitos = { texto: string, classe: string, icon: string };
type StatusInscricao = { ok: boolean, texto: string, classe: string, icon: string };

@Component({
  selector: 'app-available-cups-detail',
  imports: [RouterLink, NgClass, DatePipe],
  templateUrl: './available-cups-detail.component.html',
  styleUrl: './available-cups-detail.component.css'
})
export class AvailableCupsDetailComponent implements OnInit {

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

  copaStatusEstilos: Record<string, string> = {
    inscricoesAbertas: 'section-cards__span-abertas',
    emAndamento: 'section-cards__span-andamento',
    inscricoesEncerradas: 'section-cards__span-encerradas',
    copaFinalizada: 'section-cards__span-finalizadas'
  };

  copaStatusNomes: Record<CopaStatus, string> = {
    inscricoesAbertas: 'Inscrições Abertas',
    emAndamento: 'Em Andamento',
    inscricoesEncerradas: 'Inscrições Encerradas',
    copaFinalizada: 'Copa Finalizada'
  };

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

  inscricaoLiberada: boolean = false;
  inscricaoRealizada: boolean = false;
  copaId: string = '';

  constructor(
    private route: ActivatedRoute,
    private copaService: CopaService,
    private equipeService: EquipeService
  ) { }

  ngOnInit(): void {
    const idCopa = this.route.snapshot.paramMap.get('id')!;

    this.copaService.buscarCopaPorId(idCopa).subscribe({
      next: (copa) => {
        this.copa = copa;
        console.log(this.copa)
      }
    });

    this.equipeService.buscarEquipePorId(localStorage.getItem('idEquipe')!).subscribe({
      next: (equipe) => {
        this.equipe = equipe;

        this.inscricaoRealizada = this.equipe.inscricoes.some((inscricao) => inscricao.id === idCopa);
      }
    });
  };

  fazerInscricao(): void {
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

    this.equipeService.atualizarInscricoesDasCopas(localStorage.getItem('idEquipe')!, novasInscricoes).subscribe({
      next: () => {
        this.inscricaoRealizada = true;
      }
    });

    this.copaService.atualizarEquipesDaCopa(this.copa.id, novasEquipes).subscribe({
      next: (copa) => {
        console.log(copa)
      }
    });
  };

  requisitos(ok: boolean): Requisitos {
    if (ok === true) {
      return {
        texto: 'Atendido',
        classe: 'section-cards__span-abertas',
        icon: 'bi bi-check-circle'
      }
    }

    else {
      return {
        texto: 'Pendente',
        classe: 'section-cards__span-pendente',
        icon: 'bi bi-exclamation-circle'
      }
    }
  };

  mensagemInscricao(): StatusInscricao {
    const inscricaoLiberada = this.statusInscricao();

    return inscricaoLiberada ?
      {
        ok: true,
        texto: 'Inscrição Liberada',
        classe: 'section-cards__span-abertas',
        icon: 'bi bi-check-circle'
      } :

      {
        ok: false,
        texto: 'Inscrição Indisponível',
        classe: 'section-cards__span-pendente',
        icon: 'bi bi-exclamation-circle'
      }
  };

  statusInscricao(): boolean {
    const inscricaoLiberada =
      this.equipe.qtdeIntegrantes >= this.copa.preRequisito.minimoIntegrantes &&
      this.equipe.pontuacaoTotal >= this.copa.preRequisito.pontuacaoMinima &&
      this.equipe.status === 'ativo';

    return inscricaoLiberada;
  };
}
