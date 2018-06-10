/* eslint-disable no-undef */
import gql from 'graphql-tag';

import cleanAST from './index';

describe('The cleanAST function ', () => {
  it('should remove @secured annotations from a query', () => {
    const query = gql`
      query getAccomplishment {
        accomplishment @client {
          title @foo @secured
          description @secured
        }
      }
    `;
    const expected = gql`
      query getAccomplishment {
        accomplishment @client {
          title @foo
          description
        }
      }
    `;
    expect(cleanAST(query)).toEqual(expected);
  });
});
