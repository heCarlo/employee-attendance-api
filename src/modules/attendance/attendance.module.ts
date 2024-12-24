import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/core/entities/attendance.entity';
import { Employee } from 'src/core/entities/employee.entity';
import { AttendanceService } from './services/attendance.service';
import { AttendanceController } from './controllers/attendance.controller';
import { AttendanceRepositoryImpl } from './repositories/attendance.repository';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, Employee]),
    EmployeeModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    AttendanceRepositoryImpl,
  ],
})
export class AttendanceModule {}
