import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

export function safeMerge(oldCode, newCode) {
  const oldAst = parse(oldCode, { sourceType: "module" });
  const newAst = parse(newCode, { sourceType: "module" });

  traverse(newAst, {
    FunctionDeclaration(path) {
      const name = path.node.id.name;
      traverse(oldAst, {
        FunctionDeclaration(oldPath) {
          if (oldPath.node.id.name === name) {
            oldPath.replaceWith(path.node);
          }
        }
      });
    }
  });

  return generate(oldAst).code;
}
