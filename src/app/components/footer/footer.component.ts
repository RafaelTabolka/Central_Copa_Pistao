import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
  statusServidor: string = 'Inativo';
  
  constructor(private usuarioService: UsuarioService) {}
  
  ngOnInit(): void {
    this.statusServidor = 'Inativo';
    
    this.usuarioService.listarUsuarios().subscribe({
      next: () => {
        this.statusServidor = 'Ok'
      }
    })
  }
}
