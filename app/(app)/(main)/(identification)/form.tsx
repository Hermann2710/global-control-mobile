import CacaoForm from '@/components/main/(identification)/cacao-form';
import CafeForm from '@/components/main/(identification)/cafe-form';
import BackButton from '@/components/shared/back-button';
import { DismissKeyboard } from '@/components/shared/dismiss-keyboard';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function FormScreen() {
  const { numeroLot, produitType, operation } = useLocalSearchParams<{
    numeroLot: string,
    produitType: string,
    operation: string
  }>();

  return (
    <DismissKeyboard withSafeArea={false}>
      <View className='flex flex-row justify-between items-center'>
        <BackButton />
        <Text className="text-2xl text-primary font-bold mb-2">
          {operation} du {produitType}
        </Text>
        <Text></Text>
      </View>
      <Text className='text-muted-foreground text-center my-3 text-base'>Veuillez remplir le formulaire suivant</Text>

      {produitType === "cafe" ?
        <CafeForm numeroLot={numeroLot} produitType={produitType} />
        :
        <CacaoForm numeroLot={numeroLot} produitType={produitType} />
      }
    </DismissKeyboard>
  );
}