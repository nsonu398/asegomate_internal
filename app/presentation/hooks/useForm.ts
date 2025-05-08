// src/presentation/hooks/useForm.ts
import { useCallback, useState } from 'react';

type Validation<T> = {
  [K in keyof T]?: (value: T[K], values: T) => string | undefined;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

interface UseFormOptions<T> {
  initialValues: T;
  validations?: Validation<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validations = {},
  onSubmit
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: keyof T, value: T[keyof T], allValues: T) => {
    const validator = validations[name];
    return validator ? validator(value, allValues) : undefined;
  }, [validations]);

  const handleChange = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Clear error when value changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Run validation if the field was already touched
    if (touched[name]) {
      const error = validateField(name, value, { ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [errors, touched, validateField, values]);

  const handleBlur = useCallback((name: keyof T) => {
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate on blur
    const error = validateField(name, values[name], values);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);

  const validateAll = useCallback(() => {
    const newErrors: FormErrors<T> = {};
    let isValid = true;

    // Mark all fields as touched
    const newTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    
    setTouched(newTouched);

    // Validate all fields
    Object.keys(values).forEach(key => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, values[fieldName], values);
      
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, values]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    const isValid = validateAll();
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, validateAll, onSubmit, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
};