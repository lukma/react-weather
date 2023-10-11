import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app content', () => {
  render(<App />);
  const linkElement = screen.getByText(/Hello World!/i);
  expect(linkElement).toBeInTheDocument();
});
