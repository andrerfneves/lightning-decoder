// Core Libs & Utils
import React, { useEffect, useState } from 'react';
import QrReader from 'react-qr-reader';
import { Github, QrCode, RotateCcw, Search, Zap } from 'lucide-react';

// Utils
import { formatDetailsKey } from './utils/keys';
import { parseInvoice } from './utils/invoices';

// Constants
import {
  APP_NAME,
  APP_GITHUB,
  APP_TAGLINE,
  APP_SUBTAGLINE,
  APP_INPUT_PLACEHOLDER,
} from './constants/app';
import {
  TAGS_KEY,
  COMPLETE_KEY,
  LNURL_METADATA_KEY,
  TIMESTAMP_STRING_KEY,
  CALLBACK_KEY,
  LNURL_TAG_KEY,
} from './constants/keys';

import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Badge } from './components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

const INITIAL_STATE = {
  text: '',
  error: null,
  decodedInvoice: {},
  isLNURL: false,
  isLNAddress: false,
  isQRCodeOpened: false,
  isInvoiceLoaded: false,
};

export function App() {
  const [text, setText] = useState(INITIAL_STATE.text);
  const [error, setError] = useState(INITIAL_STATE.error);
  const [decodedInvoice, setDecodedInvoice] = useState(INITIAL_STATE.decodedInvoice);
  const [isLNURL, setIsLNURL] = useState(INITIAL_STATE.isLNURL);
  const [isLNAddress, setIsLNAddress] = useState(INITIAL_STATE.isLNAddress);
  const [isQRCodeOpened, setIsQRCodeOpened] = useState(INITIAL_STATE.isQRCodeOpened);
  const [isInvoiceLoaded, setIsInvoiceLoaded] = useState(INITIAL_STATE.isInvoiceLoaded);

  useEffect(() => {
    const invoiceOnURLParam = window.location.pathname;
    const cleanInvoice = invoiceOnURLParam.split('/')[1];
    if (cleanInvoice && cleanInvoice !== '') {
      setText(cleanInvoice);
      getInvoiceDetails(cleanInvoice);
    }
  }, []);

  const clearInvoiceDetails = () => {
    const currentOrigin = window.location.origin;
    window.history.pushState({}, null, `${currentOrigin}`);

    setText(INITIAL_STATE.text);
    setError(INITIAL_STATE.error);
    setDecodedInvoice(INITIAL_STATE.decodedInvoice);
    setIsLNURL(INITIAL_STATE.isLNURL);
    setIsLNAddress(INITIAL_STATE.isLNAddress);
    setIsQRCodeOpened(INITIAL_STATE.isQRCodeOpened);
    setIsInvoiceLoaded(INITIAL_STATE.isInvoiceLoaded);
  };

  const setErrorState = (message) => {
    setError({ message });
    setDecodedInvoice({});
    setIsInvoiceLoaded(false);
  };

  const getInvoiceDetails = async (textValue) => {
    if (!textValue) {
      return setErrorState('Please enter a valid request or address and try again.');
    }

    try {
      let response;
      const parsedInvoiceResponse = await parseInvoice(textValue);

      if (!parsedInvoiceResponse) {
        return setErrorState('Please enter a valid request or address and try again.');
      }

      const { isLNURL: parsedIsLNURL, data, error: parseError, isLNAddress: parsedIsLNAddress } = parsedInvoiceResponse;

      if (parseError && parseError.length > 0) {
        return setErrorState(parseError);
      }

      if (!data) {
        return setErrorState('Could not parse/understand this invoice or request. Please try again.');
      }

      if (parsedIsLNURL) {
        if (parsedIsLNAddress) {
          response = data;
        } else {
          response = await data;
        }
      } else {
        response = data;
      }

      if (response) {
        const currentUrl = window.location;
        const currentOrigin = window.location.origin;
        const currentPathname = window.location.pathname;
        const hasPathnameAlready = currentPathname && currentPathname !== '';

        if (hasPathnameAlready) {
          window.history.pushState({}, null, `${currentOrigin}`);
        }

        window.history.pushState({}, null, `${currentUrl}${textValue}`);

        setIsLNURL(parsedIsLNURL);
        setError(null);
        setIsLNAddress(parsedIsLNAddress);
        setIsInvoiceLoaded(true);
        setDecodedInvoice(response);
      }
    } catch (caughtError) {
      setError(caughtError);
      setDecodedInvoice({});
      setIsInvoiceLoaded(false);
    }
  };

  const handleChange = (event) => {
    const { target: { value } } = event;
    setText(value);
    setError(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      getInvoiceDetails(text);
    }
  };

  const handleScan = (value) => {
    if (Object.is(value, null)) return;

    let nextText = value;
    if (value.includes('lightning')) {
      nextText = value.split('lightning:')[1];
    }

    getInvoiceDetails(nextText);
    setIsQRCodeOpened(false);
    setText(nextText);
  };

  const handleError = (qrError) => {
    setError(qrError);
    setIsInvoiceLoaded(false);
    setIsQRCodeOpened(false);
  };

  const renderNestedItem = (label, value) => (
    <div key={label} className="flex flex-col gap-1 rounded-md border border-border/70 bg-background/60 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {formatDetailsKey(label)}
      </div>
      <div className="text-sm text-foreground break-words">{value}</div>
    </div>
  );

  const renderInvoiceInnerItems = (key) => {
    const tags = decodedInvoice[key];

    const renderNestedTag = (tag) => (
      <div key={tag.tagName} className="space-y-3 rounded-lg border border-border bg-background/40 p-4">
        <div className="text-sm font-semibold text-foreground">
          {formatDetailsKey(tag.tagName)}
        </div>
        <div className="space-y-3">
          {typeof tag.data === 'string' && (
            <div className="text-sm text-foreground break-words">{tag.data}</div>
          )}
          {Array.isArray(tag.data) && tag.data.map((item, index) => (
            <div key={`${tag.tagName}-${index}`} className="space-y-2">
              {Object.keys(item).map((label) => renderNestedItem(label, item[label]))}
            </div>
          ))}
          {!Array.isArray(tag.data) && tag.data && typeof tag.data === 'object' && (
            <div className="space-y-2">
              {Object.keys(tag.data).map((label) => renderNestedItem(label, tag.data[label]))}
            </div>
          )}
        </div>
      </div>
    );

    const renderNormalTag = (tag) => (
      <div key={tag.tagName} className="flex flex-col gap-1 rounded-lg border border-border bg-background/40 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {formatDetailsKey(tag.tagName)}
        </div>
        <div className="text-sm text-foreground break-words">{`${tag.data || '--'}`}</div>
      </div>
    );

    return tags.map((tag) => (
      typeof tag.data !== 'string' && typeof tag.data !== 'number'
        ? renderNestedTag(tag)
        : renderNormalTag(tag)
    ));
  };

  const renderInvoiceItem = (key, valuePropFormat) => {
    let value = `${decodedInvoice[key]}`;
    if (valuePropFormat && valuePropFormat === TIMESTAMP_STRING_KEY) {
      value = `${decodedInvoice[key]}`;
    }

    return (
      <div key={key} className="flex flex-col gap-1 rounded-lg border border-border bg-background/40 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {formatDetailsKey(key)}
        </div>
        <div className="text-sm text-foreground break-words">{value}</div>
      </div>
    );
  };

  const invoiceDetails = !isInvoiceLoaded || isLNURL
    ? null
    : Object.keys(decodedInvoice).flatMap((key) => {
      switch (key) {
        case COMPLETE_KEY:
          return [];
        case TAGS_KEY:
          return renderInvoiceInnerItems(key);
        case TIMESTAMP_STRING_KEY:
          return [renderInvoiceItem(key, TIMESTAMP_STRING_KEY)];
        default:
          return [renderInvoiceItem(key)];
      }
    });

  const lnurlDetails = !isInvoiceLoaded || !isLNURL
    ? null
    : Object.keys(decodedInvoice).flatMap((key) => {
      if (typeof decodedInvoice[key] === 'object') {
        return [];
      }

      if (key === 'status') {
        return [];
      }

      if (key === LNURL_TAG_KEY) {
        const textLabel = decodedInvoice[key];
        return [
          <div key={`${key}-tag`} className="flex flex-col gap-1 rounded-lg border border-border bg-background/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {formatDetailsKey(key)}
            </div>
            <div className="text-sm text-foreground break-words">
              <a className="text-primary underline-offset-4 hover:underline" href={decodedInvoice[key]}>
                {textLabel}
              </a>
            </div>
          </div>,
        ];
      }

      if (key === CALLBACK_KEY) {
        return [
          <div key={`${key}-callback`} className="flex flex-col gap-1 rounded-lg border border-border bg-background/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {formatDetailsKey(key)}
            </div>
            <div className="text-sm text-foreground break-words">
              <a className="text-primary underline-offset-4 hover:underline" href={decodedInvoice[key]}>
                {decodedInvoice[key]}
              </a>
            </div>
          </div>,
        ];
      }

      if (key === LNURL_METADATA_KEY) {
        const splitMetadata = JSON.parse(decodedInvoice[key]);

        return splitMetadata.map((arrOfData, index) => {
          if (arrOfData[0] === 'text/plain') {
            return (
              <div key={`${key}-description-${index}`} className="flex flex-col gap-1 rounded-lg border border-border bg-background/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </div>
                <div className="text-sm text-foreground break-words">{arrOfData[1]}</div>
              </div>
            );
          }

          if (arrOfData[0] === 'text/identifier') {
            return (
              <div key={`${key}-identifier-${index}`} className="flex flex-col gap-1 rounded-lg border border-border bg-background/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Lightning Address
                </div>
                <div className="text-sm text-foreground break-words">{arrOfData[1]}</div>
              </div>
            );
          }

          if (arrOfData[0] === 'image/png;base64') {
            return (
              <div key={`${key}-image-${index}`} className="flex flex-col gap-3 rounded-lg border border-border bg-background/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Image
                </div>
                <img
                  alt="Image"
                  className="max-w-[200px] rounded-md border border-border"
                  src={`data:image/png;base64,${arrOfData[1]}`}
                />
              </div>
            );
          }

          return null;
        }).filter(Boolean);
      }

      return [
        <div key={`${key}-default`} className="flex flex-col gap-1 rounded-lg border border-border bg-background/40 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {formatDetailsKey(key)}
          </div>
          <div className="text-sm text-foreground break-words">{decodedInvoice[key]}</div>
        </div>,
      ];
    });

  const hasError = Boolean(error);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-slate-950 text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{APP_NAME}</h1>
              <p className="text-sm text-muted-foreground">
                {APP_TAGLINE}{' '}
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
                  {APP_SUBTAGLINE}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="gap-2">
              <a href={APP_GITHUB} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
            {isInvoiceLoaded && (
              <Badge variant="secondary" className="self-center">Loaded</Badge>
            )}
            {isLNURL && (
              <Badge variant="default" className="self-center">LNURL</Badge>
            )}
            {isLNAddress && (
              <Badge variant="outline" className="self-center">Lightning Address</Badge>
            )}
          </div>
        </header>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Decode an invoice</CardTitle>
            <CardDescription>Paste a Lightning invoice, LNURL, or Lightning Address to inspect it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex w-full items-center gap-3 rounded-md border border-border bg-background/60 px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={text}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  placeholder={APP_INPUT_PLACEHOLDER}
                  className="border-none bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => (isInvoiceLoaded ? clearInvoiceDetails() : getInvoiceDetails(text))}>
                  {isInvoiceLoaded ? (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Decode
                    </>
                  )}
                </Button>
                {!isInvoiceLoaded && (
                  <Dialog open={isQRCodeOpened} onOpenChange={setIsQRCodeOpened}>
                    <DialogTrigger asChild>
                      <Button variant="secondary">
                        <QrCode className="h-4 w-4" />
                        Scan QR
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Scan a Lightning QR</DialogTitle>
                        <DialogDescription>Point your camera at a Lightning invoice QR code.</DialogDescription>
                      </DialogHeader>
                      <div className="rounded-lg border border-border bg-background/40 p-2">
                        <QrReader
                          delay={300}
                          onError={handleError}
                          onScan={handleScan}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isInvoiceLoaded && (
          <Card className="bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{isLNURL ? 'LNURL Details' : 'Invoice Details'}</CardTitle>
                <CardDescription>
                  {isLNURL
                    ? 'Fetched metadata and fields for the LNURL request.'
                    : 'Parsed invoice fields and tags.'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {isLNURL ? lnurlDetails : invoiceDetails}
            </CardContent>
          </Card>
        )}

        {hasError && (
          <Alert variant="destructive">
            <AlertTitle>Unable to decode</AlertTitle>
            <AlertDescription>{error.message || String(error)}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
