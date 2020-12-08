import { Postagem } from './postagem'

export class Tema{
    public id!: number
    public descricao!: string
    public postagem! : Postagem[]
}