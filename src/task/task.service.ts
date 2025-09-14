import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Device, Task, SearchEngine, Scrape } from 'generated/prisma';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CreateTaskDto } from './dto/create-task.dto';
import { ScraperService } from 'src/scraper/scraper.service';
import { ResultExtractorService } from 'src/result-extractor/result-extractor.service';

@Injectable()
export class TaskService {

  constructor(
    private databaseService: DatabaseService,
    private sheduleRegistry: SchedulerRegistry,
    private scraperService: ScraperService,
    private resultExtractorService: ResultExtractorService
  ) {}

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
    if(!task.is_active) {
      // TODO: Improve error handling later
      console.error("Task is inactive")
      return
    }

    task.keywords.forEach( async (keyword) => {
      const newScrape = await this.databaseService.scrape.create({
        data: {
          taskId: task.id,
          keyword: keyword,
          last_run_at: new Date(),
        }
      })
      await this.runTaskSchedule(task, newScrape)
    })
  }

  async runTaskSchedule(task: Task, scrape: Scrape) {
    const newCronTask = new CronJob(task.cron, async () => {
      try {
        await this.databaseService.scrape.update({
          where: { id: scrape.id },
          data: { last_run_at: new Date() }
        })

        // call the scraper Service 
        const scrapeResults = await this.scraperService.scrape(
          scrape.keyword,
          task.location,
          task.search_engine,
          task.device
        )

        this.resultExtractorService.saveAds(scrape.id, scrapeResults)
        this.resultExtractorService.saveOrganicResults(scrape.id, scrapeResults)
        this.resultExtractorService.saveLocalResults(scrape.id, scrapeResults)

        console.log(`Scheduled ${scrape.keyword} running...`)
        
      } catch (e) {
        // TODO: Improve error handling
        console.error("Error: ", e)
        throw new Error(`Failed to run ${task.name} with scrape id: ${scrape.id}`)
      }
    })
    newCronTask.start()
    this.sheduleRegistry.addCronJob(scrape.id, newCronTask)
  }


  async getTasksByUserId(id: string): Promise<Task[]> {
    const tasks = await this.databaseService.task.findMany({
      where: { userId: id }
    })

    return tasks
  }
}