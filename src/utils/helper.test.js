import helper from './helper';

describe('fillterItemWithDuplicateCreator function', () => {
  test('normal case', () => {
    const testArray = [
      { creator: '1', content: 'diweoh' },
      { creator: '1', content: 'fiowehf' },
      { creator: '2', content: 'djiqoife' },
      { creator: '3', content: 'djeiwpf' },
    ];
    const result = helper.fillterItemWithDuplicateCreator(testArray);
    expect(result).toEqual([
      { creator: '1', content: 'diweoh' },
      { creator: '2', content: 'djiqoife' },
      { creator: '3', content: 'djeiwpf' },
    ]);
  });

  test('if array is empty', () => {
    const testArray = [];
    const result = helper.fillterItemWithDuplicateCreator(testArray);
    expect(result).toEqual([]);
  });
});

describe('compare function', () => {
  test('normal case', () => {
    const testArray1 = [
      { creator: '1', content: 'diweoh' },
      { creator: '2', content: 'djiqoife' },
      { creator: '3', content: 'djeiwpf' },
    ];
    const testArray2 = [
      { creator: '1', content: 'diweoh' },
      { creator: '1', content: 'fiowehf' },
      { creator: '2', content: 'djiqoife' },
      { creator: '3', content: 'djeiwpf' },
    ];
    const result = helper.compare(testArray1, testArray2);
    expect(result).toEqual([
      { creator: '1', content: 'diweoh' },
      { creator: '2', content: 'djiqoife' },
      { creator: '3', content: 'djeiwpf' },
    ]);
  });

  test('one array is empty', () => {
    const testArray1 = [];
    const testArray2 = [
      { creator: '1', content: 'fiowehf' },
      { creator: '2', content: 'djiqoife' },
      { creator: '3', content: 'djeiwpf' },
    ];
    const result = helper.compare(testArray1, testArray2);
    expect(result).toEqual(testArray2);
  });

  test('both arrays are empty', () => {
    const testArray1 = [];
    const testArray2 = [];
    const result = helper.compare(testArray1, testArray2);
    expect(result).toEqual([]);
  });

  test('one array is undefined', () => {
    const testArray1 = [
      { creator: '1', content: 'fiowehf' },
      { creator: '2', content: 'djiqoife' },
    ];
    const testArray2 = undefined;
    const result = helper.compare(testArray1, testArray2);
    expect(result).toEqual(testArray1);
  });

  test('both arrays are undefined', () => {
    const testArray1 = undefined;
    const testArray2 = undefined;
    const result = helper.compare(testArray1, testArray2);
    expect(result).toEqual([]);
  });
});
