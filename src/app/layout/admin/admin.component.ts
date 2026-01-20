import { Component } from '@angular/core';

import { SidebarAdminComponent } from "../../components/sidebar-admin/sidebar-admin.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, SidebarAdminComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
