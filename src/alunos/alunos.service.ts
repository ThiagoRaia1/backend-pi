import { Injectable } from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';

import { Aluno } from './entities/aluno.entity';

@Injectable()
export class AlunosService {
  constructor(
    @InjectRepository(Aluno)
    private alunosRepository: Repository<Aluno>
  ) { }

  async autenticar(login: string, senha: string): Promise<Aluno> {
    const aluno = await this.alunosRepository.findOneBy({ login, senha });

    if (!aluno) {
      throw new Error('Login ou senha inválidos');
    }

    return aluno;
  }

  create(createAlunoDto: CreateAlunoDto) {
    const newAluno = this.alunosRepository.create(createAlunoDto)
    return this.alunosRepository.save(newAluno)
    // return 'This action adds a new aluno';
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
