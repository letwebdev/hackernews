import { generateRandomInteger } from "../math"

for (let i = 0; i < 5; i++) {
  test("generate random integer", () => {
    expect(generateRandomInteger(5, 1)).toBeLessThanOrEqual(5)
    expect(generateRandomInteger(5, 1)).toBeGreaterThanOrEqual(1)

    expect(generateRandomInteger(7, 2)).toBeLessThanOrEqual(7)
    expect(generateRandomInteger(5, 2)).toBeGreaterThanOrEqual(2)
  })
}
