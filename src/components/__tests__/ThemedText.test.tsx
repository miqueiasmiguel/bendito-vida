import { render } from '@testing-library/react-native';
import React from 'react';

import { ThemedText } from '../themed-text';

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  }),
}));

describe('ThemedText', () => {
  it('renders with default type', () => {
    const { getByText } = render(<ThemedText>Hello</ThemedText>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('renders with title type', () => {
    const { getByText } = render(<ThemedText type="title">Title</ThemedText>);
    expect(getByText('Title')).toBeTruthy();
  });

  it('renders with subtitle type', () => {
    const { getByText } = render(<ThemedText type="subtitle">Sub</ThemedText>);
    expect(getByText('Sub')).toBeTruthy();
  });

  it('renders with small type', () => {
    const { getByText } = render(<ThemedText type="small">Small</ThemedText>);
    expect(getByText('Small')).toBeTruthy();
  });

  it('renders with smallBold type', () => {
    const { getByText } = render(<ThemedText type="smallBold">Bold</ThemedText>);
    expect(getByText('Bold')).toBeTruthy();
  });

  it('renders with link type', () => {
    const { getByText } = render(<ThemedText type="link">Link</ThemedText>);
    expect(getByText('Link')).toBeTruthy();
  });

  it('renders with linkPrimary type', () => {
    const { getByText } = render(<ThemedText type="linkPrimary">Primary</ThemedText>);
    expect(getByText('Primary')).toBeTruthy();
  });

  it('renders with code type', () => {
    const { getByText } = render(<ThemedText type="code">code()</ThemedText>);
    expect(getByText('code()')).toBeTruthy();
  });

  it('applies custom themeColor', () => {
    const { getByText } = render(<ThemedText themeColor="textSecondary">Secondary</ThemedText>);
    expect(getByText('Secondary')).toBeTruthy();
  });
});
