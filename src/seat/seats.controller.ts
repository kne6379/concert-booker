import { Body, Controller, Get } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { AvailableSeatDto } from './dto/available-seat.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatService: SeatsService) {}
  @Get()
  async availableSeat(@Body() availableSeatDto: AvailableSeatDto) {
    try {
      const { showDate, title } = availableSeatDto;
      return await this.seatService.availableSeat(showDate, title);
    } catch (error) {
      console.log(error);
    }
  }
}
