import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * representa um colaborador.
 * 
 * @entity employee
 */
@Entity('employees')
export class Employee {
  @ApiProperty({ description: 'id único do colaborador' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'nome do colaborador' })
  @Column()
  name: string;

  @ApiProperty({ description: 'cpf do colaborador', uniqueItems: true })
  @Column({ unique: true, length: 11 })
  cpf: string;

  @ApiProperty({ description: 'código do colaborador', uniqueItems: true })
  @Column({ unique: true })
  user_code: string;

  @ApiProperty({ description: 'data de criação do registro' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'data de contratação do colaborador' })
  @CreateDateColumn()
  hiring_date: Date;

  @ApiProperty({ description: 'data de demissão do colaborador (se aplicável)' })
  @Column({ type: 'date', nullable: true })
  termination_date: Date | null;
}
