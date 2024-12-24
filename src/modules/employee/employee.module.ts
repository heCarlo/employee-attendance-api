import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/core/entities/employee.entity';
import { EmployeeService } from './services/employee.service';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeRepositoryImpl } from './repositories/employee.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])], 
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepositoryImpl],
})
export class EmployeeModule {}
