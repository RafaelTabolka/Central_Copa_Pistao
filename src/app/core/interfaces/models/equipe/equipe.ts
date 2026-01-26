import { EquipeStatus } from "./equipe-status.enum"

export interface IEquipe {
    id: string,
    idUsuario: string,
    nomeEquipe: string,
    status: EquipeStatus
    categoria: string,
    qtdeIntegrantes: number,
    integrantes: [
        {
            id: string,
            nome: string,
            funcao: string,
            status: string
        }
    ],
    pontuacaoTotal: number,
    inscricoes: [
        {
            id: string,
            nomeCopa: string,
            status: string,
            imagemLogo: string,
            dataInicio: string,
            dataTermino: string,
            descricao: string,
            preRequisito: {
                minimoParticipantes: number,
                pontuacaoMinima: number
            },
            posicaoEquipe: number,
            pontosAdicionais: {
                primeiroLugar: number | null,
                segundoLugar: number | null,
                terceiroLugar: number | null
            } | null,
            pontuacaoEquipe: number
        }
    ] | []
}