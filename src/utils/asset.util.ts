export function convertAssetToPercent(value: number, total: number) {
  return parseFloat(((value / total) * 100).toFixed(2));
}
