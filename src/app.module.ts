import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { AuthenticationMiddleware } from 'src/app.authentication';
import { AuthenticationAdminMiddleware } from 'src/app.authenticationAdmin';
import { UtilsService } from './app.utils.service';

@Module({
  imports: [AdminModule, UsersModule],
  controllers: [],
  providers: [UtilsService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthenticationMiddleware)
        .forRoutes('user/groceryList','user/bookItem','user/bookedItem');
      
      consumer
        .apply(AuthenticationAdminMiddleware)
        .forRoutes('admin/groceryList');
  }
}
