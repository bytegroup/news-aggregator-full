import { ConfigurableModuleBuilder } from '@nestjs/common';
import { QueueBoardModuleOptions } from './interface/queue-board.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE
} =
  new ConfigurableModuleBuilder<QueueBoardModuleOptions>().build();
