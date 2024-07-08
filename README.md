<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## ERD와 API 명세서 

https://stephenoeul.notion.site/af9d083846824aea92879c71c0a3b4f5?pvs=4

## 구현

- Auth: 회원가입, 로그인, 내 정보 보기 

1. 카테고리 생성 : 공연 생성 전 공연을 분류하는 카테고리 데이터를 먼저 생성
2. 공연 생성 : 공연 정보 + 공연 일정 + 공연 좌석 정보를 생성, 한 개의 공연에 N개의 일정, Enum으로 분류된 좌석 정보 생성
3. 공연 검색 : 전체 공연 검색, 카테고리별 검색, 제목별 검색
4. 공연 상세보기 : 공연 정보 + 공연 일정 표시
5. 좌석 지정 티켓 예매 : 티켓 구매 시 판매 좌석, 금액 로그, 티켓 생성 / 좌석 등급 별로 티켓 가격이 달라진다. 
6. 공연 전체 좌석 예매 정보 확인 : 등급 별로 예매 가능한 좌석 번호 표시
7. 예매 취소 : 판매 좌석, 금액 로그, 티켓 삭제 -> 결제된 금액 반환, 트랜잭션으로 이뤄진다.  
8. 동시성 처리 : 트랜잭션 isolation Level : SERIALIZABLE 설정,

## 트러블 슈팅 
추가예정 

## 아쉬움

 1. 반환값 설정 : 에러 코드와 호출 성공 시 메세지를 반환하지 못함. Interceptor에 대해 공부한 뒤 추가해보고 싶다.
 2. 상수화 : 자주 사용되는 메세지나 데이터들을 상수화하여 관리하고 싶었는데 시간이 모자랐다.
 3. 복잡한 코드 : 너무 길게 작성된 코드, 남이 보기에 읽기 어려울 것 같다.
 4. 캐시 : 전체 좌석 예매 정보를 Redis에 저장한 뒤 사용자에게 반환하여 캐시 데이터로 사용하고 싶었는데 구현하지 못했다. 매번 다시 데이터를 계산하는 로직을 작성했다.
 5. 데이터베이스에 UTC 기준으로 시간이 저장되고 있는 것 같다. 데이터베이스 설정을 통해 한국 시간으로 통일시키고 싶다. 

## 해보고 싶은 것 
- [ ] 커스텀 제너레이터
- [ ] 인터셉터 
