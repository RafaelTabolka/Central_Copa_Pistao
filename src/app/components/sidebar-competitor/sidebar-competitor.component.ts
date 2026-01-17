import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from "@angular/router";

@Component({
  selector: 'app-sidebar-competitor',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './sidebar-competitor.component.html',
  styleUrl: './sidebar-competitor.component.css'
})
export class SidebarCompetitorComponent {
  mostraSidebar: boolean = false;

  mostraEscondeSidebar(): void {
    this.mostraSidebar = !this.mostraSidebar;
  }
}
