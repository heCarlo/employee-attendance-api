import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { Employee } from './core/entities/employee.entity';
import { Attendance } from './core/entities/attendance.entity';
import { EmployeeModule } from './modules/employee/employee.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Employee, Attendance],
        synchronize: true, // desativar em produção
      }),
      inject: [ConfigService],
    }),

    AttendanceModule,
    EmployeeModule,
  ],
})
export class AppModule {}
