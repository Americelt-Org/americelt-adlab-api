import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { Task } from 'generated/prisma';

@Controller('jobs')
export class JobController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createJob(@Body() body: CreateTaskDto) { 
    const newTask: Task = await this.taskService.create(body)

    // execute or register a schedule for task
    await this.taskService.executeTask(newTask)

    return newTask
  }
}
