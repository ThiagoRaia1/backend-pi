import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class Aula {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    emailAluno: string

    @Column()
    data: Date
}
