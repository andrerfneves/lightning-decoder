import type { Meta, StoryObj } from '@storybook/react';
import { InvoiceDetails } from './invoice-details';

const meta: Meta<typeof InvoiceDetails> = {
  title: 'Composite/InvoiceDetails',
  component: InvoiceDetails,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['bolt11', 'lnurl', 'bolt12', 'lightning-address'],
      description: 'Type of invoice being displayed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceDetails>;

const bolt11Data = {
  paymentHash: 'e8c4e8c4e8c4e8c4e8c4e8c4e8c4e8c4e8c4e8c4e8c4e8c4e8c4e8c4e8c4',
  amount: 100000,
  timestamp: 1234567890,
  expiry: 3600,
  description: 'Coffee payment',
  payeeNodeKey: '03e7156ae33b0a208d0744199163177e914e0b1c5f0f0f0f0f0f0f0f0f0f0f0f0f',
};

const lnurlData = {
  tag: 'payRequest',
  callback: 'https://example.com/lnurl-pay/callback',
  minSendable: 1000,
  maxSendable: 100000000,
  metadata: '[["text/plain","Payment to example.com"]]',
};

const bolt12Data = {
  type: 'offer',
  chains: ['bitcoin'],
  amount: 50000,
  description: 'BOLT12 offer for coffee',
  issuer: 'Coffee Shop',
  quantityMax: 10,
};

const lightningAddressData = {
  status: 'OK',
  tag: 'payRequest',
  callback: 'https://example.com/.well-known/lnurlp/user',
  minSendable: 1000,
  maxSendable: 100000000,
  metadata: '[["text/plain","Payment to user@example.com"]]',
};

export const BOLT11: Story = {
  args: {
    type: 'bolt11',
    data: bolt11Data,
  },
};

export const LNURL: Story = {
  args: {
    type: 'lnurl',
    data: lnurlData,
  },
};

export const BOLT12: Story = {
  args: {
    type: 'bolt12',
    data: bolt12Data,
  },
};

export const LightningAddress: Story = {
  args: {
    type: 'lightning-address',
    data: lightningAddressData,
  },
};

export const Empty: Story = {
  args: {
    type: 'bolt11',
    data: {},
  },
};
