import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from 'src/modules/attendance/services/attendance.service';
import { Employee } from 'src/core/entities/employee.entity';
import { Attendance } from 'src/core/entities/attendance.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let employeeRepository: Repository<Employee>;
  let attendanceRepository: Repository<Attendance>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getRepositoryToken(Employee),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Attendance),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    employeeRepository = module.get<Repository<Employee>>(
      getRepositoryToken(Employee),
    );
    attendanceRepository = module.get<Repository<Attendance>>(
      getRepositoryToken(Attendance),
    );
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve iniciar um turno com sucesso para um funcionário', async () => {
    const employee = new Employee();
    employee.id = '1';
    employee.user_code = 'EMP123';
    employee.name = 'John Doe';
    employee.cpf = '12345678900';
    employee.created_at = new Date();
    employee.hiring_date = new Date();
    employee.termination_date = null;

    const attendance = new Attendance();
    attendance.id = '1';
    attendance.start_time = new Date();
    attendance.end_time = null;
    attendance.employee = employee;
    attendance.date = new Date();

    const attendanceData = {
      employee: { user_code: 'EMP123' },
    };

    employeeRepository.findOne = jest.fn().mockResolvedValue(employee);
    attendanceRepository.findOne = jest.fn().mockResolvedValue(null);
    attendanceRepository.create = jest.fn().mockReturnValue(attendance);
    attendanceRepository.save = jest.fn().mockResolvedValue(attendance);

    const result = await service.startShift(attendanceData.employee.user_code);

    expect(result).toEqual(attendance);
    expect(employeeRepository.findOne).toHaveBeenCalledWith({
      where: { user_code: 'EMP123' },
    });

    expect(attendanceRepository.findOne).toHaveBeenCalledWith({
      where: {
        employee: { id: '1' },
        date: expect.objectContaining({
          _type: 'between',
          _value: expect.arrayContaining([expect.any(Date), expect.any(Date)]),
        }),
        end_time: null,
      },
    });

    expect(attendanceRepository.create).toHaveBeenCalledWith({
      employee,
      start_time: expect.any(Date),
      date: expect.any(Date),
    });
    expect(attendanceRepository.save).toHaveBeenCalledWith(attendance);
  });

  describe('endShift', () => {
    it('deve encerrar um turno com sucesso para um funcionário', async () => {
      const employee = new Employee();
      employee.id = '1';
      employee.user_code = 'EMP123';

      const activeShift = new Attendance();
      activeShift.id = '1';
      activeShift.start_time = new Date();
      activeShift.end_time = null;
      activeShift.employee = employee;
      activeShift.date = new Date();

      const updatedShift = { ...activeShift, end_time: new Date() };

      employeeRepository.findOne = jest.fn().mockResolvedValue(employee);
      attendanceRepository.findOne = jest.fn().mockResolvedValue(activeShift);
      attendanceRepository.save = jest.fn().mockResolvedValue(updatedShift);

      const result = await service.endShift('EMP123');

      expect(result).toEqual(updatedShift);
      expect(attendanceRepository.findOne).toHaveBeenCalledWith({
        where: {
          employee: { id: '1' },
          date: expect.objectContaining({
            _type: 'between',
            _value: expect.arrayContaining([expect.any(Date), expect.any(Date)]),
          }),
          end_time: null,
        },
      });
      expect(attendanceRepository.save).toHaveBeenCalledWith(updatedShift);
    });

    it('deve lançar erro se nenhum turno ativo for encontrado', async () => {
      const employee = new Employee();
      employee.id = '1';
      employee.user_code = 'EMP123';

      employeeRepository.findOne = jest.fn().mockResolvedValue(employee);
      attendanceRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.endShift('EMP123')).rejects.toThrowError(
        new BadRequestException('nenhum turno ativo encontrado'),
      );
    });

    it('deve lançar erro se o funcionário não for encontrado', async () => {
      employeeRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.endShift('EMP123')).rejects.toThrowError(
        new NotFoundException('funcionário não encontrado'),
      );
    });
  });

  describe('getHoursToday', () => {
    it('deve retornar as horas trabalhadas com sucesso para hoje', async () => {
      const employee = new Employee();
      employee.id = '1';
      employee.user_code = 'EMP123';

      const shift = new Attendance();
      shift.start_time = new Date();
      shift.end_time = new Date();
      shift.date = new Date();
      shift.employee = employee;

      const attendanceData = {
        employee: { user_code: 'EMP123' },
      };

      employeeRepository.findOne = jest.fn().mockResolvedValue(employee);
      attendanceRepository.find = jest.fn().mockResolvedValue([shift]);

      const result = await service.getHoursToday(
        attendanceData.employee.user_code,
      );

      expect(result).toEqual({
        start_time: shift.start_time.toISOString(),
        end_time: shift.end_time.toISOString(),
        worked_hours: expect.any(String),
      });

      expect(attendanceRepository.find).toHaveBeenCalledWith({
        where: {
          employee: { id: '1' },
          date: expect.objectContaining({
            _type: 'between',
            _value: expect.arrayContaining([expect.any(Date), expect.any(Date)]),
          }),
        },
      });
    });

    it('deve lançar erro se nenhum turno for encontrado para hoje', async () => {
      const employee = new Employee();
      employee.id = '1';
      employee.user_code = 'EMP123';

      employeeRepository.findOne = jest.fn().mockResolvedValue(employee);
      attendanceRepository.find = jest.fn().mockResolvedValue([]);

      await expect(service.getHoursToday('EMP123')).rejects.toThrowError(
        new NotFoundException('nenhum turno encontrado para hoje'),
      );
    });

    it('deve lançar erro se o funcionário não for encontrado', async () => {
      employeeRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getHoursToday('EMP123')).rejects.toThrowError(
        new NotFoundException('funcionário não encontrado'),
      );
    });
  });

  describe('getPastHours', () => {
    it('deve retornar as horas trabalhadas no passado com sucesso', async () => {
      const employee = new Employee();
      employee.id = '1';
      employee.user_code = 'EMP123';

      const shift = new Attendance();
      shift.start_time = new Date();
      shift.end_time = new Date();
      shift.date = new Date();
      shift.employee = employee;

      employeeRepository.findOne = jest.fn().mockResolvedValue(employee);
      attendanceRepository.find = jest.fn().mockResolvedValue([shift]);

      const result = await service.getPastHours('EMP123');

      expect(result).toEqual([
        {
          start_time: shift.start_time.toISOString(),
          end_time: shift.end_time.toISOString(),
          worked_hours: expect.any(String),
        },
      ]);

      expect(attendanceRepository.find).toHaveBeenCalledWith({
        where: {
          employee: { id: '1' },
          date: expect.objectContaining({
            _type: 'between',
            _value: expect.arrayContaining([expect.any(Date), expect.any(Date)]),
          }),
        },
      });
    });

    it('deve lançar erro se nenhum turno passado for encontrado', async () => {
      const employee = new Employee();
      employee.id = '1';
      employee.user_code = 'EMP123';

      employeeRepository.findOne = jest.fn().mockResolvedValue(employee);
      attendanceRepository.find = jest.fn().mockResolvedValue([]);

      await expect(service.getPastHours('EMP123')).rejects.toThrowError(
        new NotFoundException('nenhum turno passado encontrado'),
      );
    });

    it('deve lançar erro se o funcionário não for encontrado', async () => {
      employeeRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getPastHours('EMP123')).rejects.toThrowError(
        new NotFoundException('funcionário não encontrado'),
      );
    });
  });
});
