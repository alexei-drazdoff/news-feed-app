import { ref } from 'vue';

export function useImageDialog() {
  const imageDialog = ref(false);
  const selectedImage = ref('');

  const openImageDialog = (imageUrl: string) => {
    selectedImage.value = imageUrl;
    imageDialog.value = true;
  };

  const closeImageDialog = () => {
    imageDialog.value = false;
  };

  return {
    imageDialog,
    selectedImage,
    openImageDialog,
    closeImageDialog,
  };
}
