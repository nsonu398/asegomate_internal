// src/presentation/navigation/NavigationTypes.ts
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { token: string };
  };
  
  export type HomeTabParamList = {
    Home: undefined;
    Trips: undefined;
    Policies: undefined;
    Claims: undefined;
    Profile: undefined;
  };
  
  export type TripStackParamList = {
    TripsList: undefined;
    TripDetail: { id: string };
    CreateTrip: undefined;
    EditTrip: { id: string };
  };
  
  export type PolicyStackParamList = {
    PoliciesList: undefined;
    PolicyDetail: { id: string };
    CoverageSelection: { tripId: string };
    CreatePolicy: { tripId: string; coverageType?: string };
  };
  
  export type ClaimStackParamList = {
    ClaimsList: undefined;
    ClaimDetail: { id: string };
    CreateClaim: { policyId: string };
    EditClaim: { id: string };
    DocumentUpload: { id: string };
  };
  
  export type ProfileStackParamList = {
    ProfileOverview: undefined;
    EditProfile: undefined;
    Settings: undefined;
    ChangePassword: undefined;
    NotificationSettings: undefined;
  };