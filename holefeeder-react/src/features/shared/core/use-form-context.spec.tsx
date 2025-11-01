import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text, Button } from 'react-native';
import { createFormDataContext } from '@/features/shared/core/use-form-context';

type TestFormData = {
  id: string;
  name: string;
};

const { FormDataProvider, useFormDataContext } = createFormDataContext<TestFormData>('Test');

const INITIAL_VALUE: TestFormData = { id: '1', name: 'Initial' };

function Consumer() {
  const { formData, isDirty, updateFormField, resetForm, setFormData } = useFormDataContext();

  return (
    <>
      <Text testID="data">{JSON.stringify(formData)}</Text>
      <Text testID="dirty">{isDirty ? 'true' : 'false'}</Text>
      <Button title="setName" onPress={() => updateFormField('name', 'Alice')} />
      <Button title="reset" onPress={() => resetForm()} />
      <Button title="setAll" onPress={() => setFormData({ id: '2', name: 'Bob' })} />
      <Button title="setSameName" onPress={() => updateFormField('name', 'Initial')} />
    </>
  );
}

describe('createFormDataContext / useFormDataContext', () => {
  const renderWithProvider = () =>
    render(
      <FormDataProvider initialValue={INITIAL_VALUE}>
        <Consumer />
      </FormDataProvider>
    );

  it('provides the initial value and isDirty=false', () => {
    const { getByTestId } = renderWithProvider();

    expect(getByTestId('data').props.children).toBe(JSON.stringify(INITIAL_VALUE));
    expect(getByTestId('dirty').props.children).toBe('false');
  });

  it('updates a field and sets isDirty=true when value actually changes', () => {
    const { getByTestId, getByText } = renderWithProvider();

    fireEvent.press(getByText('setName'));

    expect(getByTestId('data').props.children).toBe(JSON.stringify({ id: '1', name: 'Alice' }));
    expect(getByTestId('dirty').props.children).toBe('true');
  });

  it('does not set isDirty when updating a field with the same value', () => {
    const { getByTestId, getByText } = renderWithProvider();

    // Ensure initial is not dirty
    expect(getByTestId('dirty').props.children).toBe('false');

    // Update with the same value as INITIAL_VALUE.name
    fireEvent.press(getByText('setSameName'));

    expect(getByTestId('data').props.children).toBe(JSON.stringify({ id: '1', name: 'Initial' }));
    expect(getByTestId('dirty').props.children).toBe('false');
  });

  it('resets the form to initial value and clears dirty flag', () => {
    const { getByTestId, getByText } = renderWithProvider();

    fireEvent.press(getByText('setName'));
    expect(getByTestId('dirty').props.children).toBe('true');

    fireEvent.press(getByText('reset'));

    expect(getByTestId('data').props.children).toBe(JSON.stringify(INITIAL_VALUE));
    expect(getByTestId('dirty').props.children).toBe('false');
  });

  it('can replace all form data via setFormData (without toggling dirty flag)', () => {
    const { getByTestId, getByText } = renderWithProvider();

    fireEvent.press(getByText('setAll'));

    expect(getByTestId('data').props.children).toBe(JSON.stringify({ id: '2', name: 'Bob' }));
    // setFormData is a raw setter and does not toggle isDirty by design
    expect(getByTestId('dirty').props.children).toBe('false');
  });

  it('throws a helpful error when used outside of its Provider', () => {
    function OutsideConsumer() {
      // This hook call should throw because there is no provider

      const { formData } = useFormDataContext();
      return <Text>{JSON.stringify(formData)}</Text>;
    }

    expect(() => render(<OutsideConsumer />)).toThrow(new Error('useFormDataContext must be used within a TestProvider'));
  });
});
