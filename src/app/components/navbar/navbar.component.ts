import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
