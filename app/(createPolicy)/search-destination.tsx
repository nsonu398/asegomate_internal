// app/(createPolicy)/search-destination.tsx
import { SearchDestinationScreen } from '@/app/presentation/screens/createPolicy/SearchDestinationScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SearchDestinationPage() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const handleDestinationSelect = (destination: any) => {
    // Navigate back with the selected destination
    router.back();
    router.setParams({ selectedDestination: destination.name });
  };

  return (
    <SearchDestinationScreen 
      selectedDestination={params.selectedDestination as string}
      onDestinationSelect={handleDestinationSelect}
    />
  );
}