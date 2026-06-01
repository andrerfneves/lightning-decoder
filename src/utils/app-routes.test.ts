import { describe, expect, it } from "vitest"
import {
  getInvoiceFromUrl,
  isPaymentHashVerifierRoute,
  isReservedAppRoute,
  normalizePathname,
} from "./app-routes"

describe("app route helpers", () => {
  it("normalizes leading and trailing slashes", () => {
    expect(normalizePathname("/verify-payment-hash/")).toBe("verify-payment-hash")
    expect(normalizePathname("//lnbc123//")).toBe("lnbc123")
  })

  it("reserves the payment hash verifier route", () => {
    expect(isReservedAppRoute("/verify-payment-hash")).toBe(true)
    expect(isPaymentHashVerifierRoute("/verify-payment-hash")).toBe(true)
  })

  it("does not treat reserved app routes as invoices", () => {
    expect(getInvoiceFromUrl("/verify-payment-hash")).toBeNull()
  })

  it("prefers q query invoices over path invoices", () => {
    expect(getInvoiceFromUrl("/anything", "?q=lnbc123")).toBe("lnbc123")
  })

  it("keeps backward-compatible path invoice loading", () => {
    expect(getInvoiceFromUrl("/lnurl1abc")).toBe("lnurl1abc")
  })
})
