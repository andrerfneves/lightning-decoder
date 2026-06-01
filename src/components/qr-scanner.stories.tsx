import type { Meta, StoryObj } from '@storybook/react';
import { QRScanner } from './qr-scanner';
import { useState } from 'react';

const meta: Meta<typeof QRScanner> = {
  title: 'Composite/QRScanner',
  component: QRScanner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the scanner dialog is open',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QRScanner>;

export const Default: Story = {
  args: {
    onScan: (data) => console.log('Scanned:', data),
    onError: (error) => console.error('Error:', error),
  },
};

export const WithScanHandler: Story = {
  args: {
    onScan: (data) => alert(`Scanned: ${data}`),
    onError: (error) => alert(`Error: ${error.message}`),
  },
};

const ControlledExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <p className="mb-4">Open state: {open ? 'true' : 'false'}</p>
      <QRScanner
        open={open}
        onOpenChange={setOpen}
        onScan={(data) => {
          alert(`Scanned: ${data}`);
          setOpen(false);
        }}
      />
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
