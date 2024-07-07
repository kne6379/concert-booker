import _, { includes } from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesSeat } from 'src/seat/entities/sales-seat.entity';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { PurchaseHistory } from './entities/purchase-history.entity';
import { DataSource } from 'typeorm';
import { SalesSeatDto } from 'src/seat/dto/sales-seat.dto';
import { Show } from 'src/show/entities/show.entity';
import { Showdate } from 'src/show/entities/showdate.entity';
import { SeatGrade } from 'src/seat/entities/seat-grade.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(SalesSeat)
    private readonly salesSeatRepository: Repository<SalesSeat>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(PurchaseHistory)
    private readonly purchaseRepository: Repository<PurchaseHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRedis()
    private readonly client: Redis,
    private dataSource: DataSource,
  ) {}
  async buyTicket(
    salesSeatDto: SalesSeatDto,
    userId: number,
    userPoint: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { title, showDate, seatGrades } = salesSeatDto;
      const { id } = await queryRunner.manager.findOneBy(Show, { title });

      if (_.isNil(id)) {
        throw new BadRequestException('존재하지 않는 공연입니다.');
      }
      const showdateData = await queryRunner.manager.findOneBy(Showdate, {
        showId: id,
        showDate,
      }); // 일정 정보 조회

      if (_.isNil(showdateData)) {
        throw new BadRequestException('존재하지 않는 공연 일정입니다.');
      }
      const seatGradeData = await queryRunner.manager.findOneBy(SeatGrade, {
        showId: id,
        seatGrades,
      });
      if (_.isNil(seatGradeData)) {
        throw new BadRequestException('존재하지 않는 공연 등급입니다.');
      }
      const salesSeatData = await queryRunner.manager.find(SalesSeat, {
        where: { showdateId: showdateData.id },
      });
      console.log(salesSeatData);
      // 판매 좌석 정보 저장
      const salesSeat = await queryRunner.manager.save(SalesSeat, {
        showdateId: showdateData.id,
        seatgradeId: seatGradeData.id,
      });

      const ticket = await queryRunner.manager.save(Ticket, {
        showId: id,
        salesSeatId: salesSeat.id,
        userId,
      }); // 티켓 생성

      const purchaseHistory = await queryRunner.manager.save(PurchaseHistory, {
        userId,
        ticketId: ticket.id,
        ticketPrice: seatGradeData.price,
      }); // 구매 내역 생성

      const point = userPoint - seatGradeData.price;
      if (point < 0) {
        throw new BadRequestException('잔액이 부족합니다.');
      }

      const userPriceUpdate = await queryRunner.manager.update(
        User,
        { id: userId },
        { point },
      ); // 잔액 정보 업데이트

      await this.client.set(`user:${userId}:points`, point);
      await this.client.set(`ticket:${ticket.id}`, JSON.stringify(ticket));

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error;
    } finally {
      await queryRunner.release();
    }
  }

  async showTickets(userId: number) {
    let ticketData = await this.ticketRepository.find({
      where: { userId },
      select: {},
      relations: [
        'show',
        'salesSeat.seatGrade',
        'salesSeat.showdate',
        'purchaseHistory',
      ],
    });

    const data = ticketData.map((ticket) => {
      return {
        title: ticket.show.title,
        price: ticket.purchaseHistory.ticketPrice,
        seatGrade: ticket.salesSeat.seatGrade.seatGrades,
        date: ticket.salesSeat.showdate.showDate,
        address: ticket.show.address,
      };
    });
    return data;
  }
}
// return {
//     title: ticket.show.title,
//     price: ticket.purchaseHistory.ticketPrice,
//     seatGrade: {
//       grade: ticket.salesSeat.seatGrade.grade,
//       price: ticket.salesSeat.seatGrade.price,
//     },
