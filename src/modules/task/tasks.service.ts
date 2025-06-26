import { Injectable } from '@nestjs/common';
import { TaskEntity } from '../../entities/task.entity';
import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { UpdateTaskDto } from '../../dto/task/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskNotFoundException } from '../../exceptions/custom.exception';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskEntity)
    private taskRepo: Repository<TaskEntity>
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const task = new TaskEntity({
      title: createTaskDto.title,
      description: createTaskDto.description,
      completed: createTaskDto.completed || false,
    });

    return await this.taskRepo.save(task);
  }

  async findAll(): Promise<TaskEntity[]> {
    return await this.taskRepo.find({ order: { id : 'ASC' } });
  }

  async findOne(id: number): Promise<TaskEntity> {
    const task = await this.taskRepo.findOne( {where: {id}} );
    if (!task) {
      throw new TaskNotFoundException(id);
    }
    return task;
  }

  async update(id: number, updateTask: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.taskRepo.findOne( {where: {id}} );
    if (!task) {
      throw new TaskNotFoundException(id);
    }
    Object.assign(task, updateTask);
    return await this.taskRepo.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) {
      throw new TaskNotFoundException(id);
    }
  }

  async findByStatus(completed: boolean): Promise<TaskEntity[]> {
    return await this.taskRepo.find({where: {
      completed: completed
    }});
  }
}
