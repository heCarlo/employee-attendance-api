import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Controle de Ponto API')
    .setDescription('API para controle de ponto dos colaboradores. Permite registrar e visualizar os turnos de trabalho dos colaboradores, incluindo a possibilidade de iniciar e finalizar turnos, bem como visualizar as horas trabalhadas no dia atual e nos dias anteriores.')
    .setVersion('1.0')
    .addTag('attendance', 'Operações relacionadas ao controle de ponto')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
