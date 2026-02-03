import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm',
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
  @Input() titulo: string = '';
  @Input() mensagem: string = '';

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
