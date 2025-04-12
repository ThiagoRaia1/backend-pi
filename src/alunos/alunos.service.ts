import { Injectable } from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';

import { Aluno } from './entities/aluno.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AlunosService {
  constructor(
    @InjectRepository(Aluno)
    private alunosRepository: Repository<Aluno>
  ) { }

  // Valida o login
  async autenticar(login: string, senha: string): Promise<Aluno> {
    const aluno = await this.alunosRepository.findOneBy({ login });
    if (!aluno) {
      throw new Error('Login ou senha inválidos');
    }
    const senhaCorreta = await bcrypt.compare(senha, aluno.senha);
    if (!senhaCorreta) {
      throw new Error('Login ou senha inválidos');
    }
    return aluno;
  }

  // Cria o aluno com hash na senha
  async create(createAlunoDto: CreateAlunoDto): Promise<Aluno> {
    const hashedSenha = await bcrypt.hash(createAlunoDto.senha, 10); // 10 = salt rounds
    const novoAluno = this.alunosRepository.create({
      ...createAlunoDto,
      senha: hashedSenha,
    });
    return this.alunosRepository.save(novoAluno);
  }

  findAll() {
    return this.alunosRepository.find()
    //return `This action returns all alunos`;
  }

  findOne(id: string) {
    return this.alunosRepository.findOneBy({ _id: new ObjectId(id) })
    // return `This action returns a #${id} aluno`;
  }

  async findOneByLogin(login: string) {
    return this.alunosRepository.findOne({ where: { login } });
  }

  async update(id: string, updateAlunoDto: UpdateAlunoDto) {
    await this.alunosRepository.update(
      { _id: new ObjectId(id) },
      updateAlunoDto,
    )

    return this.findOne(id)
    // return `This action updates a #${id} aluno`;
  }

  async remove(id: string) {
    const aluno = await this.findOne(id)
    if (aluno) {
      return this.alunosRepository.remove(aluno)
    }
    // return `This action removes a #${id} aluno`;
  }
}
