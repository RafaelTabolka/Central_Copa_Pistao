import { CopaStatus } from "./copa-status.enum";

export interface ICopa {
    id: string,
    nomeCopa: string,
    status: CopaStatus,
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
    pontosAdicionais: {
        primeiroLugar: number,
        segundoLugar: number,
        terceiroLugar: number
    },
    equipes: {
        idEquipe: string,
        nomeEquipe: string
    }[]
}