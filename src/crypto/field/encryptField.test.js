/* eslint-disable no-undef, import/first, no-unused-vars */

jest.unmock('./encryptField');

import encryptField from './encryptField';

describe('The encryptField function ', () => {
  it('should encrypt strings', () => {
    const field = 'this is a string';
    const expected = 'ENCRYPTED:this is a string';
    expect(encryptField(field)).toEqual(expected);
  });

  it('should pass through unchanged all other data types', () => {
    expect(decryptField(true)).toEqual(true);
    expect(decryptField(2)).toEqual(2);
    expect(decryptField({ foo: 'bar' })).toEqual({ foo: 'bar' });
    expect(decryptField([1, 2, 3])).toEqual([1, 2, 3]);
  });
});
