import { Component } from '@angular/core';
import { SidebarCompetitorComponent } from "../../components/sidebar-competitor/sidebar-competitor.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-competitor',
  imports: [SidebarCompetitorComponent, RouterOutlet],
  templateUrl: './competitor.component.html',
  styleUrl: './competitor.component.css'
})
export class CompetitorComponent {

}
