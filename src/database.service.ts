// database.service.ts
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
    private connection;

    constructor() {
        this.connect();
    }

    async connect() {
        this.connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'interview_task1'
        });
    }

    async query(sql: string, params?: any[]): Promise<any> {
        const [rows, fields] = await this.connection.execute(sql, params);
        return rows;
    }

    async close() {
        await this.connection.end();
    }
}
