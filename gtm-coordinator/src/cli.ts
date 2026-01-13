#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { enrichCommand } from './commands/enrich.js';
import { packetCommand } from './commands/packet.js';
import { validateCommand } from './commands/validate.js';
import { setStatusCommand } from './commands/setStatus.js';
import { qaPassCommand } from './commands/qaPass.js';
import { marketingApproveCommand } from './commands/marketingApprove.js';
import { marketingBlockCommand } from './commands/marketingBlock.js';
import { indexCommand } from './commands/index.js';
import { lockCommand } from './commands/lock.js';
import { linksCheckCommand } from './commands/linksCheck.js';
import { utmCommand } from './commands/utm.js';
import { migrateCommand } from './commands/migrate.js';

const program = new Command();

program
  .name('gtm')
  .description('GTM Coordinator v0.2.0 - Manage Go-To-Market initiatives locally')
  .version('0.2.0');

// Core commands
program.addCommand(initCommand);
program.addCommand(enrichCommand);
program.addCommand(packetCommand);
program.addCommand(validateCommand);
program.addCommand(setStatusCommand);

// Gate commands
program.addCommand(qaPassCommand);
program.addCommand(marketingApproveCommand);
program.addCommand(marketingBlockCommand);

// New v0.2 commands
program.addCommand(lockCommand);
program.addCommand(linksCheckCommand);
program.addCommand(utmCommand);
program.addCommand(migrateCommand);

// Index command
program.addCommand(indexCommand);

program.parse();
