import { Component, OnInit } from '@angular/core';
import { ICopa } from '../../../../core/interfaces/models/copa/copa';
import { CopaStatus } from '../../../../core/interfaces/models/copa/copa-status.enum';
import { CopaService } from '../../../../core/services/copa.service';
import { DatePipe } from '@angular/common';

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

  constructor(
    private copaService: CopaService
  ) { }

  ngOnInit(): void {
    this.copaService.listarCopas().subscribe({
      next: (copas) => {
        copas.forEach((copa) => {
          if (copa.status === CopaStatus.CopaFinalizada) {
            this.copas.push(copa);
          }
        })

        console.log(this.copas)
      }
    })
  }

  copaSelecionada(idCopa: string): void {
    const copa = this.copas.find((copa) => copa.id === idCopa)!;
    
    this.copa = copa;
    
    this.copaFoiSelecionada = true;
    console.log(copa)
  }












}
