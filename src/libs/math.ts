
export function generateRandomInteger(max: number, min = 1): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export function shuffleArray(arrayToShuffle: any[]): any[] {
  // Fisher–Yates shuffle
  const array = arrayToShuffle
  let currentIndex = array.length
  let randomIndex: number
  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}
