import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TaskArchivedEvent } from "./events/TaskArchivedEvent";
import { DatabaseService } from "../database/database.service";
import { CronSchedulerService } from "./cron-scheduler.service";


@Injectable()
export class CronSchedulerListener {
  private readonly logger = new Logger(CronSchedulerListener.name)

  constructor(
    private databaseService: DatabaseService,
    private cronSchedulerService: CronSchedulerService
  ){}

  @OnEvent('task.archive')
  async handleTaskArchived(payload: TaskArchivedEvent) {
    this.logger.log(`Archiving task ${payload.task}`)
    await this.deleteCronSchedule(payload.task.id)
  }

  @OnEvent('task.delete')
  async handleTaskDelete(payload: TaskArchivedEvent) {
    this.logger.log(`Deleting task ${payload.task}`)
    await this.deleteCronSchedule(payload.task.id)
  }

  async deleteCronSchedule(taskId: string) {
    const scrapes = await this.databaseService.scrape.findMany({
      where: {
        taskId
      }
    })

    if (!scrapes.length) {
      this.logger.warn(`No scrapes found for task ${taskId}`);
      return;
    }

    for (const scrape of scrapes) {
      this.logger.log(`Stopping cron for scrape ${scrape}`);
      this.cronSchedulerService.stopCron(scrape.id);
    }
  }
}