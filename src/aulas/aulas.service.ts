import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';
import { Aula } from './entities/aula.entity';

@Injectable()
export class AulasService {
  constructor(
    @InjectRepository(Aula)
    private aulasRepository: Repository<Aula>
  ) { }

  async create(createAulaDto: CreateAulaDto): Promise<Aula> {
    const { emailAluno, data } = createAulaDto;
  
    const dataConvertida = new Date(data);
  
    const aulaExistente = await this.aulasRepository.findOne({
      where: {
        emailAluno,
        data: dataConvertida,
      },
    });
  
    if (aulaExistente) {
      throw new ConflictException('Você já está registrado para esta aula.');
    }
  
    const totalAlunosNoHorario = await this.aulasRepository.count({
      where: {
        data: dataConvertida,
      },
    });
  
    if (totalAlunosNoHorario >= 5) {
      throw new ConflictException('Limite de alunos para este horário já foi atingido.');
    }
  
    const novaAula = this.aulasRepository.create({
      emailAluno,
      data: dataConvertida,
    });
  
    return this.aulasRepository.save(novaAula);
  }

  findAll() {
    return this.aulasRepository.find()
    //return `This action returns all alunos`;
  }

  findOne(id: string) {
    return this.aulasRepository.findOneBy({ _id: new ObjectId(id) })
    // return `This action returns a #${id} aluno`;
  }

  async update(id: string, updateAulaDto: UpdateAulaDto) {
    await this.aulasRepository.update(
      { _id: new ObjectId(id) },
      updateAulaDto,
    )

    return this.findOne(id)
    // return `This action updates a #${id} aluno`;
  }

  async remove(id: string) {
    const aluno = await this.findOne(id)
    if (aluno) {
      return this.aulasRepository.remove(aluno)
    }
    // return `This action removes a #${id} aluno`;
  }
}
