import { PartialType } from '@nestjs/swagger';
import { CreateBullQueueDto } from './create-bull-queue.dto';

export class UpdateBullQueueDto extends PartialType(CreateBullQueueDto) {}
