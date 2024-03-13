import { Controller, Post, Body, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UtilsService } from 'src/app.utils.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly utilsService: UtilsService
    ) {}

    @Post('login')
    async adminLogin(@Body() body: any) {
        try {
            const { email, password } = body;
            const adminDetail = await this.adminService.adminLogin(email);
            let message = "Email id or username is not found..";
            let error = true;
            let token = null;
            if(adminDetail.length) {
                message = "Password is wrong";
                const password1 = await this.utilsService.encryptPassword("123456");
                console.log(password1,  adminDetail[0].password)
                const isPassword =await this.utilsService.checkPassword(password, adminDetail[0].password);
                if(isPassword) {
                    token  = await this.utilsService.createAccessToken({
                        id: adminDetail[0].id,
                        username: adminDetail[0].username,
                        type: adminDetail[0].type,
                    })
                    message = "Login Successfully.";
                }
            }
            return {
                status: 200,
                error, message, token
            };
        } catch (e) {
            console.log("adminLogin controller error => ", e);
            return {
                error: true,
                status: 501,
                message: 'Server error..'
            };
        }
    }

    @Post('/groceryList')
    async groceriesList(@Body() body: any) {
        try {
            let { search, filterBy } = body;
            let { type,status,price,qtyType } = filterBy;
            let groceryList = await this.adminService.groceryList({
                search,type,status,price,qtyType
            });
            return {
                status: 200,
                error: false, 
                message: "Successfully fetch items.",
                data: groceryList
            }
        } catch (e) {
            console.log("groceryList controller error => ", e);
            return {
                error: true,
                status: 501,
                message: 'Server error..'
            }
        }
    }
    
    @Post('grocery/update')
    async groceryUpdate(@Body() body: any) {
      try {
        const { id, ...items } = body;
        if(!Object.keys(items).length){
            return {
                status: 200,
                error: true,
                message: 'Update value is missing',
            }
        }
        if(!id) {
            return {
                status: 200,
                error: true,
                message: 'Item id is missing',
            }
        }
        console.log("id => ", id)
        console.log("items => ", items)
        const result = await this.adminService.groceryUpdate({ id, items });
        return {
          status: 200,
          error: false,
          message: 'Updated Successfully',
        }
      } catch (e) {
            console.log("groceryList controller error => ", e);
            return {
                error: true,
                status: 501,
                message: 'Server error..'
            }
      }
    }

    @Post('grocery/add')
    async addGrocery(@Body() body: any) {
        try {
            let { ...items } = body;
            if(!Object.keys(items).length){
                return {
                    status: 200,
                    error: true,
                    message: 'Insert date value is missing',
                }
            }
            const item = await this.adminService.getItemByCode(items.code);
            let message = "Code is already exisit.";
            let error = true;
            if(!item.length) {
                const result = await this.adminService.addGrocery(items);
                message = "Grocery added successfully";
                error = false
            }
            return {
                status: 200,
                error,
                message,
            };
        } catch (e) {
            console.log("groceryList controller error => ", e);
            return {
                error: true,
                status: 501,
                message: 'Server error..'
            }
        }
    }

    // Define other admin routes similarly
}
