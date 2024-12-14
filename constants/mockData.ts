import { ImageSourcePropType } from 'react-native';
import { destination } from '../types/typeInterfaces';

export interface Category {
  category_id: string;
  keyword_id: string;
  category_name: string;
  keyword_name: string;
  count: number;
}

export const mockCategories: Category[] = [
  // 지역
  {
    category_id: '1',
    category_name: '지역',
    keyword_id: '1',
    keyword_name: '서울',
    count: 0
  },
  {
    category_id: '1',
    category_name: '지역',
    keyword_id: '2',
    keyword_name: '경기도',
    count: 0
  },
  {
    category_id: '1',
    category_name: '지역',
    keyword_id: '3',
    keyword_name: '충청도',
    count: 0
  },
  {
    category_id: '1',
    category_name: '지역',
    keyword_id: '4',
    keyword_name: '전라도',
    count: 0
  },
  {
    category_id: '1',
    category_name: '지역',
    keyword_id: '5',
    keyword_name: '경상도',
    count: 0
  },
  {
    category_id: '1',
    category_name: '지역',
    keyword_id: '6',
    keyword_name: '강원도',
    count: 0
  },
  {
    category_id: '1',
    category_name: '지역',
    keyword_id: '7',
    keyword_name: '제주도',
    count: 0
  },
  // 여행목적
  {
    category_id: '2',
    category_name: '여행목적',
    keyword_id: '8',
    keyword_name: '힐링',
    count: 0
  },
  {
    category_id: '2',
    category_name: '여행목적',
    keyword_id: '9',
    keyword_name: '사진',
    count: 0
  },
  {
    category_id: '2',
    category_name: '여행목적',
    keyword_id: '10',
    keyword_name: '관광',
    count: 0
  },
  {
    category_id: '2',
    category_name: '여행목적',
    keyword_id: '11',
    keyword_name: '식도락',
    count: 0
  },
  {
    category_id: '2',
    category_name: '여행목적',
    keyword_id: '12',
    keyword_name: '액티비티',
    count: 0
  },
  {
    category_id: '2',
    category_name: '여행목적',
    keyword_id: '13',
    keyword_name: '체험',
    count: 0
  },
  // 계절
  {
    category_id: '3',
    category_name: '계절',
    keyword_id: '14',
    keyword_name: '봄',
    count: 0
  },
  {
    category_id: '3',
    category_name: '계절',
    keyword_id: '15',
    keyword_name: '여름',
    count: 0
  },
  {
    category_id: '3',
    category_name: '계절',
    keyword_id: '16',
    keyword_name: '가을',
    count: 0
  },
  {
    category_id: '3',
    category_name: '계절',
    keyword_id: '17',
    keyword_name: '겨울',
    count: 0
  },
  // 여행테마
  {
    category_id: '4',
    category_name: '여행테마',
    keyword_id: '18',
    keyword_name: '역사',
    count: 0
  },
  {
    category_id: '4',
    category_name: '여행테마',
    keyword_id: '19',
    keyword_name: '자연',
    count: 0
  },
  {
    category_id: '4',
    category_name: '여행테마',
    keyword_id: '20',
    keyword_name: '도심',
    count: 0
  },
  {
    category_id: '4',
    category_name: '여행테마',
    keyword_id: '21',
    keyword_name: '농촌',
    count: 0
  },
  {
    category_id: '4',
    category_name: '여행테마',
    keyword_id: '22',
    keyword_name: '당일치기',
    count: 0
  }
];

// Mock destinations 데이터
export const mockDestinations: destination[] = [
  {
    dest_id: '1',
    dest_name: "남산서울타워",
    location: "서울",
    image: [
      require('../assets/images/N-Seoul-tower.jpeg'),
      require('../assets/images/N-Seoul-tower.jpeg'),
      require('../assets/images/N-Seoul-tower.jpeg'),
      require('../assets/images/N-Seoul-tower.jpeg'),
      require('../assets/images/N-Seoul-tower.jpeg'),
      require('../assets/images/N-Seoul-tower.jpeg'),
    ],
    address: '서울특별시 용산구 남산공원길 105',
    description: '서울의 상징적인 타워\n‘남산서울타워’는 효율적인 방송전파 송수신과 한국의 전통미를 살린 관광 전망시설의 기능을 겸비한 국내 최초의 종합전파 탑으로 방송문화와 관광산업의 미래를 위해 건립되었습니다.\n\n세계 유명한 종합 탑들이 그 나라 또는 그 도시의 상징적인 존재가 된 것처럼 \'남산서울타워\' 역시 지난 40여 년간 대한민국의 대표적인 관광지이자 서울의 상징물 역할을 해왔습니다.\n\n‘남산서울타워’는 서울 시내 전 지역에서 바라보이는 탑의 높이와 독특한 구조, 형태 등으로 인하여 시민의 관심과 사랑의 대상이 되었고, 내외국인들이 즐겨 찾는 제1의 관광 명소로서의 위치를 확고히 하고 있습니다. 최근에는 한류 바람을 몰고 온 각종 예능, 드라마의 촬영지로 이름이 높아지면서 내외국인 관광객들이 발길이 끊이지 않는 곳입니다.\n\n\n\n전화번호\n02-3455-9277\n\n홈페이지\nwww.seoultower.co.kr\n\n이용요금\n전망대 : 대인 21,000원, 소인 16,000원\n\n이용시간\n평일 10:30-22:30\n주말 및 공휴일 10:00-23:00\n* 마감시간 30분 전까지 입장 가능\n* 레스토랑 운영시간은 매장마다 상이하므로 홈페이지 참고',
    keywords: ['서울', '도심', '관광'],
  },

  {
    dest_id: '2',
    dest_name: '전주한옥마을',
    location: '전주',
    image: [
      require('../assets/images/jeonju.jpeg'),
      require('../assets/images/jeonju.jpeg'),
      require('../assets/images/jeonju.jpeg'),
    ],
    address: '서울특별시 용산구 남산공원길 105',
    description: '서울의 상징적인 타워',
    keywords: ['전라도', '역사', '사진', '관광'],
  },
  // ... 더 많은 목적지 데이터
];