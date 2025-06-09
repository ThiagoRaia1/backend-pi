import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Aula } from './entities/aula.entity';

@Injectable()
export class AulasService {
  constructor(
    @InjectRepository(Aula)
    private aulasRepository: Repository<Aula>,
  ) {}

  async create(createAulaDto: CreateAulaDto): Promise<Aula> {
    const { emailAluno, data } = createAulaDto;
    const dataConvertida = new Date(data);

    const inicioDoDia = new Date(dataConvertida);
    inicioDoDia.setHours(0, 0, 0, 0);
    const fimDoDia = new Date(dataConvertida);
    fimDoDia.setHours(23, 59, 59, 999);

    const primeiroDiaDoMes = new Date(
      dataConvertida.getFullYear(),
      dataConvertida.getMonth(),
      1,
    );
    const ultimoDiaDoMes = new Date(
      dataConvertida.getFullYear(),
      dataConvertida.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // 1. Verifica se o aluno já está cadastrado em 30 aulas no mês
    const aulasDoMes = await this.aulasRepository.find({
      where: {
        emailAluno,
      },
    });

    const aulasNoMes = aulasDoMes.filter((aula) => {
      const aulaData = new Date(aula.data);
      return aulaData >= primeiroDiaDoMes && aulaData <= ultimoDiaDoMes;
    });

    if (aulasNoMes.length >= 30) {
      throw new ConflictException(
        'Você já atingiu o limite de 30 aulas neste mês.',
      );
    }

    // 2. Verifica se o aluno já está registrado para esta aula exata
    const aulaMesmaHora = aulasDoMes.find((aula) => {
      return new Date(aula.data).getTime() === dataConvertida.getTime();
    });

    if (aulaMesmaHora) {
      throw new ConflictException('Você já está registrado para esta aula.');
    }

    // 3. Verifica se o aluno já tem 2 aulas no mesmo dia
    const aulasNoDia = aulasDoMes.filter((aula) => {
      const aulaData = new Date(aula.data);
      return aulaData >= inicioDoDia && aulaData <= fimDoDia;
    });

    if (aulasNoDia.length >= 2) {
      throw new ConflictException(
        'Você já atingiu o limite de duas aulas por dia.',
      );
    }

    // 4. Verifica se já existem 5 alunos registrados para a mesma data e hora
    const totalAlunosMesmoHorario = await this.aulasRepository.count({
      where: {
        data: dataConvertida,
      },
    });

    if (totalAlunosMesmoHorario >= 5) {
      throw new ConflictException(
        'Limite de alunos para este horário já foi atingido.',
      );
    }

    // Cria a nova aula
    const novaAula = this.aulasRepository.create({
      emailAluno,
      data: dataConvertida,
    });

    return this.aulasRepository.save(novaAula);
  }

  async buscarPorLogin(login: string): Promise<Aula[]> {
    return this.aulasRepository.find({
      where: { emailAluno: login },
      order: { data: 'ASC' }, // opcional: ordena por data crescente
    });
  }

  async buscarHorariosCheios(data: Date): Promise<string[]> {
    const horariosCheios: string[] = [];
    data.setDate(data.getDate() + 1);

    for (let hora = 6; hora <= 17; hora++) {
      // const inicio = new Date(data);
      // inicio.setHours(hora, 0, 0, 0);

      // const fim = new Date(data);
      // fim.setHours(hora, 59, 59, 999);

      data.setHours(hora);

      const aulas = await this.aulasRepository.find({
        where: { data },
      });

      // console.log('aulas na data ', data, ':' + aulas);

      if (aulas.length >= 5) {
        const horaStr = `${hora.toString().padStart(2, '0')}:00`;
        horariosCheios.push(horaStr);
      }
    }

    console.log(horariosCheios);

    return horariosCheios;
  }

  findAll() {
    return this.aulasRepository.find();
    //return `This action returns all alunos`;
  }

  findOne(id: string) {
    return this.aulasRepository.findOneBy({ _id: new ObjectId(id) });
    // return `This action returns a #${id} aluno`;
  }

  async update(id: string, updateAulaDto: UpdateAulaDto) {
    await this.aulasRepository.update({ _id: new ObjectId(id) }, updateAulaDto);

    return this.findOne(id);
    // return `This action updates a #${id} aluno`;
  }

  async remove(id: string) {
    await this.aulasRepository.delete({ _id: new ObjectId(id) });

    return { mensagem: 'Aula excluída com sucesso.' };
  }

  async excluirPorLoginEData(login: string, dataHora: string) {
    const data = new Date(dataHora);

    const aula = await this.aulasRepository.findOne({
      where: {
        emailAluno: login,
        data: data,
      },
    });

    if (!aula) {
      return { mensagem: 'Aula não encontrada.' };
    }

    await this.aulasRepository.remove(aula);

    return { mensagem: 'Aula excluída com sucesso.' };
  }
}
