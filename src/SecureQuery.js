import React from 'react';
import { string, func, shape, object, array } from 'prop-types';
import { Query } from 'react-apollo';

import { mapAST, cleanAST } from './ast';
import { decryptData } from './crypto';
/* eslint-disable no-console */

export default function SecureQuery({ query, children, ...props }) {
  // Clone the AST
  const queryClone = JSON.parse(JSON.stringify(query));
  // Parse the query for @secured annotations to determine which fields to decrypt.
  const securityMap = mapAST(queryClone);
  // Remove the @secured annotations. They confuse the server. This side effect is why the
  // AST must be cloned.
  cleanAST(queryClone);

  return (
    <Query query={queryClone} {...props}>
      {({ data, ...more }) => {
        if (data && Object.keys(data).length > 0) {
          const decrypted = decryptData(data, securityMap);
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
