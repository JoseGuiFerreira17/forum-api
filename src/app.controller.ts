import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get()
  index() {
    return this.appService.getHello();
  }

  @Post('/hello')
  async getHello() {
    return await this.prisma.user.findMany();
  }
}
