import React, { type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

type Props = PropsWithChildren<{}>;

export default function NativeForm({ children }: Props) {
  return <ScrollView style={styles.container}>{children}</ScrollView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
});
