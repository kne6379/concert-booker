import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { SalesSeatDto } from 'src/seat/dto/sales-seat.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserInfo } from 'src/utils/userInfo.decorator';

@UseGuards(RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post() // 티켓 구매
  async buyTicket(@Body() salesSeatDto: SalesSeatDto, @UserInfo() user: User) {
    try {
      const { id, point } = user;
      const data = await this.ticketsService.buyTicket(salesSeatDto, id, point);
    } catch (error) {}
  }

  @Get() // 예매 정보 조회
  async showTicket(@UserInfo() user: User) {
    try {
      const { id } = user;
      const data = await this.ticketsService.showTickets(id);
      return data;
    } catch (error) {}
  }

  @Delete(':ticketId')
  async deleteTicket(
    @UserInfo() user: User,
    @Param('ticketId') ticketId: number,
  ) {
    try {
      const { id, point } = user;
      const data = await this.ticketsService.deleteTicket(id, point, ticketId);
      return data;
    } catch (error) {}
  }
}
