import { IsNotEmpty, IsString } from "class-validator";

export class ArchiveTaskDto {
  @IsString()
  @IsNotEmpty()
  taskId: string
}