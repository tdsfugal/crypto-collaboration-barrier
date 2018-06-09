/* eslint-disable no-undef, import/first, no-unused-vars */

jest.unmock('./index');
const field = jest.genMockFromModule('../field');
field.decryptField = jest.fn(f => `DECRYPTED - ${f}`);

import decryptData from './index';
import decryptField from '../field';

describe('The decryptData function ', () => {
  it('should return an unchanged data object with an empty security map', () => {
    const data = {
      getStuff: {
        blork: 'blork',
        bada: {
          zzzp: 'zzzp',
          zzzap: 'zzzap',
        },
        bing: {
          bang: 'bang',
          boom: {
            bop: 'bop',
            bip: 'bip',
          },
        },
      },
    };
    const securityMap = {};
    const expected = {
      getStuff: {
        blork: 'blork',
        bada: {
          zzzp: 'zzzp',
          zzzap: 'zzzap',
        },
        bing: {
          bang: 'bang',
          boom: {
            bop: 'bop',
            bip: 'bip',
          },
        },
      },
    };
    expect(decryptData(data, securityMap)).toEqual(expected);
  });

  it('should return a modified data object with an valid security map', () => {
    const data = {
      getStuff: {
        blork: 'blork',
        bada: {
          zzzp: 'zzzp',
          zzzap: 'zzzap',
        },
        bing: {
          bang: 'bang',
          boom: {
            bop: 'bop',
            bip: 'bip',
          },
        },
      },
    };
    const securityMap = {
      getStuff: {
        blork: true,
        bada: {
          zzzap: true,
        },
        bing: {
          boom: {
            bop: true,
          },
        },
      },
    };
    const expected = {
      getStuff: {
        blork: 'DECRYPTED - blork',
        bada: {
          zzzp: 'zzzp',
          zzzap: 'DECRYPTED - zzzap',
        },
        bing: {
          bang: 'bang',
          boom: {
            bop: 'DECRYPTED - bop',
            bip: 'bip',
          },
        },
      },
    };
    expect(decryptData(data, securityMap)).toEqual(expected);
  });

  it('should ignore missing data fields', () => {
    const data = {
      getStuff: {
        bada: {
          zzzp: 'zzzp',
        },
        bing: {
          bang: 'bang',
          boom: {
            bop: 'bop',
          },
        },
      },
    };
    const securityMap = {
      getStuff: {
        blork: true,
        bada: {
          zzzap: true,
        },
        bing: {
          boom: {
            bop: true,
            bip: true,
          },
        },
      },
    };
    const expected = {
      getStuff: {
        bada: {
          zzzp: 'zzzp',
        },
        bing: {
          bang: 'bang',
          boom: {
            bop: 'DECRYPTED - bop',
          },
        },
      },
    };
    expect(decryptData(data, securityMap)).toEqual(expected);
  });

  it('should bypass missing data object', () => {
    const data = {};
    const securityMap = {
      getStuff: {
        blork: true,
        bada: {
          zzzap: true,
        },
        bing: {
          boom: {
            bop: true,
            bip: true,
          },
        },
      },
    };
    const expected = {};
    expect(decryptData(data, securityMap)).toEqual(expected);
  });
});
