import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from 'src/core/entities/attendance.entity';
import { Employee } from 'src/core/entities/employee.entity';
import { startOfDay, endOfDay, differenceInMinutes } from 'date-fns';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  /**
   * função auxiliar para calcular as horas trabalhadas
   * @param {Date} startTime - hora de início do turno
   * @param {Date} endTime - hora de término do turno
   * @returns {string} - total de horas trabalhadas no formato "Xh Ym"
   */
  private calculateWorkedHours(startTime: Date, endTime: Date): string {
    const totalMinutes = differenceInMinutes(endTime, startTime);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  /**
   * inicia um novo turno para o funcionário
   * @param {string} userCode - código único do funcionário
   * @returns {Promise<Attendance>} - registro de presença criado
   * @throws {NotFoundException} - se o funcionário não for encontrado
   * @throws {BadRequestException} - se um turno já estiver ativo para o dia atual
   */
  async startShift(userCode: string): Promise<Attendance> {
    const employee = await this.employeeRepository.findOne({ where: { user_code: userCode } });

    if (!employee) throw new NotFoundException('funcionário não encontrado');

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const existingShift = await this.attendanceRepository.findOne({
      where: {
        employee: { id: employee.id },
        date: Between(todayStart, todayEnd),
        end_time: null,
      },
    });

    if (existingShift) throw new BadRequestException('turno já iniciado');

    const attendance = this.attendanceRepository.create({
      employee,
      start_time: new Date(),
      date: new Date(),
    });

    return this.attendanceRepository.save(attendance);
  }

  /**
   * finaliza o turno ativo do funcionário
   * @param {string} userCode - código único do funcionário
   * @returns {Promise<Attendance>} - registro de presença atualizado
   * @throws {NotFoundException} - se o funcionário não for encontrado
   * @throws {BadRequestException} - se nenhum turno ativo for encontrado
   */
  async endShift(userCode: string): Promise<Attendance> {
    const employee = await this.employeeRepository.findOne({ where: { user_code: userCode } });

    if (!employee) throw new NotFoundException('funcionário não encontrado');

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const activeShift = await this.attendanceRepository.findOne({
      where: {
        employee: { id: employee.id },
        date: Between(todayStart, todayEnd),
        end_time: null,
      },
    });

    if (!activeShift) throw new BadRequestException('nenhum turno ativo encontrado');

    activeShift.end_time = new Date();
    return this.attendanceRepository.save(activeShift);
  }

  /**
   * obtém as horas trabalhadas pelo funcionário no dia atual
   * @param {string} userCode - código único do funcionário
   * @returns {Promise<{ start_time: string; end_time: string; worked_hours: string }>} - detalhes do turno do dia atual
   * @throws {NotFoundException} - se o funcionário ou turnos do dia atual não forem encontrados
   */
  async getHoursToday(userCode: string): Promise<{ start_time: string; end_time: string; worked_hours: string }> {
    const employee = await this.employeeRepository.findOne({ where: { user_code: userCode } });

    if (!employee) throw new NotFoundException('funcionário não encontrado');

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const shifts = await this.attendanceRepository.find({
      where: {
        employee: { id: employee.id },
        date: Between(todayStart, todayEnd),
      },
    });

    if (shifts.length === 0) throw new NotFoundException('nenhum turno encontrado para hoje');

    const firstShift = shifts[0];
    const lastShift = shifts[shifts.length - 1];
    const workedHours = this.calculateWorkedHours(firstShift.start_time, lastShift.end_time);

    return {
      start_time: firstShift.start_time.toISOString(),
      end_time: lastShift.end_time?.toISOString() || '',
      worked_hours: workedHours,
    };
  }

  /**
   * obtém as horas trabalhadas pelo funcionário em turnos passados
   * @param {string} userCode - código único do funcionário
   * @returns {Promise<{ start_time: string; end_time: string; worked_hours: string }[]>} - detalhes dos turnos passados
   * @throws {NotFoundException} - se o funcionário ou turnos passados não forem encontrados
   */
  async getPastHours(userCode: string): Promise<{ start_time: string; end_time: string; worked_hours: string }[]> {
    const employee = await this.employeeRepository.findOne({ where: { user_code: userCode } });

    if (!employee) throw new NotFoundException('funcionário não encontrado');

    const pastStart = startOfDay(new Date(2024, 11, 1)); // exemplo: buscando registros desde 1º de dezembro
    const pastEnd = endOfDay(new Date());

    const shifts = await this.attendanceRepository.find({
      where: {
        employee: { id: employee.id },
        date: Between(pastStart, pastEnd),
      },
    });

    if (shifts.length === 0) throw new NotFoundException('nenhum turno passado encontrado');

    return shifts.map((shift) => {
      const workedHours = this.calculateWorkedHours(shift.start_time, shift.end_time);
      return {
        start_time: shift.start_time.toISOString(),
        end_time: shift.end_time?.toISOString() || '',
        worked_hours: workedHours,
      };
    });
  }
}
