import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './header';

const meta: Meta<typeof Header> = {
  title: 'Composite/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    appName: {
      control: 'text',
      description: 'Name of the application',
    },
    tagline: {
      control: 'text',
      description: 'Main tagline',
    },
    subTagline: {
      control: 'text',
      description: 'Secondary tagline',
    },
    githubUrl: {
      control: 'text',
      description: 'GitHub repository URL',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {},
};

export const CustomBranding: Story = {
  args: {
    appName: 'My Lightning App',
    tagline: 'Your gateway to Lightning Network',
    subTagline: 'Fast, secure, and easy to use',
    githubUrl: 'https://github.com/myorg/my-lightning-app',
  },
};

export const MinimalBranding: Story = {
  args: {
    appName: 'Lightning Tools',
    tagline: 'Utilities for Lightning Network',
    subTagline: '',
  },
};
