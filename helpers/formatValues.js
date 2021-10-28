export default function formatValue(num) {
  num = Number(num)
  if (num < 100) {
    return `${num.toFixed(1)} $`
  }
  if (num > 100 && num < 1000) {
    return `${num.toFixed()} $`
  }
  if (num >= 1000 && num < 10000) {
    return `${num.toFixed()}k $`
  }
  return `${num.toFixed()}k $`

}