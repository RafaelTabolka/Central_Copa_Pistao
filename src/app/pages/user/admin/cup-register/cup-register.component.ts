import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { CopaStatus } from '../../../../core/interfaces/models/copa/copa-status.enum';
import { ICopa } from '../../../../core/interfaces/models/copa/copa';
import { ICopaImagemLogo } from '../../../../core/interfaces/models/copa/copa-imagem-logo';
import { CopaService } from '../../../../core/services/copa.service';

@Component({
  selector: 'app-cup-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './cup-register.component.html',
  styleUrl: './cup-register.component.css'
})
export class CupRegisterComponent implements OnInit {
  readonly formRegister: FormGroup<{
    nomeCopa: FormControl<string>;
    status: FormControl<CopaStatus>;
    logoCopa: FormControl<string>;
    dataInicio: FormControl<string>;
    dataTermino: FormControl<string>;
    descricao: FormControl<string>;
    minimoIntegrantes: FormControl<number>;
    pontuacaoMinima: FormControl<number>;
    pontuacaoPrimeiroLugar: FormControl<number>;
    pontuacaoSegundoLugar: FormControl<number>;
    pontuacaoTerceiroLugar: FormControl<number>;
  }>

  copa: ICopa = {
    id: '',
    nomeCopa: '',
    status: CopaStatus.InscricoesAbertas,
    imagemLogo: {
      nome: '',
      caminho: ''
    },
    dataInicio: '',
    dataTermino: '',
    descricao: '',
    preRequisito: {
      minimoIntegrantes: 0,
      pontuacaoMinima: 0
    },
    pontosAdicionais: {
      primeiroLugar: 0,
      segundoLugar: 0,
      terceiroLugar: 0
    },
    equipes: []
  }

  imagens: ICopaImagemLogo[] = []

  constructor(
    private fb: NonNullableFormBuilder,
    private copaService: CopaService
  ) {
    this.formRegister = this.fb.group({
      nomeCopa: ['', [Validators.required]],
      status: [CopaStatus.InscricoesAbertas, [Validators.required]],
      logoCopa: ['', [Validators.required]],
      dataInicio: ['', [Validators.required]],
      dataTermino: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      minimoIntegrantes: [3, [Validators.required, Validators.min(3)]],
      pontuacaoMinima: [0, [Validators.required, Validators.min(0)]],
      pontuacaoPrimeiroLugar: [0, [Validators.required, Validators.min(0)]],
      pontuacaoSegundoLugar: [0, [Validators.required, Validators.min(0)]],
      pontuacaoTerceiroLugar: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.copaService.listarImagens().subscribe({
      next: (imagens) => {
        this.imagens = imagens;

      }
    })
  }

  cadastrarCopa(): void {
    if (this.formRegister.invalid) {
      return;
    }

    const logoCopa = this.imagens.find((imagem) => imagem.caminho === this.formRegister.controls.logoCopa.value)!

    const novaCopa: ICopa = {
      id: crypto.randomUUID(),
      nomeCopa: this.formRegister.controls.nomeCopa.value,
      status: this.formRegister.controls.status.value,
      imagemLogo: {
        nome: logoCopa.nome,
        caminho: logoCopa.caminho
      },
      dataInicio: this.formRegister.controls.dataInicio.value,
      dataTermino: this.formRegister.controls.dataTermino.value,
      descricao: this.formRegister.controls.descricao.value,
      preRequisito: {
        minimoIntegrantes: this.formRegister.controls.minimoIntegrantes.value,
        pontuacaoMinima: this.formRegister.controls.pontuacaoMinima.value
      },
      pontosAdicionais: {
        primeiroLugar: this.formRegister.controls.pontuacaoPrimeiroLugar.value,
        segundoLugar: this.formRegister.controls.pontuacaoSegundoLugar.value,
        terceiroLugar: this.formRegister.controls.pontuacaoTerceiroLugar.value
      },
      equipes: this.copa.equipes
    };

    this.copaService.cadastrarCopa(novaCopa).subscribe({
      next: () => {
        this.formRegister.reset();
      }
    })
  }

}
