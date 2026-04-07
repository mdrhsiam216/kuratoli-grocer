import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

declare global {
  namespace Express {
    interface Request {
      user?: Admin;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = this.jwtService.verify(token);
      const admin = await this.adminRepository.findOne({
        where: { email: decoded.email },
      });

      if (!admin || admin.token !== token) {
        throw new UnauthorizedException('Invalid token');
      }

      req.user = admin;
      next();
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
