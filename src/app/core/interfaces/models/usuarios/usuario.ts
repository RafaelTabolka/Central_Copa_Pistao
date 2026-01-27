export interface IUsuario {
    id: string,
    nomeUsuario: string,
    email: string,
    senha: string,
    perfil: string,
    equipe: {
        id: string,
        nomeEquipe: string
    }
}