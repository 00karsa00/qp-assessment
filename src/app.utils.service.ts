import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UtilsService {
  private readonly secretKey = '123456789';

  async encryptPassword(password: string): Promise<string> {
    try {
      const hash = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hash);
      return hash;
    } catch (e) {
      console.log('Util error => ', e);
      throw e;
    }
  }

  async checkPassword(password: string, checkPassword: string): Promise<boolean> {
    try {
      console.log("password => ",typeof password)
      console.log("checkPassword => ",typeof checkPassword)
      const result = await bcrypt.compare(password, checkPassword);
      console.log('Password Match:', result);
      return result;
    } catch (e) {
      console.log('Util error => ', e);
      throw e;
    }
  }

  async createAccessToken(data: any): Promise<string> {
    try {
      const options: jwt.SignOptions = {
        expiresIn: '1h', // Token expiration time
      };
      const token = jwt.sign(data, this.secretKey, options);
      console.log('Generated JWT:', token);
      return token;
    } catch (e) {
      console.log('Util error => ', e);
      throw e;
    }
  }

  async verifyToken (token: string): Promise<object> {
    try {
      const userObj = await jwt.verify(token, this.secretKey);
      return userObj;
    } catch (e) {
      console.log('Util error => ', e);
      throw e;
    }
  }
}
