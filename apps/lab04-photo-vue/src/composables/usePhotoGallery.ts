import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const usePhotoGallery = () => {
  const photos = ref<UserPhoto[]>([]);

  const addNewToGallery = async () => {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = Date.now() + '.jpeg';
    const savedImageFile = {
      filepath: fileName,
      webviewPath: capturedPhoto.webPath,
    };

    photos.value = [savedImageFile, ...photos.value];
  };

  return {
    addNewToGallery,
    photos,
  };
};

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}