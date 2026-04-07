import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from './entities/manager.entity';

@Injectable()
export class ManagerAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
  ) {}

  
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = this.jwtService.verify(token);
      const manager = await this.managerRepository.findOne({
        where: { email: decoded.email },
      });

      if (!manager || manager.token !== token) {
        throw new UnauthorizedException('Invalid token');
      }

      req.user = manager;
      next();
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}