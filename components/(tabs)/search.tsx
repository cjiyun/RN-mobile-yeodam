import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Category, mockCategories, mockDestinations } from '../../constants/mockData';
import { destination } from '../../types/typeInterfaces';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/Header';
import { commonStyles } from '../../styles/commonStyles';
import { typography } from '../../styles/typography';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [isCategoryPopupVisible, setIsCategoryPopupVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<destination[]>([]);

  const handleKeywordRemove = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter(item => item !== keyword));
  };

  const handleKeywordSelect = (keyword: string) => {
    setSelectedKeywords(prev => {
      // 이미 선택된 키워드인 경우 제거
      if (prev.includes(keyword)) {
        return prev.filter(k => k !== keyword);
      }
      // 선택되지 않은 키워드인 경우 추가
      return [...prev, keyword];
    });
  };

  const handleSearch = () => {
    const results = mockDestinations.filter(destination => {
      // 검색어 조건: dest_name 또는 location에 검색어 포함
      const matchesSearchInput = searchInput ? (
        destination.dest_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        destination.location?.toLowerCase().includes(searchInput.toLowerCase())
      ) : true;

      // 선택된 키워드 조건: 모든 선택된 키워드를 포함
      const matchesKeywords = selectedKeywords.length > 0 ? 
        selectedKeywords.every(keyword => 
          destination.keywords?.includes(keyword)
        ) : true;

      return matchesSearchInput && matchesKeywords;
    });

    setSearchResults(results);
  };

  // 검색 결과 렌더링
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <Text style={styles.noResults}>검색 결과가 없습니다.</Text>
      );
    }

    return (
      <ScrollView style={styles.searchResults}>
        {searchResults.map(destination => (
          <TouchableOpacity 
            key={destination.dest_id}
            style={styles.resultItem}
            onPress={() => navigation.navigate('destination', { 
              dest_id: destination.dest_id
            })}
          >
            <Image 
              source={destination.image[0]} 
              style={styles.resultImage}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>{destination.dest_name}</Text>
              <Text style={styles.resultLocation}>{destination.location}</Text>
              <View style={styles.resultKeywords}>
                {destination.keywords?.map(keyword => (
                  <Text key={keyword} style={styles.resultKeyword}>
                    #{keyword}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={commonStyles.container}>
      <StatusBar style="dark" />
      <Header />
      <View style={styles.content}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="관광지명 또는 지역명을 검색하세요"
            value={searchInput}
            onChangeText={setSearchInput}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <AntDesign name="search1" size={24} color="#145C80" />
          </TouchableOpacity>
        </View>

        <View style={styles.keywordsSearch}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedKeywords}>
            {selectedKeywords.map((keyword) => (
              <TouchableOpacity
                key={keyword}
                style={styles.selectedKeyword}
                onPress={() => handleKeywordRemove(keyword)}
              >
                <Text style={styles.keywordText}>#{keyword}</Text>
                <AntDesign name="close" size={8} color="white" />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.keywordSearchButton}
            onPress={() => setIsCategoryPopupVisible(true)}
          >
            <Text style={styles.buttonText}>키워드로 검색</Text>
          </TouchableOpacity>
        </View>
        
        {isCategoryPopupVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isCategoryPopupVisible}
            onRequestClose={() => setIsCategoryPopupVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setIsCategoryPopupVisible(false)}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>키워드 선택</Text>
                  <TouchableOpacity
                    onPress={() => setIsCategoryPopupVisible(false)}
                    style={styles.closeButton}
                  >
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.categoryList}>
                  {categories
                    .filter((item, index, self) => 
                      index === self.findIndex((t) => t.category_id === item.category_id)
                    )
                    .map((category) => {
                      return (
                        <View key={category.category_id} style={styles.category}>
                          <Text style={styles.categoryTitle}>{category.category_name}</Text>
                          <View style={styles.keywordGrid}>
                            {categories
                              .filter(k => k.category_id === category.category_id)
                              .map((keyword) => {
                                return (
                                  <TouchableOpacity
                                    key={keyword.keyword_id}
                                    style={[
                                      styles.keywordButton,
                                      selectedKeywords.includes(keyword.keyword_name) && styles.keywordButtonSelected
                                    ]}
                                    onPress={() => handleKeywordSelect(keyword.keyword_name)}
                                  >
                                    <Text style={[
                                      styles.keywordButtonText,
                                      selectedKeywords.includes(keyword.keyword_name) && styles.keywordButtonTextSelected
                                    ]}>
                                      #{keyword.keyword_name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                          </View>
                        </View>
                      );
                    })}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
        {renderSearchResults()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10,
  },
  searchBar: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
  },
  searchInput: {
    ...typography.light,
    textAlign: 'center',
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  keywordsSearch: {
    marginBottom: 16,
  },
  selectedKeywords: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  selectedKeyword: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#145C80',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  keywordText: {
    ...typography.regular,
    color: '#fff',
    marginRight: 4,
  },
  removeButton: {
    color: '#fff',
    fontSize: 12,
  },
  keywordSearchButton: {
    backgroundColor: '#145C80',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.regular,
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    ...typography.bold,
    fontSize: 18,
  },
  closeButton: {
    padding: 4,
  },
  categoryList: {
    flex: 1,
    margin: 16,
  },
  category: {
    marginBottom: 24,
  },
  categoryTitle: {
    ...typography.bold,
    fontSize: 20,
    marginBottom: 12,
    marginLeft: 4,
    color: '#333',
  },
  keywordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    gap: 5,
  },
  keywordButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'white',
    margin: 4,
  },
  keywordButtonSelected: {
    backgroundColor: '#145C80',
    borderColor: '#145C80',
  },
  keywordButtonText: {
    ...typography.regular,
    fontSize: 14,
    color: '#666',
  },
  keywordButtonTextSelected: {
    ...typography.regular,
    color: '#fff',
  },
  noResults: {
    ...typography.regular,
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
  },
  resultItem: {
    flexDirection: 'row',
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchResults: {
      marginTop: 16,
  },
  resultImage: {
    width: 100,
    height: 100,
  },
  resultInfo: {
    flex: 1,
    padding: 12,
  },
  resultTitle: {
    ...typography.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  resultLocation: {
    ...typography.regular,
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  resultKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resultKeyword: {
    ...typography.regular,
    fontSize: 12,
    color: '#145C80',
    marginRight: 8,
  },
});