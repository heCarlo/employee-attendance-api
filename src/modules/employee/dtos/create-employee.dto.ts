import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, IsDateString, IsOptional } from 'class-validator';

/**
 * DTO para criação de um colaborador
 */
export class CreateEmployeeDto {

  /**
   * Nome do colaborador
   * 
   * @example 'Carlos Santos'
   */
  @ApiProperty({ 
    description: 'Nome do colaborador',
    example: 'Carlos Santos', 
  })
  @IsString()
  name: string;

  /**
   * CPF do colaborador no formato 000.000.000-00
   * 
   * @example '518.391.378-19'
   * @pattern /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
   * @minLength 11
   * @maxLength 11
   */
  @ApiProperty({ 
    description: 'CPF do colaborador', 
    example: '518.391.378-19',
    pattern: '^\d{3}\.\d{3}\.\d{3}-\d{2}$' 
  })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'O CPF deve estar no formato 000.000.000-00' })
  @Length(11, 11, { message: 'O CPF deve ter 11 caracteres' })
  cpf: string;

  /**
   * Código único gerado automaticamente para o colaborador
   * 
   * @example 'A1B2C3D'
   */
  user_code: string;

  /**
   * Data de contratação do colaborador
   * O formato será no padrão ISO completo (yyyy-mm-ddTHH:mm:ssZ)
   * 
   * @example '2024-12-30T17:00:00Z'
   */
  @IsDateString()
  hiring_date: string;

  /**
   * Data de demissão do colaborador
   * 
   * @example '2024-12-31T17:00:00Z'
   */
  @IsOptional()
  @IsDateString()
  termination_date?: string;

  /**
   * Data de criação do registro do colaborador
   * Esse campo é gerado automaticamente pelo ORM, por isso não precisa ser enviado pelo usuário
   */
  @ApiHideProperty()
  created_at: string;
}
