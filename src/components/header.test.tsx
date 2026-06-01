import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Header } from "./header"
import { ThemeProvider } from "./theme-provider"

globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe("Header", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it("clears results when the title is clickable", async () => {
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)
    const onClearResults = vi.fn()

    await act(async () => {
      root.render(
        <ThemeProvider>
          <Header onClearResults={onClearResults} />
        </ThemeProvider>
      )
    })

    await act(async () => {
      container.querySelector("h1 button")?.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      )
    })

    expect(onClearResults).toHaveBeenCalledTimes(1)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it("renders static title when no clear handler is provided", async () => {
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    await act(async () => {
      root.render(
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      )
    })

    expect(container.querySelector("h1 button")).toBeNull()
    expect(container.querySelector("h1")?.textContent).toBe("Lightning Decoder")

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })
})
