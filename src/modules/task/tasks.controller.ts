import { Controller, Get, Post, Body, HttpCode, HttpStatus, Delete, Patch, Query, Param } from '@nestjs/common';
import { CreateTaskDto } from '../../dto/task/create-task.dto';
import { TasksService } from '../task/tasks.service';
import { UpdateTaskDto } from '../../dto/task/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllTasks(@Query('completed') completed?: string) {
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      return await this.tasksService.findByStatus(isCompleted);
    }
    return await this.tasksService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTaskById(@Param('id') id: number) {
    return await this.tasksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() body: CreateTaskDto) {
    return await this.tasksService.create(body);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateTask(@Param('id') id: number, @Body() body: UpdateTaskDto) {
    return await this.tasksService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') id: number) {
    return await this.tasksService.remove(id);
  }
}
