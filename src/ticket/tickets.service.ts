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
import { json } from 'stream/consumers';

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
    private readonly redis: Redis,
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

      // 일정 정보 조회
      const showdateData = await queryRunner.manager.findOneBy(Showdate, {
        showId: id,
        showDate,
      });
      if (_.isNil(showdateData)) {
        throw new BadRequestException('존재하지 않는 공연 일정입니다.');
      }

      // 좌석 등급 정보 조회
      const seatGradeData = await queryRunner.manager.findOneBy(SeatGrade, {
        showId: id,
        seatGrades,
      });
      if (_.isNil(seatGradeData)) {
        throw new BadRequestException('존재하지 않는 공연 등급입니다.');
      }

      // 잔액 정보 비교
      const point = userPoint - seatGradeData.price;
      if (point < 0) {
        throw new BadRequestException('잔액이 부족합니다.');
      }

      // 판매 좌석 정보 저장
      const salesSeat = await queryRunner.manager.save(SalesSeat, {
        showdateId: showdateData.id,
        seatgradeId: seatGradeData.id,
      });

      // 판매 좌석 정보 조회
      const salesSeatData = await queryRunner.manager.find(SalesSeat, {
        where: { showdateId: showdateData.id },
        relations: ['seatGrade'],
      });

      // redis에 저장된 좌석 개수 정보 가져오기
      const salesSeatCount = await this.redis.get(`title:${title}`);

      // 좌석 개수 정보가 없다면 저장하기
      if (_.isNil(salesSeatCount)) {
        const gradeCount = salesSeatData.reduce(
          (acc, data) => {
            if (data.seatGrade.seatGrades == 'VIP') {
              acc.VIP += 1;
            } else if (data.seatGrade.seatGrades == 'R') {
              acc.R += 1;
            } else if (data.seatGrade.seatGrades == 'S') {
              acc.S += 1;
            } else if (data.seatGrade.seatGrades == 'A') {
              acc.A += 1;
            } else if (data.seatGrade.seatGrades == 'B') {
              acc.B += 1;
            }
            return acc;
          },
          { VIP: 0, R: 0, S: 0, A: 0, B: 0 },
        );
        for (const grade in gradeCount) {
          if (gradeCount[grade] > 20) {
            throw new BadRequestException(
              `${grade} 등급의 좌석의 재고가 없습니다.`,
            );
          }
        }
        await this.redis.set(`title:${title}`, JSON.stringify(gradeCount));
      } else {
        const newSalesSeatAmount = JSON.parse(salesSeatCount);
        newSalesSeatAmount[seatGrades] += 1;
        if (newSalesSeatAmount[seatGrades] > 20) {
          throw new BadRequestException(
            `${seatGrades} 등급의 좌석의 재고가 없습니다.`,
          );
        }
        await this.redis.set(
          `title:${title}`,
          JSON.stringify(newSalesSeatAmount),
        );
      }

      // 티켓 생성
      const ticket = await queryRunner.manager.save(Ticket, {
        showId: id,
        salesSeatId: salesSeat.id,
        userId,
      });

      // 구매 내역 생성
      const purchaseHistory = await queryRunner.manager.save(PurchaseHistory, {
        userId,
        ticketId: ticket.id,
        ticketPrice: seatGradeData.price,
      });

      await queryRunner.manager.update(
        SalesSeat,
        { id: salesSeat.id },
        { ticketId: ticket.id },
      );

      // 잔액 정보 업데이트
      const userPriceUpdate = await queryRunner.manager.update(
        User,
        { id: userId },
        { point },
      );

      await this.redis.set(`user:${userId}:points`, point);
      await this.redis.set(`ticket:${ticket.id}`, JSON.stringify(ticket));

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
        id: ticket.id,
        title: ticket.show.title,
        price: ticket.purchaseHistory.ticketPrice,
        seatGrade: ticket.salesSeat.seatGrade.seatGrades,
        date: ticket.salesSeat.showdate.showDate,
        address: ticket.show.address,
      };
    });
    return data;
  }
  async deleteTicket(userId: number, userPoint: number, ticketId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const purchaseHistory = await queryRunner.manager.findOneBy(
        PurchaseHistory,
        {
          ticketId,
        },
      );

      const point = userPoint + purchaseHistory.ticketPrice;
      const userPriceUpdate = await queryRunner.manager.update(
        User,
        {
          id: userId,
        },
        { point },
      );

      const deleteTicket = await queryRunner.manager.delete(Ticket, {
        id: ticketId,
      });

      await queryRunner.commitTransaction();
      return deleteTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error;
    } finally {
      await queryRunner.release();
    }
  }
  //   async reduceSeat
}
