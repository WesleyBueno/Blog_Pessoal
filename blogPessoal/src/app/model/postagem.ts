import { Tema } from './tema'

    export class Postagem{
        public id!: number
        public titulo!: string
        public texto!: string
        public data!: Date
        public tema! : Tema
    }