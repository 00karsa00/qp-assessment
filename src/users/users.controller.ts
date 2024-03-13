import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { UtilsService } from 'src/app.utils.service';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly utilsService: UtilsService
    ) {}


    
    @Post('register')
    async register(@Body() body: any) {
        try {
            const { email, username, password } = body;
            const userDetails = await this.usersService.getUserList({ email, username });
            let message = 'Add Successfully';
            let error = false;
            console.log('userDetails => ', userDetails);
            if (userDetails.length) {
                const isEmail = userDetails.findIndex((item) => item.email === email);
                const isUsername = userDetails.findIndex((item) => item.username === username);
                error = true;
                if (isEmail > -1) message = 'Email id exists';
                if (isUsername > -1) message = 'Username exists';
                if (isEmail > -1 && isUsername > -1) message = 'Username and email id exist';
            }

            if (!userDetails.length) {
                await this.usersService.addUser({
                    username,
                    email,
                    password: await this.utilsService.encryptPassword(password),
                });
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

    @Post('login')
    async userLogin(@Body() body: any) {
        try {
            const { username, password } = body;

            const userDetail = await this.usersService.userLoginDetail(username);

            let message = 'Email or Username is not found';
            let error = true;
            let token = null;

            if (userDetail.length) {
                message = 'Password is wrong';
                const isPassword = await this.utilsService.checkPassword(password, userDetail[0].password);
                if (isPassword) {
                    token = await this.utilsService.createAccessToken({
                        id: userDetail[0].id,
                        username: userDetail[0].username,
                        type: userDetail[0].type
                    });
                    message = 'Login Successfully.';
                    const obj = await this.utilsService.verifyToken(token)
                    console.log("Obj => ", obj)
                }
            }

            return {
                status:200,
                error,
                message,
                token,
            };
        } catch (e) {
            console.log('User login controller error:', e);
            return {
                error: true,
                status: 501,
                message: 'Server error',
            };
        }
    }


    @Post('groceryList')
    async groceryList(@Req() req: any) {
        try {
            const groceryList = await this.usersService.groceryList({});
            return {
                status: 200,
                error: false,
                message: "Successfully fetch items.",
                data: groceryList,
            };
        } catch (e) {
            console.log('User login controller error:', e);
            return {
                error: true,
                status: 501,
                message: 'Server error',
            };
        }
    }

    @Post('bookItem')
    async groceryItemBook(@Req() req: any) {
        try {
            let { groceryItem } = req.body
            const result = await this.usersService.groceryItemBook(groceryItem, req.user.id);
            return {
                status: 200,
                error: false,
                message: "Grocery booked successfully.",
            };
        } catch (e) {
            console.log('User login controller error:', e);
            return {
                error: true,
                status: 501,
                message: 'Server error',
            };
        }
    }

    @Get('bookedItem')
    async groceryBookedItem(@Req() req: any) {
        try {
            console.log("req => ",req.user)
            const result = await this.usersService.groceryBookedItem(req.user.id);
            return {
                status: 200,
                error: false,
                message: "Data fetch items success..",
                data: result
            };
        } catch (e) {
            console.log('User login controller error:', e);
            return {
                error: true,
                status: 501,
                message: 'Server error',
            };
        }
    }
 
}
