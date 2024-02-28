import { test, expect } from "vitest"
import { convertUnixTimeStampToReadableTime } from "../formatter"

test("test", () => {
  const time = convertUnixTimeStampToReadableTime(1709112255)
  expect(time).toBe("2024-02-28 17:24")
})
