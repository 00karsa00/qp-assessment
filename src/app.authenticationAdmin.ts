import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UtilsService } from './app.utils.service';

@Injectable()
export class AuthenticationAdminMiddleware implements NestMiddleware {
    constructor(
        private readonly utilsService: UtilsService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

        if (!token) {
            return res.status(401).json({ message: 'Missing token' });
        }

        try {
            const decoded = await this.utilsService.verifyToken(token);
            req['user'] = decoded; // Attach user object to request
            if( req['user'].type && req['user'].type == 'admin') {
                next();
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}
