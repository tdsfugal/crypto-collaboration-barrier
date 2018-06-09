import React from 'react';
import { string, func, shape, object, array } from 'prop-types';
import { Query } from 'react-apollo';

import mapAST from '../mapAST';
import cleanAST from '../cleanAST';
import { decryptData } from '../crypto';
/* eslint-disable no-console */

export default function SecureQuery({ query, children, ...props }) {
  // Parse the query for @secured annotations to determine which fields to decrypt.
  const securityMap = mapAST(query);

  // Remove the @secured annotations. They confuse the server.
  cleanAST(query);

  return (
    <Query query={query} {...props}>
      {({ data, ...more }) => {
        if (data && Object.keys(data).length > 0) {
          console.log(data);
          const decrypted = decryptData(data, securityMap);
          console.log(decrypted);
          return children({ data: decrypted, ...more });
        }
        return children(more);
      }}
    </Query>
  );
}

/* eslint-disable react/forbid-prop-types */
SecureQuery.propTypes = {
  query: shape({
    // a Graphql AST
    kind: string.isRequired,
    loc: object.isRequired,
    definitions: array.isRequired,
  }).isRequired,
  children: func.isRequired,
};
