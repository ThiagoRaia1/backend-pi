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

  @Get()
  findAll() {
    return this.aulasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
}
