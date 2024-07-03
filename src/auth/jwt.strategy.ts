import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // JWT 토큰 추출
      ignoreExpiration: false, // 만료된 토큰일 경우 인증실패
      secretOrKey: configService.get('JWT_SECRET_KEY'), // configService에 등록된 환경변수, JWT 시크릿 키를 통해 검증
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.email);
    if (_.isNil(user)) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}

// - `Passport`는 인증 메커니즘을 캡슐화하고, 다양한 인증 전략을 사용하여 애플리케이션을 쉽게 확장할 수 있도록 돕는 모듈 기반의 유연한 인증 프레임워크에요!
// - 이번 프로젝트에서는 이메일과 비밀번호를 통한 로컬 로그인만 지원을 할 예정이지만 향후의 여러분들의 서비스는 구글 및 네이버, 카카오와 같은 소셜 로그인도 지원이 되어야 될 것이에요!
// - 그렇기 때문에 이번 프로젝트에서는 Passport를 활용하여 인증 및 인가를 구현할 것이고 그중에 JWT 인증 전략을 사용하는 것입니다!
// - 소셜 로그인이 궁금하시다면 관련하여 더 찾아보시길 바랍니다!
// - 이렇게 인증 프로세스를 간소화하면 개발자는 인증 로직을 구현하는게 너무 쉬워지고 이는 곧 비지니스 로직에 더 집중할 수 있음을 의미해요!
