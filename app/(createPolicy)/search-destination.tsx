// app/(createPolicy)/search-destination.tsx
import { SearchDestinationScreen } from '@/app/presentation/screens/createPolicy/SearchDestinationScreen';
import { useLocalSearchParams } from 'expo-router';

export default function SearchDestinationPage() {
  const params = useLocalSearchParams();


  return (
    <SearchDestinationScreen 
      countryRegion={params.countryRegion as string}
    />
  );
}