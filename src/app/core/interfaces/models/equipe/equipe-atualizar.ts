import { EquipeCategoria } from "./equipe-categoria.enum"
import { EquipeStatus } from "./equipe-status.enum"

export interface IEquipeAtualizar {
    nomeEquipe: string,
    categoria: EquipeCategoria,
    qtdeIntegrantes: number,
    integrantes: {
        id: string,
        nome: string,
        funcao: string,
        status: EquipeStatus
    }[]
}