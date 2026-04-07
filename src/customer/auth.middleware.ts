import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = this.jwtService.verify(token);
      const customer = await this.customerRepository.findOne({
        where: { email: decoded.email },
      });

      if (!customer || customer.token !== token) {
        throw new UnauthorizedException('Invalid token');
      }

      const requestWithUser = req as Request & { user?: Customer };
      requestWithUser.user = customer;
      next();
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
