import dayjs from "dayjs"

/**
 * @returns readableTime like this: `2024-02-17 01:01`
 */
export function convertUnixTimeStampToReadableTime(unixTimeStampInSecond: number) {
  return dayjs.unix(unixTimeStampInSecond).format("YYYY-MM-DD HH:mm")
}
