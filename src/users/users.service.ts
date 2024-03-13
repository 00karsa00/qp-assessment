import { Injectable } from '@nestjs/common';
import { Value } from 'sass';
import { DatabaseService } from 'src/database.service';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async getUserList(item: any) {
        const result = await this.databaseService.query(`select * from users where type = "user" and (email = ? or username = ?) limit 1`,[ item.email, item.username]);
        return result;
    }

    async addUser(item: any) {
        const result = await this.databaseService.query(`insert into users (${Object.keys(item)}) values ("${ Object.values(item).join('","') }")`);
        return result;
    }

    async userLoginDetail(username: string) {
        const result = await this.databaseService.query(`select * from users where type = "user" and (email = ? or username = ?) limit 1`,[username, username]);
        return result;
    }
    
    async groceryList(item: any) {
        const result = await this.databaseService.query( `select * from groceries where status = "available";`);
        return result;
    }
    
    async groceryBookedItem(userId: number) {
        const result = await this.databaseService.query( `select g.*,bi.id as bookedItem,bi.qty as totalQty,(g.price * bi.qty) as totalPrice from bookeditem as bi inner join groceries as g on (g.id = bi.grocery_id) where user_id = ?;`,[userId]);
        return result;
    }

    async groceryItemBook(item: any, userId: number) {
        let value = item.map((i) => `("${i.grocery_id}","${i.qty}","${userId}")`).join(",");
        const result = await this.databaseService.query( `insert into bookeditem (${Object.keys(item[0])},user_id) values ${value}`);
        return result;
    }

}
