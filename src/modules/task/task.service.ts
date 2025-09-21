import { HttpException, HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { Device, Task, SearchEngine, Scrape } from 'generated/prisma';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CreateTaskDto } from './dto/create-task.dto';
import { ScraperService } from 'src/modules/scraper/scraper.service';
import { ResultExtractorService } from 'src/modules/result-extractor/result-extractor.service';

@Injectable()
export class TaskService implements OnModuleInit {

  private readonly logger = new Logger(TaskService.name);

  constructor(
    private databaseService: DatabaseService,
    private schedulerRegistry: SchedulerRegistry,
    private scraperService: ScraperService,
    private resultExtractorService: ResultExtractorService
  ) { }

  async onModuleInit() {
    this.logger.log(`Task Module starting, registering active cron tasks`)
    const activeTasks = await this.databaseService.task.findMany({
      where: {
        is_active: true,
        archived_at: null
      }
    })
    this.logger.log(`Found ${activeTasks.length} active task/tasks`)
    for (const task of activeTasks) {
      this.logger.log(`Initializing '${task.name}'`)
      this.executeTask(task)
    }
  }

  async create(task: CreateTaskDto): Promise<Task> {
    const newTask: Task = await this.databaseService.task.create({
      data: {
        userId: task.userId,
        name: task.name,
        keywords: task.keywords,
        search_engine: task.search_engine as unknown as SearchEngine,
        device: task.device as unknown as Device,
        location: task.location,
        cron: task.cron
      }
    });

    return newTask;
  }

  async executeTask(task: Task) {
    if (!task.is_active || task.archived_at) {
      this.logger.error(`Unable to execute inactive task: '${task.name} - ${task.id}'`)
      return
    }

    task.keywords.forEach(async (keyword) => {
      const newScrape = await this.databaseService.scrape.create({
        data: {
          taskId: task.id,
          keyword: keyword,
          last_run_at: new Date(),
          status: "Pending"
        }
      })
      await this.runTaskSchedule(task, newScrape)
    })
  }

  async runTaskSchedule(task: Task, scrape: Scrape) {
    const newCronTask = new CronJob(task.cron, async () => {
      const startedAt = new Date();

      // try {
        // Call the scraper Service
        const scrapeResults = await this.scraperService.scrape(
          scrape.keyword,
          task.location,
          task.search_engine,
          task.device,
        );

        const processed_at = scrapeResults["search_metadata"].processed_at;
        const status = scrapeResults["search_metadata"].status;

        // Update scrape record with timing + status
        await this.databaseService.scrape.update({
          where: { id: scrape.id },
          data: { last_run_at: startedAt, processed_at, status },
        });

        // ✅ Business failure (scraper returned non-success)
        if (status !== "Success") {
          this.logger.warn(
            `Scrape failed (business error): status=${status}, scrapeId=${scrape.id}, task=${task.name}`,
          );
          return; // stop here gracefully
        }

        // ✅ Only save results if successful
        await this.resultExtractorService.saveAds(scrape.id, task.id, scrapeResults);
        await this.resultExtractorService.saveOrganicResults(scrape.id, task.id, scrapeResults);
        await this.resultExtractorService.saveLocalResults(scrape.id, task.id, scrapeResults);

        this.logger.debug(
          `Task ${task.name} scheduled run finished successfully (scrapeId=${scrape.id}, duration=${Date.now() - startedAt.getTime()}ms)`,
        );
    //   } catch (err) {
    //     // ✅ System/technical failure
    //     this.logger.error(
    //       `System failure while running task=${task.name}, scrapeId=${scrape.id}: ${err.message}`,
    //       err.stack,
    //     );
    //     throw new HttpException(
    //       `System error while running ${task.name} (scrapeId=${scrape.id})`,
    //       HttpStatus.INTERNAL_SERVER_ERROR,
    //     );
    //   }
      });

    newCronTask.start();
    this.schedulerRegistry.addCronJob(scrape.id, newCronTask);
  }

  async getTasksByUserId(id: string): Promise<Task[]> {
    const tasks = await this.databaseService.task.findMany({
      where: { userId: id, archived_at: null },
      orderBy: [
        { is_active: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 10
    })

    return tasks
  }

  async getTaskById(taskId: string): Promise<Task> {
    try {
      const task = await this.databaseService.task.findFirstOrThrow({
        where: {
          id: taskId
        },
        include: {
          scrape_results: {
            take: 10,
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
      return task;
    } catch (e) {
      throw new NotFoundException("Unable to find resource");
    }
  }

  async deleteTask(taskId: string): Promise<Task> {
    return await this.databaseService.task.delete({
      where: { id: taskId }
    })
  }

  async updateStatus(taskId: string): Promise<Task> {
    const task = await this.databaseService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      this.logger.error(`Task Status Update Failed: Cannot find task with id: ${taskId}`);
      throw new Error(`Task with id ${taskId} not found`);
    }

    const newTaskStatus = !task.is_active;

    const updatedTask = await this.databaseService.task.update({
      where: { id: taskId },
      data: { is_active: newTaskStatus },
    });

    const scrapes = await this.databaseService.scrape.findMany({
      where: { taskId },
    });

    for (const scrape of scrapes) {
      this.logger.debug(`Updating task scrape status: ${scrape.keyword} to ${newTaskStatus}`);
      try {
        const scrapeCron = this.schedulerRegistry.getCronJob(scrape.id);
        if (newTaskStatus) {
          scrapeCron.start();
        } else {
          scrapeCron.stop();
        }
      } catch (e) {
        this.logger.warn(
          `Not found scrape, creating new`
        );
        this.runTaskSchedule(updatedTask, scrape)
      }
    }
    return updatedTask;
  }

}