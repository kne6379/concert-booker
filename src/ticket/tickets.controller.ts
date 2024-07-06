import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { SalesSeatDto } from 'src/seat/dto/sales-seat.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserInfo } from 'src/utils/userInfo.decorator';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(RolesGuard)
  @Post()
  async buyTicket(@Body() salesSeatDto: SalesSeatDto, @UserInfo() user: User) {
    try {
      const { id, point } = user;
      const data = await this.ticketsService.buyTicket(salesSeatDto, id, point);
    } catch (error) {}
  }
}
