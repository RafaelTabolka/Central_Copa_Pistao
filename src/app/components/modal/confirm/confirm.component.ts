import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-confirm',
  imports: [NgClass],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
  @Input() titulo: string = '';
  @Input() mensagem: string = '';
  @Input() icone: string = 'bi bi-x-circle';

  constructor(
    private modalAtivo: NgbActiveModal
  ) {}

  cancelarInscricao(): void {
    this.modalAtivo.close(true)
  }

  fecharModal(): void {
    this.modalAtivo.close(false)
  }
}
