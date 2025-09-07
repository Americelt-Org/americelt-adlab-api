import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RobomotionService {

  constructor(private configService: ConfigService) {}

  async startJob(url: string): Promise<Response> {
    const robotEndpoint = this.configService.get<string>('ROBOT_ENDPOINT')
    const robotToken = this.configService.get<string>('ROBOT_SECRET_TOKEN')

    if(robotToken === undefined || robotEndpoint === undefined) {
      throw new Error("ROBOT_SECRET_TOKEN is not defined")
    }

    return await fetch(robotEndpoint, {
      method: "POST",
      body: JSON.stringify({url}),
      headers: { 
        "Content-Type": "application/json",
        "X-Robot-Token": robotToken
      },
    })
  }

}
