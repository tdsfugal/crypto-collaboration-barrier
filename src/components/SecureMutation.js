/* eslint-disable function-paren-newline */

import React from 'react';
import { string, func, shape, object, array, arrayOf } from 'prop-types';
import { Mutation } from 'react-apollo';

import mapAST from '../mapAST';
import cleanAST from '../cleanAST';
import { encryptVars, encryptData, decryptData } from '../crypto';

export default function SecureMutation({
  mutation,
  secured, // This is an array of variable names to be secured
  children,
  // TODO - Figure out how the top-level variables play into the mutation
  // TODO - Figure out how the top-level optimisticResponse plays into the mutation
  // TODO - The update function should exist purely on the encrypted side of
  //        the barrier. That's a big "should."  Needs to be checked out.
  ...props
}) {
  // Parse the query for @secured annotations to determine which data fields to decrypt.
  const securityMap = mapAST(mutation);
  // Remove the @secured annotations. They confuse the server.
  cleanAST(mutation);

  // wrap the mutation function to secure both input and output
  return (
    <Mutation mutation={mutation} {...props}>
      {mutate =>
        children(({ variables, optimisticResponse, ...more }) =>
          decryptData(
            mutate({
              variables: encryptVars(variables, secured),
              optimisticResponse: encryptData(optimisticResponse, securityMap),
              ...more,
            }),
            securityMap,
          ),
        )
      }
    </Mutation>
  );
}

/* eslint-disable react/forbid-prop-types */
SecureMutation.propTypes = {
  mutation: shape({
    // a Graphql AST
    kind: string.isRequired,
    loc: object.isRequired,
    definitions: array.isRequired,
  }).isRequired,
  secured: arrayOf(string).isRequired,
  children: func.isRequired,
  variables: object,
  optimisticResponse: object,
};

SecureMutation.defaultProps = {
  variables: null,
  optimisticResponse: null,
};
