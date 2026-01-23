import { PhotoPageView } from "@/components/main/(identification)/photo-page-view";
import { useUpload } from "@/contexts/upload-context";
import { useLocalSearchParams, useRouter } from "expo-router";

const PhotoScreen = () => {
  const router = useRouter();
  const { isUploading, ajouterALaQueue } = useUpload();
  const { numeroLot, produitType, operation } = useLocalSearchParams<{
    numeroLot: string,
    produitType: string,
    operation: string
  }>();

  const handleFormSubmit = async (images: string[]) => {
    const formDataFields = {
      numeroLot,
      produitType,
      operation,
      timestamp: new Date().toISOString()
    };

    try {
      await ajouterALaQueue(images, "/images/upload", formDataFields);
      router.back();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
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