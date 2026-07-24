var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// .wrangler/tmp/bundle-p2Burs/checked-fetch.js
var require_checked_fetch = __commonJS({
  ".wrangler/tmp/bundle-p2Burs/checked-fetch.js"() {
    "use strict";
    var urls = /* @__PURE__ */ new Set();
    function checkURL(request, init) {
      const url = request instanceof URL ? request : new URL(
        (typeof request === "string" ? new Request(request, init) : request).url
      );
      if (url.port && url.port !== "443" && url.protocol === "https:") {
        if (!urls.has(url.toString())) {
          urls.add(url.toString());
          console.warn(
            `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
          );
        }
      }
    }
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var import_checked_fetch;
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    import_checked_fetch = __toESM(require_checked_fetch());
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
    var import_checked_fetch45 = __toESM(require_checked_fetch());
    init_modules_watch_stub();
  }
});

// .wrangler/tmp/bundle-p2Burs/middleware-loader.entry.ts
var import_checked_fetch44 = __toESM(require_checked_fetch());
init_modules_watch_stub();

// .wrangler/tmp/bundle-p2Burs/middleware-insertion-facade.js
var import_checked_fetch42 = __toESM(require_checked_fetch());
init_modules_watch_stub();

// src/index.ts
var import_checked_fetch39 = __toESM(require_checked_fetch());
init_modules_watch_stub();

// node_modules/hono/dist/index.js
var import_checked_fetch27 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/hono.js
var import_checked_fetch26 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/hono-base.js
var import_checked_fetch14 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/compose.js
var import_checked_fetch2 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/context.js
var import_checked_fetch11 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/request.js
var import_checked_fetch9 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/http-exception.js
var import_checked_fetch3 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/request/constants.js
var import_checked_fetch4 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
var import_checked_fetch7 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/utils/buffer.js
var import_checked_fetch6 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/utils/crypto.js
var import_checked_fetch5 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = /* @__PURE__ */ __name((arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      // Normalize the media type (case-insensitive) while keeping parameters like the boundary
      "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase())
    }
  });
  return response.formData();
}, "bufferToFormData");

// node_modules/hono/dist/utils/body.js
var isRawRequest = /* @__PURE__ */ __name((request) => "headers" in request, "isRawRequest");
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const contentType = headers.get("Content-Type");
  const mediaType = contentType?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) {
    request.bodyCache.formData = formDataPromise;
  }
  const formData = await formDataPromise;
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
var import_checked_fetch8 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var import_checked_fetch10 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/hono/dist/router.js
var import_checked_fetch12 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/utils/constants.js
var import_checked_fetch13 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/hono/dist/router/reg-exp-router/index.js
var import_checked_fetch20 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/router/reg-exp-router/router.js
var import_checked_fetch18 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var import_checked_fetch15 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/hono/dist/router/reg-exp-router/node.js
var import_checked_fetch16 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var import_checked_fetch17 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/reg-exp-router/prepared-router.js
var import_checked_fetch19 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/router/smart-router/index.js
var import_checked_fetch22 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/router/smart-router/router.js
var import_checked_fetch21 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/index.js
var import_checked_fetch25 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/router/trie-router/router.js
var import_checked_fetch24 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/hono/dist/router/trie-router/node.js
var import_checked_fetch23 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  node.#params,
                  params
                );
              }
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var import_checked_fetch28 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var cors = /* @__PURE__ */ __name((options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// node_modules/@pushforge/builder/dist/lib/main.js
var import_checked_fetch37 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/request.js
var import_checked_fetch36 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/crypto.js
var import_checked_fetch29 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
if (!globalThis.crypto?.subtle) {
  throw new Error("Web Crypto API not available. Ensure you are using Node.js 20+ or a modern runtime with globalThis.crypto support.");
}
var isomorphicCrypto = globalThis.crypto;
var crypto2 = {
  /**
   * Fills the given typed array with cryptographically secure random values.
   *
   * @param {T} array - The typed array to fill with random values.
   * @returns {T} The filled typed array.
   * @template T - The type of the typed array (e.g., Uint8Array).
   */
  getRandomValues(array) {
    return isomorphicCrypto.getRandomValues(array);
  },
  /**
   * Provides access to subtle cryptographic operations.
   *
   * @type {SubtleCrypto} The subtle cryptographic interface.
   */
  subtle: isomorphicCrypto.subtle
};

// node_modules/@pushforge/builder/dist/lib/payload.js
var import_checked_fetch33 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/base64.js
var import_checked_fetch31 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/utils.js
var import_checked_fetch30 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var stringFromArrayBuffer = /* @__PURE__ */ __name((s) => {
  let result = "";
  for (const code of new Uint8Array(s))
    result += String.fromCharCode(code);
  return result;
}, "stringFromArrayBuffer");
var base64Decode = /* @__PURE__ */ __name((base64String) => {
  const paddedBase64 = base64String.padEnd(base64String.length + (4 - (base64String.length % 4 || 4)) % 4, "=");
  if (typeof Buffer !== "undefined") {
    return Buffer.from(paddedBase64, "base64").toString("binary");
  }
  if (typeof atob === "function") {
    return atob(paddedBase64);
  }
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let result = "";
  let i = 0;
  while (i < paddedBase64.length) {
    const enc1 = characters.indexOf(paddedBase64.charAt(i++));
    const enc2 = characters.indexOf(paddedBase64.charAt(i++));
    const enc3 = characters.indexOf(paddedBase64.charAt(i++));
    const enc4 = characters.indexOf(paddedBase64.charAt(i++));
    const char1 = enc1 << 2 | enc2 >> 4;
    const char2 = (enc2 & 15) << 4 | enc3 >> 2;
    const char3 = (enc3 & 3) << 6 | enc4;
    result += String.fromCharCode(char1);
    if (enc3 !== 64)
      result += String.fromCharCode(char2);
    if (enc4 !== 64)
      result += String.fromCharCode(char3);
  }
  return result;
}, "base64Decode");
var getPublicKeyFromJwk = /* @__PURE__ */ __name((jwk) => base64UrlEncode(`${base64Decode(base64UrlDecodeString(jwk.x))}${base64Decode(base64UrlDecodeString(jwk.y))}`), "getPublicKeyFromJwk");
var concatTypedArrays = /* @__PURE__ */ __name((arrays) => {
  const length = arrays.reduce((accumulator, current) => accumulator + current.byteLength, 0);
  let index = 0;
  const targetArray = new Uint8Array(length);
  for (const array of arrays) {
    targetArray.set(array, index);
    index += array.byteLength;
  }
  return targetArray;
}, "concatTypedArrays");

// node_modules/@pushforge/builder/dist/lib/base64.js
var base64UrlEncode = /* @__PURE__ */ __name((input) => {
  const text = typeof input === "string" ? input : stringFromArrayBuffer(input);
  let base64;
  if (typeof globalThis !== "undefined" && "btoa" in globalThis) {
    base64 = globalThis.btoa(text);
  } else {
    base64 = Buffer.from(text, "binary").toString("base64");
  }
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}, "base64UrlEncode");
var base64UrlDecodeString = /* @__PURE__ */ __name((s) => {
  if (!s)
    throw new Error("Invalid input");
  return s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - s.length % 4) % 4);
}, "base64UrlDecodeString");
var base64UrlDecode = /* @__PURE__ */ __name((input) => {
  const base64 = base64UrlDecodeString(input);
  if (typeof globalThis !== "undefined" && "atob" in globalThis) {
    const binaryString = globalThis.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  return Buffer.from(base64, "base64").buffer;
}, "base64UrlDecode");

// node_modules/@pushforge/builder/dist/lib/shared-secret.js
var import_checked_fetch32 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var deriveSharedSecret = /* @__PURE__ */ __name(async (clientPublicKey, localPrivateKey) => {
  const sharedSecretBytes = await crypto2.subtle.deriveBits({ name: "ECDH", public: clientPublicKey }, localPrivateKey, 256);
  return crypto2.subtle.importKey("raw", sharedSecretBytes, { name: "HKDF" }, false, ["deriveBits", "deriveKey"]);
}, "deriveSharedSecret");

// node_modules/@pushforge/builder/dist/lib/payload.js
var importClientKeys = /* @__PURE__ */ __name(async (keys) => {
  const auth = base64UrlDecode(keys.auth);
  if (auth.byteLength !== 16) {
    throw new Error(`Incorrect auth length, expected 16 bytes but got ${auth.byteLength}`);
  }
  let decodedKey;
  const base64Key = base64UrlDecodeString(keys.p256dh);
  if (typeof globalThis !== "undefined" && "atob" in globalThis) {
    const binaryStr = globalThis.atob(base64Key);
    decodedKey = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      decodedKey[i] = binaryStr.charCodeAt(i);
    }
  } else {
    decodedKey = new Uint8Array(Buffer.from(base64Key, "base64"));
  }
  if (decodedKey.byteLength !== 65) {
    throw new Error(`Invalid p256dh key: expected 65 bytes but got ${decodedKey.byteLength} bytes`);
  }
  if (decodedKey[0] !== 4) {
    throw new Error(`Invalid p256dh key: expected uncompressed point format (0x04 prefix) but got 0x${decodedKey[0].toString(16).padStart(2, "0")}`);
  }
  const p256 = await crypto2.subtle.importKey("jwk", {
    kty: "EC",
    crv: "P-256",
    x: base64UrlEncode(decodedKey.slice(1, 33)),
    y: base64UrlEncode(decodedKey.slice(33, 65)),
    ext: true
  }, { name: "ECDH", namedCurve: "P-256" }, true, []);
  return { auth, p256 };
}, "importClientKeys");
var derivePseudoRandomKey = /* @__PURE__ */ __name(async (auth, sharedSecret) => {
  const pseudoRandomKeyBytes = await crypto2.subtle.deriveBits({
    name: "HKDF",
    hash: "SHA-256",
    salt: auth,
    // Adding Content-Encoding data info here is required by the Web Push API
    info: new TextEncoder().encode("Content-Encoding: auth\0")
  }, sharedSecret, 256);
  return crypto2.subtle.importKey("raw", pseudoRandomKeyBytes, "HKDF", false, [
    "deriveBits"
  ]);
}, "derivePseudoRandomKey");
var createContext = /* @__PURE__ */ __name(async (clientPublicKey, localPublicKey) => {
  const [clientKeyBytes, localKeyBytes] = await Promise.all([
    crypto2.subtle.exportKey("raw", clientPublicKey),
    crypto2.subtle.exportKey("raw", localPublicKey)
  ]);
  return concatTypedArrays([
    new TextEncoder().encode("P-256\0"),
    new Uint8Array([0, clientKeyBytes.byteLength]),
    new Uint8Array(clientKeyBytes),
    new Uint8Array([0, localKeyBytes.byteLength]),
    new Uint8Array(localKeyBytes)
  ]);
}, "createContext");
var deriveNonce = /* @__PURE__ */ __name(async (pseudoRandomKey, salt, context) => {
  const nonceInfo = concatTypedArrays([
    new TextEncoder().encode("Content-Encoding: nonce\0"),
    context
  ]);
  return crypto2.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info: nonceInfo }, pseudoRandomKey, 12 * 8);
}, "deriveNonce");
var deriveContentEncryptionKey = /* @__PURE__ */ __name(async (pseudoRandomKey, salt, context) => {
  const info = concatTypedArrays([
    new TextEncoder().encode("Content-Encoding: aesgcm\0"),
    context
  ]);
  const bits = await crypto2.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, pseudoRandomKey, 16 * 8);
  return crypto2.subtle.importKey("raw", bits, "AES-GCM", false, ["encrypt"]);
}, "deriveContentEncryptionKey");
var MAX_PAYLOAD_SIZE = 4078;
var PADDING_LENGTH_PREFIX_SIZE = 2;
var padPayload = /* @__PURE__ */ __name((payload) => {
  const maxPayloadContentSize = MAX_PAYLOAD_SIZE - PADDING_LENGTH_PREFIX_SIZE;
  if (payload.byteLength > maxPayloadContentSize) {
    throw new Error(`Payload too large. Maximum size is ${maxPayloadContentSize} bytes, but received ${payload.byteLength} bytes`);
  }
  const availableSpace = MAX_PAYLOAD_SIZE - PADDING_LENGTH_PREFIX_SIZE - payload.byteLength;
  const maxRandomPadding = Math.min(100, availableSpace);
  const paddingSize = maxRandomPadding > 0 ? Math.floor(Math.random() * (maxRandomPadding + 1)) : 0;
  const paddingArray = new ArrayBuffer(PADDING_LENGTH_PREFIX_SIZE + paddingSize);
  new DataView(paddingArray).setUint16(0, paddingSize);
  return concatTypedArrays([new Uint8Array(paddingArray), payload]);
}, "padPayload");
var encryptPayload = /* @__PURE__ */ __name(async (localKeys, salt, payload, target) => {
  const clientKeys = await importClientKeys(target.keys);
  const sharedSecret = await deriveSharedSecret(clientKeys.p256, localKeys.privateKey);
  const pseudoRandomKey = await derivePseudoRandomKey(clientKeys.auth, sharedSecret);
  const context = await createContext(clientKeys.p256, localKeys.publicKey);
  const nonce = await deriveNonce(pseudoRandomKey, salt, context);
  const contentEncryptionKey = await deriveContentEncryptionKey(pseudoRandomKey, salt, context);
  const encodedPayload = new TextEncoder().encode(payload);
  const paddedPayload = padPayload(encodedPayload);
  return crypto2.subtle.encrypt({ name: "AES-GCM", iv: nonce }, contentEncryptionKey, paddedPayload);
}, "encryptPayload");

// node_modules/@pushforge/builder/dist/lib/vapid.js
var import_checked_fetch35 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/jwt.js
var import_checked_fetch34 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var createJwt = /* @__PURE__ */ __name(async (jwk, jwtData) => {
  const jwtInfo = {
    typ: "JWT",
    // Type of the token
    alg: "ES256"
    // Algorithm used for signing
  };
  const base64JwtInfo = base64UrlEncode(JSON.stringify(jwtInfo));
  const base64JwtData = base64UrlEncode(JSON.stringify(jwtData));
  const unsignedToken = `${base64JwtInfo}.${base64JwtData}`;
  const privateKey = await crypto2.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, true, ["sign"]);
  const signature = await crypto2.subtle.sign({ name: "ECDSA", hash: { name: "SHA-256" } }, privateKey, new TextEncoder().encode(unsignedToken)).then((token) => base64UrlEncode(token));
  return `${base64JwtInfo}.${base64JwtData}.${signature}`;
}, "createJwt");

// node_modules/@pushforge/builder/dist/lib/vapid.js
var vapidHeaders = /* @__PURE__ */ __name(async (options, payloadLength, salt, localPublicKey) => {
  const localPublicKeyBase64 = await crypto2.subtle.exportKey("raw", localPublicKey).then((bytes) => base64UrlEncode(bytes));
  const serverPublicKey = getPublicKeyFromJwk(options.jwk);
  const jwt = await createJwt(options.jwk, options.jwt);
  const headerValues = {
    Encryption: `salt=${base64UrlEncode(salt)}`,
    "Crypto-Key": `dh=${localPublicKeyBase64}`,
    "Content-Length": payloadLength.toString(),
    "Content-Type": "application/octet-stream",
    "Content-Encoding": "aesgcm",
    Authorization: `vapid t=${jwt}, k=${serverPublicKey}`
  };
  let headers;
  if (options.ttl !== void 0)
    headerValues.TTL = options.ttl.toString();
  if (options.topic !== void 0)
    headerValues.Topic = options.topic;
  if (options.urgency !== void 0)
    headerValues.Urgency = options.urgency;
  if (typeof Headers !== "undefined") {
    headers = new Headers(headerValues);
  } else {
    headers = headerValues;
  }
  return headers;
}, "vapidHeaders");

// node_modules/@pushforge/builder/dist/lib/request.js
var validatePrivateJWK = /* @__PURE__ */ __name((jwk) => {
  if (jwk.kty !== "EC") {
    throw new Error(`Invalid JWK: 'kty' must be 'EC', received '${jwk.kty ?? "undefined"}'`);
  }
  if (jwk.crv !== "P-256") {
    throw new Error(`Invalid JWK: 'crv' must be 'P-256', received '${jwk.crv ?? "undefined"}'`);
  }
  if (!jwk.x || typeof jwk.x !== "string") {
    throw new Error("Invalid JWK: missing or invalid 'x' coordinate");
  }
  if (!jwk.y || typeof jwk.y !== "string") {
    throw new Error("Invalid JWK: missing or invalid 'y' coordinate");
  }
  if (!jwk.d || typeof jwk.d !== "string") {
    throw new Error("Invalid JWK: missing or invalid 'd' (private key)");
  }
}, "validatePrivateJWK");
var validateEndpoint = /* @__PURE__ */ __name((endpoint) => {
  let url;
  try {
    url = new URL(endpoint);
  } catch {
    throw new Error(`Invalid subscription endpoint: '${endpoint}' is not a valid URL`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`Invalid subscription endpoint: push endpoints must use HTTPS, received '${url.protocol}'`);
  }
}, "validateEndpoint");
async function buildPushHTTPRequest({ privateJWK, message, subscription }) {
  let jwk;
  try {
    jwk = typeof privateJWK === "string" ? JSON.parse(privateJWK) : privateJWK;
  } catch {
    throw new Error("Invalid privateJWK: failed to parse JSON string");
  }
  validatePrivateJWK(jwk);
  validateEndpoint(subscription.endpoint);
  const MAX_TTL = 24 * 60 * 60;
  if (message.options?.ttl && message.options.ttl > MAX_TTL) {
    throw new Error("TTL must be less than 24 hours");
  }
  const ttl = message.options?.ttl && message.options.ttl > 0 ? message.options.ttl : MAX_TTL;
  const jwt = {
    aud: new URL(subscription.endpoint).origin,
    exp: Math.floor(Date.now() / 1e3) + ttl,
    sub: message.adminContact
  };
  const options = {
    jwk,
    jwt,
    payload: JSON.stringify(message.payload),
    ttl,
    ...message.options?.urgency && {
      urgency: message.options.urgency
    },
    ...message.options?.topic && {
      topic: message.options.topic
    }
  };
  const salt = crypto2.getRandomValues(new Uint8Array(16));
  const localKeys = await crypto2.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const body = await encryptPayload(localKeys, salt, options.payload, subscription);
  const headers = await vapidHeaders(options, body.byteLength, salt, localKeys.publicKey);
  return { endpoint: subscription.endpoint, body, headers };
}
__name(buildPushHTTPRequest, "buildPushHTTPRequest");

// node_modules/bcryptjs/index.js
var import_checked_fetch38 = __toESM(require_checked_fetch(), 1);
init_modules_watch_stub();
var import_crypto7 = __toESM(require_crypto(), 1);
var randomFallback = null;
function randomBytes(len) {
  try {
    return crypto.getRandomValues(new Uint8Array(len));
  } catch {
  }
  try {
    return import_crypto7.default.randomBytes(len);
  } catch {
  }
  if (!randomFallback) {
    throw Error(
      "Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative"
    );
  }
  return randomFallback(len);
}
__name(randomBytes, "randomBytes");
function setRandomFallback(random) {
  randomFallback = random;
}
__name(setRandomFallback, "setRandomFallback");
function genSaltSync(rounds, seed_length) {
  rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
  if (typeof rounds !== "number")
    throw Error(
      "Illegal arguments: " + typeof rounds + ", " + typeof seed_length
    );
  if (rounds < 4) rounds = 4;
  else if (rounds > 31) rounds = 31;
  var salt = [];
  salt.push("$2b$");
  if (rounds < 10) salt.push("0");
  salt.push(rounds.toString());
  salt.push("$");
  salt.push(base64_encode(randomBytes(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN));
  return salt.join("");
}
__name(genSaltSync, "genSaltSync");
function genSalt(rounds, seed_length, callback) {
  if (typeof seed_length === "function")
    callback = seed_length, seed_length = void 0;
  if (typeof rounds === "function") callback = rounds, rounds = void 0;
  if (typeof rounds === "undefined") rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
  else if (typeof rounds !== "number")
    throw Error("illegal arguments: " + typeof rounds);
  function _async(callback2) {
    nextTick(function() {
      try {
        callback2(null, genSaltSync(rounds));
      } catch (err) {
        callback2(err);
      }
    });
  }
  __name(_async, "_async");
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
__name(genSalt, "genSalt");
function hashSync(password, salt) {
  if (typeof salt === "undefined") salt = GENSALT_DEFAULT_LOG2_ROUNDS;
  if (typeof salt === "number") salt = genSaltSync(salt);
  if (typeof password !== "string" || typeof salt !== "string")
    throw Error("Illegal arguments: " + typeof password + ", " + typeof salt);
  return _hash(password, salt);
}
__name(hashSync, "hashSync");
function hash(password, salt, callback, progressCallback) {
  function _async(callback2) {
    if (typeof password === "string" && typeof salt === "number")
      genSalt(salt, function(err, salt2) {
        _hash(password, salt2, callback2, progressCallback);
      });
    else if (typeof password === "string" && typeof salt === "string")
      _hash(password, salt, callback2, progressCallback);
    else
      nextTick(
        callback2.bind(
          this,
          Error("Illegal arguments: " + typeof password + ", " + typeof salt)
        )
      );
  }
  __name(_async, "_async");
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
__name(hash, "hash");
function safeStringCompare(known, unknown) {
  var diff = known.length ^ unknown.length;
  for (var i = 0; i < known.length; ++i) {
    diff |= known.charCodeAt(i) ^ unknown.charCodeAt(i);
  }
  return diff === 0;
}
__name(safeStringCompare, "safeStringCompare");
function compareSync(password, hash2) {
  if (typeof password !== "string" || typeof hash2 !== "string")
    throw Error("Illegal arguments: " + typeof password + ", " + typeof hash2);
  if (hash2.length !== 60) return false;
  return safeStringCompare(
    hashSync(password, hash2.substring(0, hash2.length - 31)),
    hash2
  );
}
__name(compareSync, "compareSync");
function compare(password, hashValue, callback, progressCallback) {
  function _async(callback2) {
    if (typeof password !== "string" || typeof hashValue !== "string") {
      nextTick(
        callback2.bind(
          this,
          Error(
            "Illegal arguments: " + typeof password + ", " + typeof hashValue
          )
        )
      );
      return;
    }
    if (hashValue.length !== 60) {
      nextTick(callback2.bind(this, null, false));
      return;
    }
    hash(
      password,
      hashValue.substring(0, 29),
      function(err, comp) {
        if (err) callback2(err);
        else callback2(null, safeStringCompare(comp, hashValue));
      },
      progressCallback
    );
  }
  __name(_async, "_async");
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
__name(compare, "compare");
function getRounds(hash2) {
  if (typeof hash2 !== "string")
    throw Error("Illegal arguments: " + typeof hash2);
  return parseInt(hash2.split("$")[2], 10);
}
__name(getRounds, "getRounds");
function getSalt(hash2) {
  if (typeof hash2 !== "string")
    throw Error("Illegal arguments: " + typeof hash2);
  if (hash2.length !== 60)
    throw Error("Illegal hash length: " + hash2.length + " != 60");
  return hash2.substring(0, 29);
}
__name(getSalt, "getSalt");
function truncates(password) {
  if (typeof password !== "string")
    throw Error("Illegal arguments: " + typeof password);
  return utf8Length(password) > 72;
}
__name(truncates, "truncates");
var nextTick = typeof setImmediate === "function" ? setImmediate : typeof scheduler === "object" && typeof scheduler.postTask === "function" ? scheduler.postTask.bind(scheduler) : setTimeout;
function utf8Length(string) {
  var len = 0, c = 0;
  for (var i = 0; i < string.length; ++i) {
    c = string.charCodeAt(i);
    if (c < 128) len += 1;
    else if (c < 2048) len += 2;
    else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
      ++i;
      len += 4;
    } else len += 3;
  }
  return len;
}
__name(utf8Length, "utf8Length");
function utf8Array(string) {
  var offset = 0, c1, c2;
  var buffer = new Array(utf8Length(string));
  for (var i = 0, k = string.length; i < k; ++i) {
    c1 = string.charCodeAt(i);
    if (c1 < 128) {
      buffer[offset++] = c1;
    } else if (c1 < 2048) {
      buffer[offset++] = c1 >> 6 | 192;
      buffer[offset++] = c1 & 63 | 128;
    } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
      c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
      ++i;
      buffer[offset++] = c1 >> 18 | 240;
      buffer[offset++] = c1 >> 12 & 63 | 128;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    } else {
      buffer[offset++] = c1 >> 12 | 224;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    }
  }
  return buffer;
}
__name(utf8Array, "utf8Array");
var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
var BASE64_INDEX = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  -1,
  -1,
  -1,
  -1,
  -1
];
function base64_encode(b, len) {
  var off = 0, rs = [], c1, c2;
  if (len <= 0 || len > b.length) throw Error("Illegal len: " + len);
  while (off < len) {
    c1 = b[off++] & 255;
    rs.push(BASE64_CODE[c1 >> 2 & 63]);
    c1 = (c1 & 3) << 4;
    if (off >= len) {
      rs.push(BASE64_CODE[c1 & 63]);
      break;
    }
    c2 = b[off++] & 255;
    c1 |= c2 >> 4 & 15;
    rs.push(BASE64_CODE[c1 & 63]);
    c1 = (c2 & 15) << 2;
    if (off >= len) {
      rs.push(BASE64_CODE[c1 & 63]);
      break;
    }
    c2 = b[off++] & 255;
    c1 |= c2 >> 6 & 3;
    rs.push(BASE64_CODE[c1 & 63]);
    rs.push(BASE64_CODE[c2 & 63]);
  }
  return rs.join("");
}
__name(base64_encode, "base64_encode");
function base64_decode(s, len) {
  var off = 0, slen = s.length, olen = 0, rs = [], c1, c2, c3, c4, o, code;
  if (len <= 0) throw Error("Illegal len: " + len);
  while (off < slen - 1 && olen < len) {
    code = s.charCodeAt(off++);
    c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    code = s.charCodeAt(off++);
    c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c1 == -1 || c2 == -1) break;
    o = c1 << 2 >>> 0;
    o |= (c2 & 48) >> 4;
    rs.push(String.fromCharCode(o));
    if (++olen >= len || off >= slen) break;
    code = s.charCodeAt(off++);
    c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c3 == -1) break;
    o = (c2 & 15) << 4 >>> 0;
    o |= (c3 & 60) >> 2;
    rs.push(String.fromCharCode(o));
    if (++olen >= len || off >= slen) break;
    code = s.charCodeAt(off++);
    c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    o = (c3 & 3) << 6 >>> 0;
    o |= c4;
    rs.push(String.fromCharCode(o));
    ++olen;
  }
  var res = [];
  for (off = 0; off < olen; off++) res.push(rs[off].charCodeAt(0));
  return res;
}
__name(base64_decode, "base64_decode");
var BCRYPT_SALT_LEN = 16;
var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
var BLOWFISH_NUM_ROUNDS = 16;
var MAX_EXECUTION_TIME = 100;
var P_ORIG = [
  608135816,
  2242054355,
  320440878,
  57701188,
  2752067618,
  698298832,
  137296536,
  3964562569,
  1160258022,
  953160567,
  3193202383,
  887688300,
  3232508343,
  3380367581,
  1065670069,
  3041331479,
  2450970073,
  2306472731
];
var S_ORIG = [
  3509652390,
  2564797868,
  805139163,
  3491422135,
  3101798381,
  1780907670,
  3128725573,
  4046225305,
  614570311,
  3012652279,
  134345442,
  2240740374,
  1667834072,
  1901547113,
  2757295779,
  4103290238,
  227898511,
  1921955416,
  1904987480,
  2182433518,
  2069144605,
  3260701109,
  2620446009,
  720527379,
  3318853667,
  677414384,
  3393288472,
  3101374703,
  2390351024,
  1614419982,
  1822297739,
  2954791486,
  3608508353,
  3174124327,
  2024746970,
  1432378464,
  3864339955,
  2857741204,
  1464375394,
  1676153920,
  1439316330,
  715854006,
  3033291828,
  289532110,
  2706671279,
  2087905683,
  3018724369,
  1668267050,
  732546397,
  1947742710,
  3462151702,
  2609353502,
  2950085171,
  1814351708,
  2050118529,
  680887927,
  999245976,
  1800124847,
  3300911131,
  1713906067,
  1641548236,
  4213287313,
  1216130144,
  1575780402,
  4018429277,
  3917837745,
  3693486850,
  3949271944,
  596196993,
  3549867205,
  258830323,
  2213823033,
  772490370,
  2760122372,
  1774776394,
  2652871518,
  566650946,
  4142492826,
  1728879713,
  2882767088,
  1783734482,
  3629395816,
  2517608232,
  2874225571,
  1861159788,
  326777828,
  3124490320,
  2130389656,
  2716951837,
  967770486,
  1724537150,
  2185432712,
  2364442137,
  1164943284,
  2105845187,
  998989502,
  3765401048,
  2244026483,
  1075463327,
  1455516326,
  1322494562,
  910128902,
  469688178,
  1117454909,
  936433444,
  3490320968,
  3675253459,
  1240580251,
  122909385,
  2157517691,
  634681816,
  4142456567,
  3825094682,
  3061402683,
  2540495037,
  79693498,
  3249098678,
  1084186820,
  1583128258,
  426386531,
  1761308591,
  1047286709,
  322548459,
  995290223,
  1845252383,
  2603652396,
  3431023940,
  2942221577,
  3202600964,
  3727903485,
  1712269319,
  422464435,
  3234572375,
  1170764815,
  3523960633,
  3117677531,
  1434042557,
  442511882,
  3600875718,
  1076654713,
  1738483198,
  4213154764,
  2393238008,
  3677496056,
  1014306527,
  4251020053,
  793779912,
  2902807211,
  842905082,
  4246964064,
  1395751752,
  1040244610,
  2656851899,
  3396308128,
  445077038,
  3742853595,
  3577915638,
  679411651,
  2892444358,
  2354009459,
  1767581616,
  3150600392,
  3791627101,
  3102740896,
  284835224,
  4246832056,
  1258075500,
  768725851,
  2589189241,
  3069724005,
  3532540348,
  1274779536,
  3789419226,
  2764799539,
  1660621633,
  3471099624,
  4011903706,
  913787905,
  3497959166,
  737222580,
  2514213453,
  2928710040,
  3937242737,
  1804850592,
  3499020752,
  2949064160,
  2386320175,
  2390070455,
  2415321851,
  4061277028,
  2290661394,
  2416832540,
  1336762016,
  1754252060,
  3520065937,
  3014181293,
  791618072,
  3188594551,
  3933548030,
  2332172193,
  3852520463,
  3043980520,
  413987798,
  3465142937,
  3030929376,
  4245938359,
  2093235073,
  3534596313,
  375366246,
  2157278981,
  2479649556,
  555357303,
  3870105701,
  2008414854,
  3344188149,
  4221384143,
  3956125452,
  2067696032,
  3594591187,
  2921233993,
  2428461,
  544322398,
  577241275,
  1471733935,
  610547355,
  4027169054,
  1432588573,
  1507829418,
  2025931657,
  3646575487,
  545086370,
  48609733,
  2200306550,
  1653985193,
  298326376,
  1316178497,
  3007786442,
  2064951626,
  458293330,
  2589141269,
  3591329599,
  3164325604,
  727753846,
  2179363840,
  146436021,
  1461446943,
  4069977195,
  705550613,
  3059967265,
  3887724982,
  4281599278,
  3313849956,
  1404054877,
  2845806497,
  146425753,
  1854211946,
  1266315497,
  3048417604,
  3681880366,
  3289982499,
  290971e4,
  1235738493,
  2632868024,
  2414719590,
  3970600049,
  1771706367,
  1449415276,
  3266420449,
  422970021,
  1963543593,
  2690192192,
  3826793022,
  1062508698,
  1531092325,
  1804592342,
  2583117782,
  2714934279,
  4024971509,
  1294809318,
  4028980673,
  1289560198,
  2221992742,
  1669523910,
  35572830,
  157838143,
  1052438473,
  1016535060,
  1802137761,
  1753167236,
  1386275462,
  3080475397,
  2857371447,
  1040679964,
  2145300060,
  2390574316,
  1461121720,
  2956646967,
  4031777805,
  4028374788,
  33600511,
  2920084762,
  1018524850,
  629373528,
  3691585981,
  3515945977,
  2091462646,
  2486323059,
  586499841,
  988145025,
  935516892,
  3367335476,
  2599673255,
  2839830854,
  265290510,
  3972581182,
  2759138881,
  3795373465,
  1005194799,
  847297441,
  406762289,
  1314163512,
  1332590856,
  1866599683,
  4127851711,
  750260880,
  613907577,
  1450815602,
  3165620655,
  3734664991,
  3650291728,
  3012275730,
  3704569646,
  1427272223,
  778793252,
  1343938022,
  2676280711,
  2052605720,
  1946737175,
  3164576444,
  3914038668,
  3967478842,
  3682934266,
  1661551462,
  3294938066,
  4011595847,
  840292616,
  3712170807,
  616741398,
  312560963,
  711312465,
  1351876610,
  322626781,
  1910503582,
  271666773,
  2175563734,
  1594956187,
  70604529,
  3617834859,
  1007753275,
  1495573769,
  4069517037,
  2549218298,
  2663038764,
  504708206,
  2263041392,
  3941167025,
  2249088522,
  1514023603,
  1998579484,
  1312622330,
  694541497,
  2582060303,
  2151582166,
  1382467621,
  776784248,
  2618340202,
  3323268794,
  2497899128,
  2784771155,
  503983604,
  4076293799,
  907881277,
  423175695,
  432175456,
  1378068232,
  4145222326,
  3954048622,
  3938656102,
  3820766613,
  2793130115,
  2977904593,
  26017576,
  3274890735,
  3194772133,
  1700274565,
  1756076034,
  4006520079,
  3677328699,
  720338349,
  1533947780,
  354530856,
  688349552,
  3973924725,
  1637815568,
  332179504,
  3949051286,
  53804574,
  2852348879,
  3044236432,
  1282449977,
  3583942155,
  3416972820,
  4006381244,
  1617046695,
  2628476075,
  3002303598,
  1686838959,
  431878346,
  2686675385,
  1700445008,
  1080580658,
  1009431731,
  832498133,
  3223435511,
  2605976345,
  2271191193,
  2516031870,
  1648197032,
  4164389018,
  2548247927,
  300782431,
  375919233,
  238389289,
  3353747414,
  2531188641,
  2019080857,
  1475708069,
  455242339,
  2609103871,
  448939670,
  3451063019,
  1395535956,
  2413381860,
  1841049896,
  1491858159,
  885456874,
  4264095073,
  4001119347,
  1565136089,
  3898914787,
  1108368660,
  540939232,
  1173283510,
  2745871338,
  3681308437,
  4207628240,
  3343053890,
  4016749493,
  1699691293,
  1103962373,
  3625875870,
  2256883143,
  3830138730,
  1031889488,
  3479347698,
  1535977030,
  4236805024,
  3251091107,
  2132092099,
  1774941330,
  1199868427,
  1452454533,
  157007616,
  2904115357,
  342012276,
  595725824,
  1480756522,
  206960106,
  497939518,
  591360097,
  863170706,
  2375253569,
  3596610801,
  1814182875,
  2094937945,
  3421402208,
  1082520231,
  3463918190,
  2785509508,
  435703966,
  3908032597,
  1641649973,
  2842273706,
  3305899714,
  1510255612,
  2148256476,
  2655287854,
  3276092548,
  4258621189,
  236887753,
  3681803219,
  274041037,
  1734335097,
  3815195456,
  3317970021,
  1899903192,
  1026095262,
  4050517792,
  356393447,
  2410691914,
  3873677099,
  3682840055,
  3913112168,
  2491498743,
  4132185628,
  2489919796,
  1091903735,
  1979897079,
  3170134830,
  3567386728,
  3557303409,
  857797738,
  1136121015,
  1342202287,
  507115054,
  2535736646,
  337727348,
  3213592640,
  1301675037,
  2528481711,
  1895095763,
  1721773893,
  3216771564,
  62756741,
  2142006736,
  835421444,
  2531993523,
  1442658625,
  3659876326,
  2882144922,
  676362277,
  1392781812,
  170690266,
  3921047035,
  1759253602,
  3611846912,
  1745797284,
  664899054,
  1329594018,
  3901205900,
  3045908486,
  2062866102,
  2865634940,
  3543621612,
  3464012697,
  1080764994,
  553557557,
  3656615353,
  3996768171,
  991055499,
  499776247,
  1265440854,
  648242737,
  3940784050,
  980351604,
  3713745714,
  1749149687,
  3396870395,
  4211799374,
  3640570775,
  1161844396,
  3125318951,
  1431517754,
  545492359,
  4268468663,
  3499529547,
  1437099964,
  2702547544,
  3433638243,
  2581715763,
  2787789398,
  1060185593,
  1593081372,
  2418618748,
  4260947970,
  69676912,
  2159744348,
  86519011,
  2512459080,
  3838209314,
  1220612927,
  3339683548,
  133810670,
  1090789135,
  1078426020,
  1569222167,
  845107691,
  3583754449,
  4072456591,
  1091646820,
  628848692,
  1613405280,
  3757631651,
  526609435,
  236106946,
  48312990,
  2942717905,
  3402727701,
  1797494240,
  859738849,
  992217954,
  4005476642,
  2243076622,
  3870952857,
  3732016268,
  765654824,
  3490871365,
  2511836413,
  1685915746,
  3888969200,
  1414112111,
  2273134842,
  3281911079,
  4080962846,
  172450625,
  2569994100,
  980381355,
  4109958455,
  2819808352,
  2716589560,
  2568741196,
  3681446669,
  3329971472,
  1835478071,
  660984891,
  3704678404,
  4045999559,
  3422617507,
  3040415634,
  1762651403,
  1719377915,
  3470491036,
  2693910283,
  3642056355,
  3138596744,
  1364962596,
  2073328063,
  1983633131,
  926494387,
  3423689081,
  2150032023,
  4096667949,
  1749200295,
  3328846651,
  309677260,
  2016342300,
  1779581495,
  3079819751,
  111262694,
  1274766160,
  443224088,
  298511866,
  1025883608,
  3806446537,
  1145181785,
  168956806,
  3641502830,
  3584813610,
  1689216846,
  3666258015,
  3200248200,
  1692713982,
  2646376535,
  4042768518,
  1618508792,
  1610833997,
  3523052358,
  4130873264,
  2001055236,
  3610705100,
  2202168115,
  4028541809,
  2961195399,
  1006657119,
  2006996926,
  3186142756,
  1430667929,
  3210227297,
  1314452623,
  4074634658,
  4101304120,
  2273951170,
  1399257539,
  3367210612,
  3027628629,
  1190975929,
  2062231137,
  2333990788,
  2221543033,
  2438960610,
  1181637006,
  548689776,
  2362791313,
  3372408396,
  3104550113,
  3145860560,
  296247880,
  1970579870,
  3078560182,
  3769228297,
  1714227617,
  3291629107,
  3898220290,
  166772364,
  1251581989,
  493813264,
  448347421,
  195405023,
  2709975567,
  677966185,
  3703036547,
  1463355134,
  2715995803,
  1338867538,
  1343315457,
  2802222074,
  2684532164,
  233230375,
  2599980071,
  2000651841,
  3277868038,
  1638401717,
  4028070440,
  3237316320,
  6314154,
  819756386,
  300326615,
  590932579,
  1405279636,
  3267499572,
  3150704214,
  2428286686,
  3959192993,
  3461946742,
  1862657033,
  1266418056,
  963775037,
  2089974820,
  2263052895,
  1917689273,
  448879540,
  3550394620,
  3981727096,
  150775221,
  3627908307,
  1303187396,
  508620638,
  2975983352,
  2726630617,
  1817252668,
  1876281319,
  1457606340,
  908771278,
  3720792119,
  3617206836,
  2455994898,
  1729034894,
  1080033504,
  976866871,
  3556439503,
  2881648439,
  1522871579,
  1555064734,
  1336096578,
  3548522304,
  2579274686,
  3574697629,
  3205460757,
  3593280638,
  3338716283,
  3079412587,
  564236357,
  2993598910,
  1781952180,
  1464380207,
  3163844217,
  3332601554,
  1699332808,
  1393555694,
  1183702653,
  3581086237,
  1288719814,
  691649499,
  2847557200,
  2895455976,
  3193889540,
  2717570544,
  1781354906,
  1676643554,
  2592534050,
  3230253752,
  1126444790,
  2770207658,
  2633158820,
  2210423226,
  2615765581,
  2414155088,
  3127139286,
  673620729,
  2805611233,
  1269405062,
  4015350505,
  3341807571,
  4149409754,
  1057255273,
  2012875353,
  2162469141,
  2276492801,
  2601117357,
  993977747,
  3918593370,
  2654263191,
  753973209,
  36408145,
  2530585658,
  25011837,
  3520020182,
  2088578344,
  530523599,
  2918365339,
  1524020338,
  1518925132,
  3760827505,
  3759777254,
  1202760957,
  3985898139,
  3906192525,
  674977740,
  4174734889,
  2031300136,
  2019492241,
  3983892565,
  4153806404,
  3822280332,
  352677332,
  2297720250,
  60907813,
  90501309,
  3286998549,
  1016092578,
  2535922412,
  2839152426,
  457141659,
  509813237,
  4120667899,
  652014361,
  1966332200,
  2975202805,
  55981186,
  2327461051,
  676427537,
  3255491064,
  2882294119,
  3433927263,
  1307055953,
  942726286,
  933058658,
  2468411793,
  3933900994,
  4215176142,
  1361170020,
  2001714738,
  2830558078,
  3274259782,
  1222529897,
  1679025792,
  2729314320,
  3714953764,
  1770335741,
  151462246,
  3013232138,
  1682292957,
  1483529935,
  471910574,
  1539241949,
  458788160,
  3436315007,
  1807016891,
  3718408830,
  978976581,
  1043663428,
  3165965781,
  1927990952,
  4200891579,
  2372276910,
  3208408903,
  3533431907,
  1412390302,
  2931980059,
  4132332400,
  1947078029,
  3881505623,
  4168226417,
  2941484381,
  1077988104,
  1320477388,
  886195818,
  18198404,
  3786409e3,
  2509781533,
  112762804,
  3463356488,
  1866414978,
  891333506,
  18488651,
  661792760,
  1628790961,
  3885187036,
  3141171499,
  876946877,
  2693282273,
  1372485963,
  791857591,
  2686433993,
  3759982718,
  3167212022,
  3472953795,
  2716379847,
  445679433,
  3561995674,
  3504004811,
  3574258232,
  54117162,
  3331405415,
  2381918588,
  3769707343,
  4154350007,
  1140177722,
  4074052095,
  668550556,
  3214352940,
  367459370,
  261225585,
  2610173221,
  4209349473,
  3468074219,
  3265815641,
  314222801,
  3066103646,
  3808782860,
  282218597,
  3406013506,
  3773591054,
  379116347,
  1285071038,
  846784868,
  2669647154,
  3771962079,
  3550491691,
  2305946142,
  453669953,
  1268987020,
  3317592352,
  3279303384,
  3744833421,
  2610507566,
  3859509063,
  266596637,
  3847019092,
  517658769,
  3462560207,
  3443424879,
  370717030,
  4247526661,
  2224018117,
  4143653529,
  4112773975,
  2788324899,
  2477274417,
  1456262402,
  2901442914,
  1517677493,
  1846949527,
  2295493580,
  3734397586,
  2176403920,
  1280348187,
  1908823572,
  3871786941,
  846861322,
  1172426758,
  3287448474,
  3383383037,
  1655181056,
  3139813346,
  901632758,
  1897031941,
  2986607138,
  3066810236,
  3447102507,
  1393639104,
  373351379,
  950779232,
  625454576,
  3124240540,
  4148612726,
  2007998917,
  544563296,
  2244738638,
  2330496472,
  2058025392,
  1291430526,
  424198748,
  50039436,
  29584100,
  3605783033,
  2429876329,
  2791104160,
  1057563949,
  3255363231,
  3075367218,
  3463963227,
  1469046755,
  985887462
];
var C_ORIG = [
  1332899944,
  1700884034,
  1701343084,
  1684370003,
  1668446532,
  1869963892
];
function _encipher(lr, off, P, S) {
  var n, l = lr[off], r = lr[off + 1];
  l ^= P[0];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[1];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[2];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[3];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[4];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[5];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[6];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[7];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[8];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[9];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[10];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[11];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[12];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[13];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[14];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[15];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[16];
  lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
  lr[off + 1] = l;
  return lr;
}
__name(_encipher, "_encipher");
function _streamtoword(data, offp) {
  for (var i = 0, word = 0; i < 4; ++i)
    word = word << 8 | data[offp] & 255, offp = (offp + 1) % data.length;
  return { key: word, offp };
}
__name(_streamtoword, "_streamtoword");
function _key(key, P, S) {
  var offset = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
  for (var i = 0; i < plen; i++)
    sw = _streamtoword(key, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
  for (i = 0; i < plen; i += 2)
    lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
  for (i = 0; i < slen; i += 2)
    lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
__name(_key, "_key");
function _ekskey(data, key, P, S) {
  var offp = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
  for (var i = 0; i < plen; i++)
    sw = _streamtoword(key, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
  offp = 0;
  for (i = 0; i < plen; i += 2)
    sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
  for (i = 0; i < slen; i += 2)
    sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
__name(_ekskey, "_ekskey");
function _crypt(b, salt, rounds, callback, progressCallback) {
  var cdata = C_ORIG.slice(), clen = cdata.length, err;
  if (rounds < 4 || rounds > 31) {
    err = Error("Illegal number of rounds (4-31): " + rounds);
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  if (salt.length !== BCRYPT_SALT_LEN) {
    err = Error(
      "Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN
    );
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  rounds = 1 << rounds >>> 0;
  var P, S, i = 0, j;
  if (typeof Int32Array === "function") {
    P = new Int32Array(P_ORIG);
    S = new Int32Array(S_ORIG);
  } else {
    P = P_ORIG.slice();
    S = S_ORIG.slice();
  }
  _ekskey(salt, b, P, S);
  function next() {
    if (progressCallback) progressCallback(i / rounds);
    if (i < rounds) {
      var start = Date.now();
      for (; i < rounds; ) {
        i = i + 1;
        _key(b, P, S);
        _key(salt, P, S);
        if (Date.now() - start > MAX_EXECUTION_TIME) break;
      }
    } else {
      for (i = 0; i < 64; i++)
        for (j = 0; j < clen >> 1; j++) _encipher(cdata, j << 1, P, S);
      var ret = [];
      for (i = 0; i < clen; i++)
        ret.push((cdata[i] >> 24 & 255) >>> 0), ret.push((cdata[i] >> 16 & 255) >>> 0), ret.push((cdata[i] >> 8 & 255) >>> 0), ret.push((cdata[i] & 255) >>> 0);
      if (callback) {
        callback(null, ret);
        return;
      } else return ret;
    }
    if (callback) nextTick(next);
  }
  __name(next, "next");
  if (typeof callback !== "undefined") {
    next();
  } else {
    var res;
    while (true) if (typeof (res = next()) !== "undefined") return res || [];
  }
}
__name(_crypt, "_crypt");
function _hash(password, salt, callback, progressCallback) {
  var err;
  if (typeof password !== "string" || typeof salt !== "string") {
    err = Error("Invalid string / salt: Not a string");
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  var minor, offset;
  if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
    err = Error("Invalid salt version: " + salt.substring(0, 2));
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  if (salt.charAt(2) === "$") minor = String.fromCharCode(0), offset = 3;
  else {
    minor = salt.charAt(2);
    if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
      err = Error("Invalid salt revision: " + salt.substring(2, 4));
      if (callback) {
        nextTick(callback.bind(this, err));
        return;
      } else throw err;
    }
    offset = 4;
  }
  if (salt.charAt(offset + 2) > "$") {
    err = Error("Missing salt rounds");
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
  password += minor >= "a" ? "\0" : "";
  var passwordb = utf8Array(password), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
  function finish(bytes) {
    var res = [];
    res.push("$2");
    if (minor >= "a") res.push(minor);
    res.push("$");
    if (rounds < 10) res.push("0");
    res.push(rounds.toString());
    res.push("$");
    res.push(base64_encode(saltb, saltb.length));
    res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
    return res.join("");
  }
  __name(finish, "finish");
  if (typeof callback == "undefined")
    return finish(_crypt(passwordb, saltb, rounds));
  else {
    _crypt(
      passwordb,
      saltb,
      rounds,
      function(err2, bytes) {
        if (err2) callback(err2, null);
        else callback(null, finish(bytes));
      },
      progressCallback
    );
  }
}
__name(_hash, "_hash");
function encodeBase64(bytes, length) {
  return base64_encode(bytes, length);
}
__name(encodeBase64, "encodeBase64");
function decodeBase64(string, length) {
  return base64_decode(string, length);
}
__name(decodeBase64, "decodeBase64");
var bcryptjs_default = {
  setRandomFallback,
  genSaltSync,
  genSalt,
  hashSync,
  hash,
  compareSync,
  compare,
  getRounds,
  getSalt,
  truncates,
  encodeBase64,
  decodeBase64
};

// src/index.ts
function getISTDate() {
  return (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}
__name(getISTDate, "getISTDate");
function getISTTimeHM() {
  const d = /* @__PURE__ */ new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 6e4;
  const nd = new Date(utc + 36e5 * 5.5);
  return `${nd.getHours().toString().padStart(2, "0")}:${nd.getMinutes().toString().padStart(2, "0")}`;
}
__name(getISTTimeHM, "getISTTimeHM");
function computeEffectiveStatus(p, currentDate, currentHM) {
  if (!p) return null;
  if (p.status === "closed" || p.status === "rejected") return p.status;
  if (p.status === "granted") {
    if (p.date < currentDate) return "expired";
    if (p.date === currentDate) {
      if (currentHM >= "16:00") return "expired";
      if (p.expected_return_time && currentHM >= p.expected_return_time) return "expired";
    }
    return "active";
  }
  return p.status;
}
__name(computeEffectiveStatus, "computeEffectiveStatus");
function getUTCDateTime() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
__name(getUTCDateTime, "getUTCDateTime");
function base64UrlEncode2(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(base64UrlEncode2, "base64UrlEncode");
function base64UrlDecode2(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}
__name(base64UrlDecode2, "base64UrlDecode");
async function signJWT(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode2(JSON.stringify(header));
  const encodedPayload = base64UrlEncode2(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const encodedSignature = base64UrlEncode2(String.fromCharCode(...new Uint8Array(signature)));
  return `${data}.${encodedSignature}`;
}
__name(signJWT, "signJWT");
async function verifyJWT(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const data = `${parts[0]}.${parts[1]}`;
    const signature = parts[2];
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const signatureBytes = Uint8Array.from(atob(signature.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, signatureBytes, new TextEncoder().encode(data));
    if (!valid) return null;
    const payload = JSON.parse(base64UrlDecode2(parts[1]));
    if (payload.exp && Date.now() / 1e3 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
__name(verifyJWT, "verifyJWT");
async function createAuditLog(db, userId, userRole, action, details, ipAddress) {
  const id = crypto.randomUUID();
  await db.prepare(
    "INSERT INTO audit_logs (id, user_id, user_role, action, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(id, userId, userRole, action, details, ipAddress || null).run();
}
__name(createAuditLog, "createAuditLog");
async function createNotification(env, recipientId, recipientRole, type, title, message, relatedMemberUuid) {
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message, related_member_uuid) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, recipientId, recipientRole, type, title, message, relatedMemberUuid || null).run();
  try {
    const subs = await env.DB.prepare("SELECT * FROM push_subscriptions WHERE user_id = ?").bind(recipientId).all();
    if (subs.results && subs.results.length > 0) {
      for (const sub of subs.results) {
        try {
          const subscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          };
          const messageData = {
            payload: {
              title,
              body: message,
              url: "/"
            },
            adminContact: env.VAPID_SUBJECT
          };
          const request = await buildPushHTTPRequest({
            privateJWK: env.VAPID_PRIVATE_KEY,
            message: messageData,
            subscription
          });
          const response = await fetch(request.endpoint, {
            method: "POST",
            headers: request.headers,
            body: request.body
          });
          if (response.status === 410 || response.status === 404) {
            await env.DB.prepare("DELETE FROM push_subscriptions WHERE id = ?").bind(sub.id).run();
          }
        } catch (e) {
          console.error("Failed to send push to subscription", sub.id, e);
        }
      }
    }
  } catch (e) {
    console.error("Push notification error", e);
  }
}
__name(createNotification, "createNotification");
async function hashPassword(password) {
  return bcryptjs_default.hashSync(password, 10);
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, storedHash) {
  if (storedHash.startsWith("$2")) {
    return bcryptjs_default.compareSync(password, storedHash);
  }
  const data = new TextEncoder().encode(password);
  const hash2 = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(hash2)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === storedHash || password === storedHash;
}
__name(verifyPassword, "verifyPassword");
function validatePassword(password) {
  if (password.length < 12) return "Password must be at least 12 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "Password must contain a special character";
  return null;
}
__name(validatePassword, "validatePassword");
function formatMemberId(id) {
  return `CLB-${String(id).padStart(6, "0")}`;
}
__name(formatMemberId, "formatMemberId");
var app = new Hono2();
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"]
}));
app.get("/", (c) => c.json({ status: "ok", service: "ClubPass API", version: "1.2" }));
app.post("/api/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }
    const secret = c.env.JWT_SECRET || "clubpass-secret-key-2024";
    const identifier = email.trim();
    const admin = await c.env.DB.prepare("SELECT * FROM admins WHERE email = ?").bind(identifier).first();
    if (admin) {
      if (admin.locked_until) {
        const lockTime = new Date(admin.locked_until).getTime();
        if (Date.now() < lockTime) {
          return c.json({ error: "Account temporarily locked. Try again later." }, 423);
        }
        await c.env.DB.prepare("UPDATE admins SET login_attempts = 0, locked_until = NULL WHERE id = ?").bind(admin.id).run();
      }
      const valid = await verifyPassword(password, admin.password_hash);
      if (valid) {
        await c.env.DB.prepare("UPDATE admins SET login_attempts = 0, locked_until = NULL WHERE id = ?").bind(admin.id).run();
        const tokenPayload = {
          id: admin.id,
          name: admin.name || "Admin",
          email: admin.email,
          role: admin.role || "super_admin",
          exp: Math.floor(Date.now() / 1e3) + 86400
          // 24h
        };
        const token = await signJWT(tokenPayload, secret);
        await createAuditLog(c.env.DB, admin.id, "super_admin", "LOGIN", `Admin login: ${identifier}`);
        return c.json({ token, user: { id: admin.id, name: admin.name || "Admin", email: admin.email, role: admin.role || "super_admin" } });
      } else {
        const attempts = (admin.login_attempts || 0) + 1;
        if (attempts >= 5) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1e3).toISOString();
          await c.env.DB.prepare("UPDATE admins SET login_attempts = ?, locked_until = ? WHERE id = ?").bind(attempts, lockUntil, admin.id).run();
        } else {
          await c.env.DB.prepare("UPDATE admins SET login_attempts = ? WHERE id = ?").bind(attempts, admin.id).run();
        }
      }
    }
    const hod = await c.env.DB.prepare("SELECT * FROM hods WHERE email = ?").bind(identifier).first();
    if (hod) {
      if (hod.status === "disabled") {
        return c.json({ error: "Account has been disabled. Contact the administrator." }, 403);
      }
      if (hod.locked_until) {
        const lockTime = new Date(hod.locked_until).getTime();
        if (Date.now() < lockTime) {
          return c.json({ error: "Account temporarily locked. Try again later." }, 423);
        }
        await c.env.DB.prepare("UPDATE hods SET login_attempts = 0, locked_until = NULL WHERE id = ?").bind(hod.id).run();
      }
      const valid = await verifyPassword(password, hod.password_hash);
      if (valid) {
        await c.env.DB.prepare("UPDATE hods SET login_attempts = 0, locked_until = NULL WHERE id = ?").bind(hod.id).run();
        const tokenPayload = {
          id: hod.id,
          name: hod.name,
          email: hod.email,
          role: hod.role || "hod",
          department: hod.department,
          exp: Math.floor(Date.now() / 1e3) + 86400
        };
        const token = await signJWT(tokenPayload, secret);
        await createAuditLog(c.env.DB, hod.id, hod.role || "hod", "LOGIN", `HOD login: ${identifier}`);
        return c.json({ token, user: { id: hod.id, name: hod.name, email: hod.email, role: hod.role || "hod", department: hod.department } });
      } else {
        const attempts = (hod.login_attempts || 0) + 1;
        if (attempts >= 5) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1e3).toISOString();
          await c.env.DB.prepare("UPDATE hods SET login_attempts = ?, locked_until = ? WHERE id = ?").bind(attempts, lockUntil, hod.id).run();
        } else {
          await c.env.DB.prepare("UPDATE hods SET login_attempts = ? WHERE id = ?").bind(attempts, hod.id).run();
        }
      }
    }
    const clubCoord = await c.env.DB.prepare(
      `SELECT cc.*, c.name as club_name
       FROM coordinator_credentials cc
       JOIN clubs c ON cc.club_id = c.id
       WHERE cc.email = ?`
    ).bind(identifier).first();
    console.log("Login attempt for coord:", identifier, "found:", !!clubCoord);
    if (clubCoord) {
      if (clubCoord.status === "disabled") {
        return c.json({ error: "Account has been disabled. Contact the administrator." }, 403);
      }
      if (clubCoord.locked_until) {
        const lockTime = new Date(clubCoord.locked_until).getTime();
        if (Date.now() < lockTime) {
          return c.json({ error: "Account temporarily locked. Try again later." }, 423);
        }
        await c.env.DB.prepare("UPDATE coordinator_credentials SET login_attempts = 0, locked_until = NULL WHERE id = ?").bind(clubCoord.id).run();
      }
      console.log("Verifying password:", password, "against hash:", clubCoord.password_hash);
      const valid = await verifyPassword(password, clubCoord.password_hash);
      console.log("Verify password result:", valid);
      if (valid) {
        await c.env.DB.prepare("UPDATE coordinator_credentials SET login_attempts = 0, locked_until = NULL WHERE id = ?").bind(clubCoord.id).run();
        const tokenPayload = {
          id: clubCoord.id,
          name: clubCoord.club_name + " Coordinator",
          email: clubCoord.email,
          role: "coordinator",
          club_id: String(clubCoord.club_id),
          club_name: clubCoord.club_name,
          exp: Math.floor(Date.now() / 1e3) + 86400
        };
        const token = await signJWT(tokenPayload, secret);
        await createAuditLog(c.env.DB, clubCoord.id, "coordinator", "LOGIN", `Club Coordinator login: ${identifier}`);
        return c.json({ token, user: { id: clubCoord.id, name: tokenPayload.name, email: clubCoord.email, role: "coordinator", club_id: String(clubCoord.club_id), club_name: clubCoord.club_name } });
      } else {
        const attempts = (clubCoord.login_attempts || 0) + 1;
        if (attempts >= 5) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1e3).toISOString();
          await c.env.DB.prepare("UPDATE coordinator_credentials SET login_attempts = ?, locked_until = ? WHERE id = ?").bind(attempts, lockUntil, clubCoord.id).run();
        } else {
          await c.env.DB.prepare("UPDATE coordinator_credentials SET login_attempts = ? WHERE id = ?").bind(attempts, clubCoord.id).run();
        }
      }
    }
    const faculty = await c.env.DB.prepare(
      `SELECT m.*, mc.club_id, c.name as club_name 
       FROM members m 
       JOIN member_clubs mc ON m.id = mc.member_id 
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.email = ? AND m.member_type = 'faculty'`
    ).bind(identifier).first();
    if (faculty) {
      const valid = await verifyPassword(password, faculty.phone || "");
      if (valid) {
        const tokenPayload = {
          id: faculty.uuid || String(faculty.id),
          name: faculty.full_name,
          email: faculty.email,
          role: "coordinator",
          club_id: String(faculty.club_id),
          club_name: faculty.club_name,
          exp: Math.floor(Date.now() / 1e3) + 86400
        };
        const token = await signJWT(tokenPayload, secret);
        await createAuditLog(c.env.DB, String(faculty.id), "coordinator", "LOGIN", `Coordinator login: ${identifier}`);
        return c.json({ token, user: { id: faculty.uuid || String(faculty.id), name: faculty.full_name, email: faculty.email, role: "coordinator", club_id: String(faculty.club_id), club_name: faculty.club_name } });
      }
    }
    const studentData = await c.env.DB.prepare(
      `SELECT sc.password_hash, sc.status as cred_status, sc.locked_until, sc.login_attempts, sc.must_change_password,
              m.id as member_id, m.uuid, m.full_name, m.email as student_email, m.department, m.status as member_status, m.roll_number,
              mc.club_id, c.name as club_name
       FROM members m
       LEFT JOIN student_credentials sc ON m.id = sc.member_id
       LEFT JOIN member_clubs mc ON m.id = mc.member_id
       LEFT JOIN clubs c ON mc.club_id = c.id
       WHERE m.roll_number = ? AND m.member_type = 'student'`
    ).bind(identifier).first();
    if (studentData) {
      if (studentData.member_status === "suspended" || studentData.cred_status === "suspended") {
        return c.json({ error: "Account has been suspended. Contact the administrator." }, 403);
      }
      if (studentData.member_status === "archived" || studentData.member_status === "graduated") {
        return c.json({ error: "Account is no longer active." }, 403);
      }
      if (studentData.locked_until) {
        const lockTime = new Date(studentData.locked_until).getTime();
        if (Date.now() < lockTime) {
          return c.json({ error: "Account temporarily locked. Try again later." }, 423);
        }
        await c.env.DB.prepare("UPDATE student_credentials SET login_attempts = 0, locked_until = NULL WHERE member_id = ?").bind(studentData.member_id).run();
      }
      let valid = false;
      if (studentData.password_hash) {
        valid = await verifyPassword(password, studentData.password_hash);
      } else {
        if (password === studentData.roll_number) {
          valid = true;
          const tempPasswordHash = await hashPassword(studentData.roll_number);
          await c.env.DB.prepare(
            "INSERT OR IGNORE INTO student_credentials (member_id, username, password_hash, must_change_password) VALUES (?, ?, ?, 0)"
          ).bind(studentData.member_id, studentData.roll_number, tempPasswordHash).run();
        }
      }
      if (valid) {
        await c.env.DB.prepare("UPDATE student_credentials SET login_attempts = 0, locked_until = NULL, last_login = ? WHERE member_id = ?").bind((/* @__PURE__ */ new Date()).toISOString(), studentData.member_id).run();
        const tokenPayload = {
          id: studentData.uuid || String(studentData.member_id),
          name: studentData.full_name?.trim(),
          email: studentData.student_email || identifier,
          role: "student",
          department: studentData.department,
          club_id: studentData.club_id ? String(studentData.club_id) : "",
          club_name: studentData.club_name || "",
          must_change_password: studentData.must_change_password === 1,
          exp: Math.floor(Date.now() / 1e3) + 86400
        };
        const token = await signJWT(tokenPayload, secret);
        await createAuditLog(c.env.DB, String(studentData.member_id), "student", "LOGIN", `Student login: ${identifier}`);
        return c.json({
          token,
          user: {
            id: studentData.uuid || String(studentData.member_id),
            name: studentData.full_name?.trim(),
            email: studentData.student_email || identifier,
            role: "student",
            department: studentData.department,
            club_id: studentData.club_id ? String(studentData.club_id) : "",
            club_name: studentData.club_name || ""
          },
          must_change_password: studentData.must_change_password === 1
        });
      } else {
        const attempts = (studentData.login_attempts || 0) + 1;
        if (attempts >= 5) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1e3).toISOString();
          await c.env.DB.prepare("UPDATE student_credentials SET login_attempts = ?, locked_until = ? WHERE member_id = ?").bind(attempts, lockUntil, studentData.member_id).run();
        } else if (studentData.password_hash) {
          await c.env.DB.prepare("UPDATE student_credentials SET login_attempts = ? WHERE member_id = ?").bind(attempts, studentData.member_id).run();
        }
      }
    }
    return c.json({ error: "Invalid credentials" }, 401);
  } catch (e) {
    return c.json({ error: "Login failed", details: e.message }, 500);
  }
});
app.post("/api/auth/change-password", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const token = authHeader.slice(7);
  const secret = c.env.JWT_SECRET || "clubpass-secret-key-2024";
  const payload = await verifyJWT(token, secret);
  if (!payload) return c.json({ error: "Invalid token" }, 401);
  try {
    const { current_password, new_password } = await c.req.json();
    if (!current_password || !new_password) {
      return c.json({ error: "Current password and new password are required" }, 400);
    }
    const pwError = validatePassword(new_password);
    if (pwError) return c.json({ error: pwError }, 400);
    const member = await c.env.DB.prepare("SELECT id FROM members WHERE uuid = ?").bind(payload.id).first();
    if (!member) return c.json({ error: "User not found" }, 404);
    const cred = await c.env.DB.prepare("SELECT * FROM student_credentials WHERE member_id = ?").bind(member.id).first();
    if (!cred) return c.json({ error: "No credentials found" }, 404);
    const valid = await verifyPassword(current_password, cred.password_hash);
    if (!valid) return c.json({ error: "Current password is incorrect" }, 401);
    const newHash = await hashPassword(new_password);
    await c.env.DB.prepare("UPDATE student_credentials SET password_hash = ?, must_change_password = 0 WHERE member_id = ?").bind(newHash, member.id).run();
    await createAuditLog(c.env.DB, payload.id, "student", "PASSWORD_CHANGED", `Student changed password: ${payload.name}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to change password", details: e.message }, 500);
  }
});
var optionalAuth = /* @__PURE__ */ __name(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const secret = c.env.JWT_SECRET || "clubpass-secret-key-2024";
    const payload = await verifyJWT(token, secret);
    if (payload) {
      c.set("user", payload);
    }
  }
  await next();
}, "optionalAuth");
var requireAuth = /* @__PURE__ */ __name(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const token = authHeader.slice(7);
  const secret = c.env.JWT_SECRET || "clubpass-secret-key-2024";
  const payload = await verifyJWT(token, secret);
  if (!payload) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
  c.set("user", payload);
  await next();
}, "requireAuth");
var requireRole = /* @__PURE__ */ __name((...roles) => async (c, next) => {
  const user = c.get("user");
  if (!user || !roles.includes(user.role)) {
    return c.json({ error: "Forbidden" }, 403);
  }
  await next();
}, "requireRole");
app.get("/api/verify/:uuid", optionalAuth, async (c) => {
  const uuid = c.req.param("uuid");
  try {
    const member = await c.env.DB.prepare(
      `SELECT m.*, mc.club_id, mc.role as club_role, c.name as club_name
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.uuid = ?`
    ).bind(uuid).first();
    if (!member) {
      return c.json({ error: "Member not found" }, 404);
    }
    if (member.status === "suspended") {
      return c.json({
        error: "Member is suspended",
        member: {
          uuid: member.uuid,
          name: member.full_name.trim(),
          roll_number: member.roll_number,
          status: "suspended",
          club: member.club_name
        }
      }, 403);
    }
    if (member.status === "archived" || member.status === "graduated") {
      return c.json({
        error: `Member is ${member.status}`,
        member: {
          uuid: member.uuid,
          name: member.full_name.trim(),
          roll_number: member.roll_number,
          status: member.status,
          club: member.club_name
        }
      }, 403);
    }
    const clubCoordinators = await c.env.DB.prepare(
      `SELECT m.full_name, m.email
       FROM faculty_club_assignments fca
       JOIN members m ON m.id = fca.faculty_member_id
       WHERE fca.club_id = ?`
    ).bind(member.club_id).all();
    const today = getISTDate();
    const todayPermission = await c.env.DB.prepare(
      "SELECT p.*, h.name as hod_name, h.role as hod_role FROM permissions p LEFT JOIN hods h ON p.hod_id = h.id WHERE p.member_uuid = ? AND p.date = ?"
    ).bind(uuid, today).first();
    const user = c.get("user");
    await createAuditLog(
      c.env.DB,
      user?.id || "anonymous",
      user?.role || "public",
      "QR_SCANNED",
      `QR scanned for member: ${member.full_name.trim()} (${member.roll_number})`
    );
    let overdue_minutes = 0;
    if (todayPermission?.expected_return_time && todayPermission.status === "granted") {
      const now = /* @__PURE__ */ new Date();
      const [hours, minutes] = todayPermission.expected_return_time.split(":").map(Number);
      const expectedReturn = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      if (now > expectedReturn) {
        overdue_minutes = Math.floor((now.getTime() - expectedReturn.getTime()) / 6e4);
      }
    }
    return c.json({
      member: {
        uuid: member.uuid,
        member_id: formatMemberId(member.id),
        name: member.full_name.trim(),
        roll_number: member.roll_number,
        email: member.email,
        department: member.department,
        year: member.year || 1,
        section: member.section,
        club: member.club_name,
        club_id: member.club_id,
        position: member.club_role || member.position || "Member",
        status: member.status || "active",
        photo_url: member.photo_url,
        member_type: member.member_type
      },
      coordinators: clubCoordinators?.results?.map((fc) => ({
        name: fc.full_name?.trim(),
        email: fc.email
      })) || [],
      today_permission: todayPermission ? {
        id: todayPermission.id,
        date: todayPermission.date,
        time: todayPermission.time,
        status: todayPermission.status,
        effective_status: computeEffectiveStatus(todayPermission, getISTDate(), getISTTimeHM()),
        purpose: todayPermission.purpose,
        remark: todayPermission.remark,
        expected_return_time: todayPermission.expected_return_time,
        approved_by: todayPermission.hod_name ? `${todayPermission.hod_name} (${todayPermission.hod_role === "poc" ? "POC" : "HOD"})` : "Unknown",
        approved_at: todayPermission.approved_at,
        completed_at: todayPermission.completed_at,
        created_at: todayPermission.created_at,
        overdue_minutes: overdue_minutes > 0 && todayPermission.status !== "completed" ? overdue_minutes : null
      } : null
    });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.get("/api/permissions/today/:uuid", optionalAuth, async (c) => {
  const uuid = c.req.param("uuid");
  const today = getISTDate();
  try {
    const permission = await c.env.DB.prepare(
      "SELECT p.*, h.name as hod_name, h.role as hod_role FROM permissions p LEFT JOIN hods h ON p.hod_id = h.id WHERE p.member_uuid = ? AND p.date = ? ORDER BY p.created_at DESC"
    ).bind(uuid, today).first();
    if (permission) {
      permission.effective_status = computeEffectiveStatus(permission, today, getISTTimeHM());
    }
    return c.json({ permission: permission || null });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.get("/api/fix-db", async (c) => {
  try {
    const tableInfo = await c.env.DB.prepare("PRAGMA table_info(permissions);").all();
    const columns = tableInfo.results.map((col) => col.name);
    await c.env.DB.prepare(`
      CREATE TABLE permissions_new (
        id TEXT PRIMARY KEY,
        member_uuid TEXT NOT NULL,
        hod_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        purpose TEXT NOT NULL DEFAULT '',
        remark TEXT,
        status TEXT DEFAULT 'granted',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        closed_at TEXT,
        closed_by TEXT,
        close_reason TEXT,
        completed_at TEXT,
        club_id TEXT,
        expected_return_time TEXT,
        approved_at TEXT
      )
    `).run();
    const colList = columns.join(", ");
    await c.env.DB.prepare(`INSERT INTO permissions_new (${colList}) SELECT ${colList} FROM permissions`).run();
    await c.env.DB.prepare("DROP TABLE permissions").run();
    await c.env.DB.prepare("ALTER TABLE permissions_new RENAME TO permissions").run();
    return c.json({ success: true, message: "Fixed permissions table schema", columns });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});
app.post("/api/permissions", requireAuth, requireRole("hod", "poc", "super_admin"), async (c) => {
  try {
    const { member_uuid, purpose, remark, status, expected_return_time } = await c.req.json();
    const user = c.get("user");
    if (!member_uuid) {
      return c.json({ error: "member_uuid is required" }, 400);
    }
    const permissionStatus = status || "granted";
    const date = getISTDate();
    const now = /* @__PURE__ */ new Date();
    const istOffset = 5.5 * 60 * 60 * 1e3;
    const istDate = new Date(now.getTime() + istOffset);
    const currentISTHour = istDate.getUTCHours();
    const currentISTMin = istDate.getUTCMinutes();
    const currentISTTimeStr = `${currentISTHour.toString().padStart(2, "0")}:${currentISTMin.toString().padStart(2, "0")}`;
    if (currentISTTimeStr >= "16:00") {
      return c.json({ error: "Permission hours for today have ended. New permissions can be granted on the next working day." }, 403);
    }
    if (expected_return_time) {
      if (expected_return_time > "16:00") {
        return c.json({ error: "Expected return time cannot exceed 16:00 (4:00 PM IST)." }, 400);
      }
      if (expected_return_time <= currentISTTimeStr) {
        return c.json({ error: "Expected return time must be strictly after the current time." }, 400);
      }
    }
    const time = (/* @__PURE__ */ new Date()).toTimeString().split(" ")[0];
    const approvedAt = (/* @__PURE__ */ new Date()).toISOString();
    const id = crypto.randomUUID();
    const existing = await c.env.DB.prepare(
      "SELECT id, status, date, expected_return_time FROM permissions WHERE member_uuid = ? AND date = ? ORDER BY created_at DESC"
    ).bind(member_uuid, date).first();
    if (existing) {
      const effective = computeEffectiveStatus(existing, date, currentISTTimeStr);
      if (effective === "granted") {
        return c.json({
          error: "An active permission already exists for today",
          existing_permission: existing
        }, 409);
      }
    }
    const member = await c.env.DB.prepare(
      `SELECT m.full_name, m.roll_number, m.department, c.name as club_name, mc.club_id
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.uuid = ?`
    ).bind(member_uuid).first();
    if (!member) {
      return c.json({ error: "Member not found" }, 404);
    }
    if ((user.role === "hod" || user.role === "poc") && member.department !== user.department) {
      return c.json({ error: "Unauthorized: Cannot grant permission for a student in another department." }, 403);
    }
    await c.env.DB.prepare(
      "INSERT INTO permissions (id, member_uuid, hod_id, date, time, purpose, remark, status, expected_return_time, approved_at, club_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, member_uuid, user.id, date, time, purpose || "", remark || null, permissionStatus, expected_return_time || null, approvedAt, member.club_id).run();
    await createAuditLog(
      c.env.DB,
      user.id,
      user.role,
      permissionStatus === "granted" ? "PERMISSION_GRANTED" : "PERMISSION_REJECTED",
      `Permission ${permissionStatus} for ${member.full_name.trim()} (${member.roll_number}) by ${user.name}. Purpose: ${purpose || "N/A"}. Remark: ${remark || "N/A"}`
    );
    const coordinators = await c.env.DB.prepare(
      `SELECT m.id, m.uuid FROM faculty_club_assignments fca
       JOIN members m ON m.id = fca.faculty_member_id
       WHERE fca.club_id = ?`
    ).bind(member.club_id).all();
    for (const coord of coordinators.results || []) {
      await createNotification(
        c.env,
        coord.uuid || String(coord.id),
        "coordinator",
        "permission_update",
        `Permission ${permissionStatus === "granted" ? "Granted" : "Rejected"}`,
        `${member.full_name.trim()} (${member.roll_number}) from ${member.club_name} \u2014 Permission ${permissionStatus} by ${user.name} on ${date} at ${time}. Purpose: ${purpose || "N/A"}`,
        member_uuid
      );
    }
    return c.json({
      success: true,
      permission: { id, member_uuid, date, time, purpose, remark, status: permissionStatus, effective_status: permissionStatus === "granted" ? "active" : permissionStatus, hod_id: user.id, approved_by: user.name, expected_return_time, approved_at: approvedAt }
    });
  } catch (e) {
    if (e.message?.includes("UNIQUE constraint")) {
      return c.json({ error: "DB_UNIQUE_ERROR: " + e.message }, 409);
    }
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.post("/api/permissions/:id/close", requireAuth, requireRole("hod", "poc", "super_admin"), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  console.log("CLOSE PERMISSION CALLED WITH ID:", id, "USER:", user.email);
  try {
    let body = {};
    try {
      body = await c.req.json();
    } catch (e) {
    }
    const close_reason = body?.close_reason || "Student Returned";
    const permission = await c.env.DB.prepare(
      `SELECT p.*, m.department 
       FROM permissions p 
       JOIN members m ON p.member_uuid = m.uuid 
       WHERE p.id = ?`
    ).bind(id).first();
    if (!permission) return c.json({ error: "Permission not found" }, 404);
    if ((user.role === "hod" || user.role === "poc") && permission.department !== user.department) {
      return c.json({ error: "Unauthorized: Cannot close permission for a student in another department." }, 403);
    }
    const currentHM = getISTTimeHM();
    const effective = computeEffectiveStatus(permission, getISTDate(), currentHM);
    if (effective !== "active") {
      return c.json({ error: "Permission is no longer active" }, 400);
    }
    const nowUTC = getUTCDateTime();
    await c.env.DB.prepare(
      "UPDATE permissions SET status = 'closed', closed_at = ?, completed_at = ?, closed_by = ?, close_reason = ? WHERE id = ?"
    ).bind(nowUTC, nowUTC, user.name, close_reason, id).run();
    return c.json({ success: true, closed_at: nowUTC });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.post("/api/permissions/:id/complete", requireAuth, requireRole("coordinator", "super_admin"), async (c) => {
  const id = c.req.param("id");
  const completedAt = getUTCDateTime();
  const user = c.get("user");
  try {
    const permission = await c.env.DB.prepare("SELECT * FROM permissions WHERE id = ?").bind(id).first();
    if (!permission) return c.json({ error: "Permission not found" }, 404);
    const effective = computeEffectiveStatus(permission, getISTDate(), getISTTimeHM());
    if (effective !== "active") {
      return c.json({ error: "Permission is no longer active" }, 400);
    }
    await c.env.DB.prepare(
      "UPDATE permissions SET status = 'closed', closed_at = ?, completed_at = ?, closed_by = ?, close_reason = 'Closed by Coordinator' WHERE id = ?"
    ).bind(completedAt, completedAt, user.name, id).run();
    await createAuditLog(
      c.env.DB,
      user.id,
      user.role,
      "PERMISSION_COMPLETED",
      `Permission marked completed by ${user.name} for permission ID: ${id}`
    );
    return c.json({ success: true, completed_at: completedAt });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.get("/api/permissions/history/:uuid", requireAuth, async (c) => {
  const uuid = c.req.param("uuid");
  try {
    const permissions = await c.env.DB.prepare(
      `SELECT p.*, h.name as hod_name, h.role as hod_role 
       FROM permissions p 
       LEFT JOIN hods h ON p.hod_id = h.id 
       WHERE p.member_uuid = ? 
       ORDER BY p.created_at DESC 
       LIMIT 50`
    ).bind(uuid).all();
    return c.json({ permissions: permissions.results });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.get("/api/permissions", requireAuth, async (c) => {
  const date = c.req.query("date");
  const club = c.req.query("club");
  const department = c.req.query("department");
  const status = c.req.query("status");
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = (page - 1) * limit;
  try {
    let query = `
      SELECT p.*, h.name as hod_name, h.role as hod_role, m.full_name as member_name, m.roll_number, m.department, m.year, m.section, c.name as club_name
      FROM permissions p
      LEFT JOIN hods h ON p.hod_id = h.id
      LEFT JOIN members m ON m.uuid = p.member_uuid
      LEFT JOIN member_clubs mc ON m.id = mc.member_id
      LEFT JOIN clubs c ON mc.club_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (date) {
      query += " AND p.date = ?";
      params.push(date);
    }
    if (status) {
      if (status === "granted" || status === "active") {
        const currentISTDate2 = getISTDate();
        const currentISTHM2 = getISTTimeHM();
        query += " AND p.status = 'granted' AND p.date = ? AND (? < '16:00') AND (p.expected_return_time IS NULL OR p.expected_return_time > ?)";
        params.push(currentISTDate2, currentISTHM2, currentISTHM2);
      } else if (status === "expired") {
        const currentISTDate2 = getISTDate();
        const currentISTHM2 = getISTTimeHM();
        query += " AND p.status = 'granted' AND (p.date < ? OR ? >= '16:00' OR (p.expected_return_time IS NOT NULL AND p.expected_return_time <= ?))";
        params.push(currentISTDate2, currentISTHM2, currentISTHM2);
      } else {
        query += " AND p.status = ?";
        params.push(status);
      }
    }
    const user = c.get("user");
    if (user && (user.role === "hod" || user.role === "poc")) {
      query += " AND m.department = ?";
      params.push(user.department);
    } else if (department) {
      query += " AND m.department = ?";
      params.push(department);
    }
    if (user && user.role === "coordinator" && user.club_id) {
      query += " AND mc.club_id = ?";
      params.push(user.club_id);
    } else if (club) {
      query += " AND c.name = ?";
      params.push(club);
    }
    query += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const stmt = c.env.DB.prepare(query);
    const result = await stmt.bind(...params).all();
    const currentISTDate = getISTDate();
    const currentISTHM = getISTTimeHM();
    const permissions = result.results?.map((p) => ({
      ...p,
      effective_status: computeEffectiveStatus(p, currentISTDate, currentISTHM)
    })) || [];
    return c.json({ permissions, page, limit });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.get("/api/coordinator/faculty", requireAuth, requireRole("coordinator", "super_admin"), async (c) => {
  const clubId = c.req.query("club_id") || c.get("user")?.club_id;
  if (!clubId) return c.json({ error: "club_id required" }, 400);
  try {
    const faculty = await c.env.DB.prepare(
      `SELECT m.id, m.full_name, m.email, m.phone, m.department 
       FROM faculty_club_assignments fca
       JOIN members m ON fca.faculty_member_id = m.id
       WHERE fca.club_id = ?`
    ).bind(clubId).all();
    return c.json({ faculty: faculty.results || [] });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.get("/api/members", requireAuth, async (c) => {
  const search = c.req.query("search");
  const department = c.req.query("department");
  const club = c.req.query("club");
  const memberType = c.req.query("member_type");
  const status = c.req.query("status");
  const section = c.req.query("section");
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = (page - 1) * limit;
  try {
    let query = `
      SELECT m.*, mc.club_id, mc.role as club_role, c.name as club_name
      FROM members m
      JOIN member_clubs mc ON m.id = mc.member_id
      JOIN clubs c ON mc.club_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (search) {
      query += " AND (m.full_name LIKE ? OR m.roll_number LIKE ? OR m.email LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    const user = c.get("user");
    if (user && (user.role === "hod" || user.role === "poc")) {
      query += " AND m.department = ?";
      params.push(user.department);
    } else if (department) {
      query += " AND m.department = ?";
      params.push(department);
    }
    if (user && user.role === "coordinator" && user.club_id) {
      query += " AND mc.club_id = ?";
      params.push(user.club_id);
    } else if (club) {
      query += " AND c.name = ?";
      params.push(club);
    }
    if (memberType) {
      query += " AND m.member_type = ?";
      params.push(memberType);
    }
    if (status) {
      query += " AND m.status = ?";
      params.push(status);
    }
    if (section) {
      query += " AND m.section = ?";
      params.push(section);
    }
    query += " ORDER BY m.id ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const result = await c.env.DB.prepare(query).bind(...params).all();
    let countQuery = "SELECT COUNT(*) as total FROM members m JOIN member_clubs mc ON m.id = mc.member_id JOIN clubs c ON mc.club_id = c.id WHERE 1=1";
    const countParams = [];
    if (search) {
      countQuery += " AND (m.full_name LIKE ? OR m.roll_number LIKE ? OR m.email LIKE ?)";
      const s = `%${search}%`;
      countParams.push(s, s, s);
    }
    if (department) {
      countQuery += " AND m.department = ?";
      countParams.push(department);
    }
    if (user && user.role === "coordinator" && user.club_id) {
      countQuery += " AND mc.club_id = ?";
      countParams.push(user.club_id);
    } else if (club) {
      countQuery += " AND c.name = ?";
      countParams.push(club);
    }
    if (memberType) {
      countQuery += " AND m.member_type = ?";
      countParams.push(memberType);
    }
    if (status) {
      countQuery += " AND m.status = ?";
      countParams.push(status);
    }
    if (section) {
      countQuery += " AND m.section = ?";
      countParams.push(section);
    }
    const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first();
    return c.json({
      members: result.results?.map((m) => ({
        ...m,
        full_name: m.full_name?.trim(),
        member_id: formatMemberId(m.id)
      })),
      total: countResult?.total || 0,
      page,
      limit
    });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.get("/api/members/:uuid", requireAuth, async (c) => {
  const uuid = c.req.param("uuid");
  try {
    const member = await c.env.DB.prepare(
      `SELECT m.*, mc.club_id, mc.role as club_role, c.name as club_name
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.uuid = ?`
    ).bind(uuid).first();
    if (!member) return c.json({ error: "Member not found" }, 404);
    const coordinators = await c.env.DB.prepare(
      `SELECT m.full_name, m.email
       FROM faculty_club_assignments fca
       JOIN members m ON m.id = fca.faculty_member_id
       WHERE fca.club_id = ?`
    ).bind(member.club_id).all();
    return c.json({
      ...member,
      full_name: member.full_name?.trim(),
      member_id: formatMemberId(member.id),
      coordinators: coordinators.results?.map((fc) => ({
        name: fc.full_name?.trim(),
        email: fc.email
      })) || []
    });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.get("/api/members/:uuid/profile", requireAuth, async (c) => {
  const uuid = c.req.param("uuid");
  try {
    const member = await c.env.DB.prepare(
      `SELECT m.*, mc.club_id, mc.role as club_role, c.name as club_name
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.uuid = ?`
    ).bind(uuid).first();
    if (!member) return c.json({ error: "Member not found" }, 404);
    const coordinators = await c.env.DB.prepare(
      `SELECT m.full_name, m.email
       FROM faculty_club_assignments fca
       JOIN members m ON m.id = fca.faculty_member_id
       WHERE fca.club_id = ?`
    ).bind(member.club_id).all();
    const permissions = await c.env.DB.prepare(
      `SELECT p.*, h.name as hod_name, h.role as hod_role FROM permissions p
       LEFT JOIN hods h ON p.hod_id = h.id
       WHERE p.member_uuid = ?
       ORDER BY p.created_at DESC LIMIT 20`
    ).bind(uuid).all();
    const activities = await c.env.DB.prepare(
      `SELECT * FROM audit_logs
       WHERE details LIKE ? OR details LIKE ?
       ORDER BY created_at DESC LIMIT 20`
    ).bind(`%${uuid}%`, `%${member.roll_number}%`).all();
    return c.json({
      member: {
        ...member,
        full_name: member.full_name?.trim(),
        member_id: formatMemberId(member.id)
      },
      coordinators: coordinators.results?.map((fc) => ({
        name: fc.full_name?.trim(),
        email: fc.email
      })) || [],
      permissions: permissions.results?.map((p) => ({
        ...p,
        effective_status: computeEffectiveStatus(p, getISTDate(), getISTTimeHM())
      })) || [],
      activities: activities.results || []
    });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.post("/api/members/:uuid/profile-image", requireAuth, async (c) => {
  const uuid = c.req.param("uuid");
  const user = c.get("user");
  if (!user || user.id !== uuid) {
    return c.json({ error: "Unauthorized: Can only update your own profile image" }, 403);
  }
  try {
    const formData = await c.req.parseBody();
    const imageFile = formData["image"];
    if (!imageFile || !(imageFile instanceof File)) {
      return c.json({ error: "No image file provided" }, 400);
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return c.json({ error: "Image size exceeds 5MB limit" }, 400);
    }
    const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = c.env.CLOUDINARY_API_KEY;
    const apiSecret = c.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return c.json({ error: "Cloudinary credentials not configured" }, 500);
    }
    const timestamp = Math.floor(Date.now() / 1e3).toString();
    const paramsToSign = `timestamp=${timestamp}${apiSecret}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(paramsToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", imageFile);
    cloudinaryFormData.append("api_key", apiKey);
    cloudinaryFormData.append("timestamp", timestamp);
    cloudinaryFormData.append("signature", signature);
    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudinaryFormData
    });
    if (!cloudinaryRes.ok) {
      const errRes = await cloudinaryRes.text();
      console.error("Cloudinary upload error:", errRes);
      return c.json({ error: "Failed to upload image to Cloudinary" }, 500);
    }
    const result = await cloudinaryRes.json();
    const secureUrl = result.secure_url;
    if (!secureUrl) {
      return c.json({ error: "Failed to get secure URL from Cloudinary" }, 500);
    }
    await c.env.DB.prepare("UPDATE members SET photo_url = ? WHERE uuid = ?").bind(secureUrl, uuid).run();
    await createAuditLog(
      c.env.DB,
      user.id,
      user.role,
      "PROFILE_IMAGE_UPLOAD",
      `Member ${user.name} uploaded a new profile image`
    );
    return c.json({ success: true, photo_url: secureUrl });
  } catch (e) {
    return c.json({ error: "Failed to upload profile image", details: e.message }, 500);
  }
});
app.get("/api/clubs", async (c) => {
  try {
    const clubs = await c.env.DB.prepare("SELECT * FROM clubs ORDER BY id").all();
    return c.json({ clubs: clubs.results });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.get("/api/clubs/:id/stats", requireAuth, async (c) => {
  const clubId = c.req.param("id");
  try {
    const club = await c.env.DB.prepare("SELECT * FROM clubs WHERE id = ?").bind(clubId).first();
    if (!club) return c.json({ error: "Club not found" }, 404);
    const total = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM members m JOIN member_clubs mc ON m.id = mc.member_id WHERE mc.club_id = ? AND m.member_type = 'student'`
    ).bind(clubId).first();
    const active = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM members m JOIN member_clubs mc ON m.id = mc.member_id WHERE mc.club_id = ? AND m.member_type = 'student' AND m.status = 'active'`
    ).bind(clubId).first();
    const suspended = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM members m JOIN member_clubs mc ON m.id = mc.member_id WHERE mc.club_id = ? AND m.member_type = 'student' AND m.status = 'suspended'`
    ).bind(clubId).first();
    const archived = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM members m JOIN member_clubs mc ON m.id = mc.member_id WHERE mc.club_id = ? AND m.member_type = 'student' AND (m.status = 'archived' OR m.status = 'graduated')`
    ).bind(clubId).first();
    const faculty = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM faculty_club_assignments WHERE club_id = ?`
    ).bind(clubId).first();
    const coordinators = await c.env.DB.prepare(
      `SELECT m.id, m.full_name, m.email FROM faculty_club_assignments fca JOIN members m ON m.id = fca.faculty_member_id WHERE fca.club_id = ?`
    ).bind(clubId).all();
    return c.json({
      club,
      stats: {
        total_members: total?.count || 0,
        active_members: active?.count || 0,
        suspended_members: suspended?.count || 0,
        archived_members: archived?.count || 0,
        faculty_count: faculty?.count || 0
      },
      coordinators: coordinators.results?.map((fc) => ({
        id: fc.id,
        name: fc.full_name?.trim(),
        email: fc.email
      })) || []
    });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.get("/api/notifications", requireAuth, async (c) => {
  const user = c.get("user");
  const unreadOnly = c.req.query("unread") === "true";
  try {
    let query = "SELECT * FROM notifications WHERE recipient_id = ?";
    const params = [user.id];
    if (unreadOnly) {
      query += " AND read_status = 0";
    }
    query += " ORDER BY created_at DESC LIMIT 50";
    const result = await c.env.DB.prepare(query).bind(...params).all();
    const unreadCount = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM notifications WHERE recipient_id = ? AND read_status = 0"
    ).bind(user.id).first();
    return c.json({ notifications: result.results, unread_count: unreadCount?.count || 0 });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.post("/api/notifications/broadcast", requireAuth, requireRole("super_admin", "institution_admin", "hod", "poc", "coordinator"), async (c) => {
  const user = c.get("user");
  const { title, message, target_audience, club_id, department } = await c.req.json();
  if (!title || !message || !target_audience) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  try {
    let recipientQuery = "";
    const queryParams = [];
    if (user.role === "super_admin" || user.role === "institution_admin") {
      if (target_audience === "all_students") {
        recipientQuery = "SELECT coalesce(uuid, CAST(id AS TEXT)) as id, 'student' as role FROM members WHERE status IN ('active', 'inactive')";
      } else if (target_audience === "all_hods") {
        recipientQuery = "SELECT id, 'hod' as role FROM hods";
      } else if (target_audience === "all_coordinators") {
        recipientQuery = `SELECT faculty_member_id as id, 'coordinator' as role FROM faculty_club_assignments GROUP BY faculty_member_id
                          UNION
                          SELECT id, 'coordinator' as role FROM coordinator_credentials`;
      } else if (target_audience === "club") {
        if (!club_id) return c.json({ error: "club_id required" }, 400);
        recipientQuery = "SELECT coalesce(m.uuid, CAST(m.id AS TEXT)) as id, 'student' as role FROM member_clubs mc JOIN members m ON mc.member_id = m.id WHERE mc.club_id = ?";
        queryParams.push(club_id);
      } else if (target_audience === "department") {
        if (!department) return c.json({ error: "department required" }, 400);
        recipientQuery = "SELECT coalesce(uuid, CAST(id AS TEXT)) as id, 'student' as role FROM members WHERE department = ? AND status IN ('active', 'inactive')";
        queryParams.push(department);
      } else if (target_audience === "all") {
        recipientQuery = `SELECT coalesce(uuid, CAST(id AS TEXT)) as id, 'student' as role FROM members WHERE status IN ('active', 'inactive')
                          UNION SELECT id, 'hod' as role FROM hods
                          UNION SELECT id, role FROM admins WHERE role IN ('institution_admin', 'super_admin')
                          UNION SELECT faculty_member_id as id, 'coordinator' as role FROM faculty_club_assignments GROUP BY faculty_member_id
                          UNION SELECT id, 'coordinator' as role FROM coordinator_credentials`;
      } else {
        return c.json({ error: "Invalid target_audience" }, 400);
      }
    } else if (user.role === "hod" || user.role === "poc") {
      if (target_audience !== "department") return c.json({ error: "HODs can only notify their department" }, 403);
      const hod = await c.env.DB.prepare("SELECT department FROM hods WHERE id = ?").bind(user.id).first();
      if (!hod || hod.department !== department) return c.json({ error: "Unauthorized department" }, 403);
      recipientQuery = "SELECT coalesce(uuid, CAST(id AS TEXT)) as id, 'student' as role FROM members WHERE department = ? AND status IN ('active', 'inactive')";
      queryParams.push(department);
    } else if (user.role === "coordinator") {
      if (target_audience !== "club") return c.json({ error: "Coordinators can only notify their clubs" }, 403);
      const targetClub = user.club_id || club_id;
      if (!targetClub) return c.json({ error: "club_id required" }, 400);
      if (!user.club_id) {
        const isAssigned = await c.env.DB.prepare("SELECT 1 FROM faculty_club_assignments WHERE faculty_member_id = ? AND club_id = ?").bind(user.id, targetClub).first();
        if (!isAssigned) return c.json({ error: "Unauthorized club" }, 403);
      } else if (String(targetClub) !== String(user.club_id)) {
        return c.json({ error: "Unauthorized club" }, 403);
      }
      recipientQuery = "SELECT coalesce(m.uuid, CAST(m.id AS TEXT)) as id, 'student' as role FROM member_clubs mc JOIN members m ON mc.member_id = m.id WHERE mc.club_id = ?";
      queryParams.push(targetClub);
    }
    if (!recipientQuery) return c.json({ error: "Invalid request" }, 400);
    const recipients = await c.env.DB.prepare(recipientQuery).bind(...queryParams).all();
    if (!recipients.results || recipients.results.length === 0) {
      return c.json({ error: "No recipients found" }, 404);
    }
    const statements = [];
    const type = "announcement";
    for (const r of recipients.results) {
      const id = crypto.randomUUID();
      statements.push(
        c.env.DB.prepare(
          "INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(id, String(r.id), r.role, type, title, message)
      );
    }
    const chunkSize = 90;
    for (let i = 0; i < statements.length; i += chunkSize) {
      const chunk = statements.slice(i, i + chunkSize);
      await c.env.DB.batch(chunk);
    }
    await createAuditLog(
      c.env.DB,
      user.id,
      user.role,
      "BROADCAST_NOTIFICATION",
      `Sent announcement "${title}" to ${recipients.results.length} recipients`
    );
    return c.json({ success: true, count: recipients.results.length });
  } catch (e) {
    return c.json({ error: "Broadcast failed", details: e.message }, 500);
  }
});
app.patch("/api/notifications/:id/read", requireAuth, async (c) => {
  const id = c.req.param("id");
  try {
    await c.env.DB.prepare("UPDATE notifications SET read_status = 1 WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.patch("/api/notifications/read-all", requireAuth, async (c) => {
  const user = c.get("user");
  try {
    await c.env.DB.prepare("UPDATE notifications SET read_status = 1 WHERE recipient_id = ?").bind(user.id).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.post("/api/notifications/subscribe", requireAuth, async (c) => {
  const user = c.get("user");
  const { subscription } = await c.req.json();
  if (!subscription || !subscription.endpoint || !subscription.keys) return c.json({ error: "Invalid subscription" }, 400);
  const id = crypto.randomUUID();
  try {
    await c.env.DB.prepare(
      "INSERT INTO push_subscriptions (id, user_id, endpoint, p256dh, auth) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, user.id, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth).run();
    return c.json({ success: true });
  } catch (e) {
    if (e.message.includes("UNIQUE")) return c.json({ success: true });
    return c.json({ error: "Failed to save subscription", details: e.message }, 500);
  }
});
app.delete("/api/notifications/unsubscribe", requireAuth, async (c) => {
  const user = c.get("user");
  const { endpoint } = await c.req.json();
  try {
    await c.env.DB.prepare("DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?").bind(user.id, endpoint).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to remove subscription" }, 500);
  }
});
app.get("/api/audit-logs", requireAuth, requireRole("super_admin"), async (c) => {
  const action = c.req.query("action");
  const date = c.req.query("date");
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = (page - 1) * limit;
  try {
    let query = "SELECT * FROM audit_logs WHERE 1=1";
    const params = [];
    if (action) {
      query += " AND action = ?";
      params.push(action);
    }
    if (date) {
      query += " AND DATE(created_at) = ?";
      params.push(date);
    }
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const result = await c.env.DB.prepare(query).bind(...params).all();
    return c.json({ logs: result.results, page, limit });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.get("/api/export/members", requireAuth, requireRole("super_admin", "hod", "poc"), async (c) => {
  const format = c.req.query("format") || "csv";
  const club = c.req.query("club");
  const department = c.req.query("department");
  const status = c.req.query("status");
  try {
    let query = `SELECT m.id, m.uuid, m.roll_number, m.full_name, m.email, m.phone, m.department, m.section, m.member_type, m.status, m.year, mc.role as club_role, c.name as club_name
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE 1=1`;
    const params = [];
    if (club) {
      query += " AND c.name = ?";
      params.push(club);
    }
    if (department) {
      query += " AND m.department = ?";
      params.push(department);
    }
    if (status) {
      query += " AND m.status = ?";
      params.push(status);
    }
    query += " ORDER BY m.id";
    const result = await c.env.DB.prepare(query).bind(...params).all();
    if (format === "csv") {
      const headers = ["ID", "Member ID", "UUID", "Roll Number", "Name", "Email", "Phone", "Department", "Section", "Type", "Status", "Year", "Role", "Club"];
      const rows = result.results?.map(
        (m) => [m.id, formatMemberId(m.id), m.uuid, m.roll_number, m.full_name?.trim(), m.email, m.phone, m.department, m.section, m.member_type, m.status, m.year, m.club_role, m.club_name].map((v) => `"${String(v || "").replace(/"/g, '""')}"`).join(",")
      );
      const csv = [headers.join(","), ...rows || []].join("\n");
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="members.csv"'
        }
      });
    }
    return c.json({ data: result.results });
  } catch (e) {
    return c.json({ error: "Export failed" }, 500);
  }
});
app.get("/api/export/permissions", requireAuth, requireRole("super_admin", "hod", "poc", "institution_admin", "coordinator"), async (c) => {
  const format = c.req.query("format") || "csv";
  const user = c.get("user");
  const dateFrom = c.req.query("date_from");
  const dateTo = c.req.query("date_to");
  const month = c.req.query("month");
  const date = c.req.query("date");
  const clubFilter = c.req.query("club");
  const deptFilter = c.req.query("department");
  const statusFilter = c.req.query("status");
  try {
    let query = `
      SELECT p.*, h.name as hod_name, h.role as hod_role, m.full_name as member_name, m.roll_number, m.department, m.year, m.section, c.name as club_name
      FROM permissions p
      LEFT JOIN hods h ON p.hod_id = h.id
      LEFT JOIN members m ON m.uuid = p.member_uuid
      LEFT JOIN member_clubs mc ON m.id = mc.member_id
      LEFT JOIN clubs c ON mc.club_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (date) {
      query += " AND p.date = ?";
      params.push(date);
    } else if (month) {
      query += " AND p.date LIKE ?";
      params.push(month + "%");
    } else {
      if (dateFrom) {
        query += " AND p.date >= ?";
        params.push(dateFrom);
      }
      if (dateTo) {
        query += " AND p.date <= ?";
        params.push(dateTo);
      }
    }
    if (statusFilter && statusFilter !== "all") {
      query += " AND p.status = ?";
      params.push(statusFilter);
    } else {
      query += " AND p.status != 'rejected'";
    }
    if (user && user.role === "coordinator" && user.club_id) {
      query += " AND mc.club_id = ?";
      params.push(user.club_id);
    } else if (clubFilter) {
      query += " AND c.name = ?";
      params.push(clubFilter);
    }
    if (deptFilter) {
      query += " AND m.department = ?";
      params.push(deptFilter);
    }
    if (user.role === "hod" || user.role === "poc") {
      const hod = await c.env.DB.prepare("SELECT department FROM hods WHERE id = ?").bind(user.id).first();
      if (hod) {
        query += " AND m.department = ?";
        params.push(hod.department);
      }
    } else if (user.role === "coordinator" && !user.club_id) {
      query += " AND mc.club_id IN (SELECT club_id FROM faculty_club_assignments WHERE faculty_member_id = ?)";
      params.push(user.id);
    }
    query += " ORDER BY p.date DESC, p.created_at DESC";
    const result = await c.env.DB.prepare(query).bind(...params).all();
    if (format === "csv") {
      const headers = ["S.No", "Date", "Student Name", "Roll Number", "Department", "Year", "Section", "Club", "Purpose", "Permission Granted At", "Permission Valid Until", "Actual End Time", "Final Status", "Granted By", "Closed At", "Closed By"];
      const rows = result.results?.map((p, index) => {
        const effectiveStatus = computeEffectiveStatus(p, getISTDate(), getISTTimeHM());
        const displayStatus = effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1);
        return [
          index + 1,
          p.date,
          p.member_name?.trim(),
          p.roll_number,
          p.department,
          p.year ? `Year ${p.year}` : "",
          p.section,
          p.club_name,
          p.purpose,
          p.approved_at || p.time,
          p.expected_return_time || "16:00",
          p.completed_at || "",
          displayStatus,
          p.hod_name ? `${p.hod_name} (${p.hod_role === "poc" ? "POC" : "HOD"})` : "Unknown",
          p.completed_at || "",
          p.completed_at ? p.hod_name ? `${p.hod_name} (${p.hod_role === "poc" ? "POC" : "HOD"})` : "System" : ""
        ].map((v) => `"\${String(v || '').replace(/"/g, '""')}"`).join(",");
      });
      const csv = [headers.join(","), ...rows || []].join("\n");
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="Attendance_Report.csv"'
        }
      });
    }
    return c.json({ data: result.results });
  } catch (e) {
    return c.json({ error: "Export failed" }, 500);
  }
});
app.get("/api/export/audit-logs", requireAuth, requireRole("super_admin"), async (c) => {
  const format = c.req.query("format") || "csv";
  try {
    const result = await c.env.DB.prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 1000").all();
    if (format === "csv") {
      const headers = ["ID", "User ID", "Role", "Action", "Details", "IP", "Timestamp"];
      const rows = result.results?.map(
        (l) => [l.id, l.user_id, l.user_role, l.action, l.details, l.ip_address, l.created_at].map((v) => `"${String(v || "").replace(/"/g, '""')}"`).join(",")
      );
      const csv = [headers.join(","), ...rows || []].join("\n");
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="audit_logs.csv"'
        }
      });
    }
    return c.json({ data: result.results });
  } catch (e) {
    return c.json({ error: "Export failed" }, 500);
  }
});
app.get("/api/export/faculty", requireAuth, requireRole("super_admin"), async (c) => {
  const format = c.req.query("format") || "csv";
  try {
    const result = await c.env.DB.prepare(
      `SELECT m.id, m.full_name, m.email, m.phone, m.department, c.name as club_name
       FROM members m
       LEFT JOIN faculty_club_assignments fca ON m.id = fca.faculty_member_id
       LEFT JOIN clubs c ON fca.club_id = c.id
       WHERE m.member_type = 'faculty'
       ORDER BY m.full_name`
    ).all();
    if (format === "csv") {
      const headers = ["ID", "Name", "Email", "Phone", "Department", "Assigned Club"];
      const rows = result.results?.map(
        (f) => [f.id, f.full_name?.trim(), f.email, f.phone, f.department, f.club_name || "Unassigned"].map((v) => `"${String(v || "").replace(/"/g, '""')}"`).join(",")
      );
      const csv = [headers.join(","), ...rows || []].join("\n");
      return new Response(csv, {
        headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="faculty.csv"' }
      });
    }
    return c.json({ data: result.results });
  } catch (e) {
    return c.json({ error: "Export failed" }, 500);
  }
});
app.get("/api/export/clubs", requireAuth, requireRole("super_admin"), async (c) => {
  const format = c.req.query("format") || "csv";
  try {
    const result = await c.env.DB.prepare(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM member_clubs mc JOIN members m ON m.id = mc.member_id WHERE mc.club_id = c.id AND m.member_type = 'student') as member_count,
        (SELECT COUNT(*) FROM faculty_club_assignments fca WHERE fca.club_id = c.id) as faculty_count
       FROM clubs c ORDER BY c.id`
    ).all();
    if (format === "csv") {
      const headers = ["ID", "Name", "Description", "Status", "Members", "Faculty", "Created At"];
      const rows = result.results?.map(
        (c2) => [c2.id, c2.name, c2.description, c2.status || "active", c2.member_count, c2.faculty_count, c2.created_at].map((v) => `"${String(v || "").replace(/"/g, '""')}"`).join(",")
      );
      const csv = [headers.join(","), ...rows || []].join("\n");
      return new Response(csv, {
        headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="clubs.csv"' }
      });
    }
    return c.json({ data: result.results });
  } catch (e) {
    return c.json({ error: "Export failed" }, 500);
  }
});
app.get("/api/stats", requireAuth, async (c) => {
  try {
    const today = getISTDate();
    const totalMembers = await c.env.DB.prepare("SELECT COUNT(*) as count FROM members WHERE member_type = ?").bind("student").first();
    const totalClubs = await c.env.DB.prepare("SELECT COUNT(*) as count FROM clubs").first();
    const todayPermissions = await c.env.DB.prepare("SELECT COUNT(*) as count FROM permissions WHERE date = ?").bind(today).first();
    const totalPermissions = await c.env.DB.prepare("SELECT COUNT(*) as count FROM permissions").first();
    const todayGranted = await c.env.DB.prepare("SELECT COUNT(*) as count FROM permissions WHERE date = ? AND status = 'granted'").bind(today).first();
    const todayRejected = await c.env.DB.prepare("SELECT COUNT(*) as count FROM permissions WHERE date = ? AND status = 'rejected'").bind(today).first();
    const activeMembers = await c.env.DB.prepare("SELECT COUNT(*) as count FROM members WHERE member_type = 'student' AND status = 'active'").first();
    const suspendedMembers = await c.env.DB.prepare("SELECT COUNT(*) as count FROM members WHERE member_type = 'student' AND status = 'suspended'").first();
    return c.json({
      total_members: totalMembers?.count || 0,
      total_clubs: totalClubs?.count || 0,
      today_permissions: todayPermissions?.count || 0,
      total_permissions: totalPermissions?.count || 0,
      today_granted: todayGranted?.count || 0,
      today_rejected: todayRejected?.count || 0,
      active_members: activeMembers?.count || 0,
      suspended_members: suspendedMembers?.count || 0
    });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.post("/api/members/:uuid/regenerate-qr", requireAuth, requireRole("super_admin"), async (c) => {
  const oldUuid = c.req.param("uuid");
  const user = c.get("user");
  try {
    const member = await c.env.DB.prepare("SELECT id, full_name, roll_number, uuid FROM members WHERE uuid = ?").bind(oldUuid).first();
    if (!member) return c.json({ error: "Member not found" }, 404);
    const newUuid = crypto.randomUUID();
    await c.env.DB.prepare("UPDATE members SET uuid = ? WHERE id = ?").bind(newUuid, member.id).run();
    await c.env.DB.prepare("UPDATE permissions SET member_uuid = ? WHERE member_uuid = ?").bind(newUuid, oldUuid).run();
    await createAuditLog(
      c.env.DB,
      user.id,
      "super_admin",
      "QR_REGENERATED",
      `QR regenerated for ${member.full_name.trim()} (${member.roll_number}). Old: ${oldUuid} \u2192 New: ${newUuid}`
    );
    return c.json({ success: true, new_uuid: newUuid });
  } catch (e) {
    return c.json({ error: "Failed to regenerate QR", details: e.message }, 500);
  }
});
app.post("/api/admin/members", requireAuth, requireRole("super_admin"), async (c) => {
  const user = c.get("user");
  try {
    const body = await c.req.json();
    const { roll_number, full_name, email, phone, department, section, member_type, year, club_id, role } = body;
    if (!roll_number || !full_name || !department) {
      return c.json({ error: "roll_number, full_name, and department are required" }, 400);
    }
    const uuid = crypto.randomUUID();
    const mType = member_type || "student";
    await c.env.DB.prepare(
      `INSERT INTO members (roll_number, full_name, email, phone, department, section, member_type, uuid, year, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`
    ).bind(roll_number, full_name, email || null, phone || null, department, section || null, mType, uuid, year || 1).run();
    const newMember = await c.env.DB.prepare("SELECT id FROM members WHERE uuid = ?").bind(uuid).first();
    if (newMember && club_id) {
      await c.env.DB.prepare("INSERT INTO member_clubs (member_id, club_id, role) VALUES (?, ?, ?)").bind(newMember.id, club_id, role || "Member").run();
    }
    if (mType === "student" && newMember) {
      const tempPasswordHash = await hashPassword(roll_number);
      await c.env.DB.prepare(
        "INSERT OR IGNORE INTO student_credentials (member_id, username, password_hash, must_change_password) VALUES (?, ?, ?, 1)"
      ).bind(newMember.id, roll_number, tempPasswordHash).run();
    }
    await createAuditLog(
      c.env.DB,
      user.id,
      "super_admin",
      "MEMBER_CREATED",
      `Member created: ${full_name} (${roll_number}), dept: ${department}, club: ${club_id || "none"}`
    );
    if (club_id) {
      const coordinators = await c.env.DB.prepare(
        `SELECT m.uuid FROM faculty_club_assignments fca JOIN members m ON m.id = fca.faculty_member_id WHERE fca.club_id = ?`
      ).bind(club_id).all();
      for (const coord of coordinators.results || []) {
        await createNotification(
          c.env,
          coord.uuid,
          "coordinator",
          "member_added",
          "New Member Added",
          `${full_name} (${roll_number}) has been added to the club.`,
          uuid
        );
      }
    }
    return c.json({
      success: true,
      uuid,
      id: newMember?.id,
      member_id: newMember ? formatMemberId(newMember.id) : null
    });
  } catch (e) {
    if (e.message?.includes("UNIQUE")) return c.json({ error: "Member with this roll number already exists" }, 409);
    return c.json({ error: "Failed to create member", details: e.message }, 500);
  }
});
app.put("/api/admin/members/:uuid", requireAuth, requireRole("super_admin"), async (c) => {
  const uuid = c.req.param("uuid");
  const user = c.get("user");
  try {
    const body = await c.req.json();
    const { full_name, email, phone, department, section, year, status, position } = body;
    const member = await c.env.DB.prepare("SELECT id, full_name FROM members WHERE uuid = ?").bind(uuid).first();
    if (!member) return c.json({ error: "Member not found" }, 404);
    const updates = [];
    const params = [];
    if (full_name !== void 0) {
      updates.push("full_name = ?");
      params.push(full_name);
    }
    if (email !== void 0) {
      updates.push("email = ?");
      params.push(email);
    }
    if (phone !== void 0) {
      updates.push("phone = ?");
      params.push(phone);
    }
    if (department !== void 0) {
      updates.push("department = ?");
      params.push(department);
    }
    if (section !== void 0) {
      updates.push("section = ?");
      params.push(section);
    }
    if (year !== void 0) {
      updates.push("year = ?");
      params.push(year);
    }
    if (status !== void 0) {
      updates.push("status = ?");
      params.push(status);
    }
    if (position !== void 0) {
      updates.push("position = ?");
      params.push(position);
    }
    if (updates.length === 0) return c.json({ error: "No fields to update" }, 400);
    params.push(uuid);
    await c.env.DB.prepare(`UPDATE members SET ${updates.join(", ")} WHERE uuid = ?`).bind(...params).run();
    const action = status === "suspended" ? "MEMBER_SUSPENDED" : status === "archived" ? "MEMBER_ARCHIVED" : status === "graduated" ? "MEMBER_GRADUATED" : "MEMBER_UPDATED";
    await createAuditLog(
      c.env.DB,
      user.id,
      "super_admin",
      action,
      `Member updated: ${member.full_name.trim()} \u2192 ${JSON.stringify(body)}`
    );
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to update member", details: e.message }, 500);
  }
});
app.post("/api/admin/members/:uuid/reset-password", requireAuth, requireRole("super_admin"), async (c) => {
  const uuid = c.req.param("uuid");
  const user = c.get("user");
  try {
    const member = await c.env.DB.prepare("SELECT id, full_name, roll_number FROM members WHERE uuid = ?").bind(uuid).first();
    if (!member) return c.json({ error: "Member not found" }, 404);
    const tempHash = await hashPassword(member.roll_number);
    await c.env.DB.prepare(
      "UPDATE student_credentials SET password_hash = ?, must_change_password = 1, login_attempts = 0, locked_until = NULL WHERE member_id = ?"
    ).bind(tempHash, member.id).run();
    await createAuditLog(
      c.env.DB,
      user.id,
      "super_admin",
      "PASSWORD_RESET",
      `Password reset for student ${member.full_name.trim()} (${member.roll_number})`
    );
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to reset password", details: e.message }, 500);
  }
});
app.post("/api/admin/members/:uuid/transfer", requireAuth, requireRole("super_admin"), async (c) => {
  const uuid = c.req.param("uuid");
  const user = c.get("user");
  try {
    const { new_club_id, new_role } = await c.req.json();
    if (!new_club_id) return c.json({ error: "new_club_id is required" }, 400);
    const member = await c.env.DB.prepare(
      `SELECT m.id, m.full_name, m.roll_number, mc.club_id as old_club_id, c.name as old_club_name
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.uuid = ?`
    ).bind(uuid).first();
    if (!member) return c.json({ error: "Member not found" }, 404);
    const newClub = await c.env.DB.prepare("SELECT name FROM clubs WHERE id = ?").bind(new_club_id).first();
    if (!newClub) return c.json({ error: "Target club not found" }, 404);
    await c.env.DB.prepare("UPDATE member_clubs SET club_id = ?, role = ? WHERE member_id = ?").bind(new_club_id, new_role || "Member", member.id).run();
    await createAuditLog(
      c.env.DB,
      user.id,
      "super_admin",
      "MEMBER_TRANSFERRED",
      `${member.full_name.trim()} (${member.roll_number}) transferred from ${member.old_club_name} to ${newClub.name}`
    );
    return c.json({ success: true, old_club: member.old_club_name, new_club: newClub.name });
  } catch (e) {
    return c.json({ error: "Failed to transfer member", details: e.message }, 500);
  }
});
app.post("/api/admin/members/bulk", requireAuth, requireRole("super_admin"), async (c) => {
  const user = c.get("user");
  try {
    const { action, member_uuids, club_id } = await c.req.json();
    if (!action || !member_uuids || !Array.isArray(member_uuids) || member_uuids.length === 0) {
      return c.json({ error: "action and member_uuids[] are required" }, 400);
    }
    let processed = 0;
    for (const uuid of member_uuids) {
      try {
        if (action === "suspend") {
          await c.env.DB.prepare("UPDATE members SET status = 'suspended' WHERE uuid = ?").bind(uuid).run();
          processed++;
        } else if (action === "activate") {
          await c.env.DB.prepare("UPDATE members SET status = 'active' WHERE uuid = ?").bind(uuid).run();
          processed++;
        } else if (action === "archive") {
          await c.env.DB.prepare("UPDATE members SET status = 'archived' WHERE uuid = ?").bind(uuid).run();
          processed++;
        } else if (action === "assign_club" && club_id) {
          const member = await c.env.DB.prepare("SELECT id FROM members WHERE uuid = ?").bind(uuid).first();
          if (member) {
            await c.env.DB.prepare("UPDATE member_clubs SET club_id = ? WHERE member_id = ?").bind(club_id, member.id).run();
            processed++;
          }
        }
      } catch {
      }
    }
    await createAuditLog(
      c.env.DB,
      user.id,
      "super_admin",
      `BULK_${action.toUpperCase()}`,
      `Bulk ${action}: ${processed}/${member_uuids.length} members processed`
    );
    return c.json({ success: true, processed, total: member_uuids.length });
  } catch (e) {
    return c.json({ error: "Bulk operation failed", details: e.message }, 500);
  }
});
app.post("/api/admin/hods", requireAuth, requireRole("super_admin"), async (c) => {
  const user = c.get("user");
  try {
    const { name, department, email, password } = await c.req.json();
    if (!name || !department || !email || !password) return c.json({ error: "name, department, email, password required" }, 400);
    const pwError = validatePassword(password);
    if (pwError) return c.json({ error: pwError }, 400);
    const id = `hod-${crypto.randomUUID().slice(0, 8)}`;
    const hash2 = await hashPassword(password);
    await c.env.DB.prepare("INSERT INTO hods (id, name, department, email, password_hash) VALUES (?, ?, ?, ?, ?)").bind(id, name, department, email, hash2).run();
    await createAuditLog(c.env.DB, user.id, "super_admin", "HOD_CREATED", `HOD created: ${name} (${department})`);
    return c.json({ success: true, id });
  } catch (e) {
    if (e.message?.includes("UNIQUE")) return c.json({ error: "HOD with this email already exists" }, 409);
    return c.json({ error: "Failed to create HOD", details: e.message }, 500);
  }
});
app.put("/api/admin/hods/:id", requireAuth, requireRole("super_admin"), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  try {
    const body = await c.req.json();
    const { name, department, email, status } = body;
    const updates = [];
    const params = [];
    if (name !== void 0) {
      updates.push("name = ?");
      params.push(name);
    }
    if (department !== void 0) {
      updates.push("department = ?");
      params.push(department);
    }
    if (email !== void 0) {
      updates.push("email = ?");
      params.push(email);
    }
    if (status !== void 0) {
      updates.push("status = ?");
      params.push(status);
    }
    if (updates.length === 0) return c.json({ error: "No fields to update" }, 400);
    params.push(id);
    await c.env.DB.prepare(`UPDATE hods SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
    await createAuditLog(c.env.DB, user.id, "super_admin", "HOD_UPDATED", `HOD ${id} updated: ${JSON.stringify(body)}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to update HOD", details: e.message }, 500);
  }
});
app.post("/api/admin/hods/:id/reset-password", requireAuth, requireRole("super_admin"), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  try {
    const { password } = await c.req.json();
    if (!password) return c.json({ error: "password required" }, 400);
    const pwError = validatePassword(password);
    if (pwError) return c.json({ error: pwError }, 400);
    const hash2 = await hashPassword(password);
    await c.env.DB.prepare("UPDATE hods SET password_hash = ?, login_attempts = 0, locked_until = NULL WHERE id = ?").bind(hash2, id).run();
    await createAuditLog(c.env.DB, user.id, "super_admin", "PASSWORD_RESET", `Password reset for HOD ${id}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to reset password", details: e.message }, 500);
  }
});
app.get("/api/admin/hods", requireAuth, requireRole("super_admin", "admin"), async (c) => {
  try {
    const result = await c.env.DB.prepare("SELECT id, name, department, email, status, created_at FROM hods ORDER BY name").all();
    return c.json({ hods: result.results });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.get("/api/admin/coordinators", requireAuth, requireRole("super_admin", "admin"), async (c) => {
  try {
    const result = await c.env.DB.prepare(
      `SELECT m.id, m.uuid, m.full_name, m.email, m.phone, m.department,
              GROUP_CONCAT(c.name) as club_names,
              GROUP_CONCAT(c.id) as club_ids
       FROM members m
       LEFT JOIN faculty_club_assignments fca ON m.id = fca.faculty_member_id
       LEFT JOIN clubs c ON fca.club_id = c.id
       WHERE m.member_type = 'faculty'
       GROUP BY m.id
       ORDER BY m.full_name`
    ).all();
    return c.json({ coordinators: result.results?.map((f) => ({
      ...f,
      full_name: f.full_name?.trim(),
      clubs: f.club_names ? f.club_names.split(",").map((n, i) => ({
        id: parseInt(f.club_ids.split(",")[i]),
        name: n
      })) : []
    })) || [] });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.get("/api/admin/club-accounts", requireAuth, requireRole("super_admin", "admin"), async (c) => {
  try {
    const result = await c.env.DB.prepare(
      `SELECT cc.id, cc.email, cc.status, cc.login_attempts, cc.locked_until, cc.created_at, c.name as club_name
       FROM coordinator_credentials cc
       JOIN clubs c ON cc.club_id = c.id
       ORDER BY c.name`
    ).all();
    return c.json({ accounts: result.results || [] });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.post("/api/admin/coordinators/:memberId/assign-club", requireAuth, requireRole("super_admin"), async (c) => {
  const memberId = parseInt(c.req.param("memberId"));
  const user = c.get("user");
  try {
    const { club_id } = await c.req.json();
    if (!club_id) return c.json({ error: "club_id required" }, 400);
    await c.env.DB.prepare("INSERT OR IGNORE INTO faculty_club_assignments (faculty_member_id, club_id) VALUES (?, ?)").bind(memberId, club_id).run();
    const member = await c.env.DB.prepare("SELECT full_name FROM members WHERE id = ?").bind(memberId).first();
    const club = await c.env.DB.prepare("SELECT name FROM clubs WHERE id = ?").bind(club_id).first();
    await createAuditLog(
      c.env.DB,
      user.id,
      "super_admin",
      "FACULTY_ASSIGNED",
      `Faculty ${member?.full_name?.trim()} assigned to club ${club?.name}`
    );
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to assign", details: e.message }, 500);
  }
});
app.delete("/api/admin/coordinators/:memberId/remove-club", requireAuth, requireRole("super_admin"), async (c) => {
  const memberId = parseInt(c.req.param("memberId"));
  const user = c.get("user");
  try {
    const { club_id } = await c.req.json();
    if (!club_id) return c.json({ error: "club_id required" }, 400);
    await c.env.DB.prepare("DELETE FROM faculty_club_assignments WHERE faculty_member_id = ? AND club_id = ?").bind(memberId, club_id).run();
    await createAuditLog(c.env.DB, user.id, "super_admin", "FACULTY_REMOVED", `Faculty ${memberId} removed from club ${club_id}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to remove", details: e.message }, 500);
  }
});
app.post("/api/admin/clubs", requireAuth, requireRole("super_admin"), async (c) => {
  const user = c.get("user");
  try {
    const { name, description } = await c.req.json();
    if (!name) return c.json({ error: "name required" }, 400);
    await c.env.DB.prepare("INSERT INTO clubs (name, description, status) VALUES (?, ?, ?)").bind(name, description || null, "active").run();
    await createAuditLog(c.env.DB, user.id, "super_admin", "CLUB_CREATED", `Club created: ${name}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to create club", details: e.message }, 500);
  }
});
app.put("/api/admin/clubs/:id", requireAuth, requireRole("super_admin"), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  try {
    const { name, description, status } = await c.req.json();
    const updates = [];
    const params = [];
    if (name !== void 0) {
      updates.push("name = ?");
      params.push(name);
    }
    if (description !== void 0) {
      updates.push("description = ?");
      params.push(description);
    }
    if (status !== void 0) {
      updates.push("status = ?");
      params.push(status);
    }
    if (updates.length === 0) return c.json({ error: "No fields to update" }, 400);
    params.push(id);
    await c.env.DB.prepare(`UPDATE clubs SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
    await createAuditLog(c.env.DB, user.id, "super_admin", "CLUB_UPDATED", `Club ${id} updated: ${JSON.stringify({ name, description, status })}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to update club", details: e.message }, 500);
  }
});
app.get("/api/settings", requireAuth, async (c) => {
  try {
    const result = await c.env.DB.prepare("SELECT key, value FROM settings ORDER BY key").all();
    const settings = {};
    for (const row of result.results || []) {
      settings[row.key] = row.value;
    }
    return c.json({ settings });
  } catch (e) {
    return c.json({ error: "Database error" }, 500);
  }
});
app.put("/api/settings", requireAuth, requireRole("super_admin"), async (c) => {
  const user = c.get("user");
  try {
    const body = await c.req.json();
    for (const [key, value] of Object.entries(body)) {
      await c.env.DB.prepare(
        "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP"
      ).bind(key, String(value), String(value)).run();
    }
    await createAuditLog(c.env.DB, user.id, "super_admin", "SETTINGS_UPDATED", `Settings updated: ${Object.keys(body).join(", ")}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to update settings", details: e.message }, 500);
  }
});
app.get("/api/admin/health", requireAuth, requireRole("super_admin"), async (c) => {
  try {
    const members = await c.env.DB.prepare("SELECT COUNT(*) as count FROM members").first();
    const clubs = await c.env.DB.prepare("SELECT COUNT(*) as count FROM clubs").first();
    const permissions = await c.env.DB.prepare("SELECT COUNT(*) as count FROM permissions").first();
    const auditLogs = await c.env.DB.prepare("SELECT COUNT(*) as count FROM audit_logs").first();
    const notifications = await c.env.DB.prepare("SELECT COUNT(*) as count FROM notifications").first();
    const lastAudit = await c.env.DB.prepare("SELECT created_at FROM audit_logs ORDER BY created_at DESC LIMIT 1").first();
    const studentCredentials = await c.env.DB.prepare("SELECT COUNT(*) as count FROM student_credentials").first();
    return c.json({
      status: "healthy",
      version: "1.2",
      database: "connected",
      worker: "running",
      tables: {
        members: members?.count || 0,
        clubs: clubs?.count || 0,
        permissions: permissions?.count || 0,
        audit_logs: auditLogs?.count || 0,
        notifications: notifications?.count || 0,
        student_credentials: studentCredentials?.count || 0
      },
      last_audit_log: lastAudit?.created_at || null
    });
  } catch (e) {
    return c.json({ status: "unhealthy", error: e.message }, 500);
  }
});
app.get("/api/admin/admins", requireAuth, requireRole("super_admin"), async (c) => {
  try {
    const admins = await c.env.DB.prepare("SELECT id, name, email, role, created_at FROM admins").all();
    return c.json({ admins: admins.results });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.post("/api/admin/admins", requireAuth, requireRole("super_admin"), async (c) => {
  const { name, email, password, role } = await c.req.json();
  if (!email || !password || !name) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  try {
    const id = "admin-" + crypto.randomUUID().substring(0, 8);
    const salt = bcryptjs_default.genSaltSync(10);
    const passwordHash = bcryptjs_default.hashSync(password, salt);
    await c.env.DB.prepare(
      "INSERT INTO admins (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, name, email, passwordHash, role || "admin").run();
    const user = c.get("user");
    await c.env.DB.prepare(
      "INSERT INTO audit_logs (id, user_id, user_role, action, details) VALUES (?, ?, ?, ?, ?)"
    ).bind(crypto.randomUUID(), user.id, user.role, "create_admin", `Created admin ${email} with role ${role || "admin"}`).run();
    return c.json({ success: true, admin: { id, name, email, role: role || "admin" } });
  } catch (e) {
    if (e.message.includes("UNIQUE constraint failed")) {
      return c.json({ error: "Email already exists" }, 400);
    }
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.put("/api/admin/admins/:id/password", requireAuth, requireRole("super_admin"), async (c) => {
  const id = c.req.param("id");
  const { password } = await c.req.json();
  try {
    const salt = bcryptjs_default.genSaltSync(10);
    const passwordHash = bcryptjs_default.hashSync(password, salt);
    await c.env.DB.prepare("UPDATE admins SET password_hash = ? WHERE id = ?").bind(passwordHash, id).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
app.delete("/api/admin/admins/:id", requireAuth, requireRole("super_admin"), async (c) => {
  const id = c.req.param("id");
  try {
    await c.env.DB.prepare("DELETE FROM admins WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Database error", details: e.message }, 500);
  }
});
var src_default = app;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var import_checked_fetch40 = __toESM(require_checked_fetch());
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
var import_checked_fetch41 = __toESM(require_checked_fetch());
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-p2Burs/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var import_checked_fetch43 = __toESM(require_checked_fetch());
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-p2Burs/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  createAuditLog,
  createNotification,
  middleware_loader_entry_default as default,
  signJWT,
  verifyJWT
};
//# sourceMappingURL=index.js.map
