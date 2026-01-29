import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CopaService } from '../../../../core/services/copa.service';
import { ICopa } from '../../../../core/interfaces/models/copa/copa';
import { DatePipe, NgClass } from '@angular/common';
import { CopaStatus } from '../../../../core/interfaces/models/copa/copa-status.enum';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SubscribeComponent } from '../../../../components/modal/subscribe/subscribe.component';

@Component({
  selector: 'app-available-cups',
  imports: [RouterLink, DatePipe, NgClass, NgbModalModule],
  templateUrl: './available-cups.component.html',
  styleUrl: './available-cups.component.css'
})
export class AvailableCupsComponent implements OnInit {
  copas: ICopa[] = [];

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

  constructor(
    private copaService: CopaService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.copaService.listarCopas().subscribe({
      next: (copas) => {
        this.copas = copas;
        // console.log(this.copas);
      }
    })
  };

  abrirModal(copaId: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {inscrever: copaId}
    });
    
    const ref = this.modal.open(SubscribeComponent, {centered: true, backdrop: 'static'});
    
    ref.componentInstance.copaId = copaId;
    
    ref.result.finally(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {inscrever: null}
      }
      );
    });
  };
}