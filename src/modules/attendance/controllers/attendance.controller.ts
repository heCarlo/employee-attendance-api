import { Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AttendanceService } from '../services/attendance.service';

/**
 * controlador responsável pelas operações relacionadas ao controle de ponto.
 * 
 * @controller attendancecontroller
 */
@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * iniciar turno de um colaborador.
   * 
   * @param {string} userCode - código único do colaborador.
   * @returns {Promise<any>} confirmação do início do turno.
   */
  @ApiOperation({ summary: 'iniciar turno de um colaborador' })
  @ApiParam({ name: 'userCode', description: 'código único do colaborador' })
  @ApiResponse({ status: 200, description: 'turno iniciado com sucesso.' })
  @ApiResponse({ status: 404, description: 'funcionário não encontrado.' })
  @ApiResponse({ status: 409, description: 'turno já iniciado.' })
  @Post(':userCode/start')
  async startShift(@Param('userCode') userCode: string) {
    return this.attendanceService.startShift(userCode);
  }

  /**
   * finalizar turno de um colaborador.
   * 
   * @param {string} userCode
   * @returns {Promise<any>}
   */
  @ApiOperation({ summary: 'finalizar turno de um colaborador' })
  @ApiParam({ name: 'userCode', description: 'código único do colaborador' })
  @ApiResponse({ status: 200, description: 'turno finalizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'funcionário não encontrado.' })
  @ApiResponse({ status: 404, description: 'nenhum turno ativo encontrado.' })
  @Post(':userCode/end')
  async endShift(@Param('userCode') userCode: string) {
    return this.attendanceService.endShift(userCode);
  }

  /**
   * obter horas trabalhadas no dia atual.
   * 
   * @param {string} userCode
   * @returns {Promise<{start_time: Date, end_time: Date, worked_hours: string}>} informações sobre o turno atual.
   */
  @ApiOperation({ summary: 'obter horas trabalhadas no dia atual' })
  @ApiParam({ name: 'userCode', description: 'código único do colaborador' })
  @ApiResponse({ status: 200, description: 'horas trabalhadas hoje.' })
  @ApiResponse({ status: 404, description: 'funcionário não encontrado.' })
  @Get(':userCode/today')
  async getHoursToday(@Param('userCode') userCode: string) {
    const { start_time, end_time, worked_hours } = await this.attendanceService.getHoursToday(userCode);
    return { start_time, end_time, worked_hours };
  }

  /**
   * obter horas trabalhadas em dias anteriores.
   * 
   * @param {string} userCode
   * @returns {Promise<Array<{date: string, worked_hours: string}>>}
   */
  @ApiOperation({ summary: 'obter horas trabalhadas em dias anteriores' })
  @ApiParam({ name: 'userCode', description: 'código único do colaborador' })
  @ApiResponse({ status: 200, description: 'horas trabalhadas nos dias anteriores.' })
  @ApiResponse({ status: 404, description: 'funcionário não encontrado.' })
  @Get(':userCode/past')
  async getPastHours(@Param('userCode') userCode: string) {
    const records = await this.attendanceService.getPastHours(userCode);
    return records.map((record) => ({
      date: record.start_time.toString().split('T')[0],
      worked_hours: record.worked_hours,
    }));
  }
}