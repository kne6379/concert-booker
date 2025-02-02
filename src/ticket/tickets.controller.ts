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
import { SalesSeatDto } from 'src/seat/dto/sales-seat.dto';
import { User } from 'src/user/entities/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { Response } from 'express';

@UseGuards(RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post() // 티켓 구매
  async buyTicket(@Body() salesSeatDto: SalesSeatDto, @UserInfo() user: User) {
    try {
      const { id, point } = user;
      const data = await this.ticketsService.buyTicket(salesSeatDto, id, point);
      return data;
    } catch (error) {
      return error;
    }
  }

  @Get() // 예매 정보 조회
  async showTicket(@UserInfo() user: User) {
    try {
      const { id } = user;
      const data = await this.ticketsService.showTickets(id);
      return data;
    } catch (error) {}
  }

  @Delete(':ticketId') // 티켓 삭제
  async deleteTicket(
    @UserInfo() user: User,
    @Param('ticketId') ticketId: number,
  ) {
    try {
      const { id, point } = user;
      const data = await this.ticketsService.deleteTicket(id, point, ticketId);
      return;
    } catch (error) {}
  }
}
