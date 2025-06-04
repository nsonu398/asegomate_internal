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

export interface TravellerDetailsState {
  formValues: TravellerDetailsFormValues;
  validationErrors: Partial<TravellerDetailsFormValues>;
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
  | {
      type: "UPDATE_FIELD";
      field: keyof TravellerDetailsFormValues;
      value: string;
    }
  | {
      type: "UPDATE_MULTIPLE_FIELDS";
      fields: Partial<TravellerDetailsFormValues>;
    }
  | {
      type: "SET_VALIDATION_ERRORS";
      errors: Partial<TravellerDetailsFormValues>;
    }
  | {
      type: "TOGGLE_SECTION";
      section: keyof TravellerDetailsState["expandedSections"];
    }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET_FORM" };

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
  // Empty form for production
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

const initialFormValues: TravellerDetailsFormValues = getInitialFormValues();

const initialState: TravellerDetailsState = {
  formValues: initialFormValues,
  validationErrors: {},
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
    case "UPDATE_FIELD":
      return {
        ...state,
        formValues: {
          ...state.formValues,
          [action.field]: action.value,
        },
        validationErrors: {
          ...state.validationErrors,
          [action.field]: undefined,
        },
      };

    case "UPDATE_MULTIPLE_FIELDS":
      return {
        ...state,
        formValues: {
          ...state.formValues,
          ...action.fields,
        },
      };

    case "SET_VALIDATION_ERRORS":
      return {
        ...state,
        validationErrors: action.errors,
      };

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

    case "RESET_FORM":
      return initialState;

    default:
      return state;
  }
};

interface TravellerDetailsContextType extends TravellerDetailsState {
  updateField: (field: keyof TravellerDetailsFormValues, value: string) => void;
  updateMultipleFields: (fields: Partial<TravellerDetailsFormValues>) => void;
  setValidationErrors: (errors: Partial<TravellerDetailsFormValues>) => void;
  toggleSection: (
    section: keyof TravellerDetailsState["expandedSections"]
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  isFormValid: () => boolean;
}

const TravellerDetailsContext = createContext<
  TravellerDetailsContextType | undefined
>(undefined);

export const TravellerDetailsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(travellerDetailsReducer, initialState);

  const updateField = (
    field: keyof TravellerDetailsFormValues,
    value: string
  ) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  const updateMultipleFields = (
    fields: Partial<TravellerDetailsFormValues>
  ) => {
    dispatch({ type: "UPDATE_MULTIPLE_FIELDS", fields });
  };

  const setValidationErrors = (errors: Partial<TravellerDetailsFormValues>) => {
    dispatch({ type: "SET_VALIDATION_ERRORS", errors });
  };

  const toggleSection = (
    section: keyof TravellerDetailsState["expandedSections"]
  ) => {
    dispatch({ type: "TOGGLE_SECTION", section });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", error });
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const validateForm = (): boolean => {
    const errors: Partial<TravellerDetailsFormValues> = {};
    const { formValues } = state;

    // Required field validations
    if (!formValues.passportNumber.trim())
      errors.passportNumber = "Passport number is required";
    if (!formValues.fullName.trim()) errors.fullName = "Full name is required";
    if (!formValues.gender) {
      (errors as any).gender = "Gender is required";
    }
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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = (): boolean => {
    return Object.keys(state.validationErrors).length === 0;
  };

  const contextValue: TravellerDetailsContextType = {
    ...state,
    updateField,
    updateMultipleFields,
    setValidationErrors,
    toggleSection,
    setLoading,
    setError,
    resetForm,
    validateForm,
    isFormValid,
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
