import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/guards/session.guard';
import { CompetitorsService } from './competitors.service';

@Controller('competitors')
export class CompetitorsController {
  constructor(
    private competitorService: CompetitorsService
  ){}

  @Get(':taskId')
  @UseGuards(SessionGuard)
  async getByTaskId(
    @Param() param: {taskId: string}
  ){
    const competitors = await this.competitorService.getByTaskId(param.taskId)
    return competitors
  }
}
