import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar-admin',
  imports: [RouterLinkActive, RouterLinkWithHref, NgClass],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent {
  mostraSidebar: boolean = false;
  nomeUsuario: string = localStorage.getItem('nomeUsuario')!;
  
  constructor(
    private router: Router
  ) {}

  mostraEscondeSidebar(): void {
    this.mostraSidebar = !this.mostraSidebar;
  }

  rotaComecaCom(rota: string): boolean {
    return this.router.url.startsWith(rota) ;
  }

  sair(): void {
    localStorage.clear();
    this.router.navigate(['public/home']);
  }
}
