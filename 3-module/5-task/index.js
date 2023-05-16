function getMinMax(str) {
  // ваш код...
  let numbersOnly = str
  .split(' ')
  .map(string => +string)
  .filter(item => isFinite(item));
 
  let result = {
    min: Math.min(...numbersOnly),
    max: Math.max(...numbersOnly),
  }
  return result;
}
