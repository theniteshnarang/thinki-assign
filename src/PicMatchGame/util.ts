import { BoxType } from "./components/Box";

// This function compares two boxes to check if they have the same value
export function comparePairValue(pair: BoxType[]) {
  if (pair[0].value === pair[1].value) {
    return true;
  }
  return false;
}

export function getMinSecFromTimer(timer: number) {
  const min = Math.floor(timer / 60)
    .toString()
    .padStart(2, "0");
  const sec = (timer % 60).toString().padStart(2, "0");
  return { min, sec };
}

export function shuffleArray<T>(array: T[]): T[] {
  console.log("running");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  console.log({ array });
  return array;
}
