import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { IEquipe } from '../../../../core/interfaces/models/equipe/equipe';
import { EquipeStatus } from '../../../../core/interfaces/models/equipe/equipe-status.enum';
import { EquipeCategoria } from '../../../../core/interfaces/models/equipe/equipe-categoria.enum';
import { EquipeService } from '../../../../core/services/equipe.service';
import { DatePipe, NgClass } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ICopa } from '../../../../core/interfaces/models/copa/copa';
import { ConfirmComponent } from '../../../../components/modal/confirm/confirm.component';
import { CopaService } from '../../../../core/services/copa.service';
import { ICopaInscricaoEquipe } from '../../../../core/interfaces/models/copa/copa-inscricao';

@Component({
  selector: 'app-my-team',
  imports: [RouterLink, NgClass, DatePipe],
  templateUrl: './my-team.component.html',
  styleUrl: './my-team.component.css'
})
export class MyTeamComponent implements OnInit {
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

  instegrantesStatusEstilos: Record<string, string> = {
    ativo: 'table__span-ativo',
    inativo: 'table__span-inativo'
  };

  idEquipe: string = localStorage.getItem('idEquipe')!;

  inscricoesAtivas: number = 0;

  constructor(
    private equipeService: EquipeService,
    private copaService: CopaService,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.equipeService.buscarEquipePorId(this.idEquipe).subscribe({
      next: (equipe) => {
        this.inscricoesAtivas = 0;

        this.equipe = equipe;
        // console.log(this.equipe);

        this.equipe.inscricoes.forEach((inscricao) => {
          // console.log(inscricao)
          if (inscricao.status !== 'copaFinalizada') {
            this.inscricoesAtivas++;
          }
        });
      }
    });
  };

  cancelarInscricao(idCopa: string): void {
    const ref = this.modal.open(ConfirmComponent, { centered: true, backdrop: 'static' });

    ref.componentInstance.titulo = 'Cancelar Inscrição';
    ref.componentInstance.mensagem = 'Tem certeza que deseja cancelar sua inscrição?';


    ref.closed.subscribe((confirmou: boolean) => {
      if (confirmou) {
        const inscricoesRestantes = this.equipe.inscricoes.filter((inscricao) => inscricao.id !== idCopa);
        // console.log(inscricoesRestantes)

        this.equipeService.atualizarInscricoesDasCopas(this.idEquipe, inscricoesRestantes).subscribe({
          next: () => {

            this.copaService.buscarCopaPorId(idCopa).subscribe({
              next: (copa) => {

                const equipesRestantes = copa.equipes.filter((equipe) => equipe.idEquipe !== this.equipe.id);

                this.copaService.atualizarEquipesDaCopa(copa.id, equipesRestantes).subscribe({
                  next: () => {
                    this.ngOnInit();
                  }
                });
              }
            });
          }
        });
      };
    });
  };

  desativarEquipe(): void {
    const ref = this.modal.open(ConfirmComponent, { centered: true, backdrop: 'static' });

    ref.componentInstance.titulo = 'Desativar Equipe';
    ref.componentInstance.mensagem = 'Tem certeza? Todas as inscrições nas copas serão canceladas!';

    ref.closed.subscribe((confirmou: boolean) => {
      if (!confirmou) {
        return;
      }

      this.equipe.status = EquipeStatus.Inativo;

      this.equipe.integrantes.forEach((integrante) => integrante.status = EquipeStatus.Inativo);

      this.equipe.inscricoes = [];

      this.copaService.listarCopas().subscribe({
        next: (copas) => {

          const copasComMinhaEquipe = copas.filter((copa) => copa.equipes.some((equipe) => equipe.idEquipe === this.equipe.id));


          if (copasComMinhaEquipe.length === 0) {
            this.ngOnInit();
            return;
          }

          let equipesRestantes: number = copasComMinhaEquipe.length;

          copasComMinhaEquipe.forEach((copa) => {
            const equipesAtualizadas = copa.equipes.filter((equipe) => equipe.idEquipe !== this.equipe.id);

            this.copaService.atualizarEquipesDaCopa(copa.id, equipesAtualizadas).subscribe({
              next: () => {
                equipesRestantes--;

                if (equipesRestantes === 0) {
                  this.equipeService.modificarStatusEquipe(this.equipe).subscribe({
                    next: () => {
                      this.ngOnInit();
                    }
                  });
                };
              }
            });
          });
        }
      });
    });
  }

  ativarEquipe(): void {
    console.log('oi')

    this.equipe.status = EquipeStatus.Ativo;

    this.equipe.integrantes.forEach((integrante) => {
      integrante.status = EquipeStatus.Ativo;
    });

    this.equipeService.modificarStatusEquipe(this.equipe).subscribe({
      next: () => {
        this.ngOnInit();
      }
    })
  }
}
