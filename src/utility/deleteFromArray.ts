export async function deleteFromArray(arr: any[], indexToDelete: number) {
  const newArr = [...arr.slice(0, indexToDelete), ...arr.slice(indexToDelete + 1)];
  return newArr;
}
