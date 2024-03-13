import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseService } from 'src/database.service';
import { UtilsService } from 'src/app.utils.service';


@Module({
    controllers: [UsersController],
    providers: [UsersService, DatabaseService,UtilsService],
    exports: [UsersService], 
})
export class UsersModule {}
