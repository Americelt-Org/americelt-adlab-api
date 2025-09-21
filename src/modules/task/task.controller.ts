import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { Task } from 'generated/prisma';
import { SessionGuard } from 'src/guards/session.guard';
import { ArchiveService } from './archive.service';

@Controller('tasks')
@UseGuards(SessionGuard)
export class TaskController {
  constructor(
    private taskService: TaskService,
    private archiveService: ArchiveService
  ) { }

  @Get()
  async getTasksByUserId(
    @Req() request: Request & { authenticatedUser?: any }
  ) {
    const userId = request.authenticatedUser.id
    return this.taskService.getTasksByUserId(userId)
  }

  @Get('archives')
  async taskArchives(@Req() request: Request & { authenticatedUser?: any }) {
    const userId = request.authenticatedUser.id
    return await this.archiveService.getArchivedTasks(userId)
  }

  @Post()
  async createJob(@Body() body: CreateTaskDto) {
    const newTask: Task = await this.taskService.create(body)
    await this.taskService.executeTask(newTask)
    return newTask
  }

  @Get(':taskId')
  async findTask(
    @Param() param: { taskId: string }
  ) {
    const task = await this.taskService.getTaskById(param.taskId)
    return task
  }

  @Delete(':taskId')
  async delete(
    @Param() param: { taskId: string }
  ) {
    const deletedTask: Task = await this.taskService.deleteTask(param.taskId)
    return deletedTask
  }

  @Patch(':taskId')
  async updateStatus(
    @Param() param: { taskId: string }
  ) {
    return await this.taskService.updateStatus(param.taskId)
  }

  @Patch(':taskId/archive')
  async archiveTask(
    @Param() param: { taskId: string }
  ) {
    return this.archiveService.archiveTask(param.taskId)
  }

  @Patch(':taskId/unarchive')
  async unArchiveTask(
    @Param() param: { taskId: string }
  ) {
    return this.archiveService.unArchiveTask(param.taskId)
  }
}
