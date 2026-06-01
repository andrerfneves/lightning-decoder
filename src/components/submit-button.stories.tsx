import type { Meta, StoryObj } from '@storybook/react';
import { SubmitButton } from './submit-button';

const meta: Meta<typeof SubmitButton> = {
  title: 'Composite/SubmitButton',
  component: SubmitButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
    hasResult: {
      control: 'boolean',
      description: 'Whether there is a result to clear',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SubmitButton>;

export const Default: Story = {
  args: {},
};

export const WithResult: Story = {
  args: {
    hasResult: true,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithClickHandler: Story = {
  args: {
    onClick: () => alert('Button clicked!'),
  },
};
