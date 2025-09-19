import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { Task } from 'generated/prisma';
import { SessionGuard } from 'src/guards/session.guard';

@Controller('tasks')
@UseGuards(SessionGuard)
export class JobController {
  constructor(private readonly taskService: TaskService) {}
  
  @Post()
  async createJob(@Body() body: CreateTaskDto) { 
    const newTask: Task = await this.taskService.create(body)
    // execute or register a schedule for task
    await this.taskService.executeTask(newTask)
    return newTask
  }

  @Get()
  async getTasksByUserId(
    @Req() request: Request & { authenticatedUser?: any }
  ) {
    const userId = request.authenticatedUser.id
    return this.taskService.getTasksByUserId(userId)
  }

  @Get(':taskId')
  async findTask(
    @Param() param: { taskId: string }
  ){
    const task = await this.taskService.getTaskById(param.taskId)
    return task
  }

  @Delete(':taskId')
  async delete(
    @Param() param: { taskId: string }
  ){
    const deletedTask: Task = await this.taskService.deleteTask(param.taskId)
    return deletedTask
  }

  @Patch(':taskId')
  async updateStatus(
    @Param() param: { taskId: string }
  ) {
    const updateCount = await this.taskService.updateStatus(param.taskId)
    return updateCount
  }
}
