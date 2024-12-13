import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../../components/Header';
import { commonStyles } from '../../styles/commonStyles';
import { typography } from '../../styles/typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { destination } from '../../types/destination';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([
    { dest_id: '1', dest_name: '서울타워', image: require('../../assets/images/N-Seoul-tower.jpeg'), keywords: ['도심', '문화'] },
    { dest_id: '5', dest_name: '부산 해운대', image: require('../../assets/images/busan.jpeg'), keywords: ['도심', '휴양'] },
    { dest_id: '3', dest_name: '제주도 한라산', image: require('../../assets/images/jeju.jpeg'), keywords: ['자연', '역사'] },
    { dest_id: '4', dest_name: '강원도 설악산', image: require('../../assets/images/kangwon.jpeg'), keywords: ['자연', '휴양'] },
    { dest_id: '2', dest_name: '전주 한옥마을', image: require('../../assets/images/jeonju.jpeg'), keywords: ['문화', '역사'] },
  ]);
  
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Record<string, destination[]>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const scrollViewRef = useRef<ScrollView>(null);

  const { width } = Dimensions.get('window');

  // // 배너 네비게이션 함수들
  // const scrollToPrevious = () => {
  //   const newIndex = currentBannerIndex === 0 
  //     ? banners.length - 1  // 첫 번째에서 이전으로 가면 마지막으로
  //     : currentBannerIndex - 1;
    
  //   scrollViewRef.current?.scrollTo({
  //     x: newIndex * width,
  //     animated: true,
  //   });
  //   setCurrentBannerIndex(newIndex);
  // };

  // const scrollToNext = () => {
  //   const newIndex = currentBannerIndex === banners.length - 1
  //     ? 0  // 마지막에서 다음으로 가면 첫 번째
  //     : currentBannerIndex + 1;
    
  //   scrollViewRef.current?.scrollTo({
  //     x: newIndex * width,
  //     animated: true,
  //   });
  //   setCurrentBannerIndex(newIndex);
  // };

  // const handleDestinationClick = () => {
  //   const currentDestination = banners[currentBannerIndex];
  //   if (currentDestination) {
  //     navigation.navigate('destination', { id: currentDestination.dest_id });
  //   }
  // };

  // 비로그인 상태 추천 데이터 설정
  useEffect(() => {
    if (!isLoggedIn) {
      const keywords = ['자연', '역사', '도심', '문화', '휴양'];
      const randomKeywords = keywords.sort(() => 0.5 - Math.random()).slice(0, 5);
      setSelectedKeywords(randomKeywords);

      const testRecommendations: Record<string, destination[]> = {
        자연: [
          { dest_id: '3', dest_name: '한라산', image: require('../../assets/images/jeju.jpeg') }
        ],
        역사: [
          { dest_id: '4', dest_name: '경복궁', image: require('../../assets/images/kangwon.jpeg') }
        ],
        도심: [
          { dest_id: '1', dest_name: '서울타워', image: require('../../assets/images/N-Seoul-tower.jpeg') },
          { dest_id: '5', dest_name: '부산 해운대', image: require('../../assets/images/busan.jpeg') },
        ],
        문화: [
          { dest_id: '2', dest_name: '전주 한옥마을', image: require('../../assets/images/jeonju.jpeg') },
        ],
        휴양: [
          { dest_id: '6', dest_name: '강원도 속초', image: require('../../assets/images/kangwon.jpeg') },
        ],
      };
      setRecommendations(testRecommendations);
    }
  }, [isLoggedIn]);

  // 추천 관광지 클릭 핸들러
  const handleRecommendClick = (destination: destination) => {
    navigation.navigate('destination', { 
      dest_id: destination.dest_id
    });
  };

  const BannerSection = () => {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    // 수동 슬라이드 함수들
    const scrollToPrevious = () => {
      const newIndex = currentBannerIndex === 0 
        ? banners.length - 1 
        : currentBannerIndex - 1;
      
      scrollViewRef.current?.scrollTo({
        x: newIndex * width,
        animated: true,
      });
      setCurrentBannerIndex(newIndex);
    };

    const scrollToNext = () => {
      const newIndex = currentBannerIndex === banners.length - 1
        ? 0
        : currentBannerIndex + 1;
      
      scrollViewRef.current?.scrollTo({
        x: newIndex * width,
        animated: true,
      });
      setCurrentBannerIndex(newIndex);
    };

    // 자동 슬라이드
    useEffect(() => {
      const timer = setInterval(scrollToNext, 3000);
      return () => clearInterval(timer);
    }, [currentBannerIndex]);

    return (
      <View style={styles.bannerSection}>
        <View style={styles.bannerContainer}>
          <TouchableOpacity onPress={scrollToPrevious} style={[styles.arrow, styles.leftArrow]}>
            <Image source={require('../../assets/images/left-arrow.png')} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={scrollToNext} style={[styles.arrow, styles.rightArrow]}>
            <Image source={require('../../assets/images/right-arrow.png')} style={styles.arrowIcon} />
          </TouchableOpacity>

          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
              setCurrentBannerIndex(newIndex);
            }}
            style={{ width: width }}
            contentContainerStyle={{ width: width * banners.length }}
          >
            {banners.map((banner, index) => (
              <TouchableOpacity
                key={banner.dest_id}
                style={[styles.mainBanner, { width }]}
                onPress={() => navigation.navigate('destination', { 
                  dest_id: banner.dest_id
                })}
                activeOpacity={1}
              >
                <Image source={banner.image} style={styles.mainBannerImage} />
                <Text style={styles.bannerTitle}>{banner.dest_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={commonStyles.container}>
      <StatusBar style="dark" />
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* 배너 섹션 */}
          <BannerSection />

          {/* 추천 섹션 */}
          {selectedKeywords.length > 0 ? (
            selectedKeywords.map((keyword) => (
              <View key={keyword} style={styles.recommendSection}>
                <Text style={styles.recommendTitle}>#{keyword}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recommendations[keyword]?.map((destination) => (
                    <TouchableOpacity 
                      key={destination.dest_id} 
                      style={styles.recommendItem}
                      onPress={() => handleRecommendClick(destination)}
                    >
                      <Image source={destination.image} style={styles.destinationImage} />
                      <Text style={styles.destinationName}>{destination.dest_name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))
          ) : (
            <Text style={styles.loadingText}>추천 여행지 로딩 중...</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth * 0.455;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 10,
  },
  arrow: {
    position: 'absolute',
    top: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 15,
    zIndex: 3,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  arrowIcon: {
    width: 30,
    height: 30,
  },
  bannerSection: {
    marginTop: 20,
  },
  bannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
  },
  mainBanner: {
    width: '100%',
    height: '100%',
  },
  mainBannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  bannerTitle: {
    ...typography.regular,
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  recommendSection: {
    marginTop: 50,
  },
  recommendList: {
    flexDirection: 'row',
  },
  recommendTitle: {
    ...typography.bold,
    fontSize: 25,
    marginBottom: 10,
  },
  recommendItem: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    width: itemWidth,
    overflow: 'hidden',
    marginRight: 10,
  },
  destinationImage: {
    width: '100%',
    height: 200,
  },
  destinationName: {
    ...typography.regular,
    fontSize: 16,
    margin: 10,
  },
  noRecommendations: {
    marginHorizontal: 70,
    marginTop: 50,
  },
  loadingText: {
    ...typography.regular,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});
