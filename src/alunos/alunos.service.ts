import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';

import { Aluno } from './entities/aluno.entity';

import * as bcrypt from 'bcrypt';

const hashRounds = 10;

@Injectable()
export class AlunosService {
  constructor(
    @InjectRepository(Aluno)
    private alunosRepository: Repository<Aluno>,
  ) {}

  async autenticar(
    login: string,
    senha: string,
  ): Promise<Omit<Aluno, '_id' | 'senha'>> {
    const aluno = await this.alunosRepository.findOneBy({ login });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const senhaCorreta = await bcrypt.compare(senha, aluno.senha);
    if (!senhaCorreta) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Remove _id e senha antes de retornar
    const { _id, senha: _, ...alunoSemSenha } = aluno;
    return alunoSemSenha;
  }

  // Cria o aluno com hash na senha
  async create(createAlunoDto: CreateAlunoDto): Promise<Aluno> {
    // Verifica se já existe um aluno com o mesmo email
    const alunoExistente = await this.alunosRepository.findOne({
      where: { login: createAlunoDto.login },
    });

    if (alunoExistente) {
      throw new Error('Já existe um aluno cadastrado com esse email.');
    }

    // Criptografa a senha
    const hashedSenha = await bcrypt.hash(createAlunoDto.senha, hashRounds);

    // Cria e salva o novo aluno
    const novoAluno = this.alunosRepository.create({
      ...createAlunoDto,
      senha: hashedSenha,
    });

    return this.alunosRepository.save(novoAluno);
  }

  findAll() {
    return this.alunosRepository.find();
    //return `This action returns all alunos`;
  }

  findOne(id: string) {
    return this.alunosRepository.findOneBy({ _id: new ObjectId(id) });
    // return `This action returns a #${id} aluno`;
  }

  async findOneByLogin(login: string) {
    return this.alunosRepository.findOne({ where: { login } });
  }

  async updateByEmail(
    email: string,
    updateAlunoDto: UpdateAlunoDto,
  ): Promise<Omit<Aluno, '_id' | 'senha'>> {
    const aluno = await this.alunosRepository.findOne({
      where: { login: email },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado com esse e-mail');
    }

    const dadosAtualizacao = { ...updateAlunoDto };

    if (updateAlunoDto.senha) {
      dadosAtualizacao.senha = await bcrypt.hash(
        updateAlunoDto.senha,
        hashRounds,
      );
    }

    await this.alunosRepository.update(aluno._id, dadosAtualizacao);

    const alunoAtualizado = await this.alunosRepository.findOne({
      where: { _id: aluno._id },
    });

    if (!alunoAtualizado) {
      throw new NotFoundException(
        'Erro ao atualizar: aluno não encontrado após atualização',
      );
    }

    // Remove _id e senha antes de retornar
    const { _id, senha: _, ...alunoSemSenha } = alunoAtualizado;
    return alunoSemSenha;
  }

  async remove(id: string) {
    const aluno = await this.findOne(id);
    if (aluno) {
      return this.alunosRepository.remove(aluno);
    }
    // return `This action removes a #${id} aluno`;
  }
}
