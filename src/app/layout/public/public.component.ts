import { Component } from '@angular/core';

import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './public.component.html',
  styleUrl: './public.component.css'
})
export class PublicComponent {

}
