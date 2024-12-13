import { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, ImageSourcePropType } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { mockDestinations } from '../../constants/mockData';
import { typography } from '../../styles/typography';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

export default function DestinationScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'destination'>>();
  const { dest_id } = route.params;
  const destination = mockDestinations.find(d => d.dest_id === dest_id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // 제목 설정
  useEffect(() => {
    if (destination) {
      navigation.setOptions({ title: destination.dest_name });
    }
  }, [destination]);

  // 3초마다 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % destination!.image.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentImageIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentImageIndex]);

  if (!destination) {
    return (
      <View style={styles.container}>
        <Text>관광지를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 이미지 슬라이더 */}
      <View style={styles.header}>
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
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(newIndex);
          }}
        >
          {destination.image.map((image: ImageSourcePropType, index: number) => (
            <Image
              key={index}
              source={image}
              style={[styles.headerImage, { width }]}
            />
          ))}
        </ScrollView>

        {/* 페이지 인디케이터 */}
        <View style={styles.pagination}>
          <Text style={styles.paginationText}>
            {currentImageIndex + 1} / {destination.image.length}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* 나머지 콘텐츠는 그대로 유지 */}
      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{destination.dest_name}</Text>
          <Text style={styles.location}>{destination.location}</Text>
        </View>

        {/* 키워드 태그 */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
        >
          {destination.keywords?.map((keyword, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{keyword}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 주소 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주소</Text>
          <Text style={styles.address}>{destination.address}</Text>
        </View>

        {/* 상세 설명 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상세 정보</Text>
          <Text style={styles.description}>{destination.description}</Text>
        </View>

        {/* 추천 관광지 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추천 관광지</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.recommendationsContainer}
          >
            {mockDestinations
              .filter(d => d.dest_id !== destination.dest_id)
              .slice(0, 5)
              .map(d => (
                <TouchableOpacity 
                  key={d.dest_id}
                  style={styles.recommendationCard}
                  onPress={() => navigation.navigate('destination', { dest_id: d.dest_id })}
                >
                  <Image source={d.image[0]} style={styles.recommendationImage} />
                  <Text style={styles.recommendationTitle}>{d.dest_name}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 300,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    ...typography.bold,
    fontSize: 24,
    marginBottom: 4,
  },
  location: {
    ...typography.regular,
    fontSize: 16,
    color: '#666',
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#145C80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  tagText: {
    ...typography.regular,
    color: 'white',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  address: {
    ...typography.regular,
    fontSize: 16,
    color: '#333',
  },
  description: {
    ...typography.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  recommendationsContainer: {
    marginTop: 8,
  },
  recommendationCard: {
    width: width * 0.6,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  recommendationTitle: {
    ...typography.bold,
    fontSize: 16,
    padding: 8,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 12,
  },
  paginationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
