import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  title!: string;

  @Column()
  description?: string;

  @Column()
  completed?: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }
}
