import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Creates a type-safe context system (Context, Provider, and Hook) for managing
 * form state based on a custom generic type T.
 *
 * @param displayName A descriptive name for the context (e.g., 'UserSettingsForm')
 * @returns An object containing the Provider component and the consumer hook.
 */
export function createFormDataContext<T>(displayName: string) {
  type FormContextType = {
    formData: T;
    isDirty: boolean;
    updateFormField: <K extends keyof T>(field: K, value: T[K]) => void;
    resetForm: () => void;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
  };

  type FormDataProviderProps = {
    initialValue: T;
    children: ReactNode;
  };

  const FormContext = createContext<FormContextType | null>(null);
  FormContext.displayName = `${displayName}Context`;

  const FormDataProvider = ({ initialValue, children }: FormDataProviderProps) => {
    const [formData, setFormData] = useState<T>(initialValue);
    const [isDirty, setIsDirty] = useState(false);

    const updateFormField = <K extends keyof T>(field: K, value: T[K]) => {
      setFormData((prev) => {
        if (prev[field] !== value) {
          setIsDirty(true);
        }
        return { ...prev, [field]: value };
      });
    };

    const resetForm = () => {
      setFormData(initialValue);
      setIsDirty(false);
    };

    const contextValue = {
      formData,
      isDirty,
      updateFormField,
      resetForm,
      setFormData,
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
