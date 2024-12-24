import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/core/entities/employee.entity';
import { CreateEmployeeDto } from 'src/modules/employee/dtos/create-employee.dto';
import { UpdateEmployeeDto } from 'src/modules/employee/dtos/update-employee.dto';

/**
 * Serviço responsável pela gestão dos colaboradores
 */
@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  /**
   * Normaliza o CPF removendo caracteres não numéricos
   * 
   * @param {string} cpf
   * @returns {string}
   */
  private normalizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  /**
   * Valida o CPF verificando se ele é válido segundo o algoritmo de CPF
   * 
   * @param {string} cpf
   * @returns {boolean}
   */
  private validateCpf(cpf: string): boolean {
    const normalizedCpf = this.normalizeCpf(cpf);

    if (normalizedCpf.length !== 11 || /^(\d)\1{10}$/.test(normalizedCpf)) {
      return false 
    }

    // Cálculo do primeiro dígito verificador
    let soma1 = 0;
    for (let i = 0; i < 9; i++) {
      soma1 += parseInt(normalizedCpf[i]) * (10 - i);
    }
    let digito1 = (soma1 * 10) % 11;
    if (digito1 === 10) digito1 = 0;

    // Cálculo do segundo dígito verificador
    let soma2 = 0;
    for (let i = 0; i < 10; i++) {
      soma2 += parseInt(normalizedCpf[i]) * (11 - i);
    }
    let digito2 = (soma2 * 10) % 11;
    if (digito2 === 10) digito2 = 0;

    // Verifica se os dígitos verificadores calculados coincidem com os fornecidos
    return normalizedCpf[9] === digito1.toString() && normalizedCpf[10] === digito2.toString();
  }

  /**
   * Gera um código único para o colaborador, seguindo o padrão '4SXXFMf'
   * 
   * @returns {string}
   */
  private generateUserCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    // Padrão: 1 número, 1 letra maiúscula, 2 letras maiúsculas, 3 letras maiúsculas, 1 letra minúscula
    code += Math.floor(Math.random() * 10); // 1 número
    code += chars.charAt(Math.floor(Math.random() * 26)); // 1 letra maiúscula
    code += chars.charAt(Math.floor(Math.random() * 26)); // 2ª letra maiúscula
    code += chars.charAt(Math.floor(Math.random() * 26)); // 3ª letra maiúscula
    code += chars.charAt(Math.floor(Math.random() * 26)); // 4ª letra maiúscula
    code += chars.charAt(Math.floor(Math.random() * 26)); // 5ª letra maiúscula
    code += chars.charAt(Math.floor(Math.random() * 26) + 26); // 1 letra minúscula

    return code;
  }

  /**
   * Cria um novo colaborador, verificando se o CPF já está cadastrado e se é válido
   * 
   * @param {CreateEmployeeDto} createEmployeeDto
   * @returns {Promise<Employee>}
   * @throws {ConflictException}
   */
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const normalizedCpf = this.normalizeCpf(createEmployeeDto.cpf);

    if (!this.validateCpf(createEmployeeDto.cpf)) {
      const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      throw new ConflictException(`CPF inválido. Hora: ${currentTime}`);
    }

    const existingEmployee = await this.employeeRepository.findOne({
      where: { cpf: normalizedCpf },
    });

    if (existingEmployee) {
      const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      throw new ConflictException(`CPF já cadastrado`);
    }

    const userCode = this.generateUserCode();

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      cpf: normalizedCpf,
      user_code: userCode,
      created_at: new Date(),
    });

    return this.employeeRepository.save(employee);
  }

  /**
   * Atualiza os dados de um colaborador, sem permitir alteração do CPF
   * 
   * @param {string} id
   * @param {UpdateEmployeeDto} updateEmployeeDto
   * @returns {Promise<Employee>}
   * @throws {NotFoundException}
   * @throws {ConflictException}
   */
  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    Object.assign(employee, updateEmployeeDto);

    return this.employeeRepository.save(employee);
  }

  /**
   * Retorna todos os colaboradores cadastrados
   * 
   * @returns {Promise<Employee[]>}
   */
  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  /**
   * Busca um colaborador pelo ID
   * 
   * @param {string} id
   * @returns {Promise<Employee>}
   * @throws {NotFoundException}
   */
  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      throw new NotFoundException(`Employee with ID ${id} not found. Hora: ${currentTime}`);
    }
    return employee;
  }

  /**
   * Deleta um colaborador pelo ID
   * 
   * @param {string} id 
   * @returns {Promise<void>}
   * @throws {NotFoundException}
   */
  async delete(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }
}
