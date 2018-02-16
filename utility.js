export function getTime () {
  const t = process.hrtime()
  return t[0] * 1000000 + t[1] / 1000
}
