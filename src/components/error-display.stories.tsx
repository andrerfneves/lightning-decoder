import type { Meta, StoryObj } from '@storybook/react';
import { ErrorDisplay } from './error-display';

const meta: Meta<typeof ErrorDisplay> = {
  title: 'Composite/ErrorDisplay',
  component: ErrorDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Error message to display',
    },
    title: {
      control: 'text',
      description: 'Optional error title',
    },
    tone: {
      control: 'select',
      options: ['error', 'warning'],
      description: 'Visual tone for the callout',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorDisplay>;

export const Default: Story = {
  args: {
    message: 'An error occurred while decoding the invoice',
  },
};

export const WithTitle: Story = {
  args: {
    message: 'The invoice format is invalid',
    title: 'Invalid Invoice',
  },
};

export const Warning: Story = {
  args: {
    message: 'Please enter a Lightning invoice, LNURL, or Lightning address',
    tone: 'warning',
  },
};

export const LongMessage: Story = {
  args: {
    message: 'Failed to decode the Lightning invoice: The payment hash is malformed and cannot be parsed. Please check the invoice string and try again.',
    title: 'Decode Error',
  },
};

export const NetworkError: Story = {
  args: {
    message: 'Network request failed. Please check your internet connection and try again.',
    title: 'Network Error',
  },
};
