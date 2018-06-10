/* eslint-disable no-undef */
import gql from 'graphql-tag';

import mapAST from './index';

describe('The mapAST function ', () => {
  it('should return a full map if all fields are secured', () => {
    const exampleQuery = gql`
      query getStuff {
        bing {
          bang @secured
          boom {
            bop @secured
            bip @secured
          }
        }
      }
    `;
    const expected = {
      bing: {
        bang: true,
        boom: {
          bop: true,
          bip: true,
        },
      },
    };
    expect(mapAST(exampleQuery)).toEqual(expected);
  });

  it('should return an empty map if there are no @secured annotations', () => {
    const exampleQuery = gql`
      query getStuff {
        bing {
          bang
          boom {
            bop
            bip
          }
        }
      }
    `;
    const expected = {};
    expect(mapAST(exampleQuery)).toEqual(expected);
  });

  it('should return a tree with leaves only for the @secured annotations', () => {
    const exampleQuery = gql`
      query getStuff {
        bada {
          zzzp
          zzzap
        }
        bing {
          bang @secured
          boom {
            bop
            bip @secured
          }
          blork
        }
      }
    `;
    const expected = {
      bing: {
        bang: true,
        boom: {
          bip: true,
        },
      },
    };
    expect(mapAST(exampleQuery)).toEqual(expected);
  });
});
