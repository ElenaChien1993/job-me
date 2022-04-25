const helper = {
  findUnique(array) {
    const ids = array.map((item) => item.creator);
    const uniqueIds = ids
      .map((item, index, array) => {
        if (index === array.indexOf(item)) {
          return index;
        }
      })
      .filter((item) => item !== undefined);

    const final = array.filter(
      (item, index) => uniqueIds.indexOf(index) !== -1
    );
    return final;
  },
  compare(array1, array2) {
    const ids1 = array1.map((item) => item.id);
    const filtered = array2
      .map((item) => item.id)
      .filter((item) => ids1.indexOf(item) === -1);
    const final = array2.filter((item) => filtered.indexOf(item.id) !== -1);
    const combined = [...array1, ...final];
    return combined;
  },
};

export default helper;
