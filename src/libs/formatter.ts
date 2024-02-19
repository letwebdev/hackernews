/**
 * @returns readableTime like this: `2024-2-17 3:29`
 */
export function convertUnixTimeStampToReadableTime(unixTimeStampInSecond: number) {
  const readableTime = new Date(unixTimeStampInSecond * 1000)
  const readableTimeFormatted = `
           ${readableTime.getFullYear()}-${readableTime.getMonth() + 1}-${readableTime.getDate()}
           ${readableTime.getHours()}:${readableTime.getMinutes()}
           `
  return readableTimeFormatted
}
