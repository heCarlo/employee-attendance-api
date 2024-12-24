import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Employee } from './employee.entity';

/**
 * representa um registro de ponto de um funcionário.
 */
@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  start_time: Date;

  @Column({ nullable: true })
  end_time: Date;

  @Column()
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  /**
   * calcula e formata as horas trabalhadas para este registro de ponto.
   * 
   * @param timeProvider - um objeto que fornece o timestamp atual.
   * @returns as horas trabalhadas formatadas como string (ex.: "02h 30m").
   */
  getWorkedHours(timeProvider: { now(): number }): string {
    const durationInMillis = this.calculateDurationInMillis(timeProvider);
    return Attendance.formatDuration(durationInMillis);
  }

  /**
   * calcula a duração do ponto em milissegundos.
   * 
   * @param timeProvider - um objeto que fornece o timestamp atual.
   * @returns a duração em milissegundos.
   * @private
   */
  private calculateDurationInMillis(timeProvider: { now(): number }): number {
    const end = this.end_time ? new Date(this.end_time).getTime() : timeProvider.now();
    const start = new Date(this.start_time).getTime();
    return end - start;
  }

  /**
   * formata a duração em milissegundos para uma string legível.
   * 
   * @param durationInMillis - a duração em milissegundos.
   * @returns a duração formatada como string (ex.: "02h 30m").
   */
  static formatDuration(durationInMillis: number): string {
    const hours = Math.floor(durationInMillis / (1000 * 60 * 60));
    const minutes = Math.floor((durationInMillis % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  }

  /**
   * calcula o total de horas trabalhadas a partir de uma lista de registros de ponto.
   * 
   * @param attendances - lista de registros de ponto.
   * @param timeProvider - um objeto que fornece o timestamp atual.
   * @returns o total de horas trabalhadas formatado como string (ex.: "10h 45m").
   */
  static getTotalWorkedHours(attendances: Attendance[], timeProvider: { now(): number }): string {
    const totalMillis = attendances.reduce((total, attendance) => {
      const duration = attendance.calculateDurationInMillis(timeProvider);
      return total + (duration > 0 ? duration : 0); // ignora turnos com duração negativa
    }, 0);

    return Attendance.formatDuration(totalMillis);
  }
}
