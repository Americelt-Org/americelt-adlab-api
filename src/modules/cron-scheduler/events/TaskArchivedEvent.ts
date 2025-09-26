import { Task } from "generated/prisma";

export class TaskArchivedEvent {
  public readonly task: Task
  constructor(
    task: Task
  ){
    this.task = task
  }
}