import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { SalesSeat } from './entities/sales-seat.entity';
import { SeatGrade } from './entities/seat-grade.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Show } from 'src/show/entities/show.entity';
import { Showdate } from 'src/show/entities/showdate.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(SalesSeat)
    private readonly salesSeatRepository: Repository<SalesSeat>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(SeatGrade)
    private readonly seatGradeRepository: Repository<SeatGrade>,
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
    @InjectRepository(Showdate)
    private readonly showDateRepository: Repository<Showdate>,
  ) {}

  async availableSeat(showDate: Date, title: string) {
    const { id } = await this.showRepository.findOneBy({ title });

    // 공연에 존재하는 등급 정보 조회
    const seatGradesData = await this.seatGradeRepository.find({
      where: { showId: id },
    });

    // 공연에 존재하는 일정 정보 조회
    const showDateData = await this.showDateRepository.findOneBy({
      showId: id,
      showDate: showDate,
    });

    // 현재 판매된 좌석 정보 조회
    const salesSeatData = await this.salesSeatRepository.find({
      where: { showdateId: showDateData.id },
    });

    const remainingSeats = {};

    // 좌석 등급 : 좌석 번호 객체 생성
    const createSeatNumber = (start: number, end: number): number[] => {
      const seats: number[] = [];
      for (let i = start; i <= end; i++) {
        seats.push(i);
      }
      return seats;
    };
    const availableSeats = {};

    seatGradesData.forEach((grade) => {
      availableSeats[grade.seatGrades] = createSeatNumber(
        1,
        grade.gradeSeatCount,
      );
    });

    // 판매된 좌석 번호
    const soldSeats = salesSeatData.map((seat) => seat.seatNumber);

    for (const grade in availableSeats) {
      remainingSeats[grade] = availableSeats[grade].filter(
        (seat) => !soldSeats.includes(seat),
      );
    }
    console.log(remainingSeats);
    return remainingSeats;
  }
}

// 등급 별로 해당하는 좌석 개수를 갖고 있는 객체
// [1, 2, 3, 4, ... 20 ]
// 등급 별로 해당하는 좌석의 개수가 다르므로 등급에 맞는 개수 책정
// 존재하는 티켓의 번호를 제외한 번호가 들어가 있어야한다.
