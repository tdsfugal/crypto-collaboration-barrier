/* eslint-disable no-param-reassign */

function cleanSet(set, level) {
  if (set.selections)
    set.selections = set.selections.map(sel => {
      if (sel.directives)
        sel.directives = sel.directives.filter(
          dir => dir.name.value !== 'secured',
        );
      if (sel.selectionSet)
        sel.selectionSet = cleanSet(sel.selectionSet, level + 1);
      return sel;
    });
  return set;
}

function cleanDef(def) {
  if (!def || def.kind !== 'OperationDefinition')
    throw new Error('top level definition is not an operation');
  def.selectionSet = cleanSet(def.selectionSet, 0);
  return def;
}

function cleanLoc(loc) {
  if (loc && loc.source && loc.source.body) {
    let {
      source: { body },
    } = loc;
    while (body.includes(' @secured')) {
      body = body.replace(' @secured', '');
      loc.end -= 9;
    }
    loc.source.body = body;
  }
  return loc;
}

export default function cleanAST(ast) {
  if (ast.definitions)
    ast.definitions = ast.definitions.map(def => cleanDef(def));
  if (ast.loc) ast.loc = cleanLoc(ast.loc);
  return ast;
}
