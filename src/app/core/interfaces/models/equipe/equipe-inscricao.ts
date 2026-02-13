import { CopaStatus } from "../copa/copa-status.enum"

export interface IEquipeInscricao {
    id: string,
    nomeCopa: string,
    status: CopaStatus,
    pontuacaoLancada: boolean,
    imagemLogo: {
        nome: string,
        caminho: string
    },
    dataInicio: string,
    dataTermino: string,
    descricao: string,
    preRequisito: {
        minimoIntegrantes: number,
        pontuacaoMinima: number
    },
    posicaoEquipe: number | null,
    pontosAdicionais: {
        primeiroLugar: number,
        segundoLugar: number,
        terceiroLugar: number
    },
    pontuacaoEquipe: number | null
}