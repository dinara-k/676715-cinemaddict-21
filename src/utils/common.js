function getArrayElementsInRow(array) {
  let x;
  if (array.length > 1) {
    x = array.join(', ');
  } else {
    x = array;
  }
  return x;
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {getArrayElementsInRow, updateItem};
// export {getArrayElementsInRow};
