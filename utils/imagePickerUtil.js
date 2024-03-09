// Library imports
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';


// Local imports
import { getFirebase } from './FirebaseIntegration';

// Launch the image picker
export const launchPicker = async () => {
  await checkPermissions();
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!res.canceled) {
    return res.assets[0].uri;
  }
}

// Upload the image to Firebase
export const uploadImg = async (uri, imageName) => {
  const app = getFirebase();
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (error) {
      console.log(error);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const folderPath = 'profileImages/';
  const storageRef = ref(getStorage(app), folderPath + '/' + uuid.v4());

  await uploadBytesResumable(storageRef, blob); // Can cause crash. Known issue with Firebase SDK
  blob.close();

  return await getDownloadURL(storageRef);
}

// Check permissions for camera roll access
const checkPermissions = async () => {
  if (Platform.OS !== 'web') {
    const { status }  = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Promise.reject('Sorry, we need camera roll permissions to make this work!');
    }
  }
  return Promise.resolve();
}