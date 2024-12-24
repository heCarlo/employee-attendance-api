import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from '../../../core/entities/attendance.entity';

@Injectable()
export class AttendanceRepositoryImpl {
  constructor(
    @InjectRepository(Attendance)
    private readonly repository: Repository<Attendance>,
  ) {}

  create(attendance: Attendance): Promise<Attendance> {
    return this.repository.save(attendance);
  }

  findById(id: string): Promise<Attendance | null> {
    return this.repository.findOne({ where: { id } });
  }

  findAll(): Promise<Attendance[]> {
    return this.repository.find();
  }

  update(id: string, attendance: Partial<Attendance>): Promise<Attendance> {
    return this.repository.save({ ...attendance, id } as Attendance);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id).then(() => undefined);
  }

  async findActiveShift(employeeId: string): Promise<Attendance | null> {
    return this.repository.findOne({
      where: {
        employee: { id: employeeId },
        end_time: null,
      },
      relations: ['employee'],
    });
  }

  async findShiftsByDate(date: Date): Promise<Attendance[]> {
    return this.repository.find({ where: { date } });
  }

  async save(attendance: Attendance): Promise<Attendance> {
    return this.repository.save(attendance);
  }
}
