import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';

@Injectable()
export class AdminService {
    constructor(private readonly databaseService: DatabaseService) {}

    async adminLogin(email: string) {
        // Logic to handle admin login
        const users = await this.databaseService.query('select * from users where (email = ? or username = ?) limit 1',[email, email]);
        return users;
    }

    async groceryList(item: any) {
        let where = "";
        let list = ["id", "name","code","price","qtyType","status","type"];
        if(item.search) {
            Object.keys(item.search).map(i =>{
                console.log("item => ",i,item.search) 
                if(list.includes(i) && item.search[i].length) where += ` and ${ i }="${ item.search[i] }"`
            })
        }
        if(item.type) {
            if(item.type.length) where += ` and type in ("${item.type.join(",")}") `;
        }
        if(item.status) {
            if(item.status.length)  where += ` and status in ("${item.status.join(",")}") `;
        }
        if(item.qtyType) {
            if(item.qtyType.length) where += ` and qtyType  in ("${item.qtyType.join(",")}") `;
        }
        if(item.price) {
            if(item.price.start && item.price.start.length) where += ` and price >= ${item.price.start} `
            if(item.price.start && item.price.end.length) where += ` and price <= ${item.price.end} `
        }
        console.log(where)
        const groceryList = await this.databaseService.query(`select * from groceries where 1=1 ${where}`);
        return groceryList;
    }
    
    async getItemByCode(code: string) {
        const groceryList = await this.databaseService.query('select * from groceries where code = ?', [code]);
        return groceryList;
    }

    async groceryUpdate(item: any) {
        let updateItem = Object.entries(item.items)
                .map(([key, value]) => `${key} = "${value}"`)
                .join(', ');
        const result = await this.databaseService.query(`update groceries set ${ updateItem }  where id = ?`,[ item.id]);
        return result;
    }

    async addGrocery(item: any) {
        const result = await this.databaseService.query(`insert into groceries (${Object.keys(item)}) values ("${ Object.values(item).join('","') }")`);
        return result;
    }

}
