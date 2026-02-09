import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CopaService } from '../../../../core/services/copa.service';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CopaStatus } from '../../../../core/interfaces/models/copa/copa-status.enum';

@Component({
  selector: 'app-cup-edit',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './cup-edit.component.html',
  styleUrl: './cup-edit.component.css'
})
export class CupEditComponent implements OnInit {
  readonly formEdit: FormGroup<{
    nomeCopa: FormControl<string>;
    status: FormControl<CopaStatus>;
    logoCopa: FormControl<string>;
    dataInicio: FormControl<string>;
    dataTermino: FormControl<string>;
    descricao: FormControl<string>;
    minimoParticipantes: FormControl<number>;
    pontuacaoMinima: FormControl<number>;
    pontuacaoPrimeiroLugar: FormControl<number>;
    pontuacaoSegundoLugar: FormControl<number>;
    pontuacaoTerceiroLugar: FormControl<number>;
  }>

  constructor(
    private copaService: CopaService,
    private route: ActivatedRoute,
    private fb: NonNullableFormBuilder
  ) {
    this.formEdit = this.fb.group({
      nomeCopa: ['', [Validators.required]],
      status: [CopaStatus.InscricoesAbertas, [Validators.required]],
      logoCopa: ['', [Validators.required]],
      dataInicio: ['', [Validators.required]],
      dataTermino: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      minimoParticipantes: [0, [Validators.required]],
      pontuacaoMinima: [0, [Validators.required]],
      pontuacaoPrimeiroLugar: [0, [Validators.required]],
      pontuacaoSegundoLugar: [0, [Validators.required]],
      pontuacaoTerceiroLugar: [0, [Validators.required]]
    })
  }

  ngOnInit(): void {
    const idCopa = this.route.snapshot.paramMap.get('id')!;

    this.copaService.buscarCopaPorId(idCopa).subscribe({
      next: (copa) => {
        this.formEdit.patchValue({
          nomeCopa: copa.nomeCopa,
          status: copa.status,
          // logoCopa: copa.imagemLogo,
          dataInicio: copa.dataInicio,
          dataTermino: copa.dataTermino,
          descricao: copa.descricao,
          minimoParticipantes: copa.preRequisito.minimoIntegrantes,
          pontuacaoMinima: copa.preRequisito.pontuacaoMinima,
          pontuacaoPrimeiroLugar: copa.pontosAdicionais.primeiroLugar,
          pontuacaoSegundoLugar: copa.pontosAdicionais.segundoLugar,
          pontuacaoTerceiroLugar: copa.pontosAdicionais.terceiroLugar,
        })
      }
    })
  }

}
