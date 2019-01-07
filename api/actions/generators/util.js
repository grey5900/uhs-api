/**
 * Created by isaac on 3/15/16.
 */
export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}