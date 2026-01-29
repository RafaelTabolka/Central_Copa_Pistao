import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipeService } from '../../../core/services/equipe.service';
import { IEquipe } from '../../../core/interfaces/models/equipe/equipe';
import { EquipeStatus } from '../../../core/interfaces/models/equipe/equipe-status.enum';
import { EquipeCategoria } from '../../../core/interfaces/models/equipe/equipe-categoria.enum';
import { ActivatedRoute } from '@angular/router';
import { CopaService } from '../../../core/services/copa.service';

type Requisitos = { texto: string, classe: string, icon: string };
type StatusInscricao = { texto: string, classe: string, icon: string };

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
    status: null,
    categoria: null,
    qtdeIntegrantes: 0,
    participantes: [],
    pontuacaoTotal: 0,
    inscricoes: []
  };

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

        this.inscricaoLiberada =
          equipe.qtdeIntegrantes >= 3 &&
          equipe.pontuacaoTotal >= 120;

        console.log(this.inscricaoLiberada)
      }
    });

    this.copaId = this.route.snapshot.queryParamMap.get('inscrever')!;
    console.log(this.copaId);

    this.copaService.buscarCopaPorId(this.copaId).subscribe({
      next: (copa) => {
        console.log(copa)
      }
    })
  }

  confirmar(): void {
    this.modalAtivo.close(true);
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

  // statusInscricao(): StatusInscricao {
  //   const inscricaoLiberada = 
  //   this.equipe.pontuacaoTotal
  // }
}
