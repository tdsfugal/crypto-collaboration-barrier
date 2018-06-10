/* eslint-disable no-undef, import/first, no-unused-vars */

jest.unmock('./index');
// Removes the 'ENCRYPTED - ' substring
jest.mock('../field/encryptField', () => jest.fn(f => `ENCRYPTED - ${f}`));

import encryptData from './index';
import encryptField from '../field/encryptField';

describe('The encryptData function ', () => {
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
    expect(encryptData(data, securityMap)).toEqual(expected);
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
        blork: 'ENCRYPTED - blork',
        bada: {
          zzzp: 'zzzp',
          zzzap: 'ENCRYPTED - zzzap',
        },
        bing: {
          bang: 'bang',
          boom: {
            bop: 'ENCRYPTED - bop',
            bip: 'bip',
          },
        },
      },
    };
    expect(encryptData(data, securityMap)).toEqual(expected);
  });

  it('should ignore unused map fields', () => {
    const data = {
      getStuff: {
        bada: {
          zzzipp: 'zzzp',
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
          zzzipp: 'zzzp',
        },
        bing: {
          bang: 'bang',
          boom: {
            bop: 'ENCRYPTED - bop',
          },
        },
      },
    };
    expect(encryptData(data, securityMap)).toEqual(expected);
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
    expect(encryptData(data, securityMap)).toEqual(expected);
  });
});
