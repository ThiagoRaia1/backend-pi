import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlunosModule } from './alunos/alunos.module';
import { TypeOrmModule } from "@nestjs/typeorm"
import { Aluno } from './alunos/entities/aluno.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mongodb",
      url: "mongodb://localhost:27017/localhost",
      synchronize: true, // nao usar true em producao
      entities: [Aluno],
    }),
    AlunosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
