import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseService } from 'src/database.service';
import { UtilsService } from 'src/app.utils.service';

@Module({
    controllers: [AdminController],
    providers: [AdminService, DatabaseService,UtilsService],
    exports: [AdminService], // If AdminService needs to be used outside the module
})
export class AdminModule {}
