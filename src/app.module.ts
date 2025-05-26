import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlunosModule } from './alunos/alunos.module';
import { AulasModule } from './aulas/aulas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carrega as variáveis do .env automaticamente
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      synchronize: true, // Não usar true em produção
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    AlunosModule,
    AulasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
