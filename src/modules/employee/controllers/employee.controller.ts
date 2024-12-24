import { Controller, Post, Get, Delete, Param, Body, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { EmployeeService } from '../services/employee.service';
import { Employee } from 'src/core/entities/employee.entity';
import { CreateEmployeeDto } from 'src/modules/employee/dtos/create-employee.dto';
import { UpdateEmployeeDto } from 'src/modules/employee/dtos/update-employee.dto';

/**
 * controlador responsável por gerenciar as operações de colaboradores (employees)
 */
@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  /**
   * cria um novo colaborador
   * 
   * @param {CreateEmployeeDto} createEmployeeDto
   * @returns {Promise<Employee>}
   * @throws {ConflictException}
   * @throws {InternalServerErrorException}
   */
  @ApiOperation({ summary: 'Criar um novo colaborador' })
  @ApiBody({
    description: 'Dados necessários para criar um colaborador',
    type: CreateEmployeeDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Colaborador criado com sucesso',
    type: Employee,
  })
  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeeService.create(createEmployeeDto);
  }

  /**
   * retorna a lista de todos os colaboradores
   * 
   * @returns {Promise<Employee[]>}
   * @throws {InternalServerErrorException}
   */
  @ApiOperation({ summary: 'Listar todos os colaboradores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de colaboradores',
    type: [Employee],
  })
  @Get()
  async findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  /**
   * retorna um colaborador específico baseado no id
   * 
   * @param {string} id
   * @returns {Promise<Employee>}
   * @throws {NotFoundException}
   * @throws {InternalServerErrorException}
   */
  @ApiOperation({ summary: 'Buscar um colaborador pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do colaborador', type: String })
  @ApiResponse({
    status: 200,
    description: 'Colaborador encontrado',
    type: Employee,
  })
  @ApiResponse({
    status: 404,
    description: 'Colaborador não encontrado',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.findOne(id);
  }

  /**
   * atualiza os dados de um colaborador
   * 
   * @param {string} id
   * @param {UpdateEmployeeDto} updateEmployeeDto
   * @returns {Promise<Employee>}
   * @throws {NotFoundException}
   */
  @ApiOperation({ summary: 'Atualizar dados de um colaborador' })
  @ApiParam({ name: 'id', description: 'ID do colaborador', type: String })
  @ApiBody({
    description: 'Dados a serem atualizados para o colaborador',
    type: UpdateEmployeeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Colaborador atualizado com sucesso',
    type: Employee,
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  /**
   * deleta um colaborador pelo id
   * 
   * @param {string} id
   * @returns {Promise<void>}
   * @throws {NotFoundException}
   */
  @ApiOperation({ summary: 'Deletar um colaborador' })
  @ApiParam({ name: 'id', description: 'ID do colaborador', type: String })
  @ApiResponse({
    status: 204,
    description: 'Colaborador deletado com sucesso',
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.employeeService.delete(id);
  }
}
