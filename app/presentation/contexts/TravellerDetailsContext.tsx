// app/presentation/contexts/TravellerDetailsContext.tsx
import { isDevelopment } from "@/app/constants/environment";
import React, { createContext, ReactNode, useContext, useReducer } from "react";

export interface TravellerDetailsFormValues {
  // Personal Details
  passportNumber: string;
  fullName: string;
  gender: "Male" | "Female" | "Other" | "";
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  country: string;
  emailAddress: string;
  mobileNumber: string;

  // Nominee Details
  nomineeName: string;
  relationshipWithNominee: string;

  // Emergency Contact Details
  emergencyContactName: string;
  emergencyMobileNumber: string;
  emergencyEmailAddress: string;

  // Optional Details
  remark: string;
  crReferenceNumber: string;
  pastIllness: string;
  gstNumber: string;
  gstState: string;
}

export interface TravellerCompletionStatus {
  hasPersonalDetails: boolean;
  hasPolicySelected: boolean;
  hasAddOnsSelected: boolean; // Optional
  isComplete: boolean; // hasPersonalDetails && hasPolicySelected
}

export interface TravellerData {
  formValues: TravellerDetailsFormValues;
  validationErrors: Partial<TravellerDetailsFormValues>;
  completionStatus: TravellerCompletionStatus;
}

export interface TravellerDetailsState {
  travellers: Record<string, TravellerData>; // travellerId -> traveller data
  currentTravellerId: string | null;
  totalTravellers: number;
  isLoading: boolean;
  error: string | null;
  expandedSections: {
    personal: boolean;
    nominee: boolean;
    emergency: boolean;
    optional: boolean;
  };
}

type TravellerDetailsAction =
  | { type: "INITIALIZE_TRAVELLERS"; payload: { count: number } }
  | { type: "SET_CURRENT_TRAVELLER"; payload: string }
  | {
      type: "UPDATE_TRAVELLER_FIELD";
      payload: {
        travellerId: string;
        field: keyof TravellerDetailsFormValues;
        value: string;
      };
    }
  | {
      type: "UPDATE_TRAVELLER_MULTIPLE_FIELDS";
      payload: {
        travellerId: string;
        fields: Partial<TravellerDetailsFormValues>;
      };
    }
  | {
      type: "SET_TRAVELLER_VALIDATION_ERRORS";
      payload: {
        travellerId: string;
        errors: Partial<TravellerDetailsFormValues>;
      };
    }
  | {
      type: "UPDATE_TRAVELLER_COMPLETION_STATUS";
      payload: {
        travellerId: string;
        status: Partial<TravellerCompletionStatus>;
      };
    }
  | {
      type: "TOGGLE_SECTION";
      section: keyof TravellerDetailsState["expandedSections"];
    }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET_ALL_TRAVELLERS" }
  | { type: "RESET_TRAVELLER"; payload: string };

const getInitialFormValues = (): TravellerDetailsFormValues => {
  if (isDevelopment()) {
    return {
      passportNumber: "A1234567",
      fullName: "John Doe",
      gender: "Male",
      dateOfBirth: "1990-01-15",
      addressLine1: "123 Main Street",
      addressLine2: "Apartment 4B",
      pincode: "400001",
      city: "Mumbai",
      district: "Mumbai City",
      state: "Maharashtra",
      country: "India",
      emailAddress: "john.doe@example.com",
      mobileNumber: "9876543210",
      nomineeName: "Jane Doe",
      relationshipWithNominee: "Spouse",
      emergencyContactName: "Emergency Contact",
      emergencyMobileNumber: "9876543211",
      emergencyEmailAddress: "emergency@example.com",
      remark: "Sample remark for testing",
      crReferenceNumber: "CR123456",
      pastIllness: "None",
      gstNumber: "27AAAFG1234L1ZM",
      gstState: "Maharashtra",
    };
  }
  return {
    passportNumber: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    city: "",
    district: "",
    state: "",
    country: "",
    emailAddress: "",
    mobileNumber: "",
    nomineeName: "",
    relationshipWithNominee: "",
    emergencyContactName: "",
    emergencyMobileNumber: "",
    emergencyEmailAddress: "",
    remark: "",
    crReferenceNumber: "",
    pastIllness: "",
    gstNumber: "",
    gstState: "",
  };
};

const getInitialCompletionStatus = (): TravellerCompletionStatus => ({
  hasPersonalDetails: false,
  hasPolicySelected: false,
  hasAddOnsSelected: false,
  isComplete: false,
});

const createTravellerData = (
  customValues?: Partial<TravellerDetailsFormValues>
): TravellerData => ({
  formValues: { ...getInitialFormValues(), ...customValues },
  validationErrors: {},
  completionStatus: getInitialCompletionStatus(),
});

const initialState: TravellerDetailsState = {
  travellers: {},
  currentTravellerId: null,
  totalTravellers: 0,
  isLoading: false,
  error: null,
  expandedSections: {
    personal: true,
    nominee: false,
    emergency: false,
    optional: false,
  },
};

const travellerDetailsReducer = (
  state: TravellerDetailsState,
  action: TravellerDetailsAction
): TravellerDetailsState => {
  switch (action.type) {
    case "INITIALIZE_TRAVELLERS": {
      const travellers: Record<string, TravellerData> = {};

      for (let i = 1; i <= action.payload.count; i++) {
        const travellerId = `traveller_${i}`;
        // For first traveller in development, use demo data
        const customValues =
          isDevelopment() && i === 1 ? getInitialFormValues() : {};
        travellers[travellerId] = createTravellerData(customValues);

        // In development, mark first traveller as having personal details
        if (isDevelopment() && i === 1) {
          travellers[travellerId].completionStatus.hasPersonalDetails = true;
        }
      }

      return {
        ...state,
        travellers,
        totalTravellers: action.payload.count,
        currentTravellerId: `traveller_1`, // Default to first traveller
      };
    }

    case "SET_CURRENT_TRAVELLER":
      return {
        ...state,
        currentTravellerId: action.payload,
      };

    case "UPDATE_TRAVELLER_FIELD": {
      const { travellerId, field, value } = action.payload;
      const traveller = state.travellers[travellerId];

      if (!traveller) return state;

      return {
        ...state,
        travellers: {
          ...state.travellers,
          [travellerId]: {
            ...traveller,
            formValues: {
              ...traveller.formValues,
              [field]: value,
            },
            validationErrors: {
              ...traveller.validationErrors,
              [field]: undefined,
            },
          },
        },
      };
    }

    case "UPDATE_TRAVELLER_MULTIPLE_FIELDS": {
      const { travellerId, fields } = action.payload;
      const traveller = state.travellers[travellerId];

      if (!traveller) return state;

      return {
        ...state,
        travellers: {
          ...state.travellers,
          [travellerId]: {
            ...traveller,
            formValues: {
              ...traveller.formValues,
              ...fields,
            },
          },
        },
      };
    }

    case "SET_TRAVELLER_VALIDATION_ERRORS": {
      const { travellerId, errors } = action.payload;
      const traveller = state.travellers[travellerId];

      if (!traveller) return state;

      return {
        ...state,
        travellers: {
          ...state.travellers,
          [travellerId]: {
            ...traveller,
            validationErrors: errors,
          },
        },
      };
    }

    case "UPDATE_TRAVELLER_COMPLETION_STATUS": {
      const { travellerId, status } = action.payload;
      const traveller = state.travellers[travellerId];

      if (!traveller) return state;

      const newStatus = { ...traveller.completionStatus, ...status };
      // Auto-calculate isComplete - only requires personal details and policy selection
      // Add-ons are optional, so they don't affect completion status
      newStatus.isComplete =
        newStatus.hasPersonalDetails && newStatus.hasPolicySelected;

      return {
        ...state,
        travellers: {
          ...state.travellers,
          [travellerId]: {
            ...traveller,
            completionStatus: newStatus,
          },
        },
      };
    }

    case "TOGGLE_SECTION":
      return {
        ...state,
        expandedSections: {
          ...state.expandedSections,
          [action.section]: !state.expandedSections[action.section],
        },
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.loading,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };

    case "RESET_ALL_TRAVELLERS":
      return {
        ...initialState,
      };

    case "RESET_TRAVELLER": {
      const travellerId = action.payload;
      const traveller = state.travellers[travellerId];

      if (!traveller) return state;

      return {
        ...state,
        travellers: {
          ...state.travellers,
          [travellerId]: createTravellerData(),
        },
      };
    }

    default:
      return state;
  }
};

interface TravellerDetailsContextType extends TravellerDetailsState {
  // Traveller Management
  initializeTravellers: (count: number) => void;
  setCurrentTraveller: (travellerId: string) => void;
  getCurrentTravellerData: () => TravellerData | null;

  // Field Updates
  updateTravellerField: (
    travellerId: string,
    field: keyof TravellerDetailsFormValues,
    value: string
  ) => void;
  updateCurrentTravellerField: (
    field: keyof TravellerDetailsFormValues,
    value: string
  ) => void;
  updateTravellerMultipleFields: (
    travellerId: string,
    fields: Partial<TravellerDetailsFormValues>
  ) => void;

  // Validation
  setTravellerValidationErrors: (
    travellerId: string,
    errors: Partial<TravellerDetailsFormValues>
  ) => void;
  validateTravellerForm: (travellerId: string) => boolean;
  validateCurrentTravellerForm: () => boolean;

  // Completion Status
  updateTravellerCompletionStatus: (
    travellerId: string,
    status: Partial<TravellerCompletionStatus>
  ) => void;
  markTravellerPersonalDetailsComplete: (travellerId: string) => void;
  markTravellerPolicySelected: (travellerId: string) => void;
  markTravellerAddOnsSelected: (travellerId: string) => void;

  // Navigation Helpers
  getNextIncompleteTraveller: () => string | null;
  getAllIncompleteTravellerIds: () => string[];
  areAllTravellersComplete: () => boolean;
  getTravellerCompletionSummary: () => { completed: number; total: number };

  // Section Management
  toggleSection: (
    section: keyof TravellerDetailsState["expandedSections"]
  ) => void;

  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetAllTravellers: () => void;
  resetTraveller: (travellerId: string) => void;
}

const TravellerDetailsContext = createContext<
  TravellerDetailsContextType | undefined
>(undefined);

export const TravellerDetailsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(travellerDetailsReducer, initialState);

  // Traveller Management
  const initializeTravellers = (count: number) => {
    dispatch({ type: "INITIALIZE_TRAVELLERS", payload: { count } });
  };

  const setCurrentTraveller = (travellerId: string) => {
    dispatch({ type: "SET_CURRENT_TRAVELLER", payload: travellerId });
  };

  const getCurrentTravellerData = (): TravellerData | null => {
    if (!state.currentTravellerId) return null;
    return state.travellers[state.currentTravellerId] || null;
  };

  // Field Updates
  const updateTravellerField = (
    travellerId: string,
    field: keyof TravellerDetailsFormValues,
    value: string
  ) => {
    dispatch({
      type: "UPDATE_TRAVELLER_FIELD",
      payload: { travellerId, field, value },
    });
  };

  const updateCurrentTravellerField = (
    field: keyof TravellerDetailsFormValues,
    value: string
  ) => {
    if (state.currentTravellerId) {
      updateTravellerField(state.currentTravellerId, field, value);
    }
  };

  const updateTravellerMultipleFields = (
    travellerId: string,
    fields: Partial<TravellerDetailsFormValues>
  ) => {
    dispatch({
      type: "UPDATE_TRAVELLER_MULTIPLE_FIELDS",
      payload: { travellerId, fields },
    });
  };

  // Validation
  const validateTravellerFormFields = (
    formValues: TravellerDetailsFormValues
  ) => {
    const errors: Partial<TravellerDetailsFormValues> = {};

    // Required field validations
    if (!formValues.passportNumber.trim())
      errors.passportNumber = "Passport number is required";
    if (!formValues.fullName.trim()) errors.fullName = "Full name is required";
    if (!formValues.gender) (errors as any).gender = "Gender is required";
    if (!formValues.dateOfBirth)
      errors.dateOfBirth = "Date of birth is required";
    if (!formValues.addressLine1.trim())
      errors.addressLine1 = "Address is required";
    if (!formValues.pincode.trim()) errors.pincode = "Pincode is required";
    if (!formValues.city.trim()) errors.city = "City is required";
    if (!formValues.district.trim()) errors.district = "District is required";
    if (!formValues.state) errors.state = "State is required";
    if (!formValues.country) errors.country = "Country is required";
    if (!formValues.nomineeName.trim())
      errors.nomineeName = "Nominee name is required";
    if (!formValues.relationshipWithNominee)
      errors.relationshipWithNominee = "Relationship is required";
    if (!formValues.emergencyContactName.trim())
      errors.emergencyContactName = "Emergency contact name is required";

    // Email validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.emailAddress.trim()) {
      errors.emailAddress = "Email is required";
    } else if (!emailRegex.test(formValues.emailAddress)) {
      errors.emailAddress = "Please enter a valid email";
    }

    if (!formValues.emergencyEmailAddress.trim()) {
      errors.emergencyEmailAddress = "Emergency email is required";
    } else if (!emailRegex.test(formValues.emergencyEmailAddress)) {
      errors.emergencyEmailAddress = "Please enter a valid email";
    }

    // Mobile number validations
    if (!formValues.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
    } else if (formValues.mobileNumber.length < 10) {
      errors.mobileNumber = "Please enter a valid mobile number";
    }

    if (!formValues.emergencyMobileNumber.trim()) {
      errors.emergencyMobileNumber = "Emergency mobile number is required";
    } else if (formValues.emergencyMobileNumber.length < 10) {
      errors.emergencyMobileNumber = "Please enter a valid mobile number";
    }

    return errors;
  };

  const setTravellerValidationErrors = (
    travellerId: string,
    errors: Partial<TravellerDetailsFormValues>
  ) => {
    dispatch({
      type: "SET_TRAVELLER_VALIDATION_ERRORS",
      payload: { travellerId, errors },
    });
  };

  const validateTravellerForm = (travellerId: string): boolean => {
    const traveller = state.travellers[travellerId];
    if (!traveller) return false;

    const errors = validateTravellerFormFields(traveller.formValues);
    setTravellerValidationErrors(travellerId, errors);
    return Object.keys(errors).length === 0;
  };

  const validateCurrentTravellerForm = (): boolean => {
    if (!state.currentTravellerId) return false;
    return validateTravellerForm(state.currentTravellerId);
  };

  // Completion Status
  const updateTravellerCompletionStatus = (
    travellerId: string,
    status: Partial<TravellerCompletionStatus>
  ) => {
    dispatch({
      type: "UPDATE_TRAVELLER_COMPLETION_STATUS",
      payload: { travellerId, status },
    });
  };

  const markTravellerPersonalDetailsComplete = (travellerId: string) => {
    updateTravellerCompletionStatus(travellerId, { hasPersonalDetails: true });
  };

  const markTravellerPolicySelected = (travellerId: string) => {
    updateTravellerCompletionStatus(travellerId, { hasPolicySelected: true });
  };

  const markTravellerAddOnsSelected = (travellerId: string) => {
    updateTravellerCompletionStatus(travellerId, { hasAddOnsSelected: true });
  };

  // Navigation Helpers
  const getNextIncompleteTraveller = (): string | null => {
    for (let i = 1; i <= state.totalTravellers; i++) {
      const travellerId = `traveller_${i}`;
      const traveller = state.travellers[travellerId];
      if (traveller && !traveller.completionStatus.isComplete) {
        return travellerId;
      }
    }
    return null;
  };

  const getAllIncompleteTravellerIds = (): string[] => {
    const incomplete: string[] = [];
    for (let i = 1; i <= state.totalTravellers; i++) {
      const travellerId = `traveller_${i}`;
      const traveller = state.travellers[travellerId];
      if (traveller && !traveller.completionStatus.isComplete) {
        incomplete.push(travellerId);
      }
    }
    return incomplete;
  };

  const areAllTravellersComplete = (): boolean => {
    return getAllIncompleteTravellerIds().length === 0;
  };

  const getTravellerCompletionSummary = () => {
    const completed = Object.values(state.travellers).filter(
      (t) => t.completionStatus.isComplete
    ).length;
    return { completed, total: state.totalTravellers };
  };

  // Section Management
  const toggleSection = (
    section: keyof TravellerDetailsState["expandedSections"]
  ) => {
    dispatch({ type: "TOGGLE_SECTION", section });
  };

  // Utility
  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", error });
  };

  const resetAllTravellers = () => {
    dispatch({ type: "RESET_ALL_TRAVELLERS" });
  };

  const resetTraveller = (travellerId: string) => {
    dispatch({ type: "RESET_TRAVELLER", payload: travellerId });
  };

  const contextValue: TravellerDetailsContextType = {
    ...state,

    // Traveller Management
    initializeTravellers,
    setCurrentTraveller,
    getCurrentTravellerData,

    // Field Updates
    updateTravellerField,
    updateCurrentTravellerField,
    updateTravellerMultipleFields,

    // Validation
    setTravellerValidationErrors,
    validateTravellerForm,
    validateCurrentTravellerForm,

    // Completion Status
    updateTravellerCompletionStatus,
    markTravellerPersonalDetailsComplete,
    markTravellerPolicySelected,
    markTravellerAddOnsSelected,

    // Navigation Helpers
    getNextIncompleteTraveller,
    getAllIncompleteTravellerIds: getAllIncompleteTravellerIds,
    areAllTravellersComplete,
    getTravellerCompletionSummary,

    // Section Management
    toggleSection,

    // Utility
    setLoading,
    setError,
    resetAllTravellers,
    resetTraveller,
  };

  return (
    <TravellerDetailsContext.Provider value={contextValue}>
      {children}
    </TravellerDetailsContext.Provider>
  );
};

export const useTravellerDetails = (): TravellerDetailsContextType => {
  const context = useContext(TravellerDetailsContext);
  if (context === undefined) {
    throw new Error(
      "useTravellerDetails must be used within a TravellerDetailsProvider"
    );
  }
  return context;
};
