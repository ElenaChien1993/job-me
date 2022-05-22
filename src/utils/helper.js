const helper = {
  fillterItemWithDuplicateCreator(array) {
    const ids = array.map(item => item.creator);
    const uniqueIds = ids
      .map((item, index, array) => {
        if (index === array.indexOf(item)) {
          return index;
        }
      })
      .filter(item => item !== undefined);

    const final = array.filter((_, index) => uniqueIds.indexOf(index) !== -1);
    return final;
  },
  compare(array1, array2) {
    if (array1.length === 0) return array2;
    if (array2.length === 0) return array1;
    const ids1 = array1.map(item => item.creator);
    const filtered = array2
      .map(item => item.creator)
      .filter(item => ids1.indexOf(item) === -1);
    const final = array2.filter(item => filtered.indexOf(item.creator) !== -1);
    const combined = [...array1, ...final];
    return combined;
  },
};

export default helper;
