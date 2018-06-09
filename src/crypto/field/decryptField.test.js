/* eslint-disable no-undef, import/first, no-unused-vars */

jest.unmock('./decryptField');

import decryptField from './decryptField';

describe('The decryptField function ', () => {
  it('should decrypt strings', () => {
    const field = 'ENCRYPTED:this is a string';
    const expected = 'this is a string';
    expect(decryptField(field)).toEqual(expected);
  });

  it('should pass through unchanged all other data types', () => {
    expect(decryptField(true)).toEqual(true);
    expect(decryptField(2)).toEqual(2);
    expect(decryptField({ foo: 'bar' })).toEqual({ foo: 'bar' });
    expect(decryptField([1, 2, 3])).toEqual([1, 2, 3]);
  });
});
