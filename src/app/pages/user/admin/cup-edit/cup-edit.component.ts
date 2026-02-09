import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CopaService } from '../../../../core/services/copa.service';

@Component({
  selector: 'app-cup-edit',
  imports: [RouterLink],
  templateUrl: './cup-edit.component.html',
  styleUrl: './cup-edit.component.css'
})
export class CupEditComponent implements OnInit {
  
  constructor(
    private copaService: CopaService
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
