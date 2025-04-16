import { IsString, IsDateString, IsNotEmpty, IsEmail } from 'class-validator'

export class CreateAulaDto {
    @IsEmail()
    @IsNotEmpty()
    emailAluno: string

    @IsDateString()
    @IsNotEmpty()
    data: Date
}
