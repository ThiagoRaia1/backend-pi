import { PartialType } from '@nestjs/mapped-types';
import { CreateAlunoDto } from './create-aluno.dto';
import {
    IsOptional,
    IsString,
    IsEmail,
    IsDateString,
} from 'class-validator';

export class UpdateAlunoDto extends PartialType(CreateAlunoDto) {
    @IsOptional()
    @IsString()
    nome?: string;

    @IsOptional()
    @IsEmail()
    login?: string;

    @IsOptional()
    @IsString()
    senha: string;

    @IsOptional()
    @IsString()
    cpf?: string;

    @IsOptional()
    @IsString()
    sexo?: string;

    @IsOptional()
    @IsString()
    celular?: string;

    @IsOptional()
    @IsDateString()
    dataNascimento?: Date;
}
