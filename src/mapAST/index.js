function isSecured(sel) {
  // fast fail if directive array isn't non-empty
  return (
    sel &&
    sel.directives &&
    sel.directives.length > 0 &&
    sel.directives.reduce(
      (acc, dir) => (dir.name.value === 'secured' ? true : acc),
      false,
    )
  );
}
//
// const secured = isSecured(sel);
// acc[name] = { secured };
// if (sel.selectionSet) {
//   if (secured)
//     throw new Error('Object-level @secured annotations are forbidden');
//   acc[name].fields = mapSelectionSet(sel.selectionSet);
// }

function mapSelectionSet(set) {
  if (!set) return {};
  return set.selections.reduce((acc, sel) => {
    if (sel && sel.name && sel.name.value) {
      const name = sel.name.value;
      if (sel.selectionSet) {
        const result = mapSelectionSet(sel.selectionSet);
        if (Object.keys(result).length > 0) {
          acc[name] = result;
        }
      } else if (isSecured(sel)) acc[name] = true;
    }
    return acc;
  }, {});
}

function mapDef(def) {
  if (!def || def.kind !== 'OperationDefinition')
    throw new Error('Grapql AST not in expected form');
  return mapSelectionSet(def.selectionSet);
}

export default function mapAST(ast) {
  // This reduction section may be insufficient for complex queries with
  // multiple definitions
  return ast.definitions && ast.definitions.length > 0
    ? mapDef(ast.definitions[0])
    : {};
}
