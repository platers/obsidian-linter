/** @typedef {import("@typescript-eslint/utils").TSESTree} TSESTree */
/** @typedef {import("@typescript-eslint/utils").TSESLint} TSESLint */

/** @type {TSESLint.RuleModule<"duplicate", []>} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow duplicate values in ignoreListOfTypes and ruleIgnoreTypes",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      duplicate: 'Duplicate value "{{value}}" found.',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    /**
     * @param {(TSESTree.Expression | null)[]} elements
     */
    function checkArray(elements) {
      /** @type {Map<string | number | boolean | null, number>} */
      const seen = new Map();

      elements.forEach((el, index) => {
        if (!el) return;

        let value;

        switch (el.type) {
          case "Literal":
            value = el.value;
            break;

          case "Identifier":
            value = el.name;
            break;

          case "MemberExpression":
            if (
              el.object.type === "Identifier" &&
              el.property.type === "Identifier"
            ) {
              value = `${el.object.name}.${el.property.name}`;
            } else {
              value = sourceCode.getText(el);
            }
            break;

          default:
            return;
        }

        if (seen.has(value)) {
          const firstIndex = seen.get(value);
          const firstNode = elements[firstIndex];
          if (!firstNode) return;

          context.report({
            node: el,
            messageId: "duplicate",
            data: { value: String(value) },

            fix(fixer) {
              const current = el;

              const prevToken = sourceCode.getTokenBefore(current);
              const nextToken = sourceCode.getTokenAfter(current);

              // Case 1: ", value"
              if (prevToken && prevToken.value === ",") {
                return fixer.removeRange([
                  prevToken.range[0],
                  current.range[1],
                ]);
              }

              // Case 2: "value,"
              if (nextToken && nextToken.value === ",") {
                return fixer.removeRange([
                  current.range[0],
                  nextToken.range[1],
                ]);
              }

              // Fallback
              return fixer.remove(current);
            },
          });
        } else {
          seen.set(value, index);
        }
      });
    }

    return {
      /**
       * ignoreListOfTypes([...])
       * @param {TSESTree.CallExpression} node
       */
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "ignoreListOfTypes"
        ) {
          const arg = node.arguments[0];

          if (arg && arg.type === "ArrayExpression") {
            checkArray(arg.elements);
          }
        }
      },

      /**
       * { ruleIgnoreTypes: [...] }
       * @param {TSESTree.Property} node
       */
      Property(node) {
        const isMatch =
          (node.key.type === "Identifier" &&
            node.key.name === "ruleIgnoreTypes") ||
          (node.key.type === "Literal" &&
            node.key.value === "ruleIgnoreTypes");

        if (isMatch && node.value.type === "ArrayExpression") {
          checkArray(node.value.elements);
        }
      },
    };
  },
};
