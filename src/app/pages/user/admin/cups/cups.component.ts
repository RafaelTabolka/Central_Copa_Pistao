import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CopaService } from '../../../../core/services/copa.service';
import { ICopa } from '../../../../core/interfaces/models/copa/copa';
import { DatePipe, NgClass } from '@angular/common';
import { CopaStatus } from '../../../../core/interfaces/models/copa/copa-status.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../../../components/modal/confirm/confirm.component';
import { EquipeService } from '../../../../core/services/equipe.service';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { IEquipe } from '../../../../core/interfaces/models/equipe/equipe';

@Component({
  selector: 'app-cups',
  imports: [RouterLink, DatePipe, NgClass],
  templateUrl: './cups.component.html',
  styleUrl: './cups.component.css'
})
export class CupsComponent implements OnInit {
  copas: ICopa[] = [];

  copaStatusEstilos: Record<string, string> = {
    inscricoesAbertas: 'section-cards__span-abertas',
    inscricoesEncerradas: 'section-cards__span-encerradas',
    emAndamento: 'section-cards__span-andamento',
    copaFinalizada: 'section-cards__span-finalizadas'
  };

  copaStatusNomes: Record<CopaStatus, string> = {
    inscricoesAbertas: 'Inscrições Abertas',
    inscricoesEncerradas: 'Inscrições Encerradas',
    emAndamento: 'Em Andamento',
    copaFinalizada: 'Copa Finalizada'
  };

  botaoNomes: Record<string, string> = {
    inscricoesAbertas: 'Encerrar Inscrições',
    inscricoesEncerradas: 'Iniciar Copa',
    emAndamento: 'Finalizar Copa',
    copaFinalizada: 'Copa Finalizada'
  }

  botaoEstilos: Record<string, string> = {
    inscricoesAbertas: 'btn section-cards__btn-encerrar-inscricao',
    inscricoesEncerradas: 'btn section-cards__btn-iniciar-copa',
    emAndamento: 'btn section-cards__btn-finalizar-copa',
    copaFinalizada: 'btn section-cards__btn-copa-finalizada'
  }

  constructor(
    private copaService: CopaService,
    private equipeService: EquipeService,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.copaService.listarCopas().subscribe({
      next: (copas) => {
        this.copas = copas
      }
    })
  }

  async alterarStatus(idCopa: string, status: CopaStatus): Promise<void> {
    if (status === CopaStatus.CopaFinalizada) {
      return;
    }

    const statusValor: Record<string, number> = {
      inscricoesAbertas: 0,
      inscricoesEncerradas: 1,
      emAndamento: 2,
      copaFinalizada: 3
    }

    const valorStatus: Record<number, CopaStatus> = {
      0: CopaStatus.InscricoesAbertas,
      1: CopaStatus.InscricoesEncerradas,
      2: CopaStatus.EmAndamento,
      3: CopaStatus.CopaFinalizada
    }

    let proximoStatus: CopaStatus = valorStatus[++statusValor[status]];

    const ref = this.modal.open(ConfirmComponent, { centered: true, backdrop: 'static' });

    ref.componentInstance.titulo = 'Alterar Status';
    ref.componentInstance.mensagem = 'Certeza que deseja alterar? A copa vai ser finalizada e não há retorno!';
    ref.componentInstance.icone = 'bi-arrow-repeat';

    const confirmou = await firstValueFrom(ref.closed);
    
    if (!confirmou) {
      return;
    }

    const copaAtualizada = await firstValueFrom (
      this.copaService.atualizarStatusCopa(idCopa, proximoStatus)
    );

    for (const equipe of copaAtualizada.equipes) {
      const equipePorId = await firstValueFrom(this.equipeService.buscarEquipePorId(equipe.idEquipe));

      const inscricoesAtualizadas = equipePorId.inscricoes.map((inscricao) => {
        return inscricao.id === idCopa ? {...inscricao, status: proximoStatus} : inscricao;
      });

      await firstValueFrom(
        this.equipeService.modificarStatusInscricaoCopa(equipe.idEquipe, inscricoesAtualizadas)
      );
    }

    this.ngOnInit();
  }
}
