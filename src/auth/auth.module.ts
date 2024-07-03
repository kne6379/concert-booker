import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  // Nest.js 모듈 선언
  imports: [
    // 다른 모듈 임포트, Passport, Jwt
    PassportModule.register({ defaultStrategy: 'jwt', session: false }), // Passport 모듈 설정, Jwt 인증은 session이 필요 없으므로 false
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        // 팩토리 함수로 Jwt 모듈 설정 정의
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService], // 의존성 주입
    }),
    UserModule,
  ],
  providers: [JwtStrategy], // JwtStartegy 클래스 사용하기 위해 추가
})
export class AuthModule {}

/* 
Passport와 JWT 설정
1. PassportModule과 JwtModule이 AuthModule에 가져와져서 Passport와 JWT 관련 설정 수행 
2. PassportModule은 기본 인증 전략을 'jwt'로 설정하고 세션을 사용하지 않도록 설정
3. JwtModule은 ConfigService를 사용하여 비밀 키를 동적으로 설정합니다.

JWT 전략 제공
1. JwtStrategy 클래스가 providers에 추가되어 JWT 인증 전략이 모듈 내에서 사용될 수 있습니다.
2. 구성 요소 간의 의존성 주입

- ConfigService는 환경 변수나 설정 파일에서 필요한 값을 가져와 다른 구성 요소에서 사용할 수 있게 합니다.
- JwtStrategy는 JWT 토큰을 검증하는 역할을 수행하며, 애플리케이션의 인증 과정을 처리합니다.
*/
