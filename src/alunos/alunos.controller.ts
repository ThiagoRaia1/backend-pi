import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) { }

  // Autetica o login
  @Post('login')
  async login(@Body() body: { login: string; senha: string }) {
    const { login, senha } = body;
    return this.alunosService.autenticar(login, senha);
  }

  @Post()
  create(@Body() createAlunoDto: CreateAlunoDto) {
    return this.alunosService.create(createAlunoDto);
  }

  @Get()
  findAll() {
    return this.alunosService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.alunosService.findOne(id);
  // }

  @Get(':login')
  async findOne(@Param('login') login: string) {
    return await this.alunosService.findOneByLogin(login);
  }

  @Patch(':login')
  async atualizarAluno(
    @Param('login') login: string,
    @Body() updateAlunoDto: UpdateAlunoDto,
  ) {
    return this.alunosService.updateByEmail(login, updateAlunoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alunosService.remove(id);
  }
}
