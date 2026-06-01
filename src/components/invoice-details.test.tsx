import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { InvoiceDetails } from "./invoice-details"

const bolt11Data = {
  coinType: "bitcoin",
  millisatoshis: "100000",
  paymentRequest: "lnbc1u1p4pmwa0pp525nztlfm6k6c2c3z30leq6ukm6qpyh32l8lumalaf8j8p3af2mqshp5fqmzkwj96fgkkqhr69s9vgk0yl9lncjsjclsvj83zqamxfuhguhqcqzysxqzfvsp53yclxp77p8g7r0y365wme8m3y5ns5pr4t78y38zyy7z8rnlpjdms9qxpqysgqg59jk4lhp008qjc8lmqrpdd26pntu9mj4lh",
  payeeNodeKey: "03d6b14390cd178d670aa2d57c93d9519feaae7d1e34264d8bbb7932d47b75a50d",
  satoshis: 100,
  tags: [
    {
      tagName: "payment_hash",
      data: "552625fd3bd5b58562228bff906b96de80125e2af9ffcdf7fd49e470c7a956c1",
    },
    {
      tagName: "min_final_cltv_expiry",
      data: 144,
    },
    {
      tagName: "unknownTag",
      data: {
        tagCode: 16,
        words: "unknown13yclxp77p8g7r0y365wme8m3y5ns5pr4t78y38zyy7z8rnlpjdmsgx3v6f",
      },
    },
  ],
  timeExpireDate: 1780333787,
  timeExpireDateString: "2026-06-01T17:09:47.000Z",
  timestamp: 1780333487,
  timestampString: "2026-06-01T17:04:47.000Z",
  wordsTemp: "temp1p4pmwa0pp525nztlfm6k6c2c3z30leq6ukm6qpyh32l8lumalaf8j8p3af2mq",
}

describe("InvoiceDetails", () => {
  it("renders flattened BOLT11 detail rows without the raw tags parent", () => {
    const html = renderToStaticMarkup(
      <InvoiceDetails type="bolt11" data={bolt11Data} />
    )

    expect(html).toContain("Amount")
    expect(html).toContain("100,000 millisats")
    expect(html).toContain("100 sats")
    expect(html).toContain("Payment Hash")
    expect(html).toContain("Minimum Final CLTV Expiry")
    expect(html).toContain("Unknown Tag 16")
    expect(html).not.toContain(">Tags<")
  })

  it("renders Bitcoin as an orange badge and payee pubkey as an Amboss link", () => {
    const html = renderToStaticMarkup(
      <InvoiceDetails type="bolt11" data={bolt11Data} />
    )

    expect(html).toContain(">Bitcoin<")
    expect(html).toContain(`href="https://amboss.space/${bolt11Data.payeeNodeKey}"`)
  })

  it("places unknown tags and words temp after regular detail rows", () => {
    const html = renderToStaticMarkup(
      <InvoiceDetails type="bolt11" data={bolt11Data} />
    )

    expect(html.indexOf("Payment Hash")).toBeLessThan(html.indexOf("Unknown Tag 16"))
    expect(html.indexOf("Unknown Tag 16")).toBeLessThan(html.indexOf("Words Temp"))
  })
})
