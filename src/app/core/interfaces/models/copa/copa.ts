import { CopaStatus } from "./copa-status.enum";

export interface ICopa {
    id: string,
    nomeCopa: string,
    status: CopaStatus,
    imagemLogo: string,
    dataInicio: string,
    dataTermino: string,
    descricao: string,
    preRequisito: {
        minimoParticipantes: number,
        pontuacaoMinima: number
    },
    pontosAdicionais: {
        primeiroLugar: number | null,
        segundoLugar: number | null,
        terceiroLugar: number | null
    } | null,
    equipes: {
        idEquipe: string,
        nomeEquipe: string
    }[]
}