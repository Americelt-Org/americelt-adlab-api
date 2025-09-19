import { Scrape, Task } from "generated/prisma";


export class TaskScheduledRun {
  task: Task
  scrape: Scrape
  results: any

  constructor(
    task: Task,
    scrape: Scrape,
    results: any
  ) {
    this.task = task
    this.scrape = scrape
    this.results = results
  }
}