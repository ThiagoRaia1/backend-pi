import { IsString, IsDateString, IsNotEmpty, IsEmail } from 'class-validator'

export class CreateAlunoDto {
  @IsEmail()
  @IsNotEmpty()
  login: string

  @IsString()
  @IsNotEmpty()
  senha: string

  @IsString()
  @IsNotEmpty()
  nome: string

  @IsString()
  @IsNotEmpty()
  cpf: string

  @IsString()
  @IsNotEmpty()
  sexo: string

  @IsString()
  @IsNotEmpty()
  celular: string

  @IsDateString()
  dataNascimento: Date
}
