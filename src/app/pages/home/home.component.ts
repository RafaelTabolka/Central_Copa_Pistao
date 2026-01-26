import { Component, OnInit } from '@angular/core';
import { CopaService } from '../../core/services/copa.service';
import { ICopa } from '../../core/interfaces/models/copa/copa';
import { EquipeService } from '../../core/services/equipe.service';
import { IEquipe } from '../../core/interfaces/models/equipe/equipe';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  topTresEquipes: IEquipe[] = [];
  equipesAtivas: number = 0;

  copas: ICopa[] = [];
  copasAtivas: number = 0;
  inscricoes: number = 0;

  constructor(
    private copaService: CopaService,
    private equipeService: EquipeService
  ) {}

  ngOnInit(): void {
    this.copaService.listarCopas().subscribe({
      next: (copas) => {
        this.copas = copas; 

        this.copas.forEach((copa) => {
          this.copasAtivas += copa.status !== 'copaFinalizada' ? 1 : 0;
          this.inscricoes += copa.equipes.length;
        })
      }
    });

    this.equipeService.listarEquipes().subscribe({
      next: (equipes) => {
        // this.equipes = equipes;

        equipes.forEach((equipe) => {
          this.equipesAtivas += equipe.status == 'ativo' ? 1 : 0;
        })

        this.topTresEquipes = equipes
        .filter((equipe) => equipe.status == 'ativo')
        .sort((primeiraEquipe, segundaEquipe) => segundaEquipe.pontuacaoTotal - primeiraEquipe.pontuacaoTotal)
        .slice(0, 3);
        console.log(this.topTresEquipes);
      }
    });
  }
}
