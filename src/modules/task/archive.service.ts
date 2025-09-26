import { Injectable, Patch } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Task } from 'generated/prisma';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskArchivedEvent } from 'src/modules/cron-scheduler/events/TaskArchivedEvent';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class ArchiveService {
  constructor(
    private databaseService: DatabaseService,
    private eventEmitter: EventEmitter2,
    private scheduleRegistry: SchedulerRegistry
  ){}

  async getArchivedTasks(userId: string): Promise<Task[]> {
    return await this.databaseService.task.findMany({
      where: {
        userId: userId,
        archived_at: {
          not: null
        }
      }
    })
  }

  async archiveTask(taskId: string): Promise<Task>{
    const updatedTask = await this.databaseService.task.update({
      where: { id: taskId},
      data: { 
        archived_at: new Date(),
        is_active: false
      }
    })

    this.eventEmitter.emit(
      'task.archive', 
      new TaskArchivedEvent(updatedTask)
    )

    return updatedTask
  }

  async unArchiveTask(taskId: string){
    const updatedTask = await this.databaseService.task.update({
      where: { id: taskId },
      data: {
        archived_at: null
      }
    })

    return updatedTask
  }
}
