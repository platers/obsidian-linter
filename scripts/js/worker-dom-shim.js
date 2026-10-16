// worker-dom-shim.js

import { decodeHTML } from "entities/decode";

const document = {
  createElement(tagName) {
    let html = "";

    return {
      set innerHTML(value) {
        html = String(value);
      },

      get textContent() {
        return decodeHTML(html);
      },
    };
  },
};

export { document };
