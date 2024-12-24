import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../../../core/entities/employee.entity';

@Injectable()
export class EmployeeRepositoryImpl {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>,
  ) {}

  /**
   * Cria um novo colaborador no banco de dados
   * @param {Employee} employee
   * @returns {Promise<Employee>}
   */
  async create(employee: Employee): Promise<Employee> {
    return this.repository.save(employee);
  }

  /**
   * Busca um colaborador pelo ID.
   * @param {string} id
   * @returns {Promise<Employee | null>}
   */
  async findById(id: string): Promise<Employee | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Retorna todos os colaboradores cadastrados.
   * @returns {Promise<Employee[]>}
   */
  async findAll(): Promise<Employee[]> {
    return this.repository.find();
  }

  /**
   * Atualiza um colaborador pelo ID.
   * @param {string} id
   * @param {Partial<Employee>} employee
   * @returns {Promise<Employee>}
   */
  async update(id: string, employee: Partial<Employee>): Promise<Employee> {
    await this.repository.update(id, employee);
    return this.findById(id);
  }

  /**
   * Deleta um colaborador pelo ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
