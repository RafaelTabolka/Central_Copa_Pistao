import { EquipeCategoria } from "./equipe-categoria.enum"
import { EquipeStatus } from "./equipe-status.enum"

export interface IEquipe {
    id: string,
    idUsuario: string,
    nomeEquipe: string,
    status: EquipeStatus | null,
    categoria: EquipeCategoria | null,
    qtdeIntegrantes: number,
    participantes: {
        id: string,
        nome: string,
        funcao: string,
        status: EquipeStatus
    }[],
    pontuacaoTotal: number,
    inscricoes:
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
    }[]
}