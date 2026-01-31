import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterLinkWithHref } from "@angular/router";
import { EquipeService } from '../../core/services/equipe.service';
import { IEquipe } from '../../core/interfaces/models/equipe/equipe';
import { EquipeStatus } from '../../core/interfaces/models/equipe/equipe-status.enum';
import { EquipeCategoria } from '../../core/interfaces/models/equipe/equipe-categoria.enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar-competitor',
  imports: [RouterLinkActive, RouterLinkWithHref, NgClass],
  templateUrl: './sidebar-competitor.component.html',
  styleUrl: './sidebar-competitor.component.css'
})
export class SidebarCompetitorComponent implements OnInit {
  mostraSidebar: boolean = false;

  nomeUsuario: string = localStorage.getItem('nomeUsuario')!;

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

  equipeStatusEstilos: Record<string, string> = {
    ativo: 'menu-lateral__span-ativo',
    inativo: 'menu-lateral__span-inativo',
  };

  constructor(
    private equipeService: EquipeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.equipeService.buscarEquipePorId(localStorage.getItem('idEquipe')!).subscribe({
      next: (equipe) => {
        this.equipe = equipe;
      }
    });
  };

  mostraEscondeSidebar(): void {
    this.mostraSidebar = !this.mostraSidebar;
  };

  sair(): void {
    localStorage.clear();
    this.router.navigate(['public/home']);
  }
}
