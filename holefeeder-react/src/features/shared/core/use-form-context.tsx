import { AbstractPowerSyncDatabase, usePowerSync } from '@powersync/react-native';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { ErrorKey } from '@/shared/core/error-key';
import { Result } from '@/shared/core/result';

export type ValidationFunction<T, E extends string> = (formData: T) => Partial<Record<keyof T, E>>;

export type SaveFunction<T> = (db: AbstractPowerSyncDatabase, formData: T) => Promise<Result<unknown>>;

export function createFormDataContext<T, E extends string>(displayName: string, save: SaveFunction<T>) {
  type FormContextType = {
    formData: T;
    isDirty: boolean;
    errors: Partial<Record<keyof T, E>>;
    updateFormField: <K extends keyof T>(field: K, value: T[K]) => void;
    resetForm: () => void;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    validateField: (field: keyof T) => boolean;
    validateForm: () => boolean;
    saveForm: () => Promise<void>;
    clearError: (field: keyof T) => void;
    clearErrors: () => void;
    hasErrors: () => boolean;
    getErrorCount: () => number;
    getFieldError: (field: keyof T) => string | undefined;
    generalError: ErrorKey | null;
    clearGeneralError: () => void;
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
    const [generalError, setGeneralError] = useState<ErrorKey | null>(null);
    const [showErrorSheet, setShowErrorSheet] = useState(false);
    const db = usePowerSync();

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

    const saveForm = async (): Promise<void> => {
      const result = await save(db, formData);
      console.log(result);
      if (result.isFailure) {
        setGeneralError(ErrorKey.saveFailed);
        setShowErrorSheet(true);
      }
    };

    const clearGeneralError = () => {
      setGeneralError(null);
      setShowErrorSheet(false);
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
      saveForm,
      clearError,
      clearErrors,
      hasErrors,
      getErrorCount,
      getFieldError,
      generalError,
      clearGeneralError,
    };

    return (
      <FormContext.Provider value={contextValue}>
        {children}
        <ErrorSheet
          showError={showErrorSheet}
          setShowError={setShowErrorSheet}
          error={generalError || ErrorKey.saveFailed}
          onRetry={saveForm}
        />
      </FormContext.Provider>
    );
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
