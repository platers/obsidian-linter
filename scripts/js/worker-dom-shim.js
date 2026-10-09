// worker-dom-shim.js
import { parseHTML } from "linkedom/worker";

const { document } = parseHTML("<html><body></body></html>");

export { document };
