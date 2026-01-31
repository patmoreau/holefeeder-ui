import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import {
  useStoreItemsRepository,
  useStoreItemsRepositoryWithEnabled,
  useAllStoreItems,
} from '@/use-cases/persistence/store-items-repository-in-powersync';

/**
 * Example 1: Basic Reactive Query
 * The query automatically re-runs when the code state changes
 */
export function BasicReactiveExample() {
  const [code, setCode] = useState('settings');

  // This hook automatically re-queries when 'code' changes
  const result = useStoreItemsRepository(code);

  return (
    <View>
      <Text>Current Code: {code}</Text>

      {/* When you click these buttons, the query automatically re-runs */}
      <Button title="Load Settings" onPress={() => setCode('settings')} />
      <Button title="Load Preferences" onPress={() => setCode('preferences')} />

      {result.isLoading && <Text>Loading...</Text>}
      {result.isFailure && <Text>Error: {result.errors.join(', ')}</Text>}
      {!result.isLoading && !result.isFailure && <Text>Data: {result.value.data}</Text>}
    </View>
  );
}

/**
 * Example 2: Conditional Query with Enabled Flag
 * The query only runs when certain conditions are met
 */
export function ConditionalQueryExample() {
  const [code, setCode] = useState('settings');
  const [isEnabled, setIsEnabled] = useState(false);

  // Query only runs when isEnabled is true
  const result = useStoreItemsRepositoryWithEnabled(code, isEnabled);

  return (
    <View>
      <TextInput value={code} onChangeText={setCode} placeholder="Enter store item code" />

      <Button title={isEnabled ? 'Disable Query' : 'Enable Query'} onPress={() => setIsEnabled(!isEnabled)} />

      {/* Shows loading when disabled, or actual query state when enabled */}
      {result.isLoading && <Text>Query {isEnabled ? 'loading' : 'disabled'}...</Text>}
      {result.isFailure && <Text>Error: {result.errors.join(', ')}</Text>}
      {!result.isLoading && !result.isFailure && <Text>Data: {result.value.data}</Text>}
    </View>
  );
}

/**
 * Example 3: Debounced Search with Reactive Query
 * Demonstrates how to use the repository with user input and debouncing
 */
export function DebouncedSearchExample() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedCode, setDebouncedCode] = useState('');

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(searchInput);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Query automatically runs when debouncedCode changes
  const result = useStoreItemsRepositoryWithEnabled(debouncedCode, debouncedCode.length > 0);

  return (
    <View>
      <TextInput value={searchInput} onChangeText={setSearchInput} placeholder="Search store items..." />

      <Text>Searching for: {debouncedCode || '(none)'}</Text>

      {result.isLoading && debouncedCode && <Text>Searching...</Text>}
      {result.isFailure && <Text>Not found</Text>}
      {!result.isLoading && !result.isFailure && (
        <View>
          <Text>Found: {result.value.code}</Text>
          <Text>Data: {result.value.data}</Text>
        </View>
      )}
    </View>
  );
}

/**
 * Example 4: List All Store Items with Real-time Updates
 * This query automatically updates when store items are added/modified/deleted
 */
export function AllStoreItemsExample() {
  const result = useAllStoreItems();

  return (
    <View>
      <Text>All Store Items (updates in real-time)</Text>

      {result.isLoading && <Text>Loading...</Text>}
      {result.isFailure && <Text>Error: {result.errors.join(', ')}</Text>}
      {!result.isLoading && !result.isFailure && (
        <View>
          <Text>Found {result.value.length} items</Text>
          {result.value.map((item) => (
            <View key={item.id}>
              <Text>
                {item.code}: {item.data}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * Example 5: Multi-Step Form with Different Store Items per Step
 * Shows how queries automatically update when navigation state changes
 */
export function MultiStepFormExample() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Map each step to a different store item code
  const stepToCode = {
    1: 'form-step-1-config',
    2: 'form-step-2-config',
    3: 'form-step-3-config',
  };

  // Query automatically changes when step changes
  const configResult = useStoreItemsRepository(stepToCode[step]);

  return (
    <View>
      <Text>Step {step} of 3</Text>

      {configResult.isLoading && <Text>Loading step configuration...</Text>}
      {!configResult.isLoading && !configResult.isFailure && (
        <View>
          <Text>Config: {configResult.value.data}</Text>

          {step > 1 && <Button title="Previous" onPress={() => setStep((step - 1) as 1 | 2 | 3)} />}
          {step < 3 && <Button title="Next" onPress={() => setStep((step + 1) as 1 | 2 | 3)} />}
        </View>
      )}
    </View>
  );
}
