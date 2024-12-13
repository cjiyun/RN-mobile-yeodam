import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import handleSocialLogin from '../auth/logins/socialAuth';

export default function SettingsScreen({setIsLoggedIn}: {setIsLoggedIn: (isLoggedIn: boolean) => void}) {
  const [nickname, setNickname] = useState('현재 닉네임');
  const [profileImage, setProfileImage] = useState('현재 프로필 이미지 URL');

  const uploadImage = async (imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await axios.post('/api/users/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`
        }
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Image Upload Error:', error);
      return null;
    }
  };

  const updateProfile = async (nickname: string, imageUrl: string) => {
    try {
      await axios.patch('/api/users/profile', 
        { nickname, profile_image: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Profile Update Error:', error);
      return false;
    }
  };

  const withdrawUser = async () => {
    try {
      await axios.delete('/api/users/withdraw', {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`
        }
      });
      return true;
    } catch (error) {
      console.error('API Error:', error);
      return false;
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = await uploadImage(result.assets[0].uri);
      if (imageUrl) {
        setProfileImage(imageUrl);
      }
    }
  };

  const handleSaveProfile = async () => {
    const success = await updateProfile(nickname, profileImage);
    if (success) {
      Alert.alert('알림', '프로필이 업데이트되었습니다.');
    } else {
      Alert.alert('오류', '프로필 업데이트에 실패했습니다.');
    }
  };

  const handleWithdraw = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말로 탈퇴하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              const isDeleted = await withdrawUser();
              if (isDeleted) {
                await handleSocialLogin.kakaoUnlink();
                await AsyncStorage.clear();
                setIsLoggedIn(false);
              }
            } catch (error) {
              console.error('Withdraw error:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
        <Image 
          source={{ uri: profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.changeImageText}>사진 변경</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
          placeholder="닉네임을 입력하세요"
        />
      </View>

      <TouchableOpacity 
        onPress={handleSaveProfile}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleWithdraw}
        style={styles.withdrawButton}
      >
        <Text style={styles.withdrawButtonText}>회원 탈퇴</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changeImageText: {
    color: '#007AFF',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  withdrawButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  withdrawButtonText: {
    color: '#FF3B30',
    fontSize: 16,
  },
});