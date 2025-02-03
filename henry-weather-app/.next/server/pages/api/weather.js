const CHUNK_PUBLIC_PATH = "server/pages/api/weather.js";
const runtime = require("../../chunks/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/[root of the server]__eea4fc._.js");
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/pages/api/weather.ts [api] (ecmascript)\" } [api] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
