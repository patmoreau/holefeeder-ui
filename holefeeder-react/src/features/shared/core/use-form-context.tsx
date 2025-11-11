import React, { createContext, ReactNode, useContext, useState } from 'react';

export type ValidationFunction<T, E extends string> = (formData: T) => Partial<Record<keyof T, E>>;

export function createFormDataContext<T, E extends string>(displayName: string) {
  type FormContextType = {
    formData: T;
    isDirty: boolean;
    errors: Partial<Record<keyof T, E>>;
    updateFormField: <K extends keyof T>(field: K, value: T[K]) => void;
    resetForm: () => void;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    validateField: (field: keyof T) => boolean;
    validateForm: () => boolean;
    clearError: (field: keyof T) => void;
    clearErrors: () => void;
    hasErrors: () => boolean;
    getErrorCount: () => number;
    getFieldError: (field: keyof T) => string | undefined;
  };

  type FormDataProviderProps = {
    initialValue: T;
    children: ReactNode;
    validate?: ValidationFunction<T, E>;
    validateOnChange?: boolean;
  };

  const FormContext = createContext<FormContextType | null>(null);
  FormContext.displayName = `${displayName}Context`;

  const FormDataProvider = ({ initialValue, children, validate, validateOnChange = false }: FormDataProviderProps) => {
    const [formData, setFormData] = useState<T>(initialValue);
    const [isDirty, setIsDirty] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof T, E>>>({});

    const updateFormField = <K extends keyof T>(field: K, value: T[K]) => {
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };

        if (prev[field] !== value) {
          setIsDirty(true);
        }

        // Auto-validate if enabled
        if (validateOnChange && validate) {
          const validationErrors = validate(newData);
          setErrors(validationErrors);
        }

        return newData;
      });
    };

    const validateField = (field: keyof T): boolean => {
      if (!validate) return true;

      const validationErrors = validate(formData);
      const fieldError = validationErrors[field];

      if (fieldError) {
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
        return false;
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        return true;
      }
    };

    const validateForm = (): boolean => {
      if (!validate) return true;

      const validationErrors = validate(formData);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    };

    const clearError = (field: keyof T) => {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    };

    const clearErrors = () => {
      setErrors({});
    };

    const hasErrors = (): boolean => {
      return Object.keys(errors).length > 0;
    };

    const getErrorCount = (): number => {
      return Object.keys(errors).length;
    };

    const getFieldError = (field: keyof T): E | undefined => {
      return errors[field];
    };

    const resetForm = () => {
      setFormData(initialValue);
      setIsDirty(false);
      setErrors({});
    };

    const contextValue = {
      formData,
      isDirty,
      errors,
      updateFormField,
      resetForm,
      setFormData,
      validateField,
      validateForm,
      clearError,
      clearErrors,
      hasErrors,
      getErrorCount,
      getFieldError,
    };

    return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>;
  };

  const useFormDataContext = (): FormContextType => {
    const context = useContext(FormContext);
    if (!context) {
      throw new Error(`useFormDataContext must be used within a ${displayName}Provider`);
    }
    return context;
  };

  return { FormDataProvider, useFormDataContext };
}
