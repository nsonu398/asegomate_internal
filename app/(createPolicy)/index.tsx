// app/auth/login.tsx

import { TripDetailsProvider } from "../presentation/contexts/TripDetailsContext";
import { TripDetailsScreen } from "../presentation/screens/createPolicy/TripDetailsScreen";

export default function TripDetails() {
  return (
    <TripDetailsProvider>
      <TripDetailsScreen />
    </TripDetailsProvider>
  );
}
