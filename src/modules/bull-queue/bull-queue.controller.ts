import { Controller, Get } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';

@Controller('bull-queue')
export class BullQueueController {
  constructor(private readonly bullQueueService: BullQueueService) {}

  @Get()
  async addToQueue(): Promise<any> {
    return await this.bullQueueService.addToQueue();
  }
}
