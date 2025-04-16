import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlunosModule } from './alunos/alunos.module';
import { TypeOrmModule } from "@nestjs/typeorm"
import { AulasModule } from './aulas/aulas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mongodb",
      url: "mongodb://127.0.0.1:27017/databasePI", // entender porque url: "mongodb://localhost:27017/databasePI" nao funcionou
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // nao usar true em producao
    }),
    AlunosModule,
    AulasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
