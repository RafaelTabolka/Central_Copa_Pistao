import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent {
  mostraSidebar: boolean = false;

  mostraEscondeSidebar(): void {
    this.mostraSidebar = !this.mostraSidebar;
  }
}
