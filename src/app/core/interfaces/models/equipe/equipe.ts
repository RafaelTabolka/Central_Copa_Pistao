import { CopaStatus } from "../copa/copa-status.enum"
import { EquipeCategoria } from "./equipe-categoria.enum"
import { EquipeStatus } from "./equipe-status.enum"

export interface IEquipe {
    id: string,
    idUsuario: string,
    nomeEquipe: string,
    status: EquipeStatus,
    categoria: EquipeCategoria,
    qtdeIntegrantes: number,
    integrantes: {
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
        posicaoEquipe: number | null,
        pontosAdicionais: {
            primeiroLugar: number,
            segundoLugar: number,
            terceiroLugar: number
        },
        pontuacaoEquipe: number | null
    }[]
}