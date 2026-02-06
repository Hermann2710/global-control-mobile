import { PhotoPageView } from "@/components/main/(identification)/photo-page-view";
import { useUpload } from "@/contexts/upload-context";
import { useLocalSearchParams, useRouter } from "expo-router";

const PhotoScreen = () => {
  const router = useRouter();
  const { isUploading, addToQueue } = useUpload();
  const { numeroLot, produitType, operation } = useLocalSearchParams<{
    numeroLot: string,
    produitType: string,
    operation: string
  }>();

  const handleFormSubmit = async (images: string[], pvNumber?: string) => {
    const formDataFields = {
      numeroLot: numeroLot,
      productType: produitType,
      operation: operation,
      date: new Date().toISOString(),
      data: {
        numeroPv: pvNumber || null,
        timestamp: new Date().toISOString(),
        description: `Photo capture for ${operation}`
      }
    };

    try {
      await addToQueue(images, "/draft-mobile/upload", formDataFields);
      router.back();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <PhotoPageView
      operation={operation || ""}
      produitType={produitType || ""}
      numeroLot={numeroLot || ""}
      isUploading={isUploading}
      onSubmit={handleFormSubmit}
    />
  );
};

export default PhotoScreen;