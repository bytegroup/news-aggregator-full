import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

export const bullboardConfig = BullBoardModule.forRoot({
  route: '/queues',
  adapter: ExpressAdapter,
});
