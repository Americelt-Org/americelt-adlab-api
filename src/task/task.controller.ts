import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { Task } from 'generated/prisma';
import { SessionGuard } from 'src/auth/guard/session.guard';

@Controller('tasks')
export class JobController {
  constructor(private readonly taskService: TaskService) {}
  
  @Post()
  @UseGuards(SessionGuard)
  async createJob(@Body() body: CreateTaskDto) { 
    const newTask: Task = await this.taskService.create(body)
    // execute or register a schedule for task
    await this.taskService.executeTask(newTask)
    return newTask
  }

  @Get()
  @UseGuards(SessionGuard)
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
}
