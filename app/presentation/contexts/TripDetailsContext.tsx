// app/presentation/contexts/TripDetailsContext.tsx
import { Country } from "@/app/core/domain/entities/Country";
import React, { createContext, ReactNode, useContext, useReducer } from "react";

// Types
export type TripType = "Single Trip" | "Multi Trip" | "Student" | "Special";
export type TripDuration = "180" | "365";

export interface Destination extends Country {}

export interface TripDetails {
  // Trip Configuration
  tripType: TripType;
  region: string;
  destination: Destination | null;

  // Duration Settings
  tripDuration: TripDuration;
  startDate: string;
  endDate: string;
  tripDays: number;

  // Travellers
  numberOfTravellers: number;

  // Additional Info
  totalTripCost?: number;
  hasPaidActivities?: boolean;
  hasPrePaidAccommodation?: boolean;
}

export interface TripDetailsState {
  tripDetails: TripDetails;
  isLoading: boolean;
  error: string | null;

  // Validation states
  validationErrors: {
    destination?: string;
    startDate?: string;
    endDate?: string;
    numberOfTravellers?: string;
  };

  // UI states
  isValid: boolean;
  canProceed: boolean;
}

// Actions
type TripDetailsAction =
  | { type: "SET_TRIP_TYPE"; payload: TripType }
  | { type: "SET_REGION"; payload: string }
  | { type: "SET_DESTINATION"; payload: Destination | null }
  | { type: "SET_TRIP_DURATION"; payload: TripDuration }
  | { type: "SET_START_DATE"; payload: string }
  | { type: "SET_END_DATE"; payload: string }
  | { type: "SET_TRIP_DAYS"; payload: number }
  | { type: "SET_NUMBER_OF_TRAVELLERS"; payload: number }
  | {
      type: "SET_ADDITIONAL_INFO";
      payload: Partial<
        Pick<
          TripDetails,
          "totalTripCost" | "hasPaidActivities" | "hasPrePaidAccommodation"
        >
      >;
    }
  | { type: "UPDATE_MULTIPLE_FIELDS"; payload: Partial<TripDetails> }
  | { type: "CALCULATE_TRIP_DAYS" }
  | { type: "VALIDATE_FORM" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET_FORM" };

// Initial state
const initialTripDetails: TripDetails = {
  tripType: "Single Trip",
  region: "",
  destination: null,
  tripDuration: "180",
  startDate: "",
  endDate: "",
  tripDays: 1,
  numberOfTravellers: 1,
};

const initialState: TripDetailsState = {
  tripDetails: initialTripDetails,
  isLoading: false,
  error: null,
  validationErrors: {},
  isValid: false,
  canProceed: false,
};

// Validation helper
const validateTripDetails = (tripDetails: TripDetails) => {
  const errors: TripDetailsState["validationErrors"] = {};

  if (!tripDetails.destination) {
    errors.destination = "Please select a destination";
  }

  if (!tripDetails.startDate) {
    errors.startDate = "Please select a start date";
  }

  if (!tripDetails.endDate) {
    errors.endDate = "Please select an end date";
  }

  if (tripDetails.startDate && tripDetails.endDate) {
    const start = new Date(tripDetails.startDate);
    const end = new Date(tripDetails.endDate);

    if (end <= start) {
      errors.endDate = "End date must be after start date";
    }
  }

  if (tripDetails.numberOfTravellers < 1) {
    errors.numberOfTravellers = "At least one traveller is required";
  }

  return errors;
};

// Calculate trip days helper
const calculateTripDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 1;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // If you want it to match the new logic:
  return Math.max(1, diffDays+1); // This would be the gap between dates
};

// Reducer
const tripDetailsReducer = (
  state: TripDetailsState,
  action: TripDetailsAction
): TripDetailsState => {
  switch (action.type) {
    case "SET_TRIP_TYPE":
      return {
        ...state,
        tripDetails: {
          ...state.tripDetails,
          tripType: action.payload,
        },
      };

    case "SET_REGION":
      return {
        ...state,
        tripDetails: {
          ...state.tripDetails,
          region: action.payload,
        },
      };

    case "SET_DESTINATION":
      return {
        ...state,
        tripDetails: {
          ...state.tripDetails,
          destination: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          destination: undefined,
        },
      };

    case "SET_TRIP_DURATION":
      return {
        ...state,
        tripDetails: {
          ...state.tripDetails,
          tripDuration: action.payload,
        },
      };

    case "SET_START_DATE": {
      const newTripDetails = {
        ...state.tripDetails,
        startDate: action.payload,
      };

      // Auto-calculate trip days if end date exists
      if (newTripDetails.endDate) {
        newTripDetails.tripDays = calculateTripDays(
          action.payload,
          newTripDetails.endDate
        );
      }

      return {
        ...state,
        tripDetails: newTripDetails,
        validationErrors: {
          ...state.validationErrors,
          startDate: undefined,
        },
      };
    }

    case "SET_END_DATE": {
      const newTripDetails = {
        ...state.tripDetails,
        endDate: action.payload,
      };

      // Auto-calculate trip days if start date exists
      if (newTripDetails.startDate) {
        newTripDetails.tripDays = calculateTripDays(
          newTripDetails.startDate,
          action.payload
        );
      }

      return {
        ...state,
        tripDetails: newTripDetails,
        validationErrors: {
          ...state.validationErrors,
          endDate: undefined,
        },
      };
    }

    case "SET_TRIP_DAYS": {
      const newTripDays = Math.max(1, action.payload);
      const newTripDetails = {
        ...state.tripDetails,
        tripDays: newTripDays,
      };

      // Auto-calculate end date if start date exists
      if (newTripDetails.startDate) {
        const startDate = new Date(newTripDetails.startDate);

        // Calculate end date: start date + (trip days - 1)
        // -1 because if it's a 1-day trip, start and end dates should be the same
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + newTripDays - 1);

        // Format as YYYY-MM-DD for consistency
        newTripDetails.endDate = endDate.toISOString().split("T")[0];
      }

      return {
        ...state,
        tripDetails: newTripDetails,
        validationErrors: {
          ...state.validationErrors,
          endDate: undefined, // Clear any existing end date validation errors
        },
      };
    }

    case "SET_NUMBER_OF_TRAVELLERS":
      return {
        ...state,
        tripDetails: {
          ...state.tripDetails,
          numberOfTravellers: Math.max(1, action.payload),
        },
        validationErrors: {
          ...state.validationErrors,
          numberOfTravellers: undefined,
        },
      };

    case "SET_ADDITIONAL_INFO":
      return {
        ...state,
        tripDetails: {
          ...state.tripDetails,
          ...action.payload,
        },
      };

    case "UPDATE_MULTIPLE_FIELDS":
      return {
        ...state,
        tripDetails: {
          ...state.tripDetails,
          ...action.payload,
        },
      };

    case "CALCULATE_TRIP_DAYS": {
      const { startDate, endDate } = state.tripDetails;
      const tripDays = calculateTripDays(startDate, endDate);

      return {
        ...state,
        tripDetails: {
          ...state.tripDetails,
          tripDays,
        },
      };
    }

    case "VALIDATE_FORM": {
      const validationErrors = validateTripDetails(state.tripDetails);
      const isValid = Object.keys(validationErrors).length === 0;

      return {
        ...state,
        validationErrors,
        isValid,
        canProceed: isValid,
      };
    }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "RESET_FORM":
      return {
        ...initialState,
        tripDetails: { ...initialTripDetails },
      };

    default:
      return state;
  }
};

// Context
interface TripDetailsContextType extends TripDetailsState {
  // Actions
  setTripType: (tripType: TripType) => void;
  setRegion: (region: string) => void;
  setDestination: (destination: Destination | null) => void;
  setTripDuration: (duration: TripDuration) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setTripDays: (days: number) => void;
  setNumberOfTravellers: (count: number) => void;
  setAdditionalInfo: (
    info: Partial<
      Pick<
        TripDetails,
        "totalTripCost" | "hasPaidActivities" | "hasPrePaidAccommodation"
      >
    >
  ) => void;
  updateMultipleFields: (fields: Partial<TripDetails>) => void;

  // Utilities
  calculateTripDays: () => void;
  validateForm: () => boolean;
  resetForm: () => void;

  // State management
  setError: (error: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;

  // Computed properties
  getFormattedDuration: () => string;
  getTripSummary: () => string;
  isMinimumRequirementsMet: () => boolean;
}

const TripDetailsContext = createContext<TripDetailsContextType | undefined>(
  undefined
);

// Provider
interface TripDetailsProviderProps {
  children: ReactNode;
  initialData?: Partial<TripDetails>;
}

export const TripDetailsProvider: React.FC<TripDetailsProviderProps> = ({
  children,
  initialData,
}) => {
  const [state, dispatch] = useReducer(tripDetailsReducer, {
    ...initialState,
    tripDetails: {
      ...initialState.tripDetails,
      ...initialData,
    },
  });

  // Actions
  const setTripType = (tripType: TripType) => {
    dispatch({ type: "SET_TRIP_TYPE", payload: tripType });
  };

  const setRegion = (region: string) => {
    dispatch({ type: "SET_REGION", payload: region });
  };

  const setDestination = (destination: Destination | null) => {
    dispatch({ type: "SET_DESTINATION", payload: destination });
  };

  const setTripDuration = (duration: TripDuration) => {
    dispatch({ type: "SET_TRIP_DURATION", payload: duration });
  };

  const setStartDate = (date: string) => {
    dispatch({ type: "SET_START_DATE", payload: date });
  };

  const setEndDate = (date: string) => {
    dispatch({ type: "SET_END_DATE", payload: date });
  };

  const setTripDays = (days: number) => {
    dispatch({ type: "SET_TRIP_DAYS", payload: days });
  };

  const setNumberOfTravellers = (count: number) => {
    dispatch({ type: "SET_NUMBER_OF_TRAVELLERS", payload: count });
  };

  const setAdditionalInfo = (
    info: Partial<
      Pick<
        TripDetails,
        "totalTripCost" | "hasPaidActivities" | "hasPrePaidAccommodation"
      >
    >
  ) => {
    dispatch({ type: "SET_ADDITIONAL_INFO", payload: info });
  };

  const updateMultipleFields = (fields: Partial<TripDetails>) => {
    dispatch({ type: "UPDATE_MULTIPLE_FIELDS", payload: fields });
  };

  // Utilities
  const calculateTripDaysAction = () => {
    dispatch({ type: "CALCULATE_TRIP_DAYS" });
  };

  const validateForm = (): boolean => {
    dispatch({ type: "VALIDATE_FORM" });
    const errors = validateTripDetails(state.tripDetails);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  // State management
  const setError = (error: string) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  // Computed properties
  const getFormattedDuration = (): string => {
    const { startDate, endDate, tripDays } = state.tripDetails;

    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();
      return `${start} - ${end} (${tripDays} days)`;
    }

    return `${tripDays} day${tripDays !== 1 ? "s" : ""}`;
  };

  const getTripSummary = (): string => {
    const { destination, numberOfTravellers, tripDays } = state.tripDetails;

    const parts = [];

    if (destination) {
      parts.push(destination.countryName);
    }

    if (numberOfTravellers > 1) {
      parts.push(`${numberOfTravellers} travellers`);
    }

    parts.push(`${tripDays} day${tripDays !== 1 ? "s" : ""}`);

    return parts.join(" • ");
  };

  const isMinimumRequirementsMet = (): boolean => {
    const { destination, startDate, endDate } = state.tripDetails;
    return !!(destination && startDate && endDate);
  };

  const contextValue: TripDetailsContextType = {
    ...state,

    // Actions
    setTripType,
    setRegion,
    setDestination,
    setTripDuration,
    setStartDate,
    setEndDate,
    setTripDays,
    setNumberOfTravellers,
    setAdditionalInfo,
    updateMultipleFields,

    // Utilities
    calculateTripDays: calculateTripDaysAction,
    validateForm,
    resetForm,

    // State management
    setError,
    clearError,
    setLoading,

    // Computed properties
    getFormattedDuration,
    getTripSummary,
    isMinimumRequirementsMet,
  };

  return (
    <TripDetailsContext.Provider value={contextValue}>
      {children}
    </TripDetailsContext.Provider>
  );
};

// Hook
export const useTripDetails = (): TripDetailsContextType => {
  const context = useContext(TripDetailsContext);
  if (context === undefined) {
    throw new Error("useTripDetails must be used within a TripDetailsProvider");
  }
  return context;
};

// Export types for use in other components
export type { TripDetailsContextType };
