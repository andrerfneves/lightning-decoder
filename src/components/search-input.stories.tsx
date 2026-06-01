import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './search-input';

const meta: Meta<typeof SearchInput> = {
  title: 'Composite/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    value: {
      control: 'text',
      description: 'Current value of the input',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    placeholder: 'Enter Lightning invoice, LNURL, or Lightning address',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Enter Lightning invoice, LNURL, or Lightning address',
    value: 'lnbc10u1p3pj257pp5yztkwjcz5ftl4laxkla5ue77w3lpax8qzqj8qzqj8qzqj8qz',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Enter Lightning invoice, LNURL, or Lightning address',
    disabled: true,
  },
};

export const WithOnDecode: Story = {
  args: {
    placeholder: 'Enter Lightning invoice, LNURL, or Lightning address',
    onDecode: () => alert('Decode triggered!'),
  },
};
