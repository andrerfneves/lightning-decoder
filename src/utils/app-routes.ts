export const PAYMENT_HASH_VERIFIER_ROUTE = "verify-payment-hash"

const RESERVED_ROUTES = new Set([PAYMENT_HASH_VERIFIER_ROUTE])

export function normalizePathname(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, "")
}

export function isReservedAppRoute(pathname: string): boolean {
  return RESERVED_ROUTES.has(normalizePathname(pathname))
}

export function isPaymentHashVerifierRoute(pathname: string): boolean {
  return normalizePathname(pathname) === PAYMENT_HASH_VERIFIER_ROUTE
}

export function getInvoiceFromUrl(pathname: string, search = ""): string | null {
  const queryInvoice = new URLSearchParams(search).get("q")
  if (queryInvoice) {
    return queryInvoice
  }

  if (isReservedAppRoute(pathname)) {
    return null
  }

  return normalizePathname(pathname) || null
}
