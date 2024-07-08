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

@Injectable()
export class TicketsService {
  constructor(
    // @InjectRepository(SalesSeat)
    // private readonly salesSeatRepository: Repository<SalesSeat>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    // @InjectRepository(PurchaseHistory)
    // private readonly purchaseRepository: Repository<PurchaseHistory>,
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async buyTicket(
    salesSeatDto: SalesSeatDto,
    userId: number,
    userPoint: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const { title, showDate, seatGrades, seatNumber } = salesSeatDto;
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

      // 잔액 정보 계산
      const point = userPoint - seatGradeData.price;
      if (point < 0) {
        throw new BadRequestException('잔액이 부족합니다.');
      }

      // 판매 좌석 정보 조회, 같은 일정 + 같은 등급 + 같은 좌석 번호를 가진 데이터 조회
      const salesSeatData = await queryRunner.manager.find(SalesSeat, {
        where: {
          showdateId: showdateData.id,
          seatgradeId: seatGradeData.id,
          seatNumber,
        },
        relations: ['seatGrade'],
      });
      // 존재한다면 return
      if (salesSeatData.length > 0) {
        throw new BadRequestException('해당 좌석은 이미 판매되었습니다.');
      }

      // 각 등급 별로 생성할 때 제한을 둔 개수까지 구매 가능
      const limitedSeat = (seatNumber: number, seatGrades: string) => {
        if (seatGrades == 'VIP' && seatNumber > seatGradeData.gradeSeatCount) {
          return false;
        } else if (
          seatGrades == 'R' &&
          seatNumber > seatGradeData.gradeSeatCount
        ) {
          return false;
        } else if (
          seatGrades == 'S' &&
          seatNumber > seatGradeData.gradeSeatCount
        ) {
          return false;
        } else if (
          seatGrades == 'A' &&
          seatNumber > seatGradeData.gradeSeatCount
        ) {
          return false;
        } else {
          return true;
        }
      };

      // 열 번호 넘겼을 시 return
      if (!limitedSeat(seatNumber, seatGrades)) {
        throw new BadRequestException(
          `해당 좌석 번호가 ${seatGrades} 등급에 유효하지 않습니다. `,
        );
      }

      // 판매 좌석 정보 저장
      const salesSeat = await queryRunner.manager.save(SalesSeat, {
        showdateId: showdateData.id,
        seatgradeId: seatGradeData.id,
        seatNumber,
      });

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
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error;
    } finally {
      await queryRunner.release();
    }
  }

  // 예매한 티켓 정보 확인
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
        seatNumber: ticket.salesSeat.seatNumber,
        date: ticket.salesSeat.showdate.showDate,
        address: ticket.show.address,
      };
    });
    return data;
  }

  // 티켓 삭제
  async deleteTicket(userId: number, userPoint: number, ticketId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const ticket = await queryRunner.manager.findOne(Ticket, {
        where: { id: ticketId, userId: userId },
      });
      if (!ticket) {
        throw new BadRequestException(
          '해당 티켓을 찾을 수 없거나 권한이 없습니다.',
        );
      }

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
        userId,
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
}
