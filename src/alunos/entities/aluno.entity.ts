import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class Aluno {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    login: string

    @Column()
    senha: string

    @Column()
    nome: string

    @Column()
    cpf: string
    
    @Column()
    sexo: string

    @Column()
    celular: string

    @Column()
    dataNascimento: Date

    @Column()
    imagem: string
}
