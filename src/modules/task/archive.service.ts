import { Injectable, Patch } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Task } from 'generated/prisma';

@Injectable()
export class ArchiveService {

  constructor(
    private databaseService: DatabaseService 
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
