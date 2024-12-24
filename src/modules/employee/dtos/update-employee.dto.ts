import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, IsOptional, IsDateString } from 'class-validator';

/**
 * DTO para atualização de um colaborador
 */
export class UpdateEmployeeDto {
  /**
   * Nome do colaborador
   * 
   * @example 'Carlos Santos'
   */
  @ApiProperty({ 
    description: 'Nome do colaborador',
    example: 'Carlos Santos', 
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Data de contratação do colaborador
   * O formato será no padrão ISO completo (yyyy-mm-ddTHH:mm:ssZ)
   * 
   * @example '2024-12-30T17:00:00Z'
   */
  @ApiProperty({ 
    description: 'Data de contratação do colaborador', 
    example: '2024-12-30T17:00:00Z', 
    required: false 
  })
  @IsOptional()
  @IsDateString()
  hiring_date?: string;

  /**
   * Data de demissão do colaborador
   * 
   * @example '2024-12-31T17:00:00Z'
   */
  @ApiProperty({ 
    description: 'Data de demissão do colaborador', 
    example: '2024-12-31T17:00:00Z', 
    required: false 
  })
  @IsOptional()
  @IsDateString()
  termination_date?: string;
}
