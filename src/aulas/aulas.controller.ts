import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { AulasService } from './aulas.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { Aula } from './entities/aula.entity';

@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) { }

  @Post()
  async create(@Body() createAulaDto: CreateAulaDto): Promise<Aula> {
    try {
      return await this.aulasService.create(createAulaDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':login')
  async buscarPorLogin(@Param('login') login: string): Promise<Aula[]> {
    try {
      console.log("Entrou buscarPorLogin")
      return await this.aulasService.buscarPorLogin(login);
    } catch (error) {
      throw new BadRequestException('Erro ao buscar aulas por login');
    }
  }

  @Get('horario/:data')
  async buscarHorariosCheios(@Param('data') data: string): Promise<string[]> {
    try {
      // console.log("Entrou buscarPorData")
      const dataConvertida = new Date(data)
      return await this.aulasService.buscarHorariosCheios(dataConvertida);
    } catch (error) {
      throw new BadRequestException('Erro ao buscar aulas por data');
    }
  }

  @Get()
  findAll() {
    return this.aulasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
      console.log("Entrou findOne id")
    return this.aulasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulasService.update(id, updateAulaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aulasService.remove(id);
  }

  @Delete(':login/:dataHora')
  excluirPorLoginEData(
    @Param('login') login: string,
    @Param('dataHora') dataHora: string,
  ) {
    return this.aulasService.excluirPorLoginEData(login, dataHora);
  }
}
