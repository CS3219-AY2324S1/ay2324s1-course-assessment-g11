export function kebabToProperCase(kebabStr: string): string {
  return kebabStr.split("-").join(" ");
}
