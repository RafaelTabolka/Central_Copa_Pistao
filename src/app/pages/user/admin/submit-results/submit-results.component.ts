import { Component, OnInit } from '@angular/core';
import { ICopa } from '../../../../core/interfaces/models/copa/copa';
import { CopaStatus } from '../../../../core/interfaces/models/copa/copa-status.enum';
import { CopaService } from '../../../../core/services/copa.service';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { EquipeService } from '../../../../core/services/equipe.service';
import { IEquipe } from '../../../../core/interfaces/models/equipe/equipe';
import { EquipeStatus } from '../../../../core/interfaces/models/equipe/equipe-status.enum';
import { EquipeCategoria } from '../../../../core/interfaces/models/equipe/equipe-categoria.enum';

type Equipe = {
  idEquipe: string;
  nomeEquipe: string;
}

@Component({
  selector: 'app-submit-results',
  imports: [DatePipe],
  templateUrl: './submit-results.component.html',
  styleUrl: './submit-results.component.css'
})
export class SubmitResultsComponent implements OnInit {
  copas: ICopa[] = [];

  copa: ICopa = {
    id: '',
    nomeCopa: '',
    status: CopaStatus.InscricoesAbertas,
    pontuacaoLancada: false,
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

  copaFoiSelecionada: boolean = false;
  temPosicaoRepetida: boolean = false;

  equipesFaltamPreencher: number = 0;
  equipesPreenchidas: number = 0;

  pontosPorEquipe: Record<string, number> = {};
  posicaoPorEquipe: Record<string, number> = {};

  constructor(
    private copaService: CopaService,
    private equipeService: EquipeService
  ) { }

  ngOnInit(): void {
    this.copaService.listarCopas().subscribe({
      next: (copas) => {
        copas.forEach((copa) => {
          if (copa.status === CopaStatus.CopaFinalizada && !copa.pontuacaoLancada) {
            this.copas.push(copa);
          }
        })
      }
    })
  }

  copaSelecionada(idCopa: string): void {
    const copa = this.copas.find((copa) => copa.id === idCopa)!;

    this.equipesFaltamPreencher = copa.equipes.length;

    this.copa = copa;

    this.copaFoiSelecionada = true;
  }

  aoSelecionarPosicao(idEquipe: string, valorSelect: string): void {
    const posicao = Number(valorSelect);
    this.temPosicaoRepetida = false;

    const jaFoiContado = this.posicaoPorEquipe[idEquipe] !== undefined;

    this.pontosPorEquipe[idEquipe] = this.calcularPontosPorPosciao(posicao);

    this.posicaoPorEquipe[idEquipe] = posicao;

    if (!jaFoiContado) {
      this.equipesPreenchidas++;
      this.equipesFaltamPreencher--;
    }

    // Object.values pega os valores do objeto posicaoPorEquipe que criamos e cria um array disso. Por exemplo [0, 1, 4, 2, 1]
    const posicoes = Object.values(this.posicaoPorEquipe);
    
    // new Set cria um novo array com valores sem repetição
    // Então estamos verificando se o tamanho do array criado sem repetições é diferente do array original de posições
    // se for diferente, significa que há repetição
    if (new Set(posicoes).size !== posicoes.length) {
      this.temPosicaoRepetida = true;
    }
  }

  calcularPontosPorPosciao(posicao: number): number {
    const base = 200 - (10 * posicao);

    const posicoes: Record<number, number> = {
      0: base + this.copa.pontosAdicionais.primeiroLugar,
      1: base + this.copa.pontosAdicionais.segundoLugar,
      2: base + this.copa.pontosAdicionais.terceiroLugar
    }

    if (posicoes[posicao]) {
      return posicoes[posicao];
    }

    if (posicao >= 19) {
      return 10
    }

    return base;
  }

  async lancarPontuacao(): Promise<void> {
    this.copa.pontuacaoLancada = true;

    const copaAtualizada = await firstValueFrom(this.copaService.atualizarCopa(this.copa.id, this.copa));

    for (const equipe of copaAtualizada.equipes) {
      const equipeId = await firstValueFrom(this.equipeService.buscarEquipePorId(equipe.idEquipe));

      const pontuacaoEquipe = this.pontosPorEquipe[equipeId.id];

      const pontuacaoTotalEquipe = equipeId.pontuacaoTotal + pontuacaoEquipe;

      await firstValueFrom(this.equipeService.atualizarPontuacaoEquipe(equipeId.id, pontuacaoTotalEquipe));

      const novosValoresInscricao = equipeId.inscricoes.map((inscricao) => {
        return inscricao.id === this.copa.id ? {
          ...inscricao,
          posicaoEquipe: this.posicaoPorEquipe[equipeId.id] + 1,
          pontuacaoEquipe: pontuacaoEquipe
        } : inscricao
      })

      await firstValueFrom(this.equipeService.atualizarInscricoesDasCopas(equipeId.id, novosValoresInscricao));
    }

    this.ngOnInit();
    this.copaFoiSelecionada = false;
  }
}