/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* Riot v3.8.1, @license MIT */
(function (global, factory) {
	 true ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.riot = {})));
}(this, (function (exports) { 'use strict';

var __TAGS_CACHE = [];
var __TAG_IMPL = {};
var YIELD_TAG = 'yield';
var GLOBAL_MIXIN = '__global_mixin';
var ATTRS_PREFIX = 'riot-';
var REF_DIRECTIVES = ['ref', 'data-ref'];
var IS_DIRECTIVE = 'data-is';
var CONDITIONAL_DIRECTIVE = 'if';
var LOOP_DIRECTIVE = 'each';
var LOOP_NO_REORDER_DIRECTIVE = 'no-reorder';
var SHOW_DIRECTIVE = 'show';
var HIDE_DIRECTIVE = 'hide';
var KEY_DIRECTIVE = 'key';
var RIOT_EVENTS_KEY = '__riot-events__';
var T_STRING = 'string';
var T_OBJECT = 'object';
var T_UNDEF  = 'undefined';
var T_FUNCTION = 'function';
var XLINK_NS = 'http://www.w3.org/1999/xlink';
var SVG_NS = 'http://www.w3.org/2000/svg';
var XLINK_REGEX = /^xlink:(\w+)/;
var WIN = typeof window === T_UNDEF ? undefined : window;
var RE_SPECIAL_TAGS = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/;
var RE_SPECIAL_TAGS_NO_OPTION = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;
var RE_EVENTS_PREFIX = /^on/;
var RE_HTML_ATTRS = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;
var CASE_SENSITIVE_ATTRIBUTES = {
    'viewbox': 'viewBox',
    'preserveaspectratio': 'preserveAspectRatio'
  };
var RE_BOOL_ATTRS = /^(?:disabled|checked|readonly|required|allowfullscreen|auto(?:focus|play)|compact|controls|default|formnovalidate|hidden|ismap|itemscope|loop|multiple|muted|no(?:resize|shade|validate|wrap)?|open|reversed|seamless|selected|sortable|truespeed|typemustmatch)$/;
var IE_VERSION = (WIN && WIN.document || {}).documentMode | 0;

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return [].slice.call((ctx || document).querySelectorAll(selector))
}

/**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

/**
 * Create a document fragment
 * @returns { Object } document fragment
 */
function createFrag() {
  return document.createDocumentFragment()
}

/**
 * Create a document text node
 * @returns { Object } create a text node to use as placeholder
 */
function createDOMPlaceholder() {
  return document.createTextNode('')
}

/**
 * Check if a DOM node is an svg tag or part of an svg
 * @param   { HTMLElement }  el - node we want to test
 * @returns {Boolean} true if it's an svg node
 */
function isSvg(el) {
  var owner = el.ownerSVGElement;
  return !!owner || owner === null
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @returns { Object } DOM node just created
 */
function mkEl(name) {
  return name === 'svg' ? document.createElementNS(SVG_NS, name) : document.createElement(name)
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we'll inject new html
 * @param { String } html - html to inject
 * @param { Boolean } isSvg - svg tags should be treated a bit differently
 */
/* istanbul ignore next */
function setInnerHTML(container, html, isSvg) {
  // innerHTML is not supported on svg tags so we neet to treat them differently
  if (isSvg) {
    var node = container.ownerDocument.importNode(
      new DOMParser()
        .parseFromString(("<svg xmlns=\"" + SVG_NS + "\">" + html + "</svg>"), 'application/xml')
        .documentElement,
      true
    );

    container.appendChild(node);
  } else {
    container.innerHTML = html;
  }
}

/**
 * Toggle the visibility of any DOM node
 * @param   { Object }  dom - DOM node we want to hide
 * @param   { Boolean } show - do we want to show it?
 */

function toggleVisibility(dom, show) {
  dom.style.display = show ? '' : 'none';
  dom.hidden = show ? false : true;
}

/**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
function remAttr(dom, name) {
  dom.removeAttribute(name);
}

/**
 * Convert a style object to a string
 * @param   { Object } style - style object we need to parse
 * @returns { String } resulting css string
 * @example
 * styleObjectToString({ color: 'red', height: '10px'}) // => 'color: red; height: 10px'
 */
function styleObjectToString(style) {
  return Object.keys(style).reduce(function (acc, prop) {
    return (acc + " " + prop + ": " + (style[prop]) + ";")
  }, '')
}

/**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
function getAttr(dom, name) {
  return dom.getAttribute(name)
}

/**
 * Set any DOM attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  var xlink = XLINK_REGEX.exec(name);
  if (xlink && xlink[1])
    { dom.setAttributeNS(XLINK_NS, xlink[1], val); }
  else
    { dom.setAttribute(name, val); }
}

/**
 * Insert safely a tag to fix #1962 #1649
 * @param   { HTMLElement } root - children container
 * @param   { HTMLElement } curr - node to insert
 * @param   { HTMLElement } next - node that should preceed the current node inserted
 */
function safeInsert(root, curr, next) {
  root.insertBefore(curr, next.parentNode && next);
}

/**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
function walkAttrs(html, fn) {
  if (!html) { return }
  var m;
  while (m = RE_HTML_ATTRS.exec(html))
    { fn(m[1].toLowerCase(), m[2] || m[3] || m[4]); }
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 * @param   { Object }   context - fn can optionally return an object, which is passed to children
 */
function walkNodes(dom, fn, context) {
  if (dom) {
    var res = fn(dom, context);
    var next;
    // stop the recursion
    if (res === false) { return }

    dom = dom.firstChild;

    while (dom) {
      next = dom.nextSibling;
      walkNodes(dom, fn, res);
      dom = next;
    }
  }
}

var dom = Object.freeze({
	$$: $$,
	$: $,
	createFrag: createFrag,
	createDOMPlaceholder: createDOMPlaceholder,
	isSvg: isSvg,
	mkEl: mkEl,
	setInnerHTML: setInnerHTML,
	toggleVisibility: toggleVisibility,
	remAttr: remAttr,
	styleObjectToString: styleObjectToString,
	getAttr: getAttr,
	setAttr: setAttr,
	safeInsert: safeInsert,
	walkAttrs: walkAttrs,
	walkNodes: walkNodes
});

var styleNode;
// Create cache and shortcut to the correct property
var cssTextProp;
var byName = {};
var remainder = [];
var needsInject = false;

// skip the following code on the server
if (WIN) {
  styleNode = ((function () {
    // create a new style element with the correct type
    var newNode = mkEl('style');
    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]');

    setAttr(newNode, 'type', 'text/css');
    /* istanbul ignore next */
    if (userNode) {
      if (userNode.id) { newNode.id = userNode.id; }
      userNode.parentNode.replaceChild(newNode, userNode);
    } else { document.head.appendChild(newNode); }

    return newNode
  }))();
  cssTextProp = styleNode.styleSheet;
}

/**
 * Object that will be used to inject and manage the css of every tag instance
 */
var styleManager = {
  styleNode: styleNode,
  /**
   * Save a tag style to be later injected into DOM
   * @param { String } css - css string
   * @param { String } name - if it's passed we will map the css to a tagname
   */
  add: function add(css, name) {
    if (name) { byName[name] = css; }
    else { remainder.push(css); }
    needsInject = true;
  },
  /**
   * Inject all previously saved tag styles into DOM
   * innerHTML seems slow: http://jsperf.com/riot-insert-style
   */
  inject: function inject() {
    if (!WIN || !needsInject) { return }
    needsInject = false;
    var style = Object.keys(byName)
      .map(function (k) { return byName[k]; })
      .concat(remainder).join('\n');
    /* istanbul ignore next */
    if (cssTextProp) { cssTextProp.cssText = style; }
    else { styleNode.innerHTML = style; }
  }
};

/**
 * The riot template engine
 * @version v3.0.8
 */

var skipRegex = (function () { //eslint-disable-line no-unused-vars

  var beforeReChars = '[{(,;:?=|&!^~>%*/';

  var beforeReWords = [
    'case',
    'default',
    'do',
    'else',
    'in',
    'instanceof',
    'prefix',
    'return',
    'typeof',
    'void',
    'yield'
  ];

  var wordsLastChar = beforeReWords.reduce(function (s, w) {
    return s + w.slice(-1)
  }, '');

  var RE_REGEX = /^\/(?=[^*>/])[^[/\\]*(?:(?:\\.|\[(?:\\.|[^\]\\]*)*\])[^[\\/]*)*?\/[gimuy]*/;
  var RE_VN_CHAR = /[$\w]/;

  function prev (code, pos) {
    while (--pos >= 0 && /\s/.test(code[pos])){  }
    return pos
  }

  function _skipRegex (code, start) {

    var re = /.*/g;
    var pos = re.lastIndex = start++;
    var match = re.exec(code)[0].match(RE_REGEX);

    if (match) {
      var next = pos + match[0].length;

      pos = prev(code, pos);
      var c = code[pos];

      if (pos < 0 || ~beforeReChars.indexOf(c)) {
        return next
      }

      if (c === '.') {

        if (code[pos - 1] === '.') {
          start = next;
        }

      } else if (c === '+' || c === '-') {

        if (code[--pos] !== c ||
            (pos = prev(code, pos)) < 0 ||
            !RE_VN_CHAR.test(code[pos])) {
          start = next;
        }

      } else if (~wordsLastChar.indexOf(c)) {

        var end = pos + 1;

        while (--pos >= 0 && RE_VN_CHAR.test(code[pos])){  }
        if (~beforeReWords.indexOf(code.slice(pos + 1, end))) {
          start = next;
        }
      }
    }

    return start
  }

  return _skipRegex

})();

/**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */

/* global riot */

/* istanbul ignore next */
var brackets = (function (UNDEF) {

  var
    REGLOB = 'g',

    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|`[^`\\]*(?:\\[\S\s][^`\\]*)*`/g,

    S_QBLOCKS = R_STRINGS.source + '|' +
      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?([^<]\/)[gim]*/.source,

    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

    S_QBLOCK2 = R_STRINGS.source + '|' + /(\/)(?![*\/])/.source,

    FINDBRACES = {
      '(': RegExp('([()])|'   + S_QBLOCK2, REGLOB),
      '[': RegExp('([[\\]])|' + S_QBLOCK2, REGLOB),
      '{': RegExp('([{}])|'   + S_QBLOCK2, REGLOB)
    },

    DEFAULT = '{ }';

  var _pairs = [
    '{', '}',
    '{', '}',
    /{[^}]*}/,
    /\\([{}])/g,
    /\\({)|{/g,
    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCK2, REGLOB),
    DEFAULT,
    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
    /(^|[^\\]){=[\S\s]*?}/
  ];

  var
    cachedBrackets = UNDEF,
    _regex,
    _cache = [],
    _settings;

  function _loopback (re) { return re }

  function _rewrite (re, bp) {
    if (!bp) { bp = _cache; }
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create (pair) {
    if (pair === DEFAULT) { return _pairs }

    var arr = pair.split(' ');

    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
      throw new Error('Unsupported brackets "' + pair + '"')
    }
    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '));

    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr);
    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr);
    arr[6] = _rewrite(_pairs[6], arr);
    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCK2, REGLOB);
    arr[8] = pair;
    return arr
  }

  function _brackets (reOrIdx) {
    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
  }

  _brackets.split = function split (str, tmpl, _bp) {
    // istanbul ignore next: _bp is for the compiler
    if (!_bp) { _bp = _cache; }

    var
      parts = [],
      match,
      isexpr,
      start,
      pos,
      re = _bp[6];

    var qblocks = [];
    var prevStr = '';
    var mark, lastIndex;

    isexpr = start = re.lastIndex = 0;

    while ((match = re.exec(str))) {

      lastIndex = re.lastIndex;
      pos = match.index;

      if (isexpr) {

        if (match[2]) {

          var ch = match[2];
          var rech = FINDBRACES[ch];
          var ix = 1;

          rech.lastIndex = lastIndex;
          while ((match = rech.exec(str))) {
            if (match[1]) {
              if (match[1] === ch) { ++ix; }
              else if (!--ix) { break }
            } else {
              rech.lastIndex = pushQBlock(match.index, rech.lastIndex, match[2]);
            }
          }
          re.lastIndex = ix ? str.length : rech.lastIndex;
          continue
        }

        if (!match[3]) {
          re.lastIndex = pushQBlock(pos, lastIndex, match[4]);
          continue
        }
      }

      if (!match[1]) {
        unescapeStr(str.slice(start, pos));
        start = re.lastIndex;
        re = _bp[6 + (isexpr ^= 1)];
        re.lastIndex = start;
      }
    }

    if (str && start < str.length) {
      unescapeStr(str.slice(start));
    }

    parts.qblocks = qblocks;

    return parts

    function unescapeStr (s) {
      if (prevStr) {
        s = prevStr + s;
        prevStr = '';
      }
      if (tmpl || isexpr) {
        parts.push(s && s.replace(_bp[5], '$1'));
      } else {
        parts.push(s);
      }
    }

    function pushQBlock(_pos, _lastIndex, slash) { //eslint-disable-line
      if (slash) {
        _lastIndex = skipRegex(str, _pos);
      }

      if (tmpl && _lastIndex > _pos + 2) {
        mark = '\u2057' + qblocks.length + '~';
        qblocks.push(str.slice(_pos, _lastIndex));
        prevStr += str.slice(start, _pos) + mark;
        start = _lastIndex;
      }
      return _lastIndex
    }
  };

  _brackets.hasExpr = function hasExpr (str) {
    return _cache[4].test(str)
  };

  _brackets.loopKeys = function loopKeys (expr) {
    var m = expr.match(_cache[9]);

    return m
      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
      : { val: expr.trim() }
  };

  _brackets.array = function array (pair) {
    return pair ? _create(pair) : _cache
  };

  function _reset (pair) {
    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
      _cache = _create(pair);
      _regex = pair === DEFAULT ? _loopback : _rewrite;
      _cache[9] = _regex(_pairs[9]);
    }
    cachedBrackets = pair;
  }

  function _setSettings (o) {
    var b;

    o = o || {};
    b = o.brackets;
    Object.defineProperty(o, 'brackets', {
      set: _reset,
      get: function () { return cachedBrackets },
      enumerable: true
    });
    _settings = o;
    _reset(b);
  }

  Object.defineProperty(_brackets, 'settings', {
    set: _setSettings,
    get: function () { return _settings }
  });

  /* istanbul ignore next: in the browser riot is always in the scope */
  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {};
  _brackets.set = _reset;
  _brackets.skipRegex = skipRegex;

  _brackets.R_STRINGS = R_STRINGS;
  _brackets.R_MLCOMMS = R_MLCOMMS;
  _brackets.S_QBLOCKS = S_QBLOCKS;
  _brackets.S_QBLOCK2 = S_QBLOCK2;

  return _brackets

})();

/**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */

/* istanbul ignore next */
var tmpl = (function () {

  var _cache = {};

  function _tmpl (str, data) {
    if (!str) { return str }

    return (_cache[str] || (_cache[str] = _create(str))).call(
      data, _logErr.bind({
        data: data,
        tmpl: str
      })
    )
  }

  _tmpl.hasExpr = brackets.hasExpr;

  _tmpl.loopKeys = brackets.loopKeys;

  // istanbul ignore next
  _tmpl.clearCache = function () { _cache = {}; };

  _tmpl.errorHandler = null;

  function _logErr (err, ctx) {

    err.riotData = {
      tagName: ctx && ctx.__ && ctx.__.tagName,
      _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
    };

    if (_tmpl.errorHandler) { _tmpl.errorHandler(err); }
    else if (
      typeof console !== 'undefined' &&
      typeof console.error === 'function'
    ) {
      console.error(err.message);
      console.log('<%s> %s', err.riotData.tagName || 'Unknown tag', this.tmpl); // eslint-disable-line
      console.log(this.data); // eslint-disable-line
    }
  }

  function _create (str) {
    var expr = _getTmpl(str);

    if (expr.slice(0, 11) !== 'try{return ') { expr = 'return ' + expr; }

    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
  }

  var RE_DQUOTE = /\u2057/g;
  var RE_QBMARK = /\u2057(\d+)~/g;

  function _getTmpl (str) {
    var parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1);
    var qstr = parts.qblocks;
    var expr;

    if (parts.length > 2 || parts[0]) {
      var i, j, list = [];

      for (i = j = 0; i < parts.length; ++i) {

        expr = parts[i];

        if (expr && (expr = i & 1

            ? _parseExpr(expr, 1, qstr)

            : '"' + expr
                .replace(/\\/g, '\\\\')
                .replace(/\r\n?|\n/g, '\\n')
                .replace(/"/g, '\\"') +
              '"'

          )) { list[j++] = expr; }

      }

      expr = j < 2 ? list[0]
           : '[' + list.join(',') + '].join("")';

    } else {

      expr = _parseExpr(parts[1], 0, qstr);
    }

    if (qstr.length) {
      expr = expr.replace(RE_QBMARK, function (_, pos) {
        return qstr[pos]
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
      });
    }
    return expr
  }

  var RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/;
  var
    RE_BREND = {
      '(': /[()]/g,
      '[': /[[\]]/g,
      '{': /[{}]/g
    };

  function _parseExpr (expr, asText, qstr) {

    expr = expr
      .replace(/\s+/g, ' ').trim()
      .replace(/\ ?([[\({},?\.:])\ ?/g, '$1');

    if (expr) {
      var
        list = [],
        cnt = 0,
        match;

      while (expr &&
            (match = expr.match(RE_CSNAME)) &&
            !match.index
        ) {
        var
          key,
          jsb,
          re = /,|([[{(])|$/g;

        expr = RegExp.rightContext;
        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1];

        while (jsb = (match = re.exec(expr))[1]) { skipBraces(jsb, re); }

        jsb  = expr.slice(0, match.index);
        expr = RegExp.rightContext;

        list[cnt++] = _wrapExpr(jsb, 1, key);
      }

      expr = !cnt ? _wrapExpr(expr, asText)
           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0];
    }
    return expr

    function skipBraces (ch, re) {
      var
        mm,
        lv = 1,
        ir = RE_BREND[ch];

      ir.lastIndex = re.lastIndex;
      while (mm = ir.exec(expr)) {
        if (mm[0] === ch) { ++lv; }
        else if (!--lv) { break }
      }
      re.lastIndex = lv ? expr.length : ir.lastIndex;
    }
  }

  // istanbul ignore next: not both
  var // eslint-disable-next-line max-len
    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;

  function _wrapExpr (expr, asText, key) {
    var tb;

    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
      if (mvar) {
        pos = tb ? 0 : pos + match.length;

        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
          match = p + '("' + mvar + JS_CONTEXT + mvar;
          if (pos) { tb = (s = s[pos]) === '.' || s === '(' || s === '['; }
        } else if (pos) {
          tb = !JS_NOPROPS.test(s.slice(pos));
        }
      }
      return match
    });

    if (tb) {
      expr = 'try{return ' + expr + '}catch(e){E(e,this)}';
    }

    if (key) {

      expr = (tb
          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
        ) + '?"' + key + '":""';

    } else if (asText) {

      expr = 'function(v){' + (tb
          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
        ) + ';return v||v===0?v:""}.call(this)';
    }

    return expr
  }

  _tmpl.version = brackets.version = 'v3.0.8';

  return _tmpl

})();

/* istanbul ignore next */
var observable$1 = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {};

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice;

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given `event` ands
     * execute the `callback` each time an event is triggered.
     * @param  { String } event - event id
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(event, fn) {
        if (typeof fn == 'function')
          { (callbacks[event] = callbacks[event] || []).push(fn); }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given `event` listeners
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(event, fn) {
        if (event == '*' && !fn) { callbacks = {}; }
        else {
          if (fn) {
            var arr = callbacks[event];
            for (var i = 0, cb; cb = arr && arr[i]; ++i) {
              if (cb == fn) { arr.splice(i--, 1); }
            }
          } else { delete callbacks[event]; }
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given `event` and
     * execute the `callback` at most once
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(event, fn) {
        function on() {
          el.off(event, on);
          fn.apply(el, arguments);
        }
        return el.on(event, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given `event`
     * @param   { String } event - event id
     * @returns { Object } el
     */
    trigger: {
      value: function(event) {
        var arguments$1 = arguments;


        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns,
          fn,
          i;

        for (i = 0; i < arglen; i++) {
          args[i] = arguments$1[i + 1]; // skip first argument
        }

        fns = slice.call(callbacks[event] || [], 0);

        for (i = 0; fn = fns[i]; ++i) {
          fn.apply(el, args);
        }

        if (callbacks['*'] && event != '*')
          { el.trigger.apply(el, ['*', event].concat(args)); }

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  });

  return el

};

/**
 * Check if the passed argument is a boolean attribute
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isBoolAttr(value) {
  return RE_BOOL_ATTRS.test(value)
}

/**
 * Check if passed argument is a function
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isFunction(value) {
  return typeof value === T_FUNCTION
}

/**
 * Check if passed argument is an object, exclude null
 * NOTE: use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isObject(value) {
  return value && typeof value === T_OBJECT // typeof null is 'object'
}

/**
 * Check if passed argument is undefined
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isUndefined(value) {
  return typeof value === T_UNDEF
}

/**
 * Check if passed argument is a string
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isString(value) {
  return typeof value === T_STRING
}

/**
 * Check if passed argument is empty. Different from falsy, because we dont consider 0 or false to be blank
 * @param { * } value -
 * @returns { Boolean } -
 */
function isBlank(value) {
  return isNil(value) || value === ''
}

/**
 * Check against the null and undefined values
 * @param   { * }  value -
 * @returns {Boolean} -
 */
function isNil(value) {
  return isUndefined(value) || value === null
}

/**
 * Check if passed argument is a kind of array
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isArray(value) {
  return Array.isArray(value) || value instanceof Array
}

/**
 * Check whether object's property could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } true if writable
 */
function isWritable(obj, key) {
  var descriptor = getPropDescriptor(obj, key);
  return isUndefined(obj[key]) || descriptor && descriptor.writable
}


var check = Object.freeze({
	isBoolAttr: isBoolAttr,
	isFunction: isFunction,
	isObject: isObject,
	isUndefined: isUndefined,
	isString: isString,
	isBlank: isBlank,
	isNil: isNil,
	isArray: isArray,
	isWritable: isWritable
});

/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } list - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(list, fn) {
  var len = list ? list.length : 0;
  var i = 0;
  for (; i < len; i++) { fn(list[i], i); }
  return list
}

/**
 * Check whether an array contains an item
 * @param   { Array } array - target array
 * @param   { * } item - item to test
 * @returns { Boolean } -
 */
function contains(array, item) {
  return array.indexOf(item) !== -1
}

/**
 * Convert a string containing dashes to camel case
 * @param   { String } str - input string
 * @returns { String } my-string -> myString
 */
function toCamel(str) {
  return str.replace(/-(\w)/g, function (_, c) { return c.toUpperCase(); })
}

/**
 * Faster String startsWith alternative
 * @param   { String } str - source string
 * @param   { String } value - test string
 * @returns { Boolean } -
 */
function startsWith(str, value) {
  return str.slice(0, value.length) === value
}

/**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
 * @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
function defineProperty(el, key, value, options) {
  Object.defineProperty(el, key, extend({
    value: value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options));
  return el
}

/**
 * Function returning always a unique identifier
 * @returns { Number } - number from 0...n
 */
var uid = (function() {
  var i = -1;
  return function () { return ++i; }
})();


/**
 * Warn a message via console
 * @param   {String} message - warning message
 */
function warn(message) {
  if (console && console.warn) { console.warn(message); }
}

/**
 * Short alias for Object.getOwnPropertyDescriptor
 */
var getPropDescriptor = function (o, k) { return Object.getOwnPropertyDescriptor(o, k); };

/**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
function extend(src) {
  var obj;
  var i = 1;
  var args = arguments;
  var l = args.length;

  for (; i < l; i++) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          { src[key] = obj[key]; }
      }
    }
  }
  return src
}

var misc = Object.freeze({
	each: each,
	contains: contains,
	toCamel: toCamel,
	startsWith: startsWith,
	defineProperty: defineProperty,
	uid: uid,
	warn: warn,
	getPropDescriptor: getPropDescriptor,
	extend: extend
});

var settings$1 = extend(Object.create(brackets.settings), {
  skipAnonymousTags: true,
  // handle the auto updates on any DOM event
  autoUpdate: true
});

/**
 * Trigger DOM events
 * @param   { HTMLElement } dom - dom element target of the event
 * @param   { Function } handler - user function
 * @param   { Object } e - event object
 */
function handleEvent(dom, handler, e) {
  var ptag = this.__.parent;
  var item = this.__.item;

  if (!item)
    { while (ptag && !item) {
      item = ptag.__.item;
      ptag = ptag.__.parent;
    } }

  // override the event properties
  /* istanbul ignore next */
  if (isWritable(e, 'currentTarget')) { e.currentTarget = dom; }
  /* istanbul ignore next */
  if (isWritable(e, 'target')) { e.target = e.srcElement; }
  /* istanbul ignore next */
  if (isWritable(e, 'which')) { e.which = e.charCode || e.keyCode; }

  e.item = item;

  handler.call(this, e);

  // avoid auto updates
  if (!settings$1.autoUpdate) { return }

  if (!e.preventUpdate) {
    var p = getImmediateCustomParentTag(this);
    // fixes #2083
    if (p.isMounted) { p.update(); }
  }
}

/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {
  var eventName;
  var cb = handleEvent.bind(tag, dom, handler);

  // avoid to bind twice the same event
  // possible fix for #2332
  dom[name] = null;

  // normalize event name
  eventName = name.replace(RE_EVENTS_PREFIX, '');

  // cache the listener into the listeners array
  if (!contains(tag.__.listeners, dom)) { tag.__.listeners.push(dom); }
  if (!dom[RIOT_EVENTS_KEY]) { dom[RIOT_EVENTS_KEY] = {}; }
  if (dom[RIOT_EVENTS_KEY][name]) { dom.removeEventListener(eventName, dom[RIOT_EVENTS_KEY][name]); }

  dom[RIOT_EVENTS_KEY][name] = cb;
  dom.addEventListener(eventName, cb, false);
}

/**
 * Update dynamically created data-is tags with changing expressions
 * @param { Object } expr - expression tag and expression info
 * @param { Tag }    parent - parent for tag creation
 * @param { String } tagName - tag implementation we want to use
 */
function updateDataIs(expr, parent, tagName) {
  var tag = expr.tag || expr.dom._tag;
  var ref;

  var ref$1 = tag ? tag.__ : {};
  var head = ref$1.head;
  var isVirtual = expr.dom.tagName === 'VIRTUAL';

  if (tag && expr.tagName === tagName) {
    tag.update();
    return
  }

  // sync _parent to accommodate changing tagnames
  if (tag) {
    // need placeholder before unmount
    if(isVirtual) {
      ref = createDOMPlaceholder();
      head.parentNode.insertBefore(ref, head);
    }

    tag.unmount(true);
  }

  // unable to get the tag name
  if (!isString(tagName)) { return }

  expr.impl = __TAG_IMPL[tagName];

  // unknown implementation
  if (!expr.impl) { return }

  expr.tag = tag = initChildTag(
    expr.impl, {
      root: expr.dom,
      parent: parent,
      tagName: tagName
    },
    expr.dom.innerHTML,
    parent
  );

  each(expr.attrs, function (a) { return setAttr(tag.root, a.name, a.value); });
  expr.tagName = tagName;
  tag.mount();

  // root exist first time, after use placeholder
  if (isVirtual) { makeReplaceVirtual(tag, ref || tag.root); }

  // parent is the placeholder tag, not the dynamic tag so clean up
  parent.__.onUnmount = function () {
    var delName = tag.opts.dataIs;
    arrayishRemove(tag.parent.tags, delName, tag);
    arrayishRemove(tag.__.parent.tags, delName, tag);
    tag.unmount();
  };
}

/**
 * Nomalize any attribute removing the "riot-" prefix
 * @param   { String } attrName - original attribute name
 * @returns { String } valid html attribute name
 */
function normalizeAttrName(attrName) {
  if (!attrName) { return null }
  attrName = attrName.replace(ATTRS_PREFIX, '');
  if (CASE_SENSITIVE_ATTRIBUTES[attrName]) { attrName = CASE_SENSITIVE_ATTRIBUTES[attrName]; }
  return attrName
}

/**
 * Update on single tag expression
 * @this Tag
 * @param { Object } expr - expression logic
 * @returns { undefined }
 */
function updateExpression(expr) {
  if (this.root && getAttr(this.root,'virtualized')) { return }

  var dom = expr.dom;
  // remove the riot- prefix
  var attrName = normalizeAttrName(expr.attr);
  var isToggle = contains([SHOW_DIRECTIVE, HIDE_DIRECTIVE], attrName);
  var isVirtual = expr.root && expr.root.tagName === 'VIRTUAL';
  var ref = this.__;
  var isAnonymous = ref.isAnonymous;
  var parent = dom && (expr.parent || dom.parentNode);
  // detect the style attributes
  var isStyleAttr = attrName === 'style';
  var isClassAttr = attrName === 'class';

  var value;

  // if it's a tag we could totally skip the rest
  if (expr._riot_id) {
    if (expr.__.wasCreated) {
      expr.update();
    // if it hasn't been mounted yet, do that now.
    } else {
      expr.mount();
      if (isVirtual) {
        makeReplaceVirtual(expr, expr.root);
      }
    }
    return
  }

  // if this expression has the update method it means it can handle the DOM changes by itself
  if (expr.update) { return expr.update() }

  var context = isToggle && !isAnonymous ? inheritParentProps.call(this) : this;

  // ...it seems to be a simple expression so we try to calculate its value
  value = tmpl(expr.expr, context);

  var hasValue = !isBlank(value);
  var isObj = isObject(value);

  // convert the style/class objects to strings
  if (isObj) {
    if (isClassAttr) {
      value = tmpl(JSON.stringify(value), this);
    } else if (isStyleAttr) {
      value = styleObjectToString(value);
    }
  }

  // remove original attribute
  if (expr.attr && (!expr.wasParsedOnce || !hasValue || value === false)) {
    // remove either riot-* attributes or just the attribute name
    remAttr(dom, getAttr(dom, expr.attr) ? expr.attr : attrName);
  }

  // for the boolean attributes we don't need the value
  // we can convert it to checked=true to checked=checked
  if (expr.bool) { value = value ? attrName : false; }
  if (expr.isRtag) { return updateDataIs(expr, this, value) }
  if (expr.wasParsedOnce && expr.value === value) { return }

  // update the expression value
  expr.value = value;
  expr.wasParsedOnce = true;

  // if the value is an object (and it's not a style or class attribute) we can not do much more with it
  if (isObj && !isClassAttr && !isStyleAttr && !isToggle) { return }
  // avoid to render undefined/null values
  if (!hasValue) { value = ''; }

  // textarea and text nodes have no attribute name
  if (!attrName) {
    // about #815 w/o replace: the browser converts the value to a string,
    // the comparison by "==" does too, but not in the server
    value += '';
    // test for parent avoids error with invalid assignment to nodeValue
    if (parent) {
      // cache the parent node because somehow it will become null on IE
      // on the next iteration
      expr.parent = parent;
      if (parent.tagName === 'TEXTAREA') {
        parent.value = value;                    // #1113
        if (!IE_VERSION) { dom.nodeValue = value; }  // #1625 IE throws here, nodeValue
      }                                         // will be available on 'updated'
      else { dom.nodeValue = value; }
    }
    return
  }


  // event handler
  if (isFunction(value)) {
    setEventHandler(attrName, value, dom, this);
  // show / hide
  } else if (isToggle) {
    toggleVisibility(dom, attrName === HIDE_DIRECTIVE ? !value : value);
  // handle attributes
  } else {
    if (expr.bool) {
      dom[attrName] = value;
    }

    if (attrName === 'value' && dom.value !== value) {
      dom.value = value;
    } else if (hasValue && value !== false) {
      setAttr(dom, attrName, value);
    }

    // make sure that in case of style changes
    // the element stays hidden
    if (isStyleAttr && dom.hidden) { toggleVisibility(dom, false); }
  }
}

/**
 * Update all the expressions in a Tag instance
 * @this Tag
 * @param { Array } expressions - expression that must be re evaluated
 */
function updateAllExpressions(expressions) {
  each(expressions, updateExpression.bind(this));
}

var IfExpr = {
  init: function init(dom, tag, expr) {
    remAttr(dom, CONDITIONAL_DIRECTIVE);
    this.tag = tag;
    this.expr = expr;
    this.stub = createDOMPlaceholder();
    this.pristine = dom;

    var p = dom.parentNode;
    p.insertBefore(this.stub, dom);
    p.removeChild(dom);

    return this
  },
  update: function update() {
    this.value = tmpl(this.expr, this.tag);

    if (this.value && !this.current) { // insert
      this.current = this.pristine.cloneNode(true);
      this.stub.parentNode.insertBefore(this.current, this.stub);
      this.expressions = parseExpressions.apply(this.tag, [this.current, true]);
    } else if (!this.value && this.current) { // remove
      unmountAll(this.expressions);
      if (this.current._tag) {
        this.current._tag.unmount();
      } else if (this.current.parentNode) {
        this.current.parentNode.removeChild(this.current);
      }
      this.current = null;
      this.expressions = [];
    }

    if (this.value) { updateAllExpressions.call(this.tag, this.expressions); }
  },
  unmount: function unmount() {
    unmountAll(this.expressions || []);
  }
};

var RefExpr = {
  init: function init(dom, parent, attrName, attrValue) {
    this.dom = dom;
    this.attr = attrName;
    this.rawValue = attrValue;
    this.parent = parent;
    this.hasExp = tmpl.hasExpr(attrValue);
    return this
  },
  update: function update() {
    var old = this.value;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    // if the referenced element is a custom tag, then we set the tag itself, rather than DOM
    var tagOrDom = this.dom.__ref || this.tag || this.dom;

    this.value = this.hasExp ? tmpl(this.rawValue, this.parent) : this.rawValue;

    // the name changed, so we need to remove it from the old key (if present)
    if (!isBlank(old) && customParent) { arrayishRemove(customParent.refs, old, tagOrDom); }
    if (!isBlank(this.value) && isString(this.value)) {
      // add it to the refs of parent tag (this behavior was changed >=3.0)
      if (customParent) { arrayishAdd(
        customParent.refs,
        this.value,
        tagOrDom,
        // use an array if it's a looped node and the ref is not an expression
        null,
        this.parent.__.index
      ); }

      if (this.value !== old) {
        setAttr(this.dom, this.attr, this.value);
      }
    } else {
      remAttr(this.dom, this.attr);
    }

    // cache the ref bound to this dom node
    // to reuse it in future (see also #2329)
    if (!this.dom.__ref) { this.dom.__ref = tagOrDom; }
  },
  unmount: function unmount() {
    var tagOrDom = this.tag || this.dom;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    if (!isBlank(this.value) && customParent)
      { arrayishRemove(customParent.refs, this.value, tagOrDom); }
  }
};

/**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @param   { Object } base - prototype object for the new item
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
function mkitem(expr, key, val, base) {
  var item = base ? Object.create(base) : {};
  item[expr.key] = key;
  if (expr.pos) { item[expr.pos] = val; }
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
function unmountRedundant(items, tags) {
  var i = tags.length;
  var j = items.length;

  while (i > j) {
    i--;
    remove.apply(tags[i], [tags, i]);
  }
}


/**
 * Remove a child tag
 * @this Tag
 * @param   { Array } tags - tags collection
 * @param   { Number } i - index of the tag to remove
 */
function remove(tags, i) {
  tags.splice(i, 1);
  this.unmount();
  arrayishRemove(this.parent, this, this.__.tagName, true);
}

/**
 * Move the nested custom tags in non custom loop tags
 * @this Tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(i) {
  var this$1 = this;

  each(Object.keys(this.tags), function (tagName) {
    moveChildTag.apply(this$1.tags[tagName], [tagName, i]);
  });
}

/**
 * Move a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to move
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function move(root, nextTag, isVirtual) {
  if (isVirtual)
    { moveVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Insert and mount a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to insert
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function insert(root, nextTag, isVirtual) {
  if (isVirtual)
    { makeVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Append a new tag into the DOM
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function append(root, isVirtual) {
  if (isVirtual)
    { makeVirtual.call(this, root); }
  else
    { root.appendChild(this.root); }
}

/**
 * Return the value we want to use to lookup the postion of our items in the collection
 * @param   { String }  keyAttr         - lookup string or expression
 * @param   { * }       originalItem    - original item from the collection
 * @param   { Object }  keyedItem       - object created by riot via { item, i in collection }
 * @param   { Boolean } hasKeyAttrExpr  - flag to check whether the key is an expression
 * @returns { * } value that we will use to figure out the item position via collection.indexOf
 */
function getItemId(keyAttr, originalItem, keyedItem, hasKeyAttrExpr) {
  if (keyAttr) {
    return hasKeyAttrExpr ?  tmpl(keyAttr, keyedItem) :  originalItem[keyAttr]
  }

  return originalItem
}

/**
 * Manage tags having the 'each'
 * @param   { HTMLElement } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 * @returns { Object } expression object for this each loop
 */
function _each(dom, parent, expr) {
  var mustReorder = typeof getAttr(dom, LOOP_NO_REORDER_DIRECTIVE) !== T_STRING || remAttr(dom, LOOP_NO_REORDER_DIRECTIVE);
  var keyAttr = getAttr(dom, KEY_DIRECTIVE);
  var hasKeyAttrExpr = keyAttr ? tmpl.hasExpr(keyAttr) : false;
  var tagName = getTagName(dom);
  var impl = __TAG_IMPL[tagName];
  var parentNode = dom.parentNode;
  var placeholder = createDOMPlaceholder();
  var child = getTag(dom);
  var ifExpr = getAttr(dom, CONDITIONAL_DIRECTIVE);
  var tags = [];
  var isLoop = true;
  var innerHTML = dom.innerHTML;
  var isAnonymous = !__TAG_IMPL[tagName];
  var isVirtual = dom.tagName === 'VIRTUAL';
  var oldItems = [];
  var hasKeys;

  // remove the each property from the original tag
  remAttr(dom, LOOP_DIRECTIVE);
  remAttr(dom, KEY_DIRECTIVE);

  // parse the each expression
  expr = tmpl.loopKeys(expr);
  expr.isLoop = true;

  if (ifExpr) { remAttr(dom, CONDITIONAL_DIRECTIVE); }

  // insert a marked where the loop tags will be injected
  parentNode.insertBefore(placeholder, dom);
  parentNode.removeChild(dom);

  expr.update = function updateEach() {
    // get the new items collection
    expr.value = tmpl(expr.val, parent);

    var items = expr.value;
    var frag = createFrag();
    var isObject$$1 = !isArray(items) && !isString(items);
    var root = placeholder.parentNode;
    var tmpItems = [];

    // if this DOM was removed the update here is useless
    // this condition fixes also a weird async issue on IE in our unit test
    if (!root) { return }

    // object loop. any changes cause full redraw
    if (isObject$$1) {
      hasKeys = items || false;
      items = hasKeys ?
        Object.keys(items).map(function (key) { return mkitem(expr, items[key], key); }) : [];
    } else {
      hasKeys = false;
    }

    if (ifExpr) {
      items = items.filter(function (item, i) {
        if (expr.key && !isObject$$1)
          { return !!tmpl(ifExpr, mkitem(expr, item, i, parent)) }

        return !!tmpl(ifExpr, extend(Object.create(parent), item))
      });
    }

    // loop all the new items
    each(items, function (_item, i) {
      var item = !hasKeys && expr.key ? mkitem(expr, _item, i) : _item;
      var itemId = getItemId(keyAttr, _item, item, hasKeyAttrExpr);
      // reorder only if the items are objects
      var doReorder = mustReorder && typeof _item === T_OBJECT && !hasKeys;
      var oldPos = oldItems.indexOf(itemId);
      var isNew = oldPos === -1;
      var pos = !isNew && doReorder ? oldPos : i;
      // does a tag exist in this position?
      var tag = tags[pos];
      var mustAppend = i >= oldItems.length;
      var mustCreate =  doReorder && isNew || !doReorder && !tag;

      // new tag
      if (mustCreate) {
        tag = createTag(impl, {
          parent: parent,
          isLoop: isLoop,
          isAnonymous: isAnonymous,
          tagName: tagName,
          root: dom.cloneNode(isAnonymous),
          item: item,
          index: i,
        }, innerHTML);

        // mount the tag
        tag.mount();

        if (mustAppend)
          { append.apply(tag, [frag || root, isVirtual]); }
        else
          { insert.apply(tag, [root, tags[i], isVirtual]); }

        if (!mustAppend) { oldItems.splice(i, 0, item); }
        tags.splice(i, 0, tag);
        if (child) { arrayishAdd(parent.tags, tagName, tag, true); }
      } else if (pos !== i && doReorder) {
        // move
        if (keyAttr || contains(items, oldItems[pos])) {
          move.apply(tag, [root, tags[i], isVirtual]);
          // move the old tag instance
          tags.splice(i, 0, tags.splice(pos, 1)[0]);
          // move the old item
          oldItems.splice(i, 0, oldItems.splice(pos, 1)[0]);
        }

        // update the position attribute if it exists
        if (expr.pos) { tag[expr.pos] = i; }

        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child && tag.tags) { moveNestedTags.call(tag, i); }
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag.__.item = item;
      tag.__.index = i;
      tag.__.parent = parent;

      tmpItems[i] = itemId;

      if (!mustCreate) { tag.update(item); }
    });

    // remove the redundant tags
    unmountRedundant(items, tags);

    // clone the items array
    oldItems = tmpItems.slice();

    root.insertBefore(frag, placeholder);
  };

  expr.unmount = function () {
    each(tags, function (t) { t.unmount(); });
  };

  return expr
}

/**
 * Walk the tag DOM to detect the expressions to evaluate
 * @this Tag
 * @param   { HTMLElement } root - root tag where we will start digging the expressions
 * @param   { Boolean } mustIncludeRoot - flag to decide whether the root must be parsed as well
 * @returns { Array } all the expressions found
 */
function parseExpressions(root, mustIncludeRoot) {
  var this$1 = this;

  var expressions = [];

  walkNodes(root, function (dom) {
    var type = dom.nodeType;
    var attr;
    var tagImpl;

    if (!mustIncludeRoot && dom === root) { return }

    // text node
    if (type === 3 && dom.parentNode.tagName !== 'STYLE' && tmpl.hasExpr(dom.nodeValue))
      { expressions.push({dom: dom, expr: dom.nodeValue}); }

    if (type !== 1) { return }

    var isVirtual = dom.tagName === 'VIRTUAL';

    // loop. each does it's own thing (for now)
    if (attr = getAttr(dom, LOOP_DIRECTIVE)) {
      if(isVirtual) { setAttr(dom, 'loopVirtual', true); } // ignore here, handled in _each
      expressions.push(_each(dom, this$1, attr));
      return false
    }

    // if-attrs become the new parent. Any following expressions (either on the current
    // element, or below it) become children of this expression.
    if (attr = getAttr(dom, CONDITIONAL_DIRECTIVE)) {
      expressions.push(Object.create(IfExpr).init(dom, this$1, attr));
      return false
    }

    if (attr = getAttr(dom, IS_DIRECTIVE)) {
      if (tmpl.hasExpr(attr)) {
        expressions.push({
          isRtag: true,
          expr: attr,
          dom: dom,
          attrs: [].slice.call(dom.attributes)
        });

        return false
      }
    }

    // if this is a tag, stop traversing here.
    // we ignore the root, since parseExpressions is called while we're mounting that root
    tagImpl = getTag(dom);

    if(isVirtual) {
      if(getAttr(dom, 'virtualized')) {dom.parentElement.removeChild(dom); } // tag created, remove from dom
      if(!tagImpl && !getAttr(dom, 'virtualized') && !getAttr(dom, 'loopVirtual'))  // ok to create virtual tag
        { tagImpl = { tmpl: dom.outerHTML }; }
    }

    if (tagImpl && (dom !== root || mustIncludeRoot)) {
      if(isVirtual) { // handled in update
        if (getAttr(dom, IS_DIRECTIVE))
          { warn(("Virtual tags shouldn't be used together with the \"" + IS_DIRECTIVE + "\" attribute - https://github.com/riot/riot/issues/2511")); }
        // can not remove attribute like directives
        // so flag for removal after creation to prevent maximum stack error
        setAttr(dom, 'virtualized', true);
        var tag = createTag(
          {tmpl: dom.outerHTML},
          {root: dom, parent: this$1},
          dom.innerHTML
        );

        expressions.push(tag); // no return, anonymous tag, keep parsing
      } else {
        expressions.push(
          initChildTag(
            tagImpl,
            {
              root: dom,
              parent: this$1
            },
            dom.innerHTML,
            this$1
          )
        );
        return false
      }
    }

    // attribute expressions
    parseAttributes.apply(this$1, [dom, dom.attributes, function (attr, expr) {
      if (!expr) { return }
      expressions.push(expr);
    }]);
  });

  return expressions
}

/**
 * Calls `fn` for every attribute on an element. If that attr has an expression,
 * it is also passed to fn.
 * @this Tag
 * @param   { HTMLElement } dom - dom node to parse
 * @param   { Array } attrs - array of attributes
 * @param   { Function } fn - callback to exec on any iteration
 */
function parseAttributes(dom, attrs, fn) {
  var this$1 = this;

  each(attrs, function (attr) {
    if (!attr) { return false }

    var name = attr.name;
    var bool = isBoolAttr(name);
    var expr;

    if (contains(REF_DIRECTIVES, name) && dom.tagName.toLowerCase() !== YIELD_TAG) {
      expr =  Object.create(RefExpr).init(dom, this$1, name, attr.value);
    } else if (tmpl.hasExpr(attr.value)) {
      expr = {dom: dom, expr: attr.value, attr: name, bool: bool};
    }

    fn(attr, expr);
  });
}

/*
  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/

var reHasYield  = /<yield\b/i;
var reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig;
var reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig;
var reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig;
var rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' };
var tblTags = IE_VERSION && IE_VERSION < 10 ? RE_SPECIAL_TAGS : RE_SPECIAL_TAGS_NO_OPTION;
var GENERIC = 'div';
var SVG = 'svg';


/*
  Creates the root element for table or select child elements:
  tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
*/
function specialTags(el, tmpl, tagName) {

  var
    select = tagName[0] === 'o',
    parent = select ? 'select>' : 'table>';

  // trim() is important here, this ensures we don't have artifacts,
  // so we can check if we have only one element inside the parent
  el.innerHTML = '<' + parent + tmpl.trim() + '</' + parent;
  parent = el.firstChild;

  // returns the immediate parent if tr/th/td/col is the only element, if not
  // returns the whole tree, as this can include additional elements
  /* istanbul ignore next */
  if (select) {
    parent.selectedIndex = -1;  // for IE9, compatible w/current riot behavior
  } else {
    // avoids insertion of cointainer inside container (ex: tbody inside tbody)
    var tname = rootEls[tagName];
    if (tname && parent.childElementCount === 1) { parent = $(tname, parent); }
  }
  return parent
}

/*
  Replace the yield tag from any tag template with the innerHTML of the
  original tag in the page
*/
function replaceYield(tmpl, html) {
  // do nothing if no yield
  if (!reHasYield.test(tmpl)) { return tmpl }

  // be careful with #1343 - string on the source having `$1`
  var src = {};

  html = html && html.replace(reYieldSrc, function (_, ref, text) {
    src[ref] = src[ref] || text;   // preserve first definition
    return ''
  }).trim();

  return tmpl
    .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
      return src[ref] || def || ''
    })
    .replace(reYieldAll, function (_, def) {        // yield without any "from"
      return html || def || ''
    })
}

/**
 * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
 * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
 *
 * @param   { String } tmpl  - The template coming from the custom tag definition
 * @param   { String } html - HTML content that comes from the DOM element where you
 *           will mount the tag, mostly the original tag in the page
 * @param   { Boolean } isSvg - true if the root node is an svg
 * @returns { HTMLElement } DOM element with _tmpl_ merged through `YIELD` with the _html_.
 */
function mkdom(tmpl, html, isSvg$$1) {
  var match   = tmpl && tmpl.match(/^\s*<([-\w]+)/);
  var  tagName = match && match[1].toLowerCase();
  var el = mkEl(isSvg$$1 ? SVG : GENERIC);

  // replace all the yield tags with the tag inner html
  tmpl = replaceYield(tmpl, html);

  /* istanbul ignore next */
  if (tblTags.test(tagName))
    { el = specialTags(el, tmpl, tagName); }
  else
    { setInnerHTML(el, tmpl, isSvg$$1); }

  return el
}

/**
 * Another way to create a riot tag a bit more es6 friendly
 * @param { HTMLElement } el - tag DOM selector or DOM node/s
 * @param { Object } opts - tag logic
 * @returns { Tag } new riot tag instance
 */
function Tag$1(el, opts) {
  // get the tag properties from the class constructor
  var ref = this;
  var name = ref.name;
  var tmpl = ref.tmpl;
  var css = ref.css;
  var attrs = ref.attrs;
  var onCreate = ref.onCreate;
  // register a new tag and cache the class prototype
  if (!__TAG_IMPL[name]) {
    tag$1(name, tmpl, css, attrs, onCreate);
    // cache the class constructor
    __TAG_IMPL[name].class = this.constructor;
  }

  // mount the tag using the class instance
  mountTo(el, name, opts, this);
  // inject the component css
  if (css) { styleManager.inject(); }

  return this
}

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag$1(name, tmpl, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs;

    if (/^[\w-]+\s?=/.test(css)) {
      attrs = css;
      css = '';
    } else
      { attrs = ''; }
  }

  if (css) {
    if (isFunction(css))
      { fn = css; }
    else
      { styleManager.add(css); }
  }

  name = name.toLowerCase();
  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag2$1(name, tmpl, css, attrs, fn) {
  if (css) { styleManager.add(css, name); }

  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Mount a tag using a specific tag implementation
 * @param   { * } selector - tag DOM selector or DOM node/s
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
function mount$1(selector, tagName, opts) {
  var tags = [];
  var elem, allTags;

  function pushTagsTo(root) {
    if (root.tagName) {
      var riotTag = getAttr(root, IS_DIRECTIVE), tag;

      // have tagName? force riot-tag to be the same
      if (tagName && riotTag !== tagName) {
        riotTag = tagName;
        setAttr(root, IS_DIRECTIVE, tagName);
      }

      tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts);

      if (tag)
        { tags.push(tag); }
    } else if (root.length)
      { each(root, pushTagsTo); } // assume nodeList
  }

  // inject styles into DOM
  styleManager.inject();

  if (isObject(tagName)) {
    opts = tagName;
    tagName = 0;
  }

  // crawl the DOM to find the tag
  if (isString(selector)) {
    selector = selector === '*' ?
      // select all registered tags
      // & tags found with the riot-tag attribute set
      allTags = selectTags() :
      // or just the ones named like the selector
      selector + selectTags(selector.split(/, */));

    // make sure to pass always a selector
    // to the querySelectorAll function
    elem = selector ? $$(selector) : [];
  }
  else
    // probably you have passed already a tag or a NodeList
    { elem = selector; }

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectTags();
    // if the root els it's just a single tag
    if (elem.tagName)
      { elem = $$(tagName, elem); }
    else {
      // select all the children for all the different root elements
      var nodeList = [];

      each(elem, function (_el) { return nodeList.push($$(tagName, _el)); });

      elem = nodeList;
    }
    // get rid of the tagName
    tagName = 0;
  }

  pushTagsTo(elem);

  return tags
}

// Create a mixin that could be globally shared across all the tags
var mixins = {};
var globals = mixins[GLOBAL_MIXIN] = {};
var mixins_id = 0;

/**
 * Create/Return a mixin by its name
 * @param   { String }  name - mixin name (global mixin if object)
 * @param   { Object }  mix - mixin logic
 * @param   { Boolean } g - is global?
 * @returns { Object }  the mixin logic
 */
function mixin$1(name, mix, g) {
  // Unnamed global
  if (isObject(name)) {
    mixin$1(("__" + (mixins_id++) + "__"), name, true);
    return
  }

  var store = g ? globals : mixins;

  // Getter
  if (!mix) {
    if (isUndefined(store[name]))
      { throw new Error(("Unregistered mixin: " + name)) }

    return store[name]
  }

  // Setter
  store[name] = isFunction(mix) ?
    extend(mix.prototype, store[name] || {}) && mix :
    extend(store[name] || {}, mix);
}

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
function update$1() {
  return each(__TAGS_CACHE, function (tag) { return tag.update(); })
}

function unregister$1(name) {
  __TAG_IMPL[name] = null;
}

var version$1 = 'v3.8.1';


var core = Object.freeze({
	Tag: Tag$1,
	tag: tag$1,
	tag2: tag2$1,
	mount: mount$1,
	mixin: mixin$1,
	update: update$1,
	unregister: unregister$1,
	version: version$1
});

/**
 * We need to update opts for this tag. That requires updating the expressions
 * in any attributes on the tag, and then copying the result onto opts.
 * @this Tag
 * @param   {Boolean} isLoop - is it a loop tag?
 * @param   { Tag }  parent - parent tag node
 * @param   { Boolean }  isAnonymous - is it a tag without any impl? (a tag not registered)
 * @param   { Object }  opts - tag options
 * @param   { Array }  instAttrs - tag attributes array
 */
function updateOpts(isLoop, parent, isAnonymous, opts, instAttrs) {
  // isAnonymous `each` tags treat `dom` and `root` differently. In this case
  // (and only this case) we don't need to do updateOpts, because the regular parse
  // will update those attrs. Plus, isAnonymous tags don't need opts anyway
  if (isLoop && isAnonymous) { return }
  var ctx = isLoop ? inheritParentProps.call(this) : parent || this;

  each(instAttrs, function (attr) {
    if (attr.expr) { updateExpression.call(ctx, attr.expr); }
    // normalize the attribute names
    opts[toCamel(attr.name).replace(ATTRS_PREFIX, '')] = attr.expr ? attr.expr.value : attr.value;
  });
}

/**
 * Manage the mount state of a tag triggering also the observable events
 * @this Tag
 * @param { Boolean } value - ..of the isMounted flag
 */
function setMountState(value) {
  var ref = this.__;
  var isAnonymous = ref.isAnonymous;

  defineProperty(this, 'isMounted', value);

  if (!isAnonymous) {
    if (value) { this.trigger('mount'); }
    else {
      this.trigger('unmount');
      this.off('*');
      this.__.wasCreated = false;
    }
  }
}


/**
 * Tag creation factory function
 * @constructor
 * @param { Object } impl - it contains the tag template, and logic
 * @param { Object } conf - tag options
 * @param { String } innerHTML - html that eventually we need to inject in the tag
 */
function createTag(impl, conf, innerHTML) {
  if ( impl === void 0 ) impl = {};
  if ( conf === void 0 ) conf = {};

  var tag = conf.context || {};
  var opts = extend({}, conf.opts);
  var parent = conf.parent;
  var isLoop = conf.isLoop;
  var isAnonymous = !!conf.isAnonymous;
  var skipAnonymous = settings$1.skipAnonymousTags && isAnonymous;
  var item = conf.item;
  // available only for the looped nodes
  var index = conf.index;
  // All attributes on the Tag when it's first parsed
  var instAttrs = [];
  // expressions on this type of Tag
  var implAttrs = [];
  var expressions = [];
  var root = conf.root;
  var tagName = conf.tagName || getTagName(root);
  var isVirtual = tagName === 'virtual';
  var isInline = !isVirtual && !impl.tmpl;
  var dom;

  // make this tag observable
  if (!skipAnonymous) { observable$1(tag); }
  // only call unmount if we have a valid __TAG_IMPL (has name property)
  if (impl.name && root._tag) { root._tag.unmount(true); }

  // not yet mounted
  defineProperty(tag, 'isMounted', false);

  defineProperty(tag, '__', {
    isAnonymous: isAnonymous,
    instAttrs: instAttrs,
    innerHTML: innerHTML,
    tagName: tagName,
    index: index,
    isLoop: isLoop,
    isInline: isInline,
    // tags having event listeners
    // it would be better to use weak maps here but we can not introduce breaking changes now
    listeners: [],
    // these vars will be needed only for the virtual tags
    virts: [],
    wasCreated: false,
    tail: null,
    head: null,
    parent: null,
    item: null
  });

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(tag, '_riot_id', uid()); // base 1 allows test !t._riot_id
  defineProperty(tag, 'root', root);
  extend(tag, { opts: opts }, item);
  // protect the "tags" and "refs" property from being overridden
  defineProperty(tag, 'parent', parent || null);
  defineProperty(tag, 'tags', {});
  defineProperty(tag, 'refs', {});

  if (isInline || isLoop && isAnonymous) {
    dom = root;
  } else {
    if (!isVirtual) { root.innerHTML = ''; }
    dom = mkdom(impl.tmpl, innerHTML, isSvg(root));
  }

  /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'update', function tagUpdate(data) {
    var nextOpts = {};
    var canTrigger = tag.isMounted && !skipAnonymous;

    // inherit properties from the parent tag
    if (isAnonymous && parent) { extend(tag, parent); }
    extend(tag, data);

    updateOpts.apply(tag, [isLoop, parent, isAnonymous, nextOpts, instAttrs]);

    if (
      canTrigger &&
      tag.isMounted &&
      isFunction(tag.shouldUpdate) && !tag.shouldUpdate(data, nextOpts)
    ) {
      return tag
    }

    extend(opts, nextOpts);

    if (canTrigger) { tag.trigger('update', data); }
    updateAllExpressions.call(tag, expressions);
    if (canTrigger) { tag.trigger('updated'); }

    return tag
  });

  /**
   * Add a mixin to this tag
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'mixin', function tagMixin() {
    each(arguments, function (mix) {
      var instance;
      var obj;
      var props = [];

      // properties blacklisted and will not be bound to the tag instance
      var propsBlacklist = ['init', '__proto__'];

      mix = isString(mix) ? mixin$1(mix) : mix;

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix();
      } else { instance = mix; }

      var proto = Object.getPrototypeOf(instance);

      // build multilevel prototype inheritance chain property list
      do { props = props.concat(Object.getOwnPropertyNames(obj || instance)); }
      while (obj = Object.getPrototypeOf(obj || instance))

      // loop the keys in the function prototype or the all object keys
      each(props, function (key) {
        // bind methods to tag
        // allow mixins to override other properties/parent mixins
        if (!contains(propsBlacklist, key)) {
          // check for getters/setters
          var descriptor = getPropDescriptor(instance, key) || getPropDescriptor(proto, key);
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

          // apply method only if it does not already exist on the instance
          if (!tag.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(tag, key, descriptor);
          } else {
            tag[key] = isFunction(instance[key]) ?
              instance[key].bind(tag) :
              instance[key];
          }
        }
      });

      // init method will be called automatically
      if (instance.init)
        { instance.init.bind(tag)(opts); }
    });

    return tag
  });

  /**
   * Mount the current tag instance
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'mount', function tagMount() {
    root._tag = tag; // keep a reference to the tag just created

    // Read all the attrs on this instance. This give us the info we need for updateOpts
    parseAttributes.apply(parent, [root, root.attributes, function (attr, expr) {
      if (!isAnonymous && RefExpr.isPrototypeOf(expr)) { expr.tag = tag; }
      attr.expr = expr;
      instAttrs.push(attr);
    }]);

    // update the root adding custom attributes coming from the compiler
    walkAttrs(impl.attrs, function (k, v) { implAttrs.push({name: k, value: v}); });
    parseAttributes.apply(tag, [root, implAttrs, function (attr, expr) {
      if (expr) { expressions.push(expr); }
      else { setAttr(root, attr.name, attr.value); }
    }]);

    // initialiation
    updateOpts.apply(tag, [isLoop, parent, isAnonymous, opts, instAttrs]);

    // add global mixins
    var globalMixin = mixin$1(GLOBAL_MIXIN);

    if (globalMixin && !skipAnonymous) {
      for (var i in globalMixin) {
        if (globalMixin.hasOwnProperty(i)) {
          tag.mixin(globalMixin[i]);
        }
      }
    }

    if (impl.fn) { impl.fn.call(tag, opts); }

    if (!skipAnonymous) { tag.trigger('before-mount'); }

    // parse layout after init. fn may calculate args for nested custom tags
    each(parseExpressions.apply(tag, [dom, isAnonymous]), function (e) { return expressions.push(e); });

    tag.update(item);

    if (!isAnonymous && !isInline) {
      while (dom.firstChild) { root.appendChild(dom.firstChild); }
    }

    defineProperty(tag, 'root', root);

    // if we need to wait that the parent "mount" or "updated" event gets triggered
    if (!skipAnonymous && tag.parent) {
      var p = getImmediateCustomParentTag(tag.parent);
      p.one(!p.isMounted ? 'mount' : 'updated', function () {
        setMountState.call(tag, true);
      });
    } else {
      // otherwise it's not a child tag we can trigger its mount event
      setMountState.call(tag, true);
    }

    tag.__.wasCreated = true;

    return tag

  });

  /**
   * Unmount the tag instance
   * @param { Boolean } mustKeepRoot - if it's true the root node will not be removed
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'unmount', function tagUnmount(mustKeepRoot) {
    var el = tag.root;
    var p = el.parentNode;
    var tagIndex = __TAGS_CACHE.indexOf(tag);

    if (!skipAnonymous) { tag.trigger('before-unmount'); }

    // clear all attributes coming from the mounted tag
    walkAttrs(impl.attrs, function (name) {
      if (startsWith(name, ATTRS_PREFIX))
        { name = name.slice(ATTRS_PREFIX.length); }

      remAttr(root, name);
    });

    // remove all the event listeners
    tag.__.listeners.forEach(function (dom) {
      Object.keys(dom[RIOT_EVENTS_KEY]).forEach(function (eventName) {
        dom.removeEventListener(eventName, dom[RIOT_EVENTS_KEY][eventName]);
      });
    });

    // remove tag instance from the global tags cache collection
    if (tagIndex !== -1) { __TAGS_CACHE.splice(tagIndex, 1); }

    // clean up the parent tags object
    if (parent && !isAnonymous) {
      var ptag = getImmediateCustomParentTag(parent);

      if (isVirtual) {
        Object
          .keys(tag.tags)
          .forEach(function (tagName) { return arrayishRemove(ptag.tags, tagName, tag.tags[tagName]); });
      } else {
        arrayishRemove(ptag.tags, tagName, tag);
      }
    }

    // unmount all the virtual directives
    if (tag.__.virts) {
      each(tag.__.virts, function (v) {
        if (v.parentNode) { v.parentNode.removeChild(v); }
      });
    }

    // allow expressions to unmount themselves
    unmountAll(expressions);
    each(instAttrs, function (a) { return a.expr && a.expr.unmount && a.expr.unmount(); });

    // clear the tag html if it's necessary
    if (mustKeepRoot) { setInnerHTML(el, ''); }
    // otherwise detach the root tag from the DOM
    else if (p) { p.removeChild(el); }

    // custom internal unmount function to avoid relying on the observable
    if (tag.__.onUnmount) { tag.__.onUnmount(); }

    // weird fix for a weird edge case #2409 and #2436
    // some users might use your software not as you've expected
    // so I need to add these dirty hacks to mitigate unexpected issues
    if (!tag.isMounted) { setMountState.call(tag, true); }

    setMountState.call(tag, false);

    delete tag.root._tag;

    return tag
  });

  return tag
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __TAG_IMPL[getAttr(dom, IS_DIRECTIVE) ||
    getAttr(dom, IS_DIRECTIVE) || dom.tagName.toLowerCase()]
}

/**
 * Move the position of a custom tag in its parent tag
 * @this Tag
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
function moveChildTag(tagName, newPos) {
  var parent = this.parent;
  var tags;
  // no parent no move
  if (!parent) { return }

  tags = parent.tags[tagName];

  if (isArray(tags))
    { tags.splice(newPos, 0, tags.splice(tags.indexOf(this), 1)[0]); }
  else { arrayishAdd(parent.tags, tagName, this); }
}

/**
 * Create a new child tag including it correctly into its parent
 * @param   { Object } child - child tag implementation
 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
 * @param   { String } innerHTML - inner html of the child node
 * @param   { Object } parent - instance of the parent tag including the child custom tag
 * @returns { Object } instance of the new child tag just created
 */
function initChildTag(child, opts, innerHTML, parent) {
  var tag = createTag(child, opts, innerHTML);
  var tagName = opts.tagName || getTagName(opts.root, true);
  var ptag = getImmediateCustomParentTag(parent);
  // fix for the parent attribute in the looped elements
  defineProperty(tag, 'parent', ptag);
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag.__.parent = parent;

  // add this tag to the custom parent tag
  arrayishAdd(ptag.tags, tagName, tag);

  // and also to the real parent tag
  if (ptag !== parent)
    { arrayishAdd(parent.tags, tagName, tag); }

  return tag
}

/**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
function getImmediateCustomParentTag(tag) {
  var ptag = tag;
  while (ptag.__.isAnonymous) {
    if (!ptag.parent) { break }
    ptag = ptag.parent;
  }
  return ptag
}

/**
 * Trigger the unmount method on all the expressions
 * @param   { Array } expressions - DOM expressions
 */
function unmountAll(expressions) {
  each(expressions, function (expr) {
    if (expr.unmount) { expr.unmount(true); }
    else if (expr.tagName) { expr.tag.unmount(true); }
    else if (expr.unmount) { expr.unmount(); }
  });
}

/**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { Boolean } skipDataIs - hack to ignore the data-is attribute when attaching to parent
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom, skipDataIs) {
  var child = getTag(dom);
  var namedTag = !skipDataIs && getAttr(dom, IS_DIRECTIVE);
  return namedTag && !tmpl.hasExpr(namedTag) ?
    namedTag : child ? child.name : dom.tagName.toLowerCase()
}

/**
 * Set the property of an object for a given key. If something already
 * exists there, then it becomes an array containing both the old and new value.
 * @param { Object } obj - object on which to set the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be set
 * @param { Boolean } ensureArray - ensure that the property remains an array
 * @param { Number } index - add the new item in a certain array position
 */
function arrayishAdd(obj, key, value, ensureArray, index) {
  var dest = obj[key];
  var isArr = isArray(dest);
  var hasIndex = !isUndefined(index);

  if (dest && dest === value) { return }

  // if the key was never set, set it once
  if (!dest && ensureArray) { obj[key] = [value]; }
  else if (!dest) { obj[key] = value; }
  // if it was an array and not yet set
  else {
    if (isArr) {
      var oldIndex = dest.indexOf(value);
      // this item never changed its position
      if (oldIndex === index) { return }
      // remove the item from its old position
      if (oldIndex !== -1) { dest.splice(oldIndex, 1); }
      // move or add the item
      if (hasIndex) {
        dest.splice(index, 0, value);
      } else {
        dest.push(value);
      }
    } else { obj[key] = [dest, value]; }
  }
}

/**
 * Removes an item from an object at a given key. If the key points to an array,
 * then the item is just removed from the array.
 * @param { Object } obj - object on which to remove the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be removed
 * @param { Boolean } ensureArray - ensure that the property remains an array
*/
function arrayishRemove(obj, key, value, ensureArray) {
  if (isArray(obj[key])) {
    var index = obj[key].indexOf(value);
    if (index !== -1) { obj[key].splice(index, 1); }
    if (!obj[key].length) { delete obj[key]; }
    else if (obj[key].length === 1 && !ensureArray) { obj[key] = obj[key][0]; }
  } else if (obj[key] === value)
    { delete obj[key]; } // otherwise just delete the key
}

/**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @param   { Object } ctx - optional context that will be used to extend an existing class ( used in riot.Tag )
 * @returns { Tag } a new Tag instance
 */
function mountTo(root, tagName, opts, ctx) {
  var impl = __TAG_IMPL[tagName];
  var implClass = __TAG_IMPL[tagName].class;
  var context = ctx || (implClass ? Object.create(implClass.prototype) : {});
  // cache the inner HTML to fix #855
  var innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;
  var conf = extend({ root: root, opts: opts, context: context }, { parent: opts ? opts.parent : null });
  var tag;

  if (impl && root) { tag = createTag(impl, conf, innerHTML); }

  if (tag && tag.mount) {
    tag.mount(true);
    // add this tag to the virtualDom variable
    if (!contains(__TAGS_CACHE, tag)) { __TAGS_CACHE.push(tag); }
  }

  return tag
}

/**
 * makes a tag virtual and replaces a reference in the dom
 * @this Tag
 * @param { tag } the tag to make virtual
 * @param { ref } the dom reference location
 */
function makeReplaceVirtual(tag, ref) {
  var frag = createFrag();
  makeVirtual.call(tag, frag);
  ref.parentNode.replaceChild(frag, ref);
}

/**
 * Adds the elements for a virtual tag
 * @this Tag
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function makeVirtual(src, target) {
  var this$1 = this;

  var head = createDOMPlaceholder();
  var tail = createDOMPlaceholder();
  var frag = createFrag();
  var sib;
  var el;

  this.root.insertBefore(head, this.root.firstChild);
  this.root.appendChild(tail);

  this.__.head = el = head;
  this.__.tail = tail;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    this$1.__.virts.push(el); // hold for unmounting
    el = sib;
  }

  if (target)
    { src.insertBefore(frag, target.__.head); }
  else
    { src.appendChild(frag); }
}

/**
 * Return a temporary context containing also the parent properties
 * @this Tag
 * @param { Tag } - temporary tag context containing all the parent properties
 */
function inheritParentProps() {
  if (this.parent) { return extend(Object.create(this), this.parent) }
  return this
}

/**
 * Move virtual tag and all child nodes
 * @this Tag
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 */
function moveVirtual(src, target) {
  var this$1 = this;

  var el = this.__.head;
  var sib;
  var frag = createFrag();

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    el = sib;
    if (el === this$1.__.tail) {
      frag.appendChild(el);
      src.insertBefore(frag, target.__.head);
      break
    }
  }
}

/**
 * Get selectors for tags
 * @param   { Array } tags - tag names to select
 * @returns { String } selector
 */
function selectTags(tags) {
  // select all tags
  if (!tags) {
    var keys = Object.keys(__TAG_IMPL);
    return keys + selectTags(keys)
  }

  return tags
    .filter(function (t) { return !/[^-\w]/.test(t); })
    .reduce(function (list, t) {
      var name = t.trim().toLowerCase();
      return list + ",[" + IS_DIRECTIVE + "=\"" + name + "\"]"
    }, '')
}


var tags = Object.freeze({
	getTag: getTag,
	moveChildTag: moveChildTag,
	initChildTag: initChildTag,
	getImmediateCustomParentTag: getImmediateCustomParentTag,
	unmountAll: unmountAll,
	getTagName: getTagName,
	arrayishAdd: arrayishAdd,
	arrayishRemove: arrayishRemove,
	mountTo: mountTo,
	makeReplaceVirtual: makeReplaceVirtual,
	makeVirtual: makeVirtual,
	inheritParentProps: inheritParentProps,
	moveVirtual: moveVirtual,
	selectTags: selectTags
});

/**
 * Riot public api
 */
var settings = settings$1;
var util = {
  tmpl: tmpl,
  brackets: brackets,
  styleManager: styleManager,
  vdom: __TAGS_CACHE,
  styleNode: styleManager.styleNode,
  // export the riot internal utils as well
  dom: dom,
  check: check,
  misc: misc,
  tags: tags
};

// export the core props/methods
var Tag = Tag$1;
var tag = tag$1;
var tag2 = tag2$1;
var mount = mount$1;
var mixin = mixin$1;
var update = update$1;
var unregister = unregister$1;
var version = version$1;
var observable = observable$1;

var riot$1 = extend({}, core, {
  observable: observable$1,
  settings: settings,
  util: util,
});

exports.settings = settings;
exports.util = util;
exports.Tag = Tag;
exports.tag = tag;
exports.tag2 = tag2;
exports.mount = mount;
exports.mixin = mixin;
exports.update = update;
exports.unregister = unregister;
exports.version = version;
exports.observable = observable;
exports['default'] = riot$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _riot = __webpack_require__(0);

var _riot2 = _interopRequireDefault(_riot);

__webpack_require__(2);

__webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_riot2.default.mount('x-app', {
    title: 'RiotJS',
    options: ['es6', 'stylus', 'hotload']
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? factory(exports, __webpack_require__(0)) :
	typeof define === 'function' && define.amd ? define(['exports', 'riot'], factory) :
	(factory((global.riotHotReload = global.riotHotReload || {}),global.riot));
}(this, (function (exports,riot) { 'use strict';

var nonState = 'isMounted opts'.split(' ');

function reload(name) {
  riot.util.styleManager.inject();

  var elems = document.querySelectorAll((name + ", [data-is=" + name + "]"));
  var tags = [];

  for (var i = 0; i < elems.length; i++) {
    var el = elems[i], oldTag = el._tag, v;
    reload.trigger('before-unmount', oldTag);
    oldTag.unmount(true); // detach the old tag

    // reset the innerHTML and attributes to how they were before mount
    el.innerHTML = oldTag.__.innerHTML;
    (oldTag.__.instAttrs || []).map(function(attr) {
      el.setAttribute(attr.name, attr.value);
    });

    // copy options for creating the new tag
    var newOpts = {};
    for(key in oldTag.opts) {
      newOpts[key] = oldTag.opts[key];
    }
    newOpts.parent = oldTag.parent;

    // create the new tag
    reload.trigger('before-mount', newOpts, oldTag);
    var newTag = riot.mount(el, newOpts)[0];

    // copy state from the old to new tag
    for(var key in oldTag) {
      v = oldTag[key];
      if (~nonState.indexOf(key)) { continue }
      newTag[key] = v;
    }
    newTag.update();
    tags.push(newTag);
    reload.trigger('after-mount', newTag, oldTag);
  }

  return tags
}

riot.observable(reload);
riot.reload = reload;
if (riot.default) { riot.default.reload = reload; }

exports.reload = reload;
exports['default'] = reload;

Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


    var riot = __webpack_require__(0)
    riot.tag2('x-app', '<h1>{title}</h1> <ul> <li each="{option in opts.options}"> {option} </li> </ul>', '', '', function(opts) {
});

    
  if (false) {
    module.hot.accept()
    if (module.hot.data) {
      riot.reload('x-app')
    }
  }
  

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDgwYTdiN2M4MDcyY2YxZjU0N2MiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Jpb3QvcmlvdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmlvdC1ob3QtcmVsb2FkL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAudGFnIl0sIm5hbWVzIjpbIm1vdW50IiwidGl0bGUiLCJvcHRpb25zIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0IsQ0FBQyw0QkFBNEI7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELEdBQUcsR0FBRztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDOztBQUUzQztBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGFBQWEsU0FBUztBQUN0QixhQUFhLFNBQVM7QUFDdEI7QUFDQTtB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Q25DO0FBQ0E7QUFDQSx5QkFBeUI7O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLDhCQUE4Qjs7QUFFakQ7QUFDQTs7QUFFQSw4Q0FBOEMsY0FBYzs7QUFFNUQsQ0FBQzs7Ozs7OztBQ25ERCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL3B1YmxpYy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0ODBhN2I3YzgwNzJjZjFmNTQ3YyIsIi8qIFJpb3QgdjMuOC4xLCBAbGljZW5zZSBNSVQgKi9cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcblx0KGZhY3RvcnkoKGdsb2JhbC5yaW90ID0ge30pKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbnZhciBfX1RBR1NfQ0FDSEUgPSBbXTtcbnZhciBfX1RBR19JTVBMID0ge307XG52YXIgWUlFTERfVEFHID0gJ3lpZWxkJztcbnZhciBHTE9CQUxfTUlYSU4gPSAnX19nbG9iYWxfbWl4aW4nO1xudmFyIEFUVFJTX1BSRUZJWCA9ICdyaW90LSc7XG52YXIgUkVGX0RJUkVDVElWRVMgPSBbJ3JlZicsICdkYXRhLXJlZiddO1xudmFyIElTX0RJUkVDVElWRSA9ICdkYXRhLWlzJztcbnZhciBDT05ESVRJT05BTF9ESVJFQ1RJVkUgPSAnaWYnO1xudmFyIExPT1BfRElSRUNUSVZFID0gJ2VhY2gnO1xudmFyIExPT1BfTk9fUkVPUkRFUl9ESVJFQ1RJVkUgPSAnbm8tcmVvcmRlcic7XG52YXIgU0hPV19ESVJFQ1RJVkUgPSAnc2hvdyc7XG52YXIgSElERV9ESVJFQ1RJVkUgPSAnaGlkZSc7XG52YXIgS0VZX0RJUkVDVElWRSA9ICdrZXknO1xudmFyIFJJT1RfRVZFTlRTX0tFWSA9ICdfX3Jpb3QtZXZlbnRzX18nO1xudmFyIFRfU1RSSU5HID0gJ3N0cmluZyc7XG52YXIgVF9PQkpFQ1QgPSAnb2JqZWN0JztcbnZhciBUX1VOREVGICA9ICd1bmRlZmluZWQnO1xudmFyIFRfRlVOQ1RJT04gPSAnZnVuY3Rpb24nO1xudmFyIFhMSU5LX05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xudmFyIFNWR19OUyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG52YXIgWExJTktfUkVHRVggPSAvXnhsaW5rOihcXHcrKS87XG52YXIgV0lOID0gdHlwZW9mIHdpbmRvdyA9PT0gVF9VTkRFRiA/IHVuZGVmaW5lZCA6IHdpbmRvdztcbnZhciBSRV9TUEVDSUFMX1RBR1MgPSAvXig/OnQoPzpib2R5fGhlYWR8Zm9vdHxbcmhkXSl8Y2FwdGlvbnxjb2woPzpncm91cCk/fG9wdCg/Omlvbnxncm91cCkpJC87XG52YXIgUkVfU1BFQ0lBTF9UQUdTX05PX09QVElPTiA9IC9eKD86dCg/OmJvZHl8aGVhZHxmb290fFtyaGRdKXxjYXB0aW9ufGNvbCg/Omdyb3VwKT8pJC87XG52YXIgUkVfRVZFTlRTX1BSRUZJWCA9IC9eb24vO1xudmFyIFJFX0hUTUxfQVRUUlMgPSAvKFstXFx3XSspID89ID8oPzpcIihbXlwiXSopfCcoW14nXSopfCh7W159XSp9KSkvZztcbnZhciBDQVNFX1NFTlNJVElWRV9BVFRSSUJVVEVTID0ge1xuICAgICd2aWV3Ym94JzogJ3ZpZXdCb3gnLFxuICAgICdwcmVzZXJ2ZWFzcGVjdHJhdGlvJzogJ3ByZXNlcnZlQXNwZWN0UmF0aW8nXG4gIH07XG52YXIgUkVfQk9PTF9BVFRSUyA9IC9eKD86ZGlzYWJsZWR8Y2hlY2tlZHxyZWFkb25seXxyZXF1aXJlZHxhbGxvd2Z1bGxzY3JlZW58YXV0byg/OmZvY3VzfHBsYXkpfGNvbXBhY3R8Y29udHJvbHN8ZGVmYXVsdHxmb3Jtbm92YWxpZGF0ZXxoaWRkZW58aXNtYXB8aXRlbXNjb3BlfGxvb3B8bXVsdGlwbGV8bXV0ZWR8bm8oPzpyZXNpemV8c2hhZGV8dmFsaWRhdGV8d3JhcCk/fG9wZW58cmV2ZXJzZWR8c2VhbWxlc3N8c2VsZWN0ZWR8c29ydGFibGV8dHJ1ZXNwZWVkfHR5cGVtdXN0bWF0Y2gpJC87XG52YXIgSUVfVkVSU0lPTiA9IChXSU4gJiYgV0lOLmRvY3VtZW50IHx8IHt9KS5kb2N1bWVudE1vZGUgfCAwO1xuXG4vKipcbiAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBtdWx0aXBsZSBub2RlcyBpbiB0aGUgRE9NXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gRE9NIHNlbGVjdG9yXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGN0eCAtIERPTSBub2RlIHdoZXJlIHRoZSB0YXJnZXRzIG9mIG91ciBzZWFyY2ggd2lsbCBpcyBsb2NhdGVkXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlcyBmb3VuZFxuICovXG5mdW5jdGlvbiAkJChzZWxlY3RvciwgY3R4KSB7XG4gIHJldHVybiBbXS5zbGljZS5jYWxsKChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKVxufVxuXG4vKipcbiAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBhIHNpbmdsZSBub2RlIGluIHRoZSBET01cbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSB1bmlxdWUgZG9tIHNlbGVjdG9yXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGN0eCAtIERPTSBub2RlIHdoZXJlIHRoZSB0YXJnZXQgb2Ygb3VyIHNlYXJjaCB3aWxsIGlzIGxvY2F0ZWRcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZG9tIG5vZGUgZm91bmRcbiAqL1xuZnVuY3Rpb24gJChzZWxlY3RvciwgY3R4KSB7XG4gIHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50XG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvY3VtZW50IGZyYWdtZW50XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZyYWcoKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBkb2N1bWVudCB0ZXh0IG5vZGVcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gY3JlYXRlIGEgdGV4dCBub2RlIHRvIHVzZSBhcyBwbGFjZWhvbGRlclxuICovXG5mdW5jdGlvbiBjcmVhdGVET01QbGFjZWhvbGRlcigpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKVxufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgRE9NIG5vZGUgaXMgYW4gc3ZnIHRhZyBvciBwYXJ0IG9mIGFuIHN2Z1xuICogQHBhcmFtICAgeyBIVE1MRWxlbWVudCB9ICBlbCAtIG5vZGUgd2Ugd2FudCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiBpdCdzIGFuIHN2ZyBub2RlXG4gKi9cbmZ1bmN0aW9uIGlzU3ZnKGVsKSB7XG4gIHZhciBvd25lciA9IGVsLm93bmVyU1ZHRWxlbWVudDtcbiAgcmV0dXJuICEhb3duZXIgfHwgb3duZXIgPT09IG51bGxcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBnZW5lcmljIERPTSBub2RlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IG5hbWUgLSBuYW1lIG9mIHRoZSBET00gbm9kZSB3ZSB3YW50IHRvIGNyZWF0ZVxuICogQHJldHVybnMgeyBPYmplY3QgfSBET00gbm9kZSBqdXN0IGNyZWF0ZWRcbiAqL1xuZnVuY3Rpb24gbWtFbChuYW1lKSB7XG4gIHJldHVybiBuYW1lID09PSAnc3ZnJyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdfTlMsIG5hbWUpIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKVxufVxuXG4vKipcbiAqIFNldCB0aGUgaW5uZXIgaHRtbCBvZiBhbnkgRE9NIG5vZGUgU1ZHcyBpbmNsdWRlZFxuICogQHBhcmFtIHsgT2JqZWN0IH0gY29udGFpbmVyIC0gRE9NIG5vZGUgd2hlcmUgd2UnbGwgaW5qZWN0IG5ldyBodG1sXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBodG1sIC0gaHRtbCB0byBpbmplY3RcbiAqIEBwYXJhbSB7IEJvb2xlYW4gfSBpc1N2ZyAtIHN2ZyB0YWdzIHNob3VsZCBiZSB0cmVhdGVkIGEgYml0IGRpZmZlcmVudGx5XG4gKi9cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5mdW5jdGlvbiBzZXRJbm5lckhUTUwoY29udGFpbmVyLCBodG1sLCBpc1N2Zykge1xuICAvLyBpbm5lckhUTUwgaXMgbm90IHN1cHBvcnRlZCBvbiBzdmcgdGFncyBzbyB3ZSBuZWV0IHRvIHRyZWF0IHRoZW0gZGlmZmVyZW50bHlcbiAgaWYgKGlzU3ZnKSB7XG4gICAgdmFyIG5vZGUgPSBjb250YWluZXIub3duZXJEb2N1bWVudC5pbXBvcnROb2RlKFxuICAgICAgbmV3IERPTVBhcnNlcigpXG4gICAgICAgIC5wYXJzZUZyb21TdHJpbmcoKFwiPHN2ZyB4bWxucz1cXFwiXCIgKyBTVkdfTlMgKyBcIlxcXCI+XCIgKyBodG1sICsgXCI8L3N2Zz5cIiksICdhcHBsaWNhdGlvbi94bWwnKVxuICAgICAgICAuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH0gZWxzZSB7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG4gIH1cbn1cblxuLyoqXG4gKiBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2YgYW55IERPTSBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9ICBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIGhpZGVcbiAqIEBwYXJhbSAgIHsgQm9vbGVhbiB9IHNob3cgLSBkbyB3ZSB3YW50IHRvIHNob3cgaXQ/XG4gKi9cblxuZnVuY3Rpb24gdG9nZ2xlVmlzaWJpbGl0eShkb20sIHNob3cpIHtcbiAgZG9tLnN0eWxlLmRpc3BsYXkgPSBzaG93ID8gJycgOiAnbm9uZSc7XG4gIGRvbS5oaWRkZW4gPSBzaG93ID8gZmFsc2UgOiB0cnVlO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbnkgRE9NIGF0dHJpYnV0ZSBmcm9tIGEgbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHVwZGF0ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBuYW1lIC0gbmFtZSBvZiB0aGUgcHJvcGVydHkgd2Ugd2FudCB0byByZW1vdmVcbiAqL1xuZnVuY3Rpb24gcmVtQXR0cihkb20sIG5hbWUpIHtcbiAgZG9tLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgc3R5bGUgb2JqZWN0IHRvIGEgc3RyaW5nXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHN0eWxlIC0gc3R5bGUgb2JqZWN0IHdlIG5lZWQgdG8gcGFyc2VcbiAqIEByZXR1cm5zIHsgU3RyaW5nIH0gcmVzdWx0aW5nIGNzcyBzdHJpbmdcbiAqIEBleGFtcGxlXG4gKiBzdHlsZU9iamVjdFRvU3RyaW5nKHsgY29sb3I6ICdyZWQnLCBoZWlnaHQ6ICcxMHB4J30pIC8vID0+ICdjb2xvcjogcmVkOyBoZWlnaHQ6IDEwcHgnXG4gKi9cbmZ1bmN0aW9uIHN0eWxlT2JqZWN0VG9TdHJpbmcoc3R5bGUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0eWxlKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcHJvcCkge1xuICAgIHJldHVybiAoYWNjICsgXCIgXCIgKyBwcm9wICsgXCI6IFwiICsgKHN0eWxlW3Byb3BdKSArIFwiO1wiKVxuICB9LCAnJylcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHZhbHVlIG9mIGFueSBET00gYXR0cmlidXRlIG9uIGEgbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHBhcnNlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IG5hbWUgLSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgd2Ugd2FudCB0byBnZXRcbiAqIEByZXR1cm5zIHsgU3RyaW5nIHwgdW5kZWZpbmVkIH0gbmFtZSBvZiB0aGUgbm9kZSBhdHRyaWJ1dGUgd2hldGhlciBpdCBleGlzdHNcbiAqL1xuZnVuY3Rpb24gZ2V0QXR0cihkb20sIG5hbWUpIHtcbiAgcmV0dXJuIGRvbS5nZXRBdHRyaWJ1dGUobmFtZSlcbn1cblxuLyoqXG4gKiBTZXQgYW55IERPTSBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIHdhbnQgdG8gdXBkYXRlXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBuYW1lIC0gbmFtZSBvZiB0aGUgcHJvcGVydHkgd2Ugd2FudCB0byBzZXRcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHZhbCAtIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eSB3ZSB3YW50IHRvIHNldFxuICovXG5mdW5jdGlvbiBzZXRBdHRyKGRvbSwgbmFtZSwgdmFsKSB7XG4gIHZhciB4bGluayA9IFhMSU5LX1JFR0VYLmV4ZWMobmFtZSk7XG4gIGlmICh4bGluayAmJiB4bGlua1sxXSlcbiAgICB7IGRvbS5zZXRBdHRyaWJ1dGVOUyhYTElOS19OUywgeGxpbmtbMV0sIHZhbCk7IH1cbiAgZWxzZVxuICAgIHsgZG9tLnNldEF0dHJpYnV0ZShuYW1lLCB2YWwpOyB9XG59XG5cbi8qKlxuICogSW5zZXJ0IHNhZmVseSBhIHRhZyB0byBmaXggIzE5NjIgIzE2NDlcbiAqIEBwYXJhbSAgIHsgSFRNTEVsZW1lbnQgfSByb290IC0gY2hpbGRyZW4gY29udGFpbmVyXG4gKiBAcGFyYW0gICB7IEhUTUxFbGVtZW50IH0gY3VyciAtIG5vZGUgdG8gaW5zZXJ0XG4gKiBAcGFyYW0gICB7IEhUTUxFbGVtZW50IH0gbmV4dCAtIG5vZGUgdGhhdCBzaG91bGQgcHJlY2VlZCB0aGUgY3VycmVudCBub2RlIGluc2VydGVkXG4gKi9cbmZ1bmN0aW9uIHNhZmVJbnNlcnQocm9vdCwgY3VyciwgbmV4dCkge1xuICByb290Lmluc2VydEJlZm9yZShjdXJyLCBuZXh0LnBhcmVudE5vZGUgJiYgbmV4dCk7XG59XG5cbi8qKlxuICogTWluaW1pemUgcmlzazogb25seSB6ZXJvIG9yIG9uZSBfc3BhY2VfIGJldHdlZW4gYXR0ciAmIHZhbHVlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgaHRtbCAtIGh0bWwgc3RyaW5nIHdlIHdhbnQgdG8gcGFyc2VcbiAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGFwcGx5IG9uIGFueSBhdHRyaWJ1dGUgZm91bmRcbiAqL1xuZnVuY3Rpb24gd2Fsa0F0dHJzKGh0bWwsIGZuKSB7XG4gIGlmICghaHRtbCkgeyByZXR1cm4gfVxuICB2YXIgbTtcbiAgd2hpbGUgKG0gPSBSRV9IVE1MX0FUVFJTLmV4ZWMoaHRtbCkpXG4gICAgeyBmbihtWzFdLnRvTG93ZXJDYXNlKCksIG1bMl0gfHwgbVszXSB8fCBtWzRdKTsgfVxufVxuXG4vKipcbiAqIFdhbGsgZG93biByZWN1cnNpdmVseSBhbGwgdGhlIGNoaWxkcmVuIHRhZ3Mgc3RhcnRpbmcgZG9tIG5vZGVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gICBkb20gLSBzdGFydGluZyBub2RlIHdoZXJlIHdlIHdpbGwgc3RhcnQgdGhlIHJlY3Vyc2lvblxuICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgdG8gdHJhbnNmb3JtIHRoZSBjaGlsZCBub2RlIGp1c3QgZm91bmRcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gICBjb250ZXh0IC0gZm4gY2FuIG9wdGlvbmFsbHkgcmV0dXJuIGFuIG9iamVjdCwgd2hpY2ggaXMgcGFzc2VkIHRvIGNoaWxkcmVuXG4gKi9cbmZ1bmN0aW9uIHdhbGtOb2Rlcyhkb20sIGZuLCBjb250ZXh0KSB7XG4gIGlmIChkb20pIHtcbiAgICB2YXIgcmVzID0gZm4oZG9tLCBjb250ZXh0KTtcbiAgICB2YXIgbmV4dDtcbiAgICAvLyBzdG9wIHRoZSByZWN1cnNpb25cbiAgICBpZiAocmVzID09PSBmYWxzZSkgeyByZXR1cm4gfVxuXG4gICAgZG9tID0gZG9tLmZpcnN0Q2hpbGQ7XG5cbiAgICB3aGlsZSAoZG9tKSB7XG4gICAgICBuZXh0ID0gZG9tLm5leHRTaWJsaW5nO1xuICAgICAgd2Fsa05vZGVzKGRvbSwgZm4sIHJlcyk7XG4gICAgICBkb20gPSBuZXh0O1xuICAgIH1cbiAgfVxufVxuXG52YXIgZG9tID0gT2JqZWN0LmZyZWV6ZSh7XG5cdCQkOiAkJCxcblx0JDogJCxcblx0Y3JlYXRlRnJhZzogY3JlYXRlRnJhZyxcblx0Y3JlYXRlRE9NUGxhY2Vob2xkZXI6IGNyZWF0ZURPTVBsYWNlaG9sZGVyLFxuXHRpc1N2ZzogaXNTdmcsXG5cdG1rRWw6IG1rRWwsXG5cdHNldElubmVySFRNTDogc2V0SW5uZXJIVE1MLFxuXHR0b2dnbGVWaXNpYmlsaXR5OiB0b2dnbGVWaXNpYmlsaXR5LFxuXHRyZW1BdHRyOiByZW1BdHRyLFxuXHRzdHlsZU9iamVjdFRvU3RyaW5nOiBzdHlsZU9iamVjdFRvU3RyaW5nLFxuXHRnZXRBdHRyOiBnZXRBdHRyLFxuXHRzZXRBdHRyOiBzZXRBdHRyLFxuXHRzYWZlSW5zZXJ0OiBzYWZlSW5zZXJ0LFxuXHR3YWxrQXR0cnM6IHdhbGtBdHRycyxcblx0d2Fsa05vZGVzOiB3YWxrTm9kZXNcbn0pO1xuXG52YXIgc3R5bGVOb2RlO1xuLy8gQ3JlYXRlIGNhY2hlIGFuZCBzaG9ydGN1dCB0byB0aGUgY29ycmVjdCBwcm9wZXJ0eVxudmFyIGNzc1RleHRQcm9wO1xudmFyIGJ5TmFtZSA9IHt9O1xudmFyIHJlbWFpbmRlciA9IFtdO1xudmFyIG5lZWRzSW5qZWN0ID0gZmFsc2U7XG5cbi8vIHNraXAgdGhlIGZvbGxvd2luZyBjb2RlIG9uIHRoZSBzZXJ2ZXJcbmlmIChXSU4pIHtcbiAgc3R5bGVOb2RlID0gKChmdW5jdGlvbiAoKSB7XG4gICAgLy8gY3JlYXRlIGEgbmV3IHN0eWxlIGVsZW1lbnQgd2l0aCB0aGUgY29ycmVjdCB0eXBlXG4gICAgdmFyIG5ld05vZGUgPSBta0VsKCdzdHlsZScpO1xuICAgIC8vIHJlcGxhY2UgYW55IHVzZXIgbm9kZSBvciBpbnNlcnQgdGhlIG5ldyBvbmUgaW50byB0aGUgaGVhZFxuICAgIHZhciB1c2VyTm9kZSA9ICQoJ3N0eWxlW3R5cGU9cmlvdF0nKTtcblxuICAgIHNldEF0dHIobmV3Tm9kZSwgJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh1c2VyTm9kZSkge1xuICAgICAgaWYgKHVzZXJOb2RlLmlkKSB7IG5ld05vZGUuaWQgPSB1c2VyTm9kZS5pZDsgfVxuICAgICAgdXNlck5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgdXNlck5vZGUpO1xuICAgIH0gZWxzZSB7IGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobmV3Tm9kZSk7IH1cblxuICAgIHJldHVybiBuZXdOb2RlXG4gIH0pKSgpO1xuICBjc3NUZXh0UHJvcCA9IHN0eWxlTm9kZS5zdHlsZVNoZWV0O1xufVxuXG4vKipcbiAqIE9iamVjdCB0aGF0IHdpbGwgYmUgdXNlZCB0byBpbmplY3QgYW5kIG1hbmFnZSB0aGUgY3NzIG9mIGV2ZXJ5IHRhZyBpbnN0YW5jZVxuICovXG52YXIgc3R5bGVNYW5hZ2VyID0ge1xuICBzdHlsZU5vZGU6IHN0eWxlTm9kZSxcbiAgLyoqXG4gICAqIFNhdmUgYSB0YWcgc3R5bGUgdG8gYmUgbGF0ZXIgaW5qZWN0ZWQgaW50byBET01cbiAgICogQHBhcmFtIHsgU3RyaW5nIH0gY3NzIC0gY3NzIHN0cmluZ1xuICAgKiBAcGFyYW0geyBTdHJpbmcgfSBuYW1lIC0gaWYgaXQncyBwYXNzZWQgd2Ugd2lsbCBtYXAgdGhlIGNzcyB0byBhIHRhZ25hbWVcbiAgICovXG4gIGFkZDogZnVuY3Rpb24gYWRkKGNzcywgbmFtZSkge1xuICAgIGlmIChuYW1lKSB7IGJ5TmFtZVtuYW1lXSA9IGNzczsgfVxuICAgIGVsc2UgeyByZW1haW5kZXIucHVzaChjc3MpOyB9XG4gICAgbmVlZHNJbmplY3QgPSB0cnVlO1xuICB9LFxuICAvKipcbiAgICogSW5qZWN0IGFsbCBwcmV2aW91c2x5IHNhdmVkIHRhZyBzdHlsZXMgaW50byBET01cbiAgICogaW5uZXJIVE1MIHNlZW1zIHNsb3c6IGh0dHA6Ly9qc3BlcmYuY29tL3Jpb3QtaW5zZXJ0LXN0eWxlXG4gICAqL1xuICBpbmplY3Q6IGZ1bmN0aW9uIGluamVjdCgpIHtcbiAgICBpZiAoIVdJTiB8fCAhbmVlZHNJbmplY3QpIHsgcmV0dXJuIH1cbiAgICBuZWVkc0luamVjdCA9IGZhbHNlO1xuICAgIHZhciBzdHlsZSA9IE9iamVjdC5rZXlzKGJ5TmFtZSlcbiAgICAgIC5tYXAoZnVuY3Rpb24gKGspIHsgcmV0dXJuIGJ5TmFtZVtrXTsgfSlcbiAgICAgIC5jb25jYXQocmVtYWluZGVyKS5qb2luKCdcXG4nKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChjc3NUZXh0UHJvcCkgeyBjc3NUZXh0UHJvcC5jc3NUZXh0ID0gc3R5bGU7IH1cbiAgICBlbHNlIHsgc3R5bGVOb2RlLmlubmVySFRNTCA9IHN0eWxlOyB9XG4gIH1cbn07XG5cbi8qKlxuICogVGhlIHJpb3QgdGVtcGxhdGUgZW5naW5lXG4gKiBAdmVyc2lvbiB2My4wLjhcbiAqL1xuXG52YXIgc2tpcFJlZ2V4ID0gKGZ1bmN0aW9uICgpIHsgLy9lc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG5cbiAgdmFyIGJlZm9yZVJlQ2hhcnMgPSAnW3soLDs6Pz18JiFefj4lKi8nO1xuXG4gIHZhciBiZWZvcmVSZVdvcmRzID0gW1xuICAgICdjYXNlJyxcbiAgICAnZGVmYXVsdCcsXG4gICAgJ2RvJyxcbiAgICAnZWxzZScsXG4gICAgJ2luJyxcbiAgICAnaW5zdGFuY2VvZicsXG4gICAgJ3ByZWZpeCcsXG4gICAgJ3JldHVybicsXG4gICAgJ3R5cGVvZicsXG4gICAgJ3ZvaWQnLFxuICAgICd5aWVsZCdcbiAgXTtcblxuICB2YXIgd29yZHNMYXN0Q2hhciA9IGJlZm9yZVJlV29yZHMucmVkdWNlKGZ1bmN0aW9uIChzLCB3KSB7XG4gICAgcmV0dXJuIHMgKyB3LnNsaWNlKC0xKVxuICB9LCAnJyk7XG5cbiAgdmFyIFJFX1JFR0VYID0gL15cXC8oPz1bXio+L10pW15bL1xcXFxdKig/Oig/OlxcXFwufFxcWyg/OlxcXFwufFteXFxdXFxcXF0qKSpcXF0pW15bXFxcXC9dKikqP1xcL1tnaW11eV0qLztcbiAgdmFyIFJFX1ZOX0NIQVIgPSAvWyRcXHddLztcblxuICBmdW5jdGlvbiBwcmV2IChjb2RlLCBwb3MpIHtcbiAgICB3aGlsZSAoLS1wb3MgPj0gMCAmJiAvXFxzLy50ZXN0KGNvZGVbcG9zXSkpeyAgfVxuICAgIHJldHVybiBwb3NcbiAgfVxuXG4gIGZ1bmN0aW9uIF9za2lwUmVnZXggKGNvZGUsIHN0YXJ0KSB7XG5cbiAgICB2YXIgcmUgPSAvLiovZztcbiAgICB2YXIgcG9zID0gcmUubGFzdEluZGV4ID0gc3RhcnQrKztcbiAgICB2YXIgbWF0Y2ggPSByZS5leGVjKGNvZGUpWzBdLm1hdGNoKFJFX1JFR0VYKTtcblxuICAgIGlmIChtYXRjaCkge1xuICAgICAgdmFyIG5leHQgPSBwb3MgKyBtYXRjaFswXS5sZW5ndGg7XG5cbiAgICAgIHBvcyA9IHByZXYoY29kZSwgcG9zKTtcbiAgICAgIHZhciBjID0gY29kZVtwb3NdO1xuXG4gICAgICBpZiAocG9zIDwgMCB8fCB+YmVmb3JlUmVDaGFycy5pbmRleE9mKGMpKSB7XG4gICAgICAgIHJldHVybiBuZXh0XG4gICAgICB9XG5cbiAgICAgIGlmIChjID09PSAnLicpIHtcblxuICAgICAgICBpZiAoY29kZVtwb3MgLSAxXSA9PT0gJy4nKSB7XG4gICAgICAgICAgc3RhcnQgPSBuZXh0O1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJysnIHx8IGMgPT09ICctJykge1xuXG4gICAgICAgIGlmIChjb2RlWy0tcG9zXSAhPT0gYyB8fFxuICAgICAgICAgICAgKHBvcyA9IHByZXYoY29kZSwgcG9zKSkgPCAwIHx8XG4gICAgICAgICAgICAhUkVfVk5fQ0hBUi50ZXN0KGNvZGVbcG9zXSkpIHtcbiAgICAgICAgICBzdGFydCA9IG5leHQ7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIGlmICh+d29yZHNMYXN0Q2hhci5pbmRleE9mKGMpKSB7XG5cbiAgICAgICAgdmFyIGVuZCA9IHBvcyArIDE7XG5cbiAgICAgICAgd2hpbGUgKC0tcG9zID49IDAgJiYgUkVfVk5fQ0hBUi50ZXN0KGNvZGVbcG9zXSkpeyAgfVxuICAgICAgICBpZiAofmJlZm9yZVJlV29yZHMuaW5kZXhPZihjb2RlLnNsaWNlKHBvcyArIDEsIGVuZCkpKSB7XG4gICAgICAgICAgc3RhcnQgPSBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXJ0XG4gIH1cblxuICByZXR1cm4gX3NraXBSZWdleFxuXG59KSgpO1xuXG4vKipcbiAqIHJpb3QudXRpbC5icmFja2V0c1xuICpcbiAqIC0gYGJyYWNrZXRzICAgIGAgLSBSZXR1cm5zIGEgc3RyaW5nIG9yIHJlZ2V4IGJhc2VkIG9uIGl0cyBwYXJhbWV0ZXJcbiAqIC0gYGJyYWNrZXRzLnNldGAgLSBDaGFuZ2UgdGhlIGN1cnJlbnQgcmlvdCBicmFja2V0c1xuICpcbiAqIEBtb2R1bGVcbiAqL1xuXG4vKiBnbG9iYWwgcmlvdCAqL1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIGJyYWNrZXRzID0gKGZ1bmN0aW9uIChVTkRFRikge1xuXG4gIHZhclxuICAgIFJFR0xPQiA9ICdnJyxcblxuICAgIFJfTUxDT01NUyA9IC9cXC9cXCpbXipdKlxcKisoPzpbXipcXC9dW14qXSpcXCorKSpcXC8vZyxcblxuICAgIFJfU1RSSU5HUyA9IC9cIlteXCJcXFxcXSooPzpcXFxcW1xcU1xcc11bXlwiXFxcXF0qKSpcInwnW14nXFxcXF0qKD86XFxcXFtcXFNcXHNdW14nXFxcXF0qKSonfGBbXmBcXFxcXSooPzpcXFxcW1xcU1xcc11bXmBcXFxcXSopKmAvZyxcblxuICAgIFNfUUJMT0NLUyA9IFJfU1RSSU5HUy5zb3VyY2UgKyAnfCcgK1xuICAgICAgLyg/OlxcYnJldHVyblxccyt8KD86WyRcXHdcXClcXF1dfFxcK1xcK3wtLSlcXHMqKFxcLykoPyFbKlxcL10pKS8uc291cmNlICsgJ3wnICtcbiAgICAgIC9cXC8oPz1bXipcXC9dKVteW1xcL1xcXFxdKig/Oig/OlxcWyg/OlxcXFwufFteXFxdXFxcXF0qKSpcXF18XFxcXC4pW15bXFwvXFxcXF0qKSo/KFtePF1cXC8pW2dpbV0qLy5zb3VyY2UsXG5cbiAgICBVTlNVUFBPUlRFRCA9IFJlZ0V4cCgnW1xcXFwnICsgJ3gwMC1cXFxceDFGPD5hLXpBLVowLTlcXCdcIiw7XFxcXFxcXFxdJyksXG5cbiAgICBORUVEX0VTQ0FQRSA9IC8oPz1bW1xcXSgpKis/Ll4kfF0pL2csXG5cbiAgICBTX1FCTE9DSzIgPSBSX1NUUklOR1Muc291cmNlICsgJ3wnICsgLyhcXC8pKD8hWypcXC9dKS8uc291cmNlLFxuXG4gICAgRklOREJSQUNFUyA9IHtcbiAgICAgICcoJzogUmVnRXhwKCcoWygpXSl8JyAgICsgU19RQkxPQ0syLCBSRUdMT0IpLFxuICAgICAgJ1snOiBSZWdFeHAoJyhbW1xcXFxdXSl8JyArIFNfUUJMT0NLMiwgUkVHTE9CKSxcbiAgICAgICd7JzogUmVnRXhwKCcoW3t9XSl8JyAgICsgU19RQkxPQ0syLCBSRUdMT0IpXG4gICAgfSxcblxuICAgIERFRkFVTFQgPSAneyB9JztcblxuICB2YXIgX3BhaXJzID0gW1xuICAgICd7JywgJ30nLFxuICAgICd7JywgJ30nLFxuICAgIC97W159XSp9LyxcbiAgICAvXFxcXChbe31dKS9nLFxuICAgIC9cXFxcKHspfHsvZyxcbiAgICBSZWdFeHAoJ1xcXFxcXFxcKH0pfChbWyh7XSl8KH0pfCcgKyBTX1FCTE9DSzIsIFJFR0xPQiksXG4gICAgREVGQVVMVCxcbiAgICAvXlxccyp7XFxeP1xccyooWyRcXHddKykoPzpcXHMqLFxccyooXFxTKykpP1xccytpblxccysoXFxTLiopXFxzKn0vLFxuICAgIC8oXnxbXlxcXFxdKXs9W1xcU1xcc10qP30vXG4gIF07XG5cbiAgdmFyXG4gICAgY2FjaGVkQnJhY2tldHMgPSBVTkRFRixcbiAgICBfcmVnZXgsXG4gICAgX2NhY2hlID0gW10sXG4gICAgX3NldHRpbmdzO1xuXG4gIGZ1bmN0aW9uIF9sb29wYmFjayAocmUpIHsgcmV0dXJuIHJlIH1cblxuICBmdW5jdGlvbiBfcmV3cml0ZSAocmUsIGJwKSB7XG4gICAgaWYgKCFicCkgeyBicCA9IF9jYWNoZTsgfVxuICAgIHJldHVybiBuZXcgUmVnRXhwKFxuICAgICAgcmUuc291cmNlLnJlcGxhY2UoL3svZywgYnBbMl0pLnJlcGxhY2UoL30vZywgYnBbM10pLCByZS5nbG9iYWwgPyBSRUdMT0IgOiAnJ1xuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGUgKHBhaXIpIHtcbiAgICBpZiAocGFpciA9PT0gREVGQVVMVCkgeyByZXR1cm4gX3BhaXJzIH1cblxuICAgIHZhciBhcnIgPSBwYWlyLnNwbGl0KCcgJyk7XG5cbiAgICBpZiAoYXJyLmxlbmd0aCAhPT0gMiB8fCBVTlNVUFBPUlRFRC50ZXN0KHBhaXIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGJyYWNrZXRzIFwiJyArIHBhaXIgKyAnXCInKVxuICAgIH1cbiAgICBhcnIgPSBhcnIuY29uY2F0KHBhaXIucmVwbGFjZShORUVEX0VTQ0FQRSwgJ1xcXFwnKS5zcGxpdCgnICcpKTtcblxuICAgIGFycls0XSA9IF9yZXdyaXRlKGFyclsxXS5sZW5ndGggPiAxID8gL3tbXFxTXFxzXSo/fS8gOiBfcGFpcnNbNF0sIGFycik7XG4gICAgYXJyWzVdID0gX3Jld3JpdGUocGFpci5sZW5ndGggPiAzID8gL1xcXFwoe3x9KS9nIDogX3BhaXJzWzVdLCBhcnIpO1xuICAgIGFycls2XSA9IF9yZXdyaXRlKF9wYWlyc1s2XSwgYXJyKTtcbiAgICBhcnJbN10gPSBSZWdFeHAoJ1xcXFxcXFxcKCcgKyBhcnJbM10gKyAnKXwoW1soe10pfCgnICsgYXJyWzNdICsgJyl8JyArIFNfUUJMT0NLMiwgUkVHTE9CKTtcbiAgICBhcnJbOF0gPSBwYWlyO1xuICAgIHJldHVybiBhcnJcbiAgfVxuXG4gIGZ1bmN0aW9uIF9icmFja2V0cyAocmVPcklkeCkge1xuICAgIHJldHVybiByZU9ySWR4IGluc3RhbmNlb2YgUmVnRXhwID8gX3JlZ2V4KHJlT3JJZHgpIDogX2NhY2hlW3JlT3JJZHhdXG4gIH1cblxuICBfYnJhY2tldHMuc3BsaXQgPSBmdW5jdGlvbiBzcGxpdCAoc3RyLCB0bXBsLCBfYnApIHtcbiAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogX2JwIGlzIGZvciB0aGUgY29tcGlsZXJcbiAgICBpZiAoIV9icCkgeyBfYnAgPSBfY2FjaGU7IH1cblxuICAgIHZhclxuICAgICAgcGFydHMgPSBbXSxcbiAgICAgIG1hdGNoLFxuICAgICAgaXNleHByLFxuICAgICAgc3RhcnQsXG4gICAgICBwb3MsXG4gICAgICByZSA9IF9icFs2XTtcblxuICAgIHZhciBxYmxvY2tzID0gW107XG4gICAgdmFyIHByZXZTdHIgPSAnJztcbiAgICB2YXIgbWFyaywgbGFzdEluZGV4O1xuXG4gICAgaXNleHByID0gc3RhcnQgPSByZS5sYXN0SW5kZXggPSAwO1xuXG4gICAgd2hpbGUgKChtYXRjaCA9IHJlLmV4ZWMoc3RyKSkpIHtcblxuICAgICAgbGFzdEluZGV4ID0gcmUubGFzdEluZGV4O1xuICAgICAgcG9zID0gbWF0Y2guaW5kZXg7XG5cbiAgICAgIGlmIChpc2V4cHIpIHtcblxuICAgICAgICBpZiAobWF0Y2hbMl0pIHtcblxuICAgICAgICAgIHZhciBjaCA9IG1hdGNoWzJdO1xuICAgICAgICAgIHZhciByZWNoID0gRklOREJSQUNFU1tjaF07XG4gICAgICAgICAgdmFyIGl4ID0gMTtcblxuICAgICAgICAgIHJlY2gubGFzdEluZGV4ID0gbGFzdEluZGV4O1xuICAgICAgICAgIHdoaWxlICgobWF0Y2ggPSByZWNoLmV4ZWMoc3RyKSkpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaFsxXSkge1xuICAgICAgICAgICAgICBpZiAobWF0Y2hbMV0gPT09IGNoKSB7ICsraXg7IH1cbiAgICAgICAgICAgICAgZWxzZSBpZiAoIS0taXgpIHsgYnJlYWsgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVjaC5sYXN0SW5kZXggPSBwdXNoUUJsb2NrKG1hdGNoLmluZGV4LCByZWNoLmxhc3RJbmRleCwgbWF0Y2hbMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZS5sYXN0SW5kZXggPSBpeCA/IHN0ci5sZW5ndGggOiByZWNoLmxhc3RJbmRleDtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtYXRjaFszXSkge1xuICAgICAgICAgIHJlLmxhc3RJbmRleCA9IHB1c2hRQmxvY2socG9zLCBsYXN0SW5kZXgsIG1hdGNoWzRdKTtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghbWF0Y2hbMV0pIHtcbiAgICAgICAgdW5lc2NhcGVTdHIoc3RyLnNsaWNlKHN0YXJ0LCBwb3MpKTtcbiAgICAgICAgc3RhcnQgPSByZS5sYXN0SW5kZXg7XG4gICAgICAgIHJlID0gX2JwWzYgKyAoaXNleHByIF49IDEpXTtcbiAgICAgICAgcmUubGFzdEluZGV4ID0gc3RhcnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0ciAmJiBzdGFydCA8IHN0ci5sZW5ndGgpIHtcbiAgICAgIHVuZXNjYXBlU3RyKHN0ci5zbGljZShzdGFydCkpO1xuICAgIH1cblxuICAgIHBhcnRzLnFibG9ja3MgPSBxYmxvY2tzO1xuXG4gICAgcmV0dXJuIHBhcnRzXG5cbiAgICBmdW5jdGlvbiB1bmVzY2FwZVN0ciAocykge1xuICAgICAgaWYgKHByZXZTdHIpIHtcbiAgICAgICAgcyA9IHByZXZTdHIgKyBzO1xuICAgICAgICBwcmV2U3RyID0gJyc7XG4gICAgICB9XG4gICAgICBpZiAodG1wbCB8fCBpc2V4cHIpIHtcbiAgICAgICAgcGFydHMucHVzaChzICYmIHMucmVwbGFjZShfYnBbNV0sICckMScpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnRzLnB1c2gocyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHVzaFFCbG9jayhfcG9zLCBfbGFzdEluZGV4LCBzbGFzaCkgeyAvL2VzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgIGlmIChzbGFzaCkge1xuICAgICAgICBfbGFzdEluZGV4ID0gc2tpcFJlZ2V4KHN0ciwgX3Bvcyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0bXBsICYmIF9sYXN0SW5kZXggPiBfcG9zICsgMikge1xuICAgICAgICBtYXJrID0gJ1xcdTIwNTcnICsgcWJsb2Nrcy5sZW5ndGggKyAnfic7XG4gICAgICAgIHFibG9ja3MucHVzaChzdHIuc2xpY2UoX3BvcywgX2xhc3RJbmRleCkpO1xuICAgICAgICBwcmV2U3RyICs9IHN0ci5zbGljZShzdGFydCwgX3BvcykgKyBtYXJrO1xuICAgICAgICBzdGFydCA9IF9sYXN0SW5kZXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gX2xhc3RJbmRleFxuICAgIH1cbiAgfTtcblxuICBfYnJhY2tldHMuaGFzRXhwciA9IGZ1bmN0aW9uIGhhc0V4cHIgKHN0cikge1xuICAgIHJldHVybiBfY2FjaGVbNF0udGVzdChzdHIpXG4gIH07XG5cbiAgX2JyYWNrZXRzLmxvb3BLZXlzID0gZnVuY3Rpb24gbG9vcEtleXMgKGV4cHIpIHtcbiAgICB2YXIgbSA9IGV4cHIubWF0Y2goX2NhY2hlWzldKTtcblxuICAgIHJldHVybiBtXG4gICAgICA/IHsga2V5OiBtWzFdLCBwb3M6IG1bMl0sIHZhbDogX2NhY2hlWzBdICsgbVszXS50cmltKCkgKyBfY2FjaGVbMV0gfVxuICAgICAgOiB7IHZhbDogZXhwci50cmltKCkgfVxuICB9O1xuXG4gIF9icmFja2V0cy5hcnJheSA9IGZ1bmN0aW9uIGFycmF5IChwYWlyKSB7XG4gICAgcmV0dXJuIHBhaXIgPyBfY3JlYXRlKHBhaXIpIDogX2NhY2hlXG4gIH07XG5cbiAgZnVuY3Rpb24gX3Jlc2V0IChwYWlyKSB7XG4gICAgaWYgKChwYWlyIHx8IChwYWlyID0gREVGQVVMVCkpICE9PSBfY2FjaGVbOF0pIHtcbiAgICAgIF9jYWNoZSA9IF9jcmVhdGUocGFpcik7XG4gICAgICBfcmVnZXggPSBwYWlyID09PSBERUZBVUxUID8gX2xvb3BiYWNrIDogX3Jld3JpdGU7XG4gICAgICBfY2FjaGVbOV0gPSBfcmVnZXgoX3BhaXJzWzldKTtcbiAgICB9XG4gICAgY2FjaGVkQnJhY2tldHMgPSBwYWlyO1xuICB9XG5cbiAgZnVuY3Rpb24gX3NldFNldHRpbmdzIChvKSB7XG4gICAgdmFyIGI7XG5cbiAgICBvID0gbyB8fCB7fTtcbiAgICBiID0gby5icmFja2V0cztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgJ2JyYWNrZXRzJywge1xuICAgICAgc2V0OiBfcmVzZXQsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNhY2hlZEJyYWNrZXRzIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgX3NldHRpbmdzID0gbztcbiAgICBfcmVzZXQoYik7XG4gIH1cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2JyYWNrZXRzLCAnc2V0dGluZ3MnLCB7XG4gICAgc2V0OiBfc2V0U2V0dGluZ3MsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfc2V0dGluZ3MgfVxuICB9KTtcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogaW4gdGhlIGJyb3dzZXIgcmlvdCBpcyBhbHdheXMgaW4gdGhlIHNjb3BlICovXG4gIF9icmFja2V0cy5zZXR0aW5ncyA9IHR5cGVvZiByaW90ICE9PSAndW5kZWZpbmVkJyAmJiByaW90LnNldHRpbmdzIHx8IHt9O1xuICBfYnJhY2tldHMuc2V0ID0gX3Jlc2V0O1xuICBfYnJhY2tldHMuc2tpcFJlZ2V4ID0gc2tpcFJlZ2V4O1xuXG4gIF9icmFja2V0cy5SX1NUUklOR1MgPSBSX1NUUklOR1M7XG4gIF9icmFja2V0cy5SX01MQ09NTVMgPSBSX01MQ09NTVM7XG4gIF9icmFja2V0cy5TX1FCTE9DS1MgPSBTX1FCTE9DS1M7XG4gIF9icmFja2V0cy5TX1FCTE9DSzIgPSBTX1FCTE9DSzI7XG5cbiAgcmV0dXJuIF9icmFja2V0c1xuXG59KSgpO1xuXG4vKipcbiAqIEBtb2R1bGUgdG1wbFxuICpcbiAqIHRtcGwgICAgICAgICAgLSBSb290IGZ1bmN0aW9uLCByZXR1cm5zIHRoZSB0ZW1wbGF0ZSB2YWx1ZSwgcmVuZGVyIHdpdGggZGF0YVxuICogdG1wbC5oYXNFeHByICAtIFRlc3QgdGhlIGV4aXN0ZW5jZSBvZiBhIGV4cHJlc3Npb24gaW5zaWRlIGEgc3RyaW5nXG4gKiB0bXBsLmxvb3BLZXlzIC0gR2V0IHRoZSBrZXlzIGZvciBhbiAnZWFjaCcgbG9vcCAodXNlZCBieSBgX2VhY2hgKVxuICovXG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgdG1wbCA9IChmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIF9jYWNoZSA9IHt9O1xuXG4gIGZ1bmN0aW9uIF90bXBsIChzdHIsIGRhdGEpIHtcbiAgICBpZiAoIXN0cikgeyByZXR1cm4gc3RyIH1cblxuICAgIHJldHVybiAoX2NhY2hlW3N0cl0gfHwgKF9jYWNoZVtzdHJdID0gX2NyZWF0ZShzdHIpKSkuY2FsbChcbiAgICAgIGRhdGEsIF9sb2dFcnIuYmluZCh7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIHRtcGw6IHN0clxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBfdG1wbC5oYXNFeHByID0gYnJhY2tldHMuaGFzRXhwcjtcblxuICBfdG1wbC5sb29wS2V5cyA9IGJyYWNrZXRzLmxvb3BLZXlzO1xuXG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gIF90bXBsLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiAoKSB7IF9jYWNoZSA9IHt9OyB9O1xuXG4gIF90bXBsLmVycm9ySGFuZGxlciA9IG51bGw7XG5cbiAgZnVuY3Rpb24gX2xvZ0VyciAoZXJyLCBjdHgpIHtcblxuICAgIGVyci5yaW90RGF0YSA9IHtcbiAgICAgIHRhZ05hbWU6IGN0eCAmJiBjdHguX18gJiYgY3R4Ll9fLnRhZ05hbWUsXG4gICAgICBfcmlvdF9pZDogY3R4ICYmIGN0eC5fcmlvdF9pZCAgLy9lc2xpbnQtZGlzYWJsZS1saW5lIGNhbWVsY2FzZVxuICAgIH07XG5cbiAgICBpZiAoX3RtcGwuZXJyb3JIYW5kbGVyKSB7IF90bXBsLmVycm9ySGFuZGxlcihlcnIpOyB9XG4gICAgZWxzZSBpZiAoXG4gICAgICB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nXG4gICAgKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICAgIGNvbnNvbGUubG9nKCc8JXM+ICVzJywgZXJyLnJpb3REYXRhLnRhZ05hbWUgfHwgJ1Vua25vd24gdGFnJywgdGhpcy50bXBsKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgY29uc29sZS5sb2codGhpcy5kYXRhKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGUgKHN0cikge1xuICAgIHZhciBleHByID0gX2dldFRtcGwoc3RyKTtcblxuICAgIGlmIChleHByLnNsaWNlKDAsIDExKSAhPT0gJ3RyeXtyZXR1cm4gJykgeyBleHByID0gJ3JldHVybiAnICsgZXhwcjsgfVxuXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignRScsIGV4cHIgKyAnOycpICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LWZ1bmNcbiAgfVxuXG4gIHZhciBSRV9EUVVPVEUgPSAvXFx1MjA1Ny9nO1xuICB2YXIgUkVfUUJNQVJLID0gL1xcdTIwNTcoXFxkKyl+L2c7XG5cbiAgZnVuY3Rpb24gX2dldFRtcGwgKHN0cikge1xuICAgIHZhciBwYXJ0cyA9IGJyYWNrZXRzLnNwbGl0KHN0ci5yZXBsYWNlKFJFX0RRVU9URSwgJ1wiJyksIDEpO1xuICAgIHZhciBxc3RyID0gcGFydHMucWJsb2NrcztcbiAgICB2YXIgZXhwcjtcblxuICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyIHx8IHBhcnRzWzBdKSB7XG4gICAgICB2YXIgaSwgaiwgbGlzdCA9IFtdO1xuXG4gICAgICBmb3IgKGkgPSBqID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgICAgZXhwciA9IHBhcnRzW2ldO1xuXG4gICAgICAgIGlmIChleHByICYmIChleHByID0gaSAmIDFcblxuICAgICAgICAgICAgPyBfcGFyc2VFeHByKGV4cHIsIDEsIHFzdHIpXG5cbiAgICAgICAgICAgIDogJ1wiJyArIGV4cHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHJcXG4/fFxcbi9nLCAnXFxcXG4nKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykgK1xuICAgICAgICAgICAgICAnXCInXG5cbiAgICAgICAgICApKSB7IGxpc3RbaisrXSA9IGV4cHI7IH1cblxuICAgICAgfVxuXG4gICAgICBleHByID0gaiA8IDIgPyBsaXN0WzBdXG4gICAgICAgICAgIDogJ1snICsgbGlzdC5qb2luKCcsJykgKyAnXS5qb2luKFwiXCIpJztcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGV4cHIgPSBfcGFyc2VFeHByKHBhcnRzWzFdLCAwLCBxc3RyKTtcbiAgICB9XG5cbiAgICBpZiAocXN0ci5sZW5ndGgpIHtcbiAgICAgIGV4cHIgPSBleHByLnJlcGxhY2UoUkVfUUJNQVJLLCBmdW5jdGlvbiAoXywgcG9zKSB7XG4gICAgICAgIHJldHVybiBxc3RyW3Bvc11cbiAgICAgICAgICAucmVwbGFjZSgvXFxyL2csICdcXFxccicpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBleHByXG4gIH1cblxuICB2YXIgUkVfQ1NOQU1FID0gL14oPzooLT9bX0EtWmEtelxceEEwLVxceEZGXVstXFx3XFx4QTAtXFx4RkZdKil8XFx1MjA1NyhcXGQrKX4pOi87XG4gIHZhclxuICAgIFJFX0JSRU5EID0ge1xuICAgICAgJygnOiAvWygpXS9nLFxuICAgICAgJ1snOiAvW1tcXF1dL2csXG4gICAgICAneyc6IC9be31dL2dcbiAgICB9O1xuXG4gIGZ1bmN0aW9uIF9wYXJzZUV4cHIgKGV4cHIsIGFzVGV4dCwgcXN0cikge1xuXG4gICAgZXhwciA9IGV4cHJcbiAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpXG4gICAgICAucmVwbGFjZSgvXFwgPyhbW1xcKHt9LD9cXC46XSlcXCA/L2csICckMScpO1xuXG4gICAgaWYgKGV4cHIpIHtcbiAgICAgIHZhclxuICAgICAgICBsaXN0ID0gW10sXG4gICAgICAgIGNudCA9IDAsXG4gICAgICAgIG1hdGNoO1xuXG4gICAgICB3aGlsZSAoZXhwciAmJlxuICAgICAgICAgICAgKG1hdGNoID0gZXhwci5tYXRjaChSRV9DU05BTUUpKSAmJlxuICAgICAgICAgICAgIW1hdGNoLmluZGV4XG4gICAgICAgICkge1xuICAgICAgICB2YXJcbiAgICAgICAgICBrZXksXG4gICAgICAgICAganNiLFxuICAgICAgICAgIHJlID0gLyx8KFtbeyhdKXwkL2c7XG5cbiAgICAgICAgZXhwciA9IFJlZ0V4cC5yaWdodENvbnRleHQ7XG4gICAgICAgIGtleSAgPSBtYXRjaFsyXSA/IHFzdHJbbWF0Y2hbMl1dLnNsaWNlKDEsIC0xKS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpIDogbWF0Y2hbMV07XG5cbiAgICAgICAgd2hpbGUgKGpzYiA9IChtYXRjaCA9IHJlLmV4ZWMoZXhwcikpWzFdKSB7IHNraXBCcmFjZXMoanNiLCByZSk7IH1cblxuICAgICAgICBqc2IgID0gZXhwci5zbGljZSgwLCBtYXRjaC5pbmRleCk7XG4gICAgICAgIGV4cHIgPSBSZWdFeHAucmlnaHRDb250ZXh0O1xuXG4gICAgICAgIGxpc3RbY250KytdID0gX3dyYXBFeHByKGpzYiwgMSwga2V5KTtcbiAgICAgIH1cblxuICAgICAgZXhwciA9ICFjbnQgPyBfd3JhcEV4cHIoZXhwciwgYXNUZXh0KVxuICAgICAgICAgICA6IGNudCA+IDEgPyAnWycgKyBsaXN0LmpvaW4oJywnKSArICddLmpvaW4oXCIgXCIpLnRyaW0oKScgOiBsaXN0WzBdO1xuICAgIH1cbiAgICByZXR1cm4gZXhwclxuXG4gICAgZnVuY3Rpb24gc2tpcEJyYWNlcyAoY2gsIHJlKSB7XG4gICAgICB2YXJcbiAgICAgICAgbW0sXG4gICAgICAgIGx2ID0gMSxcbiAgICAgICAgaXIgPSBSRV9CUkVORFtjaF07XG5cbiAgICAgIGlyLmxhc3RJbmRleCA9IHJlLmxhc3RJbmRleDtcbiAgICAgIHdoaWxlIChtbSA9IGlyLmV4ZWMoZXhwcikpIHtcbiAgICAgICAgaWYgKG1tWzBdID09PSBjaCkgeyArK2x2OyB9XG4gICAgICAgIGVsc2UgaWYgKCEtLWx2KSB7IGJyZWFrIH1cbiAgICAgIH1cbiAgICAgIHJlLmxhc3RJbmRleCA9IGx2ID8gZXhwci5sZW5ndGggOiBpci5sYXN0SW5kZXg7XG4gICAgfVxuICB9XG5cbiAgLy8gaXN0YW5idWwgaWdub3JlIG5leHQ6IG5vdCBib3RoXG4gIHZhciAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgIEpTX0NPTlRFWFQgPSAnXCJpbiB0aGlzP3RoaXM6JyArICh0eXBlb2Ygd2luZG93ICE9PSAnb2JqZWN0JyA/ICdnbG9iYWwnIDogJ3dpbmRvdycpICsgJykuJyxcbiAgICBKU19WQVJOQU1FID0gL1sse11bXFwkXFx3XSsoPz06KXwoXiAqfFteJFxcd1xcLntdKSg/ISg/OnR5cGVvZnx0cnVlfGZhbHNlfG51bGx8dW5kZWZpbmVkfGlufGluc3RhbmNlb2Z8aXMoPzpGaW5pdGV8TmFOKXx2b2lkfE5hTnxuZXd8RGF0ZXxSZWdFeHB8TWF0aCkoPyFbJFxcd10pKShbJF9BLVphLXpdWyRcXHddKikvZyxcbiAgICBKU19OT1BST1BTID0gL14oPz0oXFwuWyRcXHddKykpXFwxKD86W14uWyhdfCQpLztcblxuICBmdW5jdGlvbiBfd3JhcEV4cHIgKGV4cHIsIGFzVGV4dCwga2V5KSB7XG4gICAgdmFyIHRiO1xuXG4gICAgZXhwciA9IGV4cHIucmVwbGFjZShKU19WQVJOQU1FLCBmdW5jdGlvbiAobWF0Y2gsIHAsIG12YXIsIHBvcywgcykge1xuICAgICAgaWYgKG12YXIpIHtcbiAgICAgICAgcG9zID0gdGIgPyAwIDogcG9zICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICAgIGlmIChtdmFyICE9PSAndGhpcycgJiYgbXZhciAhPT0gJ2dsb2JhbCcgJiYgbXZhciAhPT0gJ3dpbmRvdycpIHtcbiAgICAgICAgICBtYXRjaCA9IHAgKyAnKFwiJyArIG12YXIgKyBKU19DT05URVhUICsgbXZhcjtcbiAgICAgICAgICBpZiAocG9zKSB7IHRiID0gKHMgPSBzW3Bvc10pID09PSAnLicgfHwgcyA9PT0gJygnIHx8IHMgPT09ICdbJzsgfVxuICAgICAgICB9IGVsc2UgaWYgKHBvcykge1xuICAgICAgICAgIHRiID0gIUpTX05PUFJPUFMudGVzdChzLnNsaWNlKHBvcykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0Y2hcbiAgICB9KTtcblxuICAgIGlmICh0Yikge1xuICAgICAgZXhwciA9ICd0cnl7cmV0dXJuICcgKyBleHByICsgJ31jYXRjaChlKXtFKGUsdGhpcyl9JztcbiAgICB9XG5cbiAgICBpZiAoa2V5KSB7XG5cbiAgICAgIGV4cHIgPSAodGJcbiAgICAgICAgICA/ICdmdW5jdGlvbigpeycgKyBleHByICsgJ30uY2FsbCh0aGlzKScgOiAnKCcgKyBleHByICsgJyknXG4gICAgICAgICkgKyAnP1wiJyArIGtleSArICdcIjpcIlwiJztcblxuICAgIH0gZWxzZSBpZiAoYXNUZXh0KSB7XG5cbiAgICAgIGV4cHIgPSAnZnVuY3Rpb24odil7JyArICh0YlxuICAgICAgICAgID8gZXhwci5yZXBsYWNlKCdyZXR1cm4gJywgJ3Y9JykgOiAndj0oJyArIGV4cHIgKyAnKSdcbiAgICAgICAgKSArICc7cmV0dXJuIHZ8fHY9PT0wP3Y6XCJcIn0uY2FsbCh0aGlzKSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4cHJcbiAgfVxuXG4gIF90bXBsLnZlcnNpb24gPSBicmFja2V0cy52ZXJzaW9uID0gJ3YzLjAuOCc7XG5cbiAgcmV0dXJuIF90bXBsXG5cbn0pKCk7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgb2JzZXJ2YWJsZSQxID0gZnVuY3Rpb24oZWwpIHtcblxuICAvKipcbiAgICogRXh0ZW5kIHRoZSBvcmlnaW5hbCBvYmplY3Qgb3IgY3JlYXRlIGEgbmV3IGVtcHR5IG9uZVxuICAgKiBAdHlwZSB7IE9iamVjdCB9XG4gICAqL1xuXG4gIGVsID0gZWwgfHwge307XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgdmFyaWFibGVzXG4gICAqL1xuICB2YXIgY2FsbGJhY2tzID0ge30sXG4gICAgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBBcGlcbiAgICovXG5cbiAgLy8gZXh0ZW5kIHRoZSBlbCBvYmplY3QgYWRkaW5nIHRoZSBvYnNlcnZhYmxlIG1ldGhvZHNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZWwsIHtcbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIGBldmVudGAgYW5kc1xuICAgICAqIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgZWFjaCB0aW1lIGFuIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICAgKiBAcGFyYW0gIHsgU3RyaW5nIH0gZXZlbnQgLSBldmVudCBpZFxuICAgICAqIEBwYXJhbSAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb246IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudCwgZm4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgIHsgKGNhbGxiYWNrc1tldmVudF0gPSBjYWxsYmFja3NbZXZlbnRdIHx8IFtdKS5wdXNoKGZuKTsgfVxuICAgICAgICByZXR1cm4gZWxcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgZ2l2ZW4gYGV2ZW50YCBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50IC0gZXZlbnQgaWRcbiAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvZmY6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudCwgZm4pIHtcbiAgICAgICAgaWYgKGV2ZW50ID09ICcqJyAmJiAhZm4pIHsgY2FsbGJhY2tzID0ge307IH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICB2YXIgYXJyID0gY2FsbGJhY2tzW2V2ZW50XTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgY2IgPSBhcnIgJiYgYXJyW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgaWYgKGNiID09IGZuKSB7IGFyci5zcGxpY2UoaS0tLCAxKTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7IGRlbGV0ZSBjYWxsYmFja3NbZXZlbnRdOyB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gYGV2ZW50YCBhbmRcbiAgICAgKiBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGF0IG1vc3Qgb25jZVxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnQgLSBldmVudCBpZFxuICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9uZToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50LCBmbikge1xuICAgICAgICBmdW5jdGlvbiBvbigpIHtcbiAgICAgICAgICBlbC5vZmYoZXZlbnQsIG9uKTtcbiAgICAgICAgICBmbi5hcHBseShlbCwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWwub24oZXZlbnQsIG9uKVxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFsbCBjYWxsYmFjayBmdW5jdGlvbnMgdGhhdCBsaXN0ZW4gdG9cbiAgICAgKiB0aGUgZ2l2ZW4gYGV2ZW50YFxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnQgLSBldmVudCBpZFxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICB0cmlnZ2VyOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGFyZ3VtZW50cyQxID0gYXJndW1lbnRzO1xuXG5cbiAgICAgICAgLy8gZ2V0dGluZyB0aGUgYXJndW1lbnRzXG4gICAgICAgIHZhciBhcmdsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMSxcbiAgICAgICAgICBhcmdzID0gbmV3IEFycmF5KGFyZ2xlbiksXG4gICAgICAgICAgZm5zLFxuICAgICAgICAgIGZuLFxuICAgICAgICAgIGk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyZ2xlbjsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50cyQxW2kgKyAxXTsgLy8gc2tpcCBmaXJzdCBhcmd1bWVudFxuICAgICAgICB9XG5cbiAgICAgICAgZm5zID0gc2xpY2UuY2FsbChjYWxsYmFja3NbZXZlbnRdIHx8IFtdLCAwKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBmbiA9IGZuc1tpXTsgKytpKSB7XG4gICAgICAgICAgZm4uYXBwbHkoZWwsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrc1snKiddICYmIGV2ZW50ICE9ICcqJylcbiAgICAgICAgICB7IGVsLnRyaWdnZXIuYXBwbHkoZWwsIFsnKicsIGV2ZW50XS5jb25jYXQoYXJncykpOyB9XG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZWxcblxufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgcGFzc2VkIGFyZ3VtZW50IGlzIGEgYm9vbGVhbiBhdHRyaWJ1dGVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gdmFsdWUgLVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBpc0Jvb2xBdHRyKHZhbHVlKSB7XG4gIHJldHVybiBSRV9CT09MX0FUVFJTLnRlc3QodmFsdWUpXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgcGFzc2VkIGFyZ3VtZW50IGlzIGEgZnVuY3Rpb25cbiAqIEBwYXJhbSAgIHsgKiB9IHZhbHVlIC1cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBUX0ZVTkNUSU9OXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgcGFzc2VkIGFyZ3VtZW50IGlzIGFuIG9iamVjdCwgZXhjbHVkZSBudWxsXG4gKiBOT1RFOiB1c2UgaXNPYmplY3QoeCkgJiYgIWlzQXJyYXkoeCkgdG8gZXhjbHVkZXMgYXJyYXlzLlxuICogQHBhcmFtICAgeyAqIH0gdmFsdWUgLVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBUX09CSkVDVCAvLyB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0J1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHBhc3NlZCBhcmd1bWVudCBpcyB1bmRlZmluZWRcbiAqIEBwYXJhbSAgIHsgKiB9IHZhbHVlIC1cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gVF9VTkRFRlxufVxuXG4vKipcbiAqIENoZWNrIGlmIHBhc3NlZCBhcmd1bWVudCBpcyBhIHN0cmluZ1xuICogQHBhcmFtICAgeyAqIH0gdmFsdWUgLVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBUX1NUUklOR1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHBhc3NlZCBhcmd1bWVudCBpcyBlbXB0eS4gRGlmZmVyZW50IGZyb20gZmFsc3ksIGJlY2F1c2Ugd2UgZG9udCBjb25zaWRlciAwIG9yIGZhbHNlIHRvIGJlIGJsYW5rXG4gKiBAcGFyYW0geyAqIH0gdmFsdWUgLVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBpc0JsYW5rKHZhbHVlKSB7XG4gIHJldHVybiBpc05pbCh2YWx1ZSkgfHwgdmFsdWUgPT09ICcnXG59XG5cbi8qKlxuICogQ2hlY2sgYWdhaW5zdCB0aGUgbnVsbCBhbmQgdW5kZWZpbmVkIHZhbHVlc1xuICogQHBhcmFtICAgeyAqIH0gIHZhbHVlIC1cbiAqIEByZXR1cm5zIHtCb29sZWFufSAtXG4gKi9cbmZ1bmN0aW9uIGlzTmlsKHZhbHVlKSB7XG4gIHJldHVybiBpc1VuZGVmaW5lZCh2YWx1ZSkgfHwgdmFsdWUgPT09IG51bGxcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBwYXNzZWQgYXJndW1lbnQgaXMgYSBraW5kIG9mIGFycmF5XG4gKiBAcGFyYW0gICB7ICogfSB2YWx1ZSAtXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpIHx8IHZhbHVlIGluc3RhbmNlb2YgQXJyYXlcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIG9iamVjdCdzIHByb3BlcnR5IGNvdWxkIGJlIG92ZXJyaWRkZW5cbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gIG9iaiAtIHNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gIGtleSAtIG9iamVjdCBwcm9wZXJ0eVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gdHJ1ZSBpZiB3cml0YWJsZVxuICovXG5mdW5jdGlvbiBpc1dyaXRhYmxlKG9iaiwga2V5KSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0UHJvcERlc2NyaXB0b3Iob2JqLCBrZXkpO1xuICByZXR1cm4gaXNVbmRlZmluZWQob2JqW2tleV0pIHx8IGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci53cml0YWJsZVxufVxuXG5cbnZhciBjaGVjayA9IE9iamVjdC5mcmVlemUoe1xuXHRpc0Jvb2xBdHRyOiBpc0Jvb2xBdHRyLFxuXHRpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuXHRpc09iamVjdDogaXNPYmplY3QsXG5cdGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcblx0aXNTdHJpbmc6IGlzU3RyaW5nLFxuXHRpc0JsYW5rOiBpc0JsYW5rLFxuXHRpc05pbDogaXNOaWwsXG5cdGlzQXJyYXk6IGlzQXJyYXksXG5cdGlzV3JpdGFibGU6IGlzV3JpdGFibGVcbn0pO1xuXG4vKipcbiAqIFNwZWNpYWxpemVkIGZ1bmN0aW9uIGZvciBsb29waW5nIGFuIGFycmF5LWxpa2UgY29sbGVjdGlvbiB3aXRoIGBlYWNoPXt9YFxuICogQHBhcmFtICAgeyBBcnJheSB9IGxpc3QgLSBjb2xsZWN0aW9uIG9mIGl0ZW1zXG4gKiBAcGFyYW0gICB7RnVuY3Rpb259IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQXJyYXkgfSB0aGUgYXJyYXkgbG9vcGVkXG4gKi9cbmZ1bmN0aW9uIGVhY2gobGlzdCwgZm4pIHtcbiAgdmFyIGxlbiA9IGxpc3QgPyBsaXN0Lmxlbmd0aCA6IDA7XG4gIHZhciBpID0gMDtcbiAgZm9yICg7IGkgPCBsZW47IGkrKykgeyBmbihsaXN0W2ldLCBpKTsgfVxuICByZXR1cm4gbGlzdFxufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gYXJyYXkgY29udGFpbnMgYW4gaXRlbVxuICogQHBhcmFtICAgeyBBcnJheSB9IGFycmF5IC0gdGFyZ2V0IGFycmF5XG4gKiBAcGFyYW0gICB7ICogfSBpdGVtIC0gaXRlbSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmZ1bmN0aW9uIGNvbnRhaW5zKGFycmF5LCBpdGVtKSB7XG4gIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pICE9PSAtMVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBzdHJpbmcgY29udGFpbmluZyBkYXNoZXMgdG8gY2FtZWwgY2FzZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzdHIgLSBpbnB1dCBzdHJpbmdcbiAqIEByZXR1cm5zIHsgU3RyaW5nIH0gbXktc3RyaW5nIC0+IG15U3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHRvQ2FtZWwoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvLShcXHcpL2csIGZ1bmN0aW9uIChfLCBjKSB7IHJldHVybiBjLnRvVXBwZXJDYXNlKCk7IH0pXG59XG5cbi8qKlxuICogRmFzdGVyIFN0cmluZyBzdGFydHNXaXRoIGFsdGVybmF0aXZlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHN0ciAtIHNvdXJjZSBzdHJpbmdcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gdmFsdWUgLSB0ZXN0IHN0cmluZ1xuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBzdGFydHNXaXRoKHN0ciwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0ci5zbGljZSgwLCB2YWx1ZS5sZW5ndGgpID09PSB2YWx1ZVxufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBzZXQgYW4gaW1tdXRhYmxlIHByb3BlcnR5XG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGVsIC0gb2JqZWN0IHdoZXJlIHRoZSBuZXcgcHJvcGVydHkgd2lsbCBiZSBzZXRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0ga2V5IC0gb2JqZWN0IGtleSB3aGVyZSB0aGUgbmV3IHByb3BlcnR5IHdpbGwgYmUgc3RvcmVkXG4gKiBAcGFyYW0gICB7ICogfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBuZXcgcHJvcGVydHlcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gb3B0aW9ucyAtIHNldCB0aGUgcHJvcGVyeSBvdmVycmlkaW5nIHRoZSBkZWZhdWx0IG9wdGlvbnNcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gLSB0aGUgaW5pdGlhbCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoZWwsIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsLCBrZXksIGV4dGVuZCh7XG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSwgb3B0aW9ucykpO1xuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiByZXR1cm5pbmcgYWx3YXlzIGEgdW5pcXVlIGlkZW50aWZpZXJcbiAqIEByZXR1cm5zIHsgTnVtYmVyIH0gLSBudW1iZXIgZnJvbSAwLi4ublxuICovXG52YXIgdWlkID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgaSA9IC0xO1xuICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gKytpOyB9XG59KSgpO1xuXG5cbi8qKlxuICogV2FybiBhIG1lc3NhZ2UgdmlhIGNvbnNvbGVcbiAqIEBwYXJhbSAgIHtTdHJpbmd9IG1lc3NhZ2UgLSB3YXJuaW5nIG1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gd2FybihtZXNzYWdlKSB7XG4gIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2FybikgeyBjb25zb2xlLndhcm4obWVzc2FnZSk7IH1cbn1cblxuLyoqXG4gKiBTaG9ydCBhbGlhcyBmb3IgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvclxuICovXG52YXIgZ2V0UHJvcERlc2NyaXB0b3IgPSBmdW5jdGlvbiAobywgaykgeyByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBrKTsgfTtcblxuLyoqXG4gKiBFeHRlbmQgYW55IG9iamVjdCB3aXRoIG90aGVyIHByb3BlcnRpZXNcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gc3JjIC0gc291cmNlIG9iamVjdFxuICogQHJldHVybnMgeyBPYmplY3QgfSB0aGUgcmVzdWx0aW5nIGV4dGVuZGVkIG9iamVjdFxuICpcbiAqIHZhciBvYmogPSB7IGZvbzogJ2JheicgfVxuICogZXh0ZW5kKG9iaiwge2JhcjogJ2JhcicsIGZvbzogJ2Jhcid9KVxuICogY29uc29sZS5sb2cob2JqKSA9PiB7YmFyOiAnYmFyJywgZm9vOiAnYmFyJ31cbiAqXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChzcmMpIHtcbiAgdmFyIG9iajtcbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGwgPSBhcmdzLmxlbmd0aDtcblxuICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChvYmogPSBhcmdzW2ldKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgcHJvcGVydHkgb2YgdGhlIHNvdXJjZSBvYmplY3QgY291bGQgYmUgb3ZlcnJpZGRlblxuICAgICAgICBpZiAoaXNXcml0YWJsZShzcmMsIGtleSkpXG4gICAgICAgICAgeyBzcmNba2V5XSA9IG9ialtrZXldOyB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzcmNcbn1cblxudmFyIG1pc2MgPSBPYmplY3QuZnJlZXplKHtcblx0ZWFjaDogZWFjaCxcblx0Y29udGFpbnM6IGNvbnRhaW5zLFxuXHR0b0NhbWVsOiB0b0NhbWVsLFxuXHRzdGFydHNXaXRoOiBzdGFydHNXaXRoLFxuXHRkZWZpbmVQcm9wZXJ0eTogZGVmaW5lUHJvcGVydHksXG5cdHVpZDogdWlkLFxuXHR3YXJuOiB3YXJuLFxuXHRnZXRQcm9wRGVzY3JpcHRvcjogZ2V0UHJvcERlc2NyaXB0b3IsXG5cdGV4dGVuZDogZXh0ZW5kXG59KTtcblxudmFyIHNldHRpbmdzJDEgPSBleHRlbmQoT2JqZWN0LmNyZWF0ZShicmFja2V0cy5zZXR0aW5ncyksIHtcbiAgc2tpcEFub255bW91c1RhZ3M6IHRydWUsXG4gIC8vIGhhbmRsZSB0aGUgYXV0byB1cGRhdGVzIG9uIGFueSBET00gZXZlbnRcbiAgYXV0b1VwZGF0ZTogdHJ1ZVxufSk7XG5cbi8qKlxuICogVHJpZ2dlciBET00gZXZlbnRzXG4gKiBAcGFyYW0gICB7IEhUTUxFbGVtZW50IH0gZG9tIC0gZG9tIGVsZW1lbnQgdGFyZ2V0IG9mIHRoZSBldmVudFxuICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGhhbmRsZXIgLSB1c2VyIGZ1bmN0aW9uXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGUgLSBldmVudCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gaGFuZGxlRXZlbnQoZG9tLCBoYW5kbGVyLCBlKSB7XG4gIHZhciBwdGFnID0gdGhpcy5fXy5wYXJlbnQ7XG4gIHZhciBpdGVtID0gdGhpcy5fXy5pdGVtO1xuXG4gIGlmICghaXRlbSlcbiAgICB7IHdoaWxlIChwdGFnICYmICFpdGVtKSB7XG4gICAgICBpdGVtID0gcHRhZy5fXy5pdGVtO1xuICAgICAgcHRhZyA9IHB0YWcuX18ucGFyZW50O1xuICAgIH0gfVxuXG4gIC8vIG92ZXJyaWRlIHRoZSBldmVudCBwcm9wZXJ0aWVzXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlmIChpc1dyaXRhYmxlKGUsICdjdXJyZW50VGFyZ2V0JykpIHsgZS5jdXJyZW50VGFyZ2V0ID0gZG9tOyB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlmIChpc1dyaXRhYmxlKGUsICd0YXJnZXQnKSkgeyBlLnRhcmdldCA9IGUuc3JjRWxlbWVudDsgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpZiAoaXNXcml0YWJsZShlLCAnd2hpY2gnKSkgeyBlLndoaWNoID0gZS5jaGFyQ29kZSB8fCBlLmtleUNvZGU7IH1cblxuICBlLml0ZW0gPSBpdGVtO1xuXG4gIGhhbmRsZXIuY2FsbCh0aGlzLCBlKTtcblxuICAvLyBhdm9pZCBhdXRvIHVwZGF0ZXNcbiAgaWYgKCFzZXR0aW5ncyQxLmF1dG9VcGRhdGUpIHsgcmV0dXJuIH1cblxuICBpZiAoIWUucHJldmVudFVwZGF0ZSkge1xuICAgIHZhciBwID0gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHRoaXMpO1xuICAgIC8vIGZpeGVzICMyMDgzXG4gICAgaWYgKHAuaXNNb3VudGVkKSB7IHAudXBkYXRlKCk7IH1cbiAgfVxufVxuXG4vKipcbiAqIEF0dGFjaCBhbiBldmVudCB0byBhIERPTSBub2RlXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBuYW1lIC0gZXZlbnQgbmFtZVxuICogQHBhcmFtIHsgRnVuY3Rpb24gfSBoYW5kbGVyIC0gZXZlbnQgY2FsbGJhY2tcbiAqIEBwYXJhbSB7IE9iamVjdCB9IGRvbSAtIGRvbSBub2RlXG4gKiBAcGFyYW0geyBUYWcgfSB0YWcgLSB0YWcgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gc2V0RXZlbnRIYW5kbGVyKG5hbWUsIGhhbmRsZXIsIGRvbSwgdGFnKSB7XG4gIHZhciBldmVudE5hbWU7XG4gIHZhciBjYiA9IGhhbmRsZUV2ZW50LmJpbmQodGFnLCBkb20sIGhhbmRsZXIpO1xuXG4gIC8vIGF2b2lkIHRvIGJpbmQgdHdpY2UgdGhlIHNhbWUgZXZlbnRcbiAgLy8gcG9zc2libGUgZml4IGZvciAjMjMzMlxuICBkb21bbmFtZV0gPSBudWxsO1xuXG4gIC8vIG5vcm1hbGl6ZSBldmVudCBuYW1lXG4gIGV2ZW50TmFtZSA9IG5hbWUucmVwbGFjZShSRV9FVkVOVFNfUFJFRklYLCAnJyk7XG5cbiAgLy8gY2FjaGUgdGhlIGxpc3RlbmVyIGludG8gdGhlIGxpc3RlbmVycyBhcnJheVxuICBpZiAoIWNvbnRhaW5zKHRhZy5fXy5saXN0ZW5lcnMsIGRvbSkpIHsgdGFnLl9fLmxpc3RlbmVycy5wdXNoKGRvbSk7IH1cbiAgaWYgKCFkb21bUklPVF9FVkVOVFNfS0VZXSkgeyBkb21bUklPVF9FVkVOVFNfS0VZXSA9IHt9OyB9XG4gIGlmIChkb21bUklPVF9FVkVOVFNfS0VZXVtuYW1lXSkgeyBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGRvbVtSSU9UX0VWRU5UU19LRVldW25hbWVdKTsgfVxuXG4gIGRvbVtSSU9UX0VWRU5UU19LRVldW25hbWVdID0gY2I7XG4gIGRvbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2IsIGZhbHNlKTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgZHluYW1pY2FsbHkgY3JlYXRlZCBkYXRhLWlzIHRhZ3Mgd2l0aCBjaGFuZ2luZyBleHByZXNzaW9uc1xuICogQHBhcmFtIHsgT2JqZWN0IH0gZXhwciAtIGV4cHJlc3Npb24gdGFnIGFuZCBleHByZXNzaW9uIGluZm9cbiAqIEBwYXJhbSB7IFRhZyB9ICAgIHBhcmVudCAtIHBhcmVudCBmb3IgdGFnIGNyZWF0aW9uXG4gKiBAcGFyYW0geyBTdHJpbmcgfSB0YWdOYW1lIC0gdGFnIGltcGxlbWVudGF0aW9uIHdlIHdhbnQgdG8gdXNlXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZURhdGFJcyhleHByLCBwYXJlbnQsIHRhZ05hbWUpIHtcbiAgdmFyIHRhZyA9IGV4cHIudGFnIHx8IGV4cHIuZG9tLl90YWc7XG4gIHZhciByZWY7XG5cbiAgdmFyIHJlZiQxID0gdGFnID8gdGFnLl9fIDoge307XG4gIHZhciBoZWFkID0gcmVmJDEuaGVhZDtcbiAgdmFyIGlzVmlydHVhbCA9IGV4cHIuZG9tLnRhZ05hbWUgPT09ICdWSVJUVUFMJztcblxuICBpZiAodGFnICYmIGV4cHIudGFnTmFtZSA9PT0gdGFnTmFtZSkge1xuICAgIHRhZy51cGRhdGUoKTtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIHN5bmMgX3BhcmVudCB0byBhY2NvbW1vZGF0ZSBjaGFuZ2luZyB0YWduYW1lc1xuICBpZiAodGFnKSB7XG4gICAgLy8gbmVlZCBwbGFjZWhvbGRlciBiZWZvcmUgdW5tb3VudFxuICAgIGlmKGlzVmlydHVhbCkge1xuICAgICAgcmVmID0gY3JlYXRlRE9NUGxhY2Vob2xkZXIoKTtcbiAgICAgIGhlYWQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocmVmLCBoZWFkKTtcbiAgICB9XG5cbiAgICB0YWcudW5tb3VudCh0cnVlKTtcbiAgfVxuXG4gIC8vIHVuYWJsZSB0byBnZXQgdGhlIHRhZyBuYW1lXG4gIGlmICghaXNTdHJpbmcodGFnTmFtZSkpIHsgcmV0dXJuIH1cblxuICBleHByLmltcGwgPSBfX1RBR19JTVBMW3RhZ05hbWVdO1xuXG4gIC8vIHVua25vd24gaW1wbGVtZW50YXRpb25cbiAgaWYgKCFleHByLmltcGwpIHsgcmV0dXJuIH1cblxuICBleHByLnRhZyA9IHRhZyA9IGluaXRDaGlsZFRhZyhcbiAgICBleHByLmltcGwsIHtcbiAgICAgIHJvb3Q6IGV4cHIuZG9tLFxuICAgICAgcGFyZW50OiBwYXJlbnQsXG4gICAgICB0YWdOYW1lOiB0YWdOYW1lXG4gICAgfSxcbiAgICBleHByLmRvbS5pbm5lckhUTUwsXG4gICAgcGFyZW50XG4gICk7XG5cbiAgZWFjaChleHByLmF0dHJzLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gc2V0QXR0cih0YWcucm9vdCwgYS5uYW1lLCBhLnZhbHVlKTsgfSk7XG4gIGV4cHIudGFnTmFtZSA9IHRhZ05hbWU7XG4gIHRhZy5tb3VudCgpO1xuXG4gIC8vIHJvb3QgZXhpc3QgZmlyc3QgdGltZSwgYWZ0ZXIgdXNlIHBsYWNlaG9sZGVyXG4gIGlmIChpc1ZpcnR1YWwpIHsgbWFrZVJlcGxhY2VWaXJ0dWFsKHRhZywgcmVmIHx8IHRhZy5yb290KTsgfVxuXG4gIC8vIHBhcmVudCBpcyB0aGUgcGxhY2Vob2xkZXIgdGFnLCBub3QgdGhlIGR5bmFtaWMgdGFnIHNvIGNsZWFuIHVwXG4gIHBhcmVudC5fXy5vblVubW91bnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlbE5hbWUgPSB0YWcub3B0cy5kYXRhSXM7XG4gICAgYXJyYXlpc2hSZW1vdmUodGFnLnBhcmVudC50YWdzLCBkZWxOYW1lLCB0YWcpO1xuICAgIGFycmF5aXNoUmVtb3ZlKHRhZy5fXy5wYXJlbnQudGFncywgZGVsTmFtZSwgdGFnKTtcbiAgICB0YWcudW5tb3VudCgpO1xuICB9O1xufVxuXG4vKipcbiAqIE5vbWFsaXplIGFueSBhdHRyaWJ1dGUgcmVtb3ZpbmcgdGhlIFwicmlvdC1cIiBwcmVmaXhcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gYXR0ck5hbWUgLSBvcmlnaW5hbCBhdHRyaWJ1dGUgbmFtZVxuICogQHJldHVybnMgeyBTdHJpbmcgfSB2YWxpZCBodG1sIGF0dHJpYnV0ZSBuYW1lXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUF0dHJOYW1lKGF0dHJOYW1lKSB7XG4gIGlmICghYXR0ck5hbWUpIHsgcmV0dXJuIG51bGwgfVxuICBhdHRyTmFtZSA9IGF0dHJOYW1lLnJlcGxhY2UoQVRUUlNfUFJFRklYLCAnJyk7XG4gIGlmIChDQVNFX1NFTlNJVElWRV9BVFRSSUJVVEVTW2F0dHJOYW1lXSkgeyBhdHRyTmFtZSA9IENBU0VfU0VOU0lUSVZFX0FUVFJJQlVURVNbYXR0ck5hbWVdOyB9XG4gIHJldHVybiBhdHRyTmFtZVxufVxuXG4vKipcbiAqIFVwZGF0ZSBvbiBzaW5nbGUgdGFnIGV4cHJlc3Npb25cbiAqIEB0aGlzIFRhZ1xuICogQHBhcmFtIHsgT2JqZWN0IH0gZXhwciAtIGV4cHJlc3Npb24gbG9naWNcbiAqIEByZXR1cm5zIHsgdW5kZWZpbmVkIH1cbiAqL1xuZnVuY3Rpb24gdXBkYXRlRXhwcmVzc2lvbihleHByKSB7XG4gIGlmICh0aGlzLnJvb3QgJiYgZ2V0QXR0cih0aGlzLnJvb3QsJ3ZpcnR1YWxpemVkJykpIHsgcmV0dXJuIH1cblxuICB2YXIgZG9tID0gZXhwci5kb207XG4gIC8vIHJlbW92ZSB0aGUgcmlvdC0gcHJlZml4XG4gIHZhciBhdHRyTmFtZSA9IG5vcm1hbGl6ZUF0dHJOYW1lKGV4cHIuYXR0cik7XG4gIHZhciBpc1RvZ2dsZSA9IGNvbnRhaW5zKFtTSE9XX0RJUkVDVElWRSwgSElERV9ESVJFQ1RJVkVdLCBhdHRyTmFtZSk7XG4gIHZhciBpc1ZpcnR1YWwgPSBleHByLnJvb3QgJiYgZXhwci5yb290LnRhZ05hbWUgPT09ICdWSVJUVUFMJztcbiAgdmFyIHJlZiA9IHRoaXMuX187XG4gIHZhciBpc0Fub255bW91cyA9IHJlZi5pc0Fub255bW91cztcbiAgdmFyIHBhcmVudCA9IGRvbSAmJiAoZXhwci5wYXJlbnQgfHwgZG9tLnBhcmVudE5vZGUpO1xuICAvLyBkZXRlY3QgdGhlIHN0eWxlIGF0dHJpYnV0ZXNcbiAgdmFyIGlzU3R5bGVBdHRyID0gYXR0ck5hbWUgPT09ICdzdHlsZSc7XG4gIHZhciBpc0NsYXNzQXR0ciA9IGF0dHJOYW1lID09PSAnY2xhc3MnO1xuXG4gIHZhciB2YWx1ZTtcblxuICAvLyBpZiBpdCdzIGEgdGFnIHdlIGNvdWxkIHRvdGFsbHkgc2tpcCB0aGUgcmVzdFxuICBpZiAoZXhwci5fcmlvdF9pZCkge1xuICAgIGlmIChleHByLl9fLndhc0NyZWF0ZWQpIHtcbiAgICAgIGV4cHIudXBkYXRlKCk7XG4gICAgLy8gaWYgaXQgaGFzbid0IGJlZW4gbW91bnRlZCB5ZXQsIGRvIHRoYXQgbm93LlxuICAgIH0gZWxzZSB7XG4gICAgICBleHByLm1vdW50KCk7XG4gICAgICBpZiAoaXNWaXJ0dWFsKSB7XG4gICAgICAgIG1ha2VSZXBsYWNlVmlydHVhbChleHByLCBleHByLnJvb3QpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIGlmIHRoaXMgZXhwcmVzc2lvbiBoYXMgdGhlIHVwZGF0ZSBtZXRob2QgaXQgbWVhbnMgaXQgY2FuIGhhbmRsZSB0aGUgRE9NIGNoYW5nZXMgYnkgaXRzZWxmXG4gIGlmIChleHByLnVwZGF0ZSkgeyByZXR1cm4gZXhwci51cGRhdGUoKSB9XG5cbiAgdmFyIGNvbnRleHQgPSBpc1RvZ2dsZSAmJiAhaXNBbm9ueW1vdXMgPyBpbmhlcml0UGFyZW50UHJvcHMuY2FsbCh0aGlzKSA6IHRoaXM7XG5cbiAgLy8gLi4uaXQgc2VlbXMgdG8gYmUgYSBzaW1wbGUgZXhwcmVzc2lvbiBzbyB3ZSB0cnkgdG8gY2FsY3VsYXRlIGl0cyB2YWx1ZVxuICB2YWx1ZSA9IHRtcGwoZXhwci5leHByLCBjb250ZXh0KTtcblxuICB2YXIgaGFzVmFsdWUgPSAhaXNCbGFuayh2YWx1ZSk7XG4gIHZhciBpc09iaiA9IGlzT2JqZWN0KHZhbHVlKTtcblxuICAvLyBjb252ZXJ0IHRoZSBzdHlsZS9jbGFzcyBvYmplY3RzIHRvIHN0cmluZ3NcbiAgaWYgKGlzT2JqKSB7XG4gICAgaWYgKGlzQ2xhc3NBdHRyKSB7XG4gICAgICB2YWx1ZSA9IHRtcGwoSlNPTi5zdHJpbmdpZnkodmFsdWUpLCB0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGlzU3R5bGVBdHRyKSB7XG4gICAgICB2YWx1ZSA9IHN0eWxlT2JqZWN0VG9TdHJpbmcodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlbW92ZSBvcmlnaW5hbCBhdHRyaWJ1dGVcbiAgaWYgKGV4cHIuYXR0ciAmJiAoIWV4cHIud2FzUGFyc2VkT25jZSB8fCAhaGFzVmFsdWUgfHwgdmFsdWUgPT09IGZhbHNlKSkge1xuICAgIC8vIHJlbW92ZSBlaXRoZXIgcmlvdC0qIGF0dHJpYnV0ZXMgb3IganVzdCB0aGUgYXR0cmlidXRlIG5hbWVcbiAgICByZW1BdHRyKGRvbSwgZ2V0QXR0cihkb20sIGV4cHIuYXR0cikgPyBleHByLmF0dHIgOiBhdHRyTmFtZSk7XG4gIH1cblxuICAvLyBmb3IgdGhlIGJvb2xlYW4gYXR0cmlidXRlcyB3ZSBkb24ndCBuZWVkIHRoZSB2YWx1ZVxuICAvLyB3ZSBjYW4gY29udmVydCBpdCB0byBjaGVja2VkPXRydWUgdG8gY2hlY2tlZD1jaGVja2VkXG4gIGlmIChleHByLmJvb2wpIHsgdmFsdWUgPSB2YWx1ZSA/IGF0dHJOYW1lIDogZmFsc2U7IH1cbiAgaWYgKGV4cHIuaXNSdGFnKSB7IHJldHVybiB1cGRhdGVEYXRhSXMoZXhwciwgdGhpcywgdmFsdWUpIH1cbiAgaWYgKGV4cHIud2FzUGFyc2VkT25jZSAmJiBleHByLnZhbHVlID09PSB2YWx1ZSkgeyByZXR1cm4gfVxuXG4gIC8vIHVwZGF0ZSB0aGUgZXhwcmVzc2lvbiB2YWx1ZVxuICBleHByLnZhbHVlID0gdmFsdWU7XG4gIGV4cHIud2FzUGFyc2VkT25jZSA9IHRydWU7XG5cbiAgLy8gaWYgdGhlIHZhbHVlIGlzIGFuIG9iamVjdCAoYW5kIGl0J3Mgbm90IGEgc3R5bGUgb3IgY2xhc3MgYXR0cmlidXRlKSB3ZSBjYW4gbm90IGRvIG11Y2ggbW9yZSB3aXRoIGl0XG4gIGlmIChpc09iaiAmJiAhaXNDbGFzc0F0dHIgJiYgIWlzU3R5bGVBdHRyICYmICFpc1RvZ2dsZSkgeyByZXR1cm4gfVxuICAvLyBhdm9pZCB0byByZW5kZXIgdW5kZWZpbmVkL251bGwgdmFsdWVzXG4gIGlmICghaGFzVmFsdWUpIHsgdmFsdWUgPSAnJzsgfVxuXG4gIC8vIHRleHRhcmVhIGFuZCB0ZXh0IG5vZGVzIGhhdmUgbm8gYXR0cmlidXRlIG5hbWVcbiAgaWYgKCFhdHRyTmFtZSkge1xuICAgIC8vIGFib3V0ICM4MTUgdy9vIHJlcGxhY2U6IHRoZSBicm93c2VyIGNvbnZlcnRzIHRoZSB2YWx1ZSB0byBhIHN0cmluZyxcbiAgICAvLyB0aGUgY29tcGFyaXNvbiBieSBcIj09XCIgZG9lcyB0b28sIGJ1dCBub3QgaW4gdGhlIHNlcnZlclxuICAgIHZhbHVlICs9ICcnO1xuICAgIC8vIHRlc3QgZm9yIHBhcmVudCBhdm9pZHMgZXJyb3Igd2l0aCBpbnZhbGlkIGFzc2lnbm1lbnQgdG8gbm9kZVZhbHVlXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgLy8gY2FjaGUgdGhlIHBhcmVudCBub2RlIGJlY2F1c2Ugc29tZWhvdyBpdCB3aWxsIGJlY29tZSBudWxsIG9uIElFXG4gICAgICAvLyBvbiB0aGUgbmV4dCBpdGVyYXRpb25cbiAgICAgIGV4cHIucGFyZW50ID0gcGFyZW50O1xuICAgICAgaWYgKHBhcmVudC50YWdOYW1lID09PSAnVEVYVEFSRUEnKSB7XG4gICAgICAgIHBhcmVudC52YWx1ZSA9IHZhbHVlOyAgICAgICAgICAgICAgICAgICAgLy8gIzExMTNcbiAgICAgICAgaWYgKCFJRV9WRVJTSU9OKSB7IGRvbS5ub2RlVmFsdWUgPSB2YWx1ZTsgfSAgLy8gIzE2MjUgSUUgdGhyb3dzIGhlcmUsIG5vZGVWYWx1ZVxuICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCBiZSBhdmFpbGFibGUgb24gJ3VwZGF0ZWQnXG4gICAgICBlbHNlIHsgZG9tLm5vZGVWYWx1ZSA9IHZhbHVlOyB9XG4gICAgfVxuICAgIHJldHVyblxuICB9XG5cblxuICAvLyBldmVudCBoYW5kbGVyXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHNldEV2ZW50SGFuZGxlcihhdHRyTmFtZSwgdmFsdWUsIGRvbSwgdGhpcyk7XG4gIC8vIHNob3cgLyBoaWRlXG4gIH0gZWxzZSBpZiAoaXNUb2dnbGUpIHtcbiAgICB0b2dnbGVWaXNpYmlsaXR5KGRvbSwgYXR0ck5hbWUgPT09IEhJREVfRElSRUNUSVZFID8gIXZhbHVlIDogdmFsdWUpO1xuICAvLyBoYW5kbGUgYXR0cmlidXRlc1xuICB9IGVsc2Uge1xuICAgIGlmIChleHByLmJvb2wpIHtcbiAgICAgIGRvbVthdHRyTmFtZV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoYXR0ck5hbWUgPT09ICd2YWx1ZScgJiYgZG9tLnZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgZG9tLnZhbHVlID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChoYXNWYWx1ZSAmJiB2YWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgIHNldEF0dHIoZG9tLCBhdHRyTmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIC8vIG1ha2Ugc3VyZSB0aGF0IGluIGNhc2Ugb2Ygc3R5bGUgY2hhbmdlc1xuICAgIC8vIHRoZSBlbGVtZW50IHN0YXlzIGhpZGRlblxuICAgIGlmIChpc1N0eWxlQXR0ciAmJiBkb20uaGlkZGVuKSB7IHRvZ2dsZVZpc2liaWxpdHkoZG9tLCBmYWxzZSk7IH1cbiAgfVxufVxuXG4vKipcbiAqIFVwZGF0ZSBhbGwgdGhlIGV4cHJlc3Npb25zIGluIGEgVGFnIGluc3RhbmNlXG4gKiBAdGhpcyBUYWdcbiAqIEBwYXJhbSB7IEFycmF5IH0gZXhwcmVzc2lvbnMgLSBleHByZXNzaW9uIHRoYXQgbXVzdCBiZSByZSBldmFsdWF0ZWRcbiAqL1xuZnVuY3Rpb24gdXBkYXRlQWxsRXhwcmVzc2lvbnMoZXhwcmVzc2lvbnMpIHtcbiAgZWFjaChleHByZXNzaW9ucywgdXBkYXRlRXhwcmVzc2lvbi5iaW5kKHRoaXMpKTtcbn1cblxudmFyIElmRXhwciA9IHtcbiAgaW5pdDogZnVuY3Rpb24gaW5pdChkb20sIHRhZywgZXhwcikge1xuICAgIHJlbUF0dHIoZG9tLCBDT05ESVRJT05BTF9ESVJFQ1RJVkUpO1xuICAgIHRoaXMudGFnID0gdGFnO1xuICAgIHRoaXMuZXhwciA9IGV4cHI7XG4gICAgdGhpcy5zdHViID0gY3JlYXRlRE9NUGxhY2Vob2xkZXIoKTtcbiAgICB0aGlzLnByaXN0aW5lID0gZG9tO1xuXG4gICAgdmFyIHAgPSBkb20ucGFyZW50Tm9kZTtcbiAgICBwLmluc2VydEJlZm9yZSh0aGlzLnN0dWIsIGRvbSk7XG4gICAgcC5yZW1vdmVDaGlsZChkb20pO1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgdGhpcy52YWx1ZSA9IHRtcGwodGhpcy5leHByLCB0aGlzLnRhZyk7XG5cbiAgICBpZiAodGhpcy52YWx1ZSAmJiAhdGhpcy5jdXJyZW50KSB7IC8vIGluc2VydFxuICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5wcmlzdGluZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICB0aGlzLnN0dWIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5jdXJyZW50LCB0aGlzLnN0dWIpO1xuICAgICAgdGhpcy5leHByZXNzaW9ucyA9IHBhcnNlRXhwcmVzc2lvbnMuYXBwbHkodGhpcy50YWcsIFt0aGlzLmN1cnJlbnQsIHRydWVdKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnZhbHVlICYmIHRoaXMuY3VycmVudCkgeyAvLyByZW1vdmVcbiAgICAgIHVubW91bnRBbGwodGhpcy5leHByZXNzaW9ucyk7XG4gICAgICBpZiAodGhpcy5jdXJyZW50Ll90YWcpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50Ll90YWcudW5tb3VudCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnQucGFyZW50Tm9kZSkge1xuICAgICAgICB0aGlzLmN1cnJlbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmN1cnJlbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuZXhwcmVzc2lvbnMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy52YWx1ZSkgeyB1cGRhdGVBbGxFeHByZXNzaW9ucy5jYWxsKHRoaXMudGFnLCB0aGlzLmV4cHJlc3Npb25zKTsgfVxuICB9LFxuICB1bm1vdW50OiBmdW5jdGlvbiB1bm1vdW50KCkge1xuICAgIHVubW91bnRBbGwodGhpcy5leHByZXNzaW9ucyB8fCBbXSk7XG4gIH1cbn07XG5cbnZhciBSZWZFeHByID0ge1xuICBpbml0OiBmdW5jdGlvbiBpbml0KGRvbSwgcGFyZW50LCBhdHRyTmFtZSwgYXR0clZhbHVlKSB7XG4gICAgdGhpcy5kb20gPSBkb207XG4gICAgdGhpcy5hdHRyID0gYXR0ck5hbWU7XG4gICAgdGhpcy5yYXdWYWx1ZSA9IGF0dHJWYWx1ZTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLmhhc0V4cCA9IHRtcGwuaGFzRXhwcihhdHRyVmFsdWUpO1xuICAgIHJldHVybiB0aGlzXG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHZhciBvbGQgPSB0aGlzLnZhbHVlO1xuICAgIHZhciBjdXN0b21QYXJlbnQgPSB0aGlzLnBhcmVudCAmJiBnZXRJbW1lZGlhdGVDdXN0b21QYXJlbnRUYWcodGhpcy5wYXJlbnQpO1xuICAgIC8vIGlmIHRoZSByZWZlcmVuY2VkIGVsZW1lbnQgaXMgYSBjdXN0b20gdGFnLCB0aGVuIHdlIHNldCB0aGUgdGFnIGl0c2VsZiwgcmF0aGVyIHRoYW4gRE9NXG4gICAgdmFyIHRhZ09yRG9tID0gdGhpcy5kb20uX19yZWYgfHwgdGhpcy50YWcgfHwgdGhpcy5kb207XG5cbiAgICB0aGlzLnZhbHVlID0gdGhpcy5oYXNFeHAgPyB0bXBsKHRoaXMucmF3VmFsdWUsIHRoaXMucGFyZW50KSA6IHRoaXMucmF3VmFsdWU7XG5cbiAgICAvLyB0aGUgbmFtZSBjaGFuZ2VkLCBzbyB3ZSBuZWVkIHRvIHJlbW92ZSBpdCBmcm9tIHRoZSBvbGQga2V5IChpZiBwcmVzZW50KVxuICAgIGlmICghaXNCbGFuayhvbGQpICYmIGN1c3RvbVBhcmVudCkgeyBhcnJheWlzaFJlbW92ZShjdXN0b21QYXJlbnQucmVmcywgb2xkLCB0YWdPckRvbSk7IH1cbiAgICBpZiAoIWlzQmxhbmsodGhpcy52YWx1ZSkgJiYgaXNTdHJpbmcodGhpcy52YWx1ZSkpIHtcbiAgICAgIC8vIGFkZCBpdCB0byB0aGUgcmVmcyBvZiBwYXJlbnQgdGFnICh0aGlzIGJlaGF2aW9yIHdhcyBjaGFuZ2VkID49My4wKVxuICAgICAgaWYgKGN1c3RvbVBhcmVudCkgeyBhcnJheWlzaEFkZChcbiAgICAgICAgY3VzdG9tUGFyZW50LnJlZnMsXG4gICAgICAgIHRoaXMudmFsdWUsXG4gICAgICAgIHRhZ09yRG9tLFxuICAgICAgICAvLyB1c2UgYW4gYXJyYXkgaWYgaXQncyBhIGxvb3BlZCBub2RlIGFuZCB0aGUgcmVmIGlzIG5vdCBhbiBleHByZXNzaW9uXG4gICAgICAgIG51bGwsXG4gICAgICAgIHRoaXMucGFyZW50Ll9fLmluZGV4XG4gICAgICApOyB9XG5cbiAgICAgIGlmICh0aGlzLnZhbHVlICE9PSBvbGQpIHtcbiAgICAgICAgc2V0QXR0cih0aGlzLmRvbSwgdGhpcy5hdHRyLCB0aGlzLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVtQXR0cih0aGlzLmRvbSwgdGhpcy5hdHRyKTtcbiAgICB9XG5cbiAgICAvLyBjYWNoZSB0aGUgcmVmIGJvdW5kIHRvIHRoaXMgZG9tIG5vZGVcbiAgICAvLyB0byByZXVzZSBpdCBpbiBmdXR1cmUgKHNlZSBhbHNvICMyMzI5KVxuICAgIGlmICghdGhpcy5kb20uX19yZWYpIHsgdGhpcy5kb20uX19yZWYgPSB0YWdPckRvbTsgfVxuICB9LFxuICB1bm1vdW50OiBmdW5jdGlvbiB1bm1vdW50KCkge1xuICAgIHZhciB0YWdPckRvbSA9IHRoaXMudGFnIHx8IHRoaXMuZG9tO1xuICAgIHZhciBjdXN0b21QYXJlbnQgPSB0aGlzLnBhcmVudCAmJiBnZXRJbW1lZGlhdGVDdXN0b21QYXJlbnRUYWcodGhpcy5wYXJlbnQpO1xuICAgIGlmICghaXNCbGFuayh0aGlzLnZhbHVlKSAmJiBjdXN0b21QYXJlbnQpXG4gICAgICB7IGFycmF5aXNoUmVtb3ZlKGN1c3RvbVBhcmVudC5yZWZzLCB0aGlzLnZhbHVlLCB0YWdPckRvbSk7IH1cbiAgfVxufTtcblxuLyoqXG4gKiBDb252ZXJ0IHRoZSBpdGVtIGxvb3BlZCBpbnRvIGFuIG9iamVjdCB1c2VkIHRvIGV4dGVuZCB0aGUgY2hpbGQgdGFnIHByb3BlcnRpZXNcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZXhwciAtIG9iamVjdCBjb250YWluaW5nIHRoZSBrZXlzIHVzZWQgdG8gZXh0ZW5kIHRoZSBjaGlsZHJlbiB0YWdzXG4gKiBAcGFyYW0gICB7ICogfSBrZXkgLSB2YWx1ZSB0byBhc3NpZ24gdG8gdGhlIG5ldyBvYmplY3QgcmV0dXJuZWRcbiAqIEBwYXJhbSAgIHsgKiB9IHZhbCAtIHZhbHVlIGNvbnRhaW5pbmcgdGhlIHBvc2l0aW9uIG9mIHRoZSBpdGVtIGluIHRoZSBhcnJheVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBiYXNlIC0gcHJvdG90eXBlIG9iamVjdCBmb3IgdGhlIG5ldyBpdGVtXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IC0gbmV3IG9iamVjdCBjb250YWluaW5nIHRoZSB2YWx1ZXMgb2YgdGhlIG9yaWdpbmFsIGl0ZW1cbiAqXG4gKiBUaGUgdmFyaWFibGVzICdrZXknIGFuZCAndmFsJyBhcmUgYXJiaXRyYXJ5LlxuICogVGhleSBkZXBlbmQgb24gdGhlIGNvbGxlY3Rpb24gdHlwZSBsb29wZWQgKEFycmF5LCBPYmplY3QpXG4gKiBhbmQgb24gdGhlIGV4cHJlc3Npb24gdXNlZCBvbiB0aGUgZWFjaCB0YWdcbiAqXG4gKi9cbmZ1bmN0aW9uIG1raXRlbShleHByLCBrZXksIHZhbCwgYmFzZSkge1xuICB2YXIgaXRlbSA9IGJhc2UgPyBPYmplY3QuY3JlYXRlKGJhc2UpIDoge307XG4gIGl0ZW1bZXhwci5rZXldID0ga2V5O1xuICBpZiAoZXhwci5wb3MpIHsgaXRlbVtleHByLnBvc10gPSB2YWw7IH1cbiAgcmV0dXJuIGl0ZW1cbn1cblxuLyoqXG4gKiBVbm1vdW50IHRoZSByZWR1bmRhbnQgdGFnc1xuICogQHBhcmFtICAgeyBBcnJheSB9IGl0ZW1zIC0gYXJyYXkgY29udGFpbmluZyB0aGUgY3VycmVudCBpdGVtcyB0byBsb29wXG4gKiBAcGFyYW0gICB7IEFycmF5IH0gdGFncyAtIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBjaGlsZHJlbiB0YWdzXG4gKi9cbmZ1bmN0aW9uIHVubW91bnRSZWR1bmRhbnQoaXRlbXMsIHRhZ3MpIHtcbiAgdmFyIGkgPSB0YWdzLmxlbmd0aDtcbiAgdmFyIGogPSBpdGVtcy5sZW5ndGg7XG5cbiAgd2hpbGUgKGkgPiBqKSB7XG4gICAgaS0tO1xuICAgIHJlbW92ZS5hcHBseSh0YWdzW2ldLCBbdGFncywgaV0pO1xuICB9XG59XG5cblxuLyoqXG4gKiBSZW1vdmUgYSBjaGlsZCB0YWdcbiAqIEB0aGlzIFRhZ1xuICogQHBhcmFtICAgeyBBcnJheSB9IHRhZ3MgLSB0YWdzIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSAgIHsgTnVtYmVyIH0gaSAtIGluZGV4IG9mIHRoZSB0YWcgdG8gcmVtb3ZlXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZSh0YWdzLCBpKSB7XG4gIHRhZ3Muc3BsaWNlKGksIDEpO1xuICB0aGlzLnVubW91bnQoKTtcbiAgYXJyYXlpc2hSZW1vdmUodGhpcy5wYXJlbnQsIHRoaXMsIHRoaXMuX18udGFnTmFtZSwgdHJ1ZSk7XG59XG5cbi8qKlxuICogTW92ZSB0aGUgbmVzdGVkIGN1c3RvbSB0YWdzIGluIG5vbiBjdXN0b20gbG9vcCB0YWdzXG4gKiBAdGhpcyBUYWdcbiAqIEBwYXJhbSAgIHsgTnVtYmVyIH0gaSAtIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIGxvb3AgdGFnXG4gKi9cbmZ1bmN0aW9uIG1vdmVOZXN0ZWRUYWdzKGkpIHtcbiAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgZWFjaChPYmplY3Qua2V5cyh0aGlzLnRhZ3MpLCBmdW5jdGlvbiAodGFnTmFtZSkge1xuICAgIG1vdmVDaGlsZFRhZy5hcHBseSh0aGlzJDEudGFnc1t0YWdOYW1lXSwgW3RhZ05hbWUsIGldKTtcbiAgfSk7XG59XG5cbi8qKlxuICogTW92ZSBhIGNoaWxkIHRhZ1xuICogQHRoaXMgVGFnXG4gKiBAcGFyYW0gICB7IEhUTUxFbGVtZW50IH0gcm9vdCAtIGRvbSBub2RlIGNvbnRhaW5pbmcgYWxsIHRoZSBsb29wIGNoaWxkcmVuXG4gKiBAcGFyYW0gICB7IFRhZyB9IG5leHRUYWcgLSBpbnN0YW5jZSBvZiB0aGUgbmV4dCB0YWcgcHJlY2VkaW5nIHRoZSBvbmUgd2Ugd2FudCB0byBtb3ZlXG4gKiBAcGFyYW0gICB7IEJvb2xlYW4gfSBpc1ZpcnR1YWwgLSBpcyBpdCBhIHZpcnR1YWwgdGFnP1xuICovXG5mdW5jdGlvbiBtb3ZlKHJvb3QsIG5leHRUYWcsIGlzVmlydHVhbCkge1xuICBpZiAoaXNWaXJ0dWFsKVxuICAgIHsgbW92ZVZpcnR1YWwuYXBwbHkodGhpcywgW3Jvb3QsIG5leHRUYWddKTsgfVxuICBlbHNlXG4gICAgeyBzYWZlSW5zZXJ0KHJvb3QsIHRoaXMucm9vdCwgbmV4dFRhZy5yb290KTsgfVxufVxuXG4vKipcbiAqIEluc2VydCBhbmQgbW91bnQgYSBjaGlsZCB0YWdcbiAqIEB0aGlzIFRhZ1xuICogQHBhcmFtICAgeyBIVE1MRWxlbWVudCB9IHJvb3QgLSBkb20gbm9kZSBjb250YWluaW5nIGFsbCB0aGUgbG9vcCBjaGlsZHJlblxuICogQHBhcmFtICAgeyBUYWcgfSBuZXh0VGFnIC0gaW5zdGFuY2Ugb2YgdGhlIG5leHQgdGFnIHByZWNlZGluZyB0aGUgb25lIHdlIHdhbnQgdG8gaW5zZXJ0XG4gKiBAcGFyYW0gICB7IEJvb2xlYW4gfSBpc1ZpcnR1YWwgLSBpcyBpdCBhIHZpcnR1YWwgdGFnP1xuICovXG5mdW5jdGlvbiBpbnNlcnQocm9vdCwgbmV4dFRhZywgaXNWaXJ0dWFsKSB7XG4gIGlmIChpc1ZpcnR1YWwpXG4gICAgeyBtYWtlVmlydHVhbC5hcHBseSh0aGlzLCBbcm9vdCwgbmV4dFRhZ10pOyB9XG4gIGVsc2VcbiAgICB7IHNhZmVJbnNlcnQocm9vdCwgdGhpcy5yb290LCBuZXh0VGFnLnJvb3QpOyB9XG59XG5cbi8qKlxuICogQXBwZW5kIGEgbmV3IHRhZyBpbnRvIHRoZSBET01cbiAqIEB0aGlzIFRhZ1xuICogQHBhcmFtICAgeyBIVE1MRWxlbWVudCB9IHJvb3QgLSBkb20gbm9kZSBjb250YWluaW5nIGFsbCB0aGUgbG9vcCBjaGlsZHJlblxuICogQHBhcmFtICAgeyBCb29sZWFuIH0gaXNWaXJ0dWFsIC0gaXMgaXQgYSB2aXJ0dWFsIHRhZz9cbiAqL1xuZnVuY3Rpb24gYXBwZW5kKHJvb3QsIGlzVmlydHVhbCkge1xuICBpZiAoaXNWaXJ0dWFsKVxuICAgIHsgbWFrZVZpcnR1YWwuY2FsbCh0aGlzLCByb290KTsgfVxuICBlbHNlXG4gICAgeyByb290LmFwcGVuZENoaWxkKHRoaXMucm9vdCk7IH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHZhbHVlIHdlIHdhbnQgdG8gdXNlIHRvIGxvb2t1cCB0aGUgcG9zdGlvbiBvZiBvdXIgaXRlbXMgaW4gdGhlIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gIGtleUF0dHIgICAgICAgICAtIGxvb2t1cCBzdHJpbmcgb3IgZXhwcmVzc2lvblxuICogQHBhcmFtICAgeyAqIH0gICAgICAgb3JpZ2luYWxJdGVtICAgIC0gb3JpZ2luYWwgaXRlbSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9ICBrZXllZEl0ZW0gICAgICAgLSBvYmplY3QgY3JlYXRlZCBieSByaW90IHZpYSB7IGl0ZW0sIGkgaW4gY29sbGVjdGlvbiB9XG4gKiBAcGFyYW0gICB7IEJvb2xlYW4gfSBoYXNLZXlBdHRyRXhwciAgLSBmbGFnIHRvIGNoZWNrIHdoZXRoZXIgdGhlIGtleSBpcyBhbiBleHByZXNzaW9uXG4gKiBAcmV0dXJucyB7ICogfSB2YWx1ZSB0aGF0IHdlIHdpbGwgdXNlIHRvIGZpZ3VyZSBvdXQgdGhlIGl0ZW0gcG9zaXRpb24gdmlhIGNvbGxlY3Rpb24uaW5kZXhPZlxuICovXG5mdW5jdGlvbiBnZXRJdGVtSWQoa2V5QXR0ciwgb3JpZ2luYWxJdGVtLCBrZXllZEl0ZW0sIGhhc0tleUF0dHJFeHByKSB7XG4gIGlmIChrZXlBdHRyKSB7XG4gICAgcmV0dXJuIGhhc0tleUF0dHJFeHByID8gIHRtcGwoa2V5QXR0ciwga2V5ZWRJdGVtKSA6ICBvcmlnaW5hbEl0ZW1ba2V5QXR0cl1cbiAgfVxuXG4gIHJldHVybiBvcmlnaW5hbEl0ZW1cbn1cblxuLyoqXG4gKiBNYW5hZ2UgdGFncyBoYXZpbmcgdGhlICdlYWNoJ1xuICogQHBhcmFtICAgeyBIVE1MRWxlbWVudCB9IGRvbSAtIERPTSBub2RlIHdlIG5lZWQgdG8gbG9vcFxuICogQHBhcmFtICAgeyBUYWcgfSBwYXJlbnQgLSBwYXJlbnQgdGFnIGluc3RhbmNlIHdoZXJlIHRoZSBkb20gbm9kZSBpcyBjb250YWluZWRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXhwciAtIHN0cmluZyBjb250YWluZWQgaW4gdGhlICdlYWNoJyBhdHRyaWJ1dGVcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZXhwcmVzc2lvbiBvYmplY3QgZm9yIHRoaXMgZWFjaCBsb29wXG4gKi9cbmZ1bmN0aW9uIF9lYWNoKGRvbSwgcGFyZW50LCBleHByKSB7XG4gIHZhciBtdXN0UmVvcmRlciA9IHR5cGVvZiBnZXRBdHRyKGRvbSwgTE9PUF9OT19SRU9SREVSX0RJUkVDVElWRSkgIT09IFRfU1RSSU5HIHx8IHJlbUF0dHIoZG9tLCBMT09QX05PX1JFT1JERVJfRElSRUNUSVZFKTtcbiAgdmFyIGtleUF0dHIgPSBnZXRBdHRyKGRvbSwgS0VZX0RJUkVDVElWRSk7XG4gIHZhciBoYXNLZXlBdHRyRXhwciA9IGtleUF0dHIgPyB0bXBsLmhhc0V4cHIoa2V5QXR0cikgOiBmYWxzZTtcbiAgdmFyIHRhZ05hbWUgPSBnZXRUYWdOYW1lKGRvbSk7XG4gIHZhciBpbXBsID0gX19UQUdfSU1QTFt0YWdOYW1lXTtcbiAgdmFyIHBhcmVudE5vZGUgPSBkb20ucGFyZW50Tm9kZTtcbiAgdmFyIHBsYWNlaG9sZGVyID0gY3JlYXRlRE9NUGxhY2Vob2xkZXIoKTtcbiAgdmFyIGNoaWxkID0gZ2V0VGFnKGRvbSk7XG4gIHZhciBpZkV4cHIgPSBnZXRBdHRyKGRvbSwgQ09ORElUSU9OQUxfRElSRUNUSVZFKTtcbiAgdmFyIHRhZ3MgPSBbXTtcbiAgdmFyIGlzTG9vcCA9IHRydWU7XG4gIHZhciBpbm5lckhUTUwgPSBkb20uaW5uZXJIVE1MO1xuICB2YXIgaXNBbm9ueW1vdXMgPSAhX19UQUdfSU1QTFt0YWdOYW1lXTtcbiAgdmFyIGlzVmlydHVhbCA9IGRvbS50YWdOYW1lID09PSAnVklSVFVBTCc7XG4gIHZhciBvbGRJdGVtcyA9IFtdO1xuICB2YXIgaGFzS2V5cztcblxuICAvLyByZW1vdmUgdGhlIGVhY2ggcHJvcGVydHkgZnJvbSB0aGUgb3JpZ2luYWwgdGFnXG4gIHJlbUF0dHIoZG9tLCBMT09QX0RJUkVDVElWRSk7XG4gIHJlbUF0dHIoZG9tLCBLRVlfRElSRUNUSVZFKTtcblxuICAvLyBwYXJzZSB0aGUgZWFjaCBleHByZXNzaW9uXG4gIGV4cHIgPSB0bXBsLmxvb3BLZXlzKGV4cHIpO1xuICBleHByLmlzTG9vcCA9IHRydWU7XG5cbiAgaWYgKGlmRXhwcikgeyByZW1BdHRyKGRvbSwgQ09ORElUSU9OQUxfRElSRUNUSVZFKTsgfVxuXG4gIC8vIGluc2VydCBhIG1hcmtlZCB3aGVyZSB0aGUgbG9vcCB0YWdzIHdpbGwgYmUgaW5qZWN0ZWRcbiAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIGRvbSk7XG4gIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tKTtcblxuICBleHByLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZUVhY2goKSB7XG4gICAgLy8gZ2V0IHRoZSBuZXcgaXRlbXMgY29sbGVjdGlvblxuICAgIGV4cHIudmFsdWUgPSB0bXBsKGV4cHIudmFsLCBwYXJlbnQpO1xuXG4gICAgdmFyIGl0ZW1zID0gZXhwci52YWx1ZTtcbiAgICB2YXIgZnJhZyA9IGNyZWF0ZUZyYWcoKTtcbiAgICB2YXIgaXNPYmplY3QkJDEgPSAhaXNBcnJheShpdGVtcykgJiYgIWlzU3RyaW5nKGl0ZW1zKTtcbiAgICB2YXIgcm9vdCA9IHBsYWNlaG9sZGVyLnBhcmVudE5vZGU7XG4gICAgdmFyIHRtcEl0ZW1zID0gW107XG5cbiAgICAvLyBpZiB0aGlzIERPTSB3YXMgcmVtb3ZlZCB0aGUgdXBkYXRlIGhlcmUgaXMgdXNlbGVzc1xuICAgIC8vIHRoaXMgY29uZGl0aW9uIGZpeGVzIGFsc28gYSB3ZWlyZCBhc3luYyBpc3N1ZSBvbiBJRSBpbiBvdXIgdW5pdCB0ZXN0XG4gICAgaWYgKCFyb290KSB7IHJldHVybiB9XG5cbiAgICAvLyBvYmplY3QgbG9vcC4gYW55IGNoYW5nZXMgY2F1c2UgZnVsbCByZWRyYXdcbiAgICBpZiAoaXNPYmplY3QkJDEpIHtcbiAgICAgIGhhc0tleXMgPSBpdGVtcyB8fCBmYWxzZTtcbiAgICAgIGl0ZW1zID0gaGFzS2V5cyA/XG4gICAgICAgIE9iamVjdC5rZXlzKGl0ZW1zKS5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gbWtpdGVtKGV4cHIsIGl0ZW1zW2tleV0sIGtleSk7IH0pIDogW107XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhc0tleXMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaWZFeHByKSB7XG4gICAgICBpdGVtcyA9IGl0ZW1zLmZpbHRlcihmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICBpZiAoZXhwci5rZXkgJiYgIWlzT2JqZWN0JCQxKVxuICAgICAgICAgIHsgcmV0dXJuICEhdG1wbChpZkV4cHIsIG1raXRlbShleHByLCBpdGVtLCBpLCBwYXJlbnQpKSB9XG5cbiAgICAgICAgcmV0dXJuICEhdG1wbChpZkV4cHIsIGV4dGVuZChPYmplY3QuY3JlYXRlKHBhcmVudCksIGl0ZW0pKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gbG9vcCBhbGwgdGhlIG5ldyBpdGVtc1xuICAgIGVhY2goaXRlbXMsIGZ1bmN0aW9uIChfaXRlbSwgaSkge1xuICAgICAgdmFyIGl0ZW0gPSAhaGFzS2V5cyAmJiBleHByLmtleSA/IG1raXRlbShleHByLCBfaXRlbSwgaSkgOiBfaXRlbTtcbiAgICAgIHZhciBpdGVtSWQgPSBnZXRJdGVtSWQoa2V5QXR0ciwgX2l0ZW0sIGl0ZW0sIGhhc0tleUF0dHJFeHByKTtcbiAgICAgIC8vIHJlb3JkZXIgb25seSBpZiB0aGUgaXRlbXMgYXJlIG9iamVjdHNcbiAgICAgIHZhciBkb1Jlb3JkZXIgPSBtdXN0UmVvcmRlciAmJiB0eXBlb2YgX2l0ZW0gPT09IFRfT0JKRUNUICYmICFoYXNLZXlzO1xuICAgICAgdmFyIG9sZFBvcyA9IG9sZEl0ZW1zLmluZGV4T2YoaXRlbUlkKTtcbiAgICAgIHZhciBpc05ldyA9IG9sZFBvcyA9PT0gLTE7XG4gICAgICB2YXIgcG9zID0gIWlzTmV3ICYmIGRvUmVvcmRlciA/IG9sZFBvcyA6IGk7XG4gICAgICAvLyBkb2VzIGEgdGFnIGV4aXN0IGluIHRoaXMgcG9zaXRpb24/XG4gICAgICB2YXIgdGFnID0gdGFnc1twb3NdO1xuICAgICAgdmFyIG11c3RBcHBlbmQgPSBpID49IG9sZEl0ZW1zLmxlbmd0aDtcbiAgICAgIHZhciBtdXN0Q3JlYXRlID0gIGRvUmVvcmRlciAmJiBpc05ldyB8fCAhZG9SZW9yZGVyICYmICF0YWc7XG5cbiAgICAgIC8vIG5ldyB0YWdcbiAgICAgIGlmIChtdXN0Q3JlYXRlKSB7XG4gICAgICAgIHRhZyA9IGNyZWF0ZVRhZyhpbXBsLCB7XG4gICAgICAgICAgcGFyZW50OiBwYXJlbnQsXG4gICAgICAgICAgaXNMb29wOiBpc0xvb3AsXG4gICAgICAgICAgaXNBbm9ueW1vdXM6IGlzQW5vbnltb3VzLFxuICAgICAgICAgIHRhZ05hbWU6IHRhZ05hbWUsXG4gICAgICAgICAgcm9vdDogZG9tLmNsb25lTm9kZShpc0Fub255bW91cyksXG4gICAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgfSwgaW5uZXJIVE1MKTtcblxuICAgICAgICAvLyBtb3VudCB0aGUgdGFnXG4gICAgICAgIHRhZy5tb3VudCgpO1xuXG4gICAgICAgIGlmIChtdXN0QXBwZW5kKVxuICAgICAgICAgIHsgYXBwZW5kLmFwcGx5KHRhZywgW2ZyYWcgfHwgcm9vdCwgaXNWaXJ0dWFsXSk7IH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHsgaW5zZXJ0LmFwcGx5KHRhZywgW3Jvb3QsIHRhZ3NbaV0sIGlzVmlydHVhbF0pOyB9XG5cbiAgICAgICAgaWYgKCFtdXN0QXBwZW5kKSB7IG9sZEl0ZW1zLnNwbGljZShpLCAwLCBpdGVtKTsgfVxuICAgICAgICB0YWdzLnNwbGljZShpLCAwLCB0YWcpO1xuICAgICAgICBpZiAoY2hpbGQpIHsgYXJyYXlpc2hBZGQocGFyZW50LnRhZ3MsIHRhZ05hbWUsIHRhZywgdHJ1ZSk7IH1cbiAgICAgIH0gZWxzZSBpZiAocG9zICE9PSBpICYmIGRvUmVvcmRlcikge1xuICAgICAgICAvLyBtb3ZlXG4gICAgICAgIGlmIChrZXlBdHRyIHx8IGNvbnRhaW5zKGl0ZW1zLCBvbGRJdGVtc1twb3NdKSkge1xuICAgICAgICAgIG1vdmUuYXBwbHkodGFnLCBbcm9vdCwgdGFnc1tpXSwgaXNWaXJ0dWFsXSk7XG4gICAgICAgICAgLy8gbW92ZSB0aGUgb2xkIHRhZyBpbnN0YW5jZVxuICAgICAgICAgIHRhZ3Muc3BsaWNlKGksIDAsIHRhZ3Muc3BsaWNlKHBvcywgMSlbMF0pO1xuICAgICAgICAgIC8vIG1vdmUgdGhlIG9sZCBpdGVtXG4gICAgICAgICAgb2xkSXRlbXMuc3BsaWNlKGksIDAsIG9sZEl0ZW1zLnNwbGljZShwb3MsIDEpWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgcG9zaXRpb24gYXR0cmlidXRlIGlmIGl0IGV4aXN0c1xuICAgICAgICBpZiAoZXhwci5wb3MpIHsgdGFnW2V4cHIucG9zXSA9IGk7IH1cblxuICAgICAgICAvLyBpZiB0aGUgbG9vcCB0YWdzIGFyZSBub3QgY3VzdG9tXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gbW92ZSBhbGwgdGhlaXIgY3VzdG9tIHRhZ3MgaW50byB0aGUgcmlnaHQgcG9zaXRpb25cbiAgICAgICAgaWYgKCFjaGlsZCAmJiB0YWcudGFncykgeyBtb3ZlTmVzdGVkVGFncy5jYWxsKHRhZywgaSk7IH1cbiAgICAgIH1cblxuICAgICAgLy8gY2FjaGUgdGhlIG9yaWdpbmFsIGl0ZW0gdG8gdXNlIGl0IGluIHRoZSBldmVudHMgYm91bmQgdG8gdGhpcyBub2RlXG4gICAgICAvLyBhbmQgaXRzIGNoaWxkcmVuXG4gICAgICB0YWcuX18uaXRlbSA9IGl0ZW07XG4gICAgICB0YWcuX18uaW5kZXggPSBpO1xuICAgICAgdGFnLl9fLnBhcmVudCA9IHBhcmVudDtcblxuICAgICAgdG1wSXRlbXNbaV0gPSBpdGVtSWQ7XG5cbiAgICAgIGlmICghbXVzdENyZWF0ZSkgeyB0YWcudXBkYXRlKGl0ZW0pOyB9XG4gICAgfSk7XG5cbiAgICAvLyByZW1vdmUgdGhlIHJlZHVuZGFudCB0YWdzXG4gICAgdW5tb3VudFJlZHVuZGFudChpdGVtcywgdGFncyk7XG5cbiAgICAvLyBjbG9uZSB0aGUgaXRlbXMgYXJyYXlcbiAgICBvbGRJdGVtcyA9IHRtcEl0ZW1zLnNsaWNlKCk7XG5cbiAgICByb290Lmluc2VydEJlZm9yZShmcmFnLCBwbGFjZWhvbGRlcik7XG4gIH07XG5cbiAgZXhwci51bm1vdW50ID0gZnVuY3Rpb24gKCkge1xuICAgIGVhY2godGFncywgZnVuY3Rpb24gKHQpIHsgdC51bm1vdW50KCk7IH0pO1xuICB9O1xuXG4gIHJldHVybiBleHByXG59XG5cbi8qKlxuICogV2FsayB0aGUgdGFnIERPTSB0byBkZXRlY3QgdGhlIGV4cHJlc3Npb25zIHRvIGV2YWx1YXRlXG4gKiBAdGhpcyBUYWdcbiAqIEBwYXJhbSAgIHsgSFRNTEVsZW1lbnQgfSByb290IC0gcm9vdCB0YWcgd2hlcmUgd2Ugd2lsbCBzdGFydCBkaWdnaW5nIHRoZSBleHByZXNzaW9uc1xuICogQHBhcmFtICAgeyBCb29sZWFuIH0gbXVzdEluY2x1ZGVSb290IC0gZmxhZyB0byBkZWNpZGUgd2hldGhlciB0aGUgcm9vdCBtdXN0IGJlIHBhcnNlZCBhcyB3ZWxsXG4gKiBAcmV0dXJucyB7IEFycmF5IH0gYWxsIHRoZSBleHByZXNzaW9ucyBmb3VuZFxuICovXG5mdW5jdGlvbiBwYXJzZUV4cHJlc3Npb25zKHJvb3QsIG11c3RJbmNsdWRlUm9vdCkge1xuICB2YXIgdGhpcyQxID0gdGhpcztcblxuICB2YXIgZXhwcmVzc2lvbnMgPSBbXTtcblxuICB3YWxrTm9kZXMocm9vdCwgZnVuY3Rpb24gKGRvbSkge1xuICAgIHZhciB0eXBlID0gZG9tLm5vZGVUeXBlO1xuICAgIHZhciBhdHRyO1xuICAgIHZhciB0YWdJbXBsO1xuXG4gICAgaWYgKCFtdXN0SW5jbHVkZVJvb3QgJiYgZG9tID09PSByb290KSB7IHJldHVybiB9XG5cbiAgICAvLyB0ZXh0IG5vZGVcbiAgICBpZiAodHlwZSA9PT0gMyAmJiBkb20ucGFyZW50Tm9kZS50YWdOYW1lICE9PSAnU1RZTEUnICYmIHRtcGwuaGFzRXhwcihkb20ubm9kZVZhbHVlKSlcbiAgICAgIHsgZXhwcmVzc2lvbnMucHVzaCh7ZG9tOiBkb20sIGV4cHI6IGRvbS5ub2RlVmFsdWV9KTsgfVxuXG4gICAgaWYgKHR5cGUgIT09IDEpIHsgcmV0dXJuIH1cblxuICAgIHZhciBpc1ZpcnR1YWwgPSBkb20udGFnTmFtZSA9PT0gJ1ZJUlRVQUwnO1xuXG4gICAgLy8gbG9vcC4gZWFjaCBkb2VzIGl0J3Mgb3duIHRoaW5nIChmb3Igbm93KVxuICAgIGlmIChhdHRyID0gZ2V0QXR0cihkb20sIExPT1BfRElSRUNUSVZFKSkge1xuICAgICAgaWYoaXNWaXJ0dWFsKSB7IHNldEF0dHIoZG9tLCAnbG9vcFZpcnR1YWwnLCB0cnVlKTsgfSAvLyBpZ25vcmUgaGVyZSwgaGFuZGxlZCBpbiBfZWFjaFxuICAgICAgZXhwcmVzc2lvbnMucHVzaChfZWFjaChkb20sIHRoaXMkMSwgYXR0cikpO1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgLy8gaWYtYXR0cnMgYmVjb21lIHRoZSBuZXcgcGFyZW50LiBBbnkgZm9sbG93aW5nIGV4cHJlc3Npb25zIChlaXRoZXIgb24gdGhlIGN1cnJlbnRcbiAgICAvLyBlbGVtZW50LCBvciBiZWxvdyBpdCkgYmVjb21lIGNoaWxkcmVuIG9mIHRoaXMgZXhwcmVzc2lvbi5cbiAgICBpZiAoYXR0ciA9IGdldEF0dHIoZG9tLCBDT05ESVRJT05BTF9ESVJFQ1RJVkUpKSB7XG4gICAgICBleHByZXNzaW9ucy5wdXNoKE9iamVjdC5jcmVhdGUoSWZFeHByKS5pbml0KGRvbSwgdGhpcyQxLCBhdHRyKSk7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoYXR0ciA9IGdldEF0dHIoZG9tLCBJU19ESVJFQ1RJVkUpKSB7XG4gICAgICBpZiAodG1wbC5oYXNFeHByKGF0dHIpKSB7XG4gICAgICAgIGV4cHJlc3Npb25zLnB1c2goe1xuICAgICAgICAgIGlzUnRhZzogdHJ1ZSxcbiAgICAgICAgICBleHByOiBhdHRyLFxuICAgICAgICAgIGRvbTogZG9tLFxuICAgICAgICAgIGF0dHJzOiBbXS5zbGljZS5jYWxsKGRvbS5hdHRyaWJ1dGVzKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiB0aGlzIGlzIGEgdGFnLCBzdG9wIHRyYXZlcnNpbmcgaGVyZS5cbiAgICAvLyB3ZSBpZ25vcmUgdGhlIHJvb3QsIHNpbmNlIHBhcnNlRXhwcmVzc2lvbnMgaXMgY2FsbGVkIHdoaWxlIHdlJ3JlIG1vdW50aW5nIHRoYXQgcm9vdFxuICAgIHRhZ0ltcGwgPSBnZXRUYWcoZG9tKTtcblxuICAgIGlmKGlzVmlydHVhbCkge1xuICAgICAgaWYoZ2V0QXR0cihkb20sICd2aXJ0dWFsaXplZCcpKSB7ZG9tLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZG9tKTsgfSAvLyB0YWcgY3JlYXRlZCwgcmVtb3ZlIGZyb20gZG9tXG4gICAgICBpZighdGFnSW1wbCAmJiAhZ2V0QXR0cihkb20sICd2aXJ0dWFsaXplZCcpICYmICFnZXRBdHRyKGRvbSwgJ2xvb3BWaXJ0dWFsJykpICAvLyBvayB0byBjcmVhdGUgdmlydHVhbCB0YWdcbiAgICAgICAgeyB0YWdJbXBsID0geyB0bXBsOiBkb20ub3V0ZXJIVE1MIH07IH1cbiAgICB9XG5cbiAgICBpZiAodGFnSW1wbCAmJiAoZG9tICE9PSByb290IHx8IG11c3RJbmNsdWRlUm9vdCkpIHtcbiAgICAgIGlmKGlzVmlydHVhbCkgeyAvLyBoYW5kbGVkIGluIHVwZGF0ZVxuICAgICAgICBpZiAoZ2V0QXR0cihkb20sIElTX0RJUkVDVElWRSkpXG4gICAgICAgICAgeyB3YXJuKChcIlZpcnR1YWwgdGFncyBzaG91bGRuJ3QgYmUgdXNlZCB0b2dldGhlciB3aXRoIHRoZSBcXFwiXCIgKyBJU19ESVJFQ1RJVkUgKyBcIlxcXCIgYXR0cmlidXRlIC0gaHR0cHM6Ly9naXRodWIuY29tL3Jpb3QvcmlvdC9pc3N1ZXMvMjUxMVwiKSk7IH1cbiAgICAgICAgLy8gY2FuIG5vdCByZW1vdmUgYXR0cmlidXRlIGxpa2UgZGlyZWN0aXZlc1xuICAgICAgICAvLyBzbyBmbGFnIGZvciByZW1vdmFsIGFmdGVyIGNyZWF0aW9uIHRvIHByZXZlbnQgbWF4aW11bSBzdGFjayBlcnJvclxuICAgICAgICBzZXRBdHRyKGRvbSwgJ3ZpcnR1YWxpemVkJywgdHJ1ZSk7XG4gICAgICAgIHZhciB0YWcgPSBjcmVhdGVUYWcoXG4gICAgICAgICAge3RtcGw6IGRvbS5vdXRlckhUTUx9LFxuICAgICAgICAgIHtyb290OiBkb20sIHBhcmVudDogdGhpcyQxfSxcbiAgICAgICAgICBkb20uaW5uZXJIVE1MXG4gICAgICAgICk7XG5cbiAgICAgICAgZXhwcmVzc2lvbnMucHVzaCh0YWcpOyAvLyBubyByZXR1cm4sIGFub255bW91cyB0YWcsIGtlZXAgcGFyc2luZ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXhwcmVzc2lvbnMucHVzaChcbiAgICAgICAgICBpbml0Q2hpbGRUYWcoXG4gICAgICAgICAgICB0YWdJbXBsLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByb290OiBkb20sXG4gICAgICAgICAgICAgIHBhcmVudDogdGhpcyQxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZG9tLmlubmVySFRNTCxcbiAgICAgICAgICAgIHRoaXMkMVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYXR0cmlidXRlIGV4cHJlc3Npb25zXG4gICAgcGFyc2VBdHRyaWJ1dGVzLmFwcGx5KHRoaXMkMSwgW2RvbSwgZG9tLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChhdHRyLCBleHByKSB7XG4gICAgICBpZiAoIWV4cHIpIHsgcmV0dXJuIH1cbiAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcik7XG4gICAgfV0pO1xuICB9KTtcblxuICByZXR1cm4gZXhwcmVzc2lvbnNcbn1cblxuLyoqXG4gKiBDYWxscyBgZm5gIGZvciBldmVyeSBhdHRyaWJ1dGUgb24gYW4gZWxlbWVudC4gSWYgdGhhdCBhdHRyIGhhcyBhbiBleHByZXNzaW9uLFxuICogaXQgaXMgYWxzbyBwYXNzZWQgdG8gZm4uXG4gKiBAdGhpcyBUYWdcbiAqIEBwYXJhbSAgIHsgSFRNTEVsZW1lbnQgfSBkb20gLSBkb20gbm9kZSB0byBwYXJzZVxuICogQHBhcmFtICAgeyBBcnJheSB9IGF0dHJzIC0gYXJyYXkgb2YgYXR0cmlidXRlc1xuICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgdG8gZXhlYyBvbiBhbnkgaXRlcmF0aW9uXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQXR0cmlidXRlcyhkb20sIGF0dHJzLCBmbikge1xuICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBlYWNoKGF0dHJzLCBmdW5jdGlvbiAoYXR0cikge1xuICAgIGlmICghYXR0cikgeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgdmFyIG5hbWUgPSBhdHRyLm5hbWU7XG4gICAgdmFyIGJvb2wgPSBpc0Jvb2xBdHRyKG5hbWUpO1xuICAgIHZhciBleHByO1xuXG4gICAgaWYgKGNvbnRhaW5zKFJFRl9ESVJFQ1RJVkVTLCBuYW1lKSAmJiBkb20udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBZSUVMRF9UQUcpIHtcbiAgICAgIGV4cHIgPSAgT2JqZWN0LmNyZWF0ZShSZWZFeHByKS5pbml0KGRvbSwgdGhpcyQxLCBuYW1lLCBhdHRyLnZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHRtcGwuaGFzRXhwcihhdHRyLnZhbHVlKSkge1xuICAgICAgZXhwciA9IHtkb206IGRvbSwgZXhwcjogYXR0ci52YWx1ZSwgYXR0cjogbmFtZSwgYm9vbDogYm9vbH07XG4gICAgfVxuXG4gICAgZm4oYXR0ciwgZXhwcik7XG4gIH0pO1xufVxuXG4vKlxuICBJbmNsdWRlcyBoYWNrcyBuZWVkZWQgZm9yIHRoZSBJbnRlcm5ldCBFeHBsb3JlciB2ZXJzaW9uIDkgYW5kIGJlbG93XG4gIFNlZTogaHR0cDovL2thbmdheC5naXRodWIuaW8vY29tcGF0LXRhYmxlL2VzNS8jaWU4XG4gICAgICAgaHR0cDovL2NvZGVwbGFuZXQuaW8vZHJvcHBpbmctaWU4L1xuKi9cblxudmFyIHJlSGFzWWllbGQgID0gLzx5aWVsZFxcYi9pO1xudmFyIHJlWWllbGRBbGwgID0gLzx5aWVsZFxccyooPzpcXC8+fD4oW1xcU1xcc10qPyk8XFwveWllbGRcXHMqPnw+KS9pZztcbnZhciByZVlpZWxkU3JjICA9IC88eWllbGRcXHMrdG89WydcIl0oW14nXCI+XSopWydcIl1cXHMqPihbXFxTXFxzXSo/KTxcXC95aWVsZFxccyo+L2lnO1xudmFyIHJlWWllbGREZXN0ID0gLzx5aWVsZFxccytmcm9tPVsnXCJdPyhbLVxcd10rKVsnXCJdP1xccyooPzpcXC8+fD4oW1xcU1xcc10qPyk8XFwveWllbGRcXHMqPikvaWc7XG52YXIgcm9vdEVscyA9IHsgdHI6ICd0Ym9keScsIHRoOiAndHInLCB0ZDogJ3RyJywgY29sOiAnY29sZ3JvdXAnIH07XG52YXIgdGJsVGFncyA9IElFX1ZFUlNJT04gJiYgSUVfVkVSU0lPTiA8IDEwID8gUkVfU1BFQ0lBTF9UQUdTIDogUkVfU1BFQ0lBTF9UQUdTX05PX09QVElPTjtcbnZhciBHRU5FUklDID0gJ2Rpdic7XG52YXIgU1ZHID0gJ3N2Zyc7XG5cblxuLypcbiAgQ3JlYXRlcyB0aGUgcm9vdCBlbGVtZW50IGZvciB0YWJsZSBvciBzZWxlY3QgY2hpbGQgZWxlbWVudHM6XG4gIHRyL3RoL3RkL3RoZWFkL3Rmb290L3Rib2R5L2NhcHRpb24vY29sL2NvbGdyb3VwL29wdGlvbi9vcHRncm91cFxuKi9cbmZ1bmN0aW9uIHNwZWNpYWxUYWdzKGVsLCB0bXBsLCB0YWdOYW1lKSB7XG5cbiAgdmFyXG4gICAgc2VsZWN0ID0gdGFnTmFtZVswXSA9PT0gJ28nLFxuICAgIHBhcmVudCA9IHNlbGVjdCA/ICdzZWxlY3Q+JyA6ICd0YWJsZT4nO1xuXG4gIC8vIHRyaW0oKSBpcyBpbXBvcnRhbnQgaGVyZSwgdGhpcyBlbnN1cmVzIHdlIGRvbid0IGhhdmUgYXJ0aWZhY3RzLFxuICAvLyBzbyB3ZSBjYW4gY2hlY2sgaWYgd2UgaGF2ZSBvbmx5IG9uZSBlbGVtZW50IGluc2lkZSB0aGUgcGFyZW50XG4gIGVsLmlubmVySFRNTCA9ICc8JyArIHBhcmVudCArIHRtcGwudHJpbSgpICsgJzwvJyArIHBhcmVudDtcbiAgcGFyZW50ID0gZWwuZmlyc3RDaGlsZDtcblxuICAvLyByZXR1cm5zIHRoZSBpbW1lZGlhdGUgcGFyZW50IGlmIHRyL3RoL3RkL2NvbCBpcyB0aGUgb25seSBlbGVtZW50LCBpZiBub3RcbiAgLy8gcmV0dXJucyB0aGUgd2hvbGUgdHJlZSwgYXMgdGhpcyBjYW4gaW5jbHVkZSBhZGRpdGlvbmFsIGVsZW1lbnRzXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlmIChzZWxlY3QpIHtcbiAgICBwYXJlbnQuc2VsZWN0ZWRJbmRleCA9IC0xOyAgLy8gZm9yIElFOSwgY29tcGF0aWJsZSB3L2N1cnJlbnQgcmlvdCBiZWhhdmlvclxuICB9IGVsc2Uge1xuICAgIC8vIGF2b2lkcyBpbnNlcnRpb24gb2YgY29pbnRhaW5lciBpbnNpZGUgY29udGFpbmVyIChleDogdGJvZHkgaW5zaWRlIHRib2R5KVxuICAgIHZhciB0bmFtZSA9IHJvb3RFbHNbdGFnTmFtZV07XG4gICAgaWYgKHRuYW1lICYmIHBhcmVudC5jaGlsZEVsZW1lbnRDb3VudCA9PT0gMSkgeyBwYXJlbnQgPSAkKHRuYW1lLCBwYXJlbnQpOyB9XG4gIH1cbiAgcmV0dXJuIHBhcmVudFxufVxuXG4vKlxuICBSZXBsYWNlIHRoZSB5aWVsZCB0YWcgZnJvbSBhbnkgdGFnIHRlbXBsYXRlIHdpdGggdGhlIGlubmVySFRNTCBvZiB0aGVcbiAgb3JpZ2luYWwgdGFnIGluIHRoZSBwYWdlXG4qL1xuZnVuY3Rpb24gcmVwbGFjZVlpZWxkKHRtcGwsIGh0bWwpIHtcbiAgLy8gZG8gbm90aGluZyBpZiBubyB5aWVsZFxuICBpZiAoIXJlSGFzWWllbGQudGVzdCh0bXBsKSkgeyByZXR1cm4gdG1wbCB9XG5cbiAgLy8gYmUgY2FyZWZ1bCB3aXRoICMxMzQzIC0gc3RyaW5nIG9uIHRoZSBzb3VyY2UgaGF2aW5nIGAkMWBcbiAgdmFyIHNyYyA9IHt9O1xuXG4gIGh0bWwgPSBodG1sICYmIGh0bWwucmVwbGFjZShyZVlpZWxkU3JjLCBmdW5jdGlvbiAoXywgcmVmLCB0ZXh0KSB7XG4gICAgc3JjW3JlZl0gPSBzcmNbcmVmXSB8fCB0ZXh0OyAgIC8vIHByZXNlcnZlIGZpcnN0IGRlZmluaXRpb25cbiAgICByZXR1cm4gJydcbiAgfSkudHJpbSgpO1xuXG4gIHJldHVybiB0bXBsXG4gICAgLnJlcGxhY2UocmVZaWVsZERlc3QsIGZ1bmN0aW9uIChfLCByZWYsIGRlZikgeyAgLy8geWllbGQgd2l0aCBmcm9tIC0gdG8gYXR0cnNcbiAgICAgIHJldHVybiBzcmNbcmVmXSB8fCBkZWYgfHwgJydcbiAgICB9KVxuICAgIC5yZXBsYWNlKHJlWWllbGRBbGwsIGZ1bmN0aW9uIChfLCBkZWYpIHsgICAgICAgIC8vIHlpZWxkIHdpdGhvdXQgYW55IFwiZnJvbVwiXG4gICAgICByZXR1cm4gaHRtbCB8fCBkZWYgfHwgJydcbiAgICB9KVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBET00gZWxlbWVudCB0byB3cmFwIHRoZSBnaXZlbiBjb250ZW50LiBOb3JtYWxseSBhbiBgRElWYCwgYnV0IGNhbiBiZVxuICogYWxzbyBhIGBUQUJMRWAsIGBTRUxFQ1RgLCBgVEJPRFlgLCBgVFJgLCBvciBgQ09MR1JPVVBgIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtICAgeyBTdHJpbmcgfSB0bXBsICAtIFRoZSB0ZW1wbGF0ZSBjb21pbmcgZnJvbSB0aGUgY3VzdG9tIHRhZyBkZWZpbml0aW9uXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IGh0bWwgLSBIVE1MIGNvbnRlbnQgdGhhdCBjb21lcyBmcm9tIHRoZSBET00gZWxlbWVudCB3aGVyZSB5b3VcbiAqICAgICAgICAgICB3aWxsIG1vdW50IHRoZSB0YWcsIG1vc3RseSB0aGUgb3JpZ2luYWwgdGFnIGluIHRoZSBwYWdlXG4gKiBAcGFyYW0gICB7IEJvb2xlYW4gfSBpc1N2ZyAtIHRydWUgaWYgdGhlIHJvb3Qgbm9kZSBpcyBhbiBzdmdcbiAqIEByZXR1cm5zIHsgSFRNTEVsZW1lbnQgfSBET00gZWxlbWVudCB3aXRoIF90bXBsXyBtZXJnZWQgdGhyb3VnaCBgWUlFTERgIHdpdGggdGhlIF9odG1sXy5cbiAqL1xuZnVuY3Rpb24gbWtkb20odG1wbCwgaHRtbCwgaXNTdmckJDEpIHtcbiAgdmFyIG1hdGNoICAgPSB0bXBsICYmIHRtcGwubWF0Y2goL15cXHMqPChbLVxcd10rKS8pO1xuICB2YXIgIHRhZ05hbWUgPSBtYXRjaCAmJiBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpO1xuICB2YXIgZWwgPSBta0VsKGlzU3ZnJCQxID8gU1ZHIDogR0VORVJJQyk7XG5cbiAgLy8gcmVwbGFjZSBhbGwgdGhlIHlpZWxkIHRhZ3Mgd2l0aCB0aGUgdGFnIGlubmVyIGh0bWxcbiAgdG1wbCA9IHJlcGxhY2VZaWVsZCh0bXBsLCBodG1sKTtcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpZiAodGJsVGFncy50ZXN0KHRhZ05hbWUpKVxuICAgIHsgZWwgPSBzcGVjaWFsVGFncyhlbCwgdG1wbCwgdGFnTmFtZSk7IH1cbiAgZWxzZVxuICAgIHsgc2V0SW5uZXJIVE1MKGVsLCB0bXBsLCBpc1N2ZyQkMSk7IH1cblxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBBbm90aGVyIHdheSB0byBjcmVhdGUgYSByaW90IHRhZyBhIGJpdCBtb3JlIGVzNiBmcmllbmRseVxuICogQHBhcmFtIHsgSFRNTEVsZW1lbnQgfSBlbCAtIHRhZyBET00gc2VsZWN0b3Igb3IgRE9NIG5vZGUvc1xuICogQHBhcmFtIHsgT2JqZWN0IH0gb3B0cyAtIHRhZyBsb2dpY1xuICogQHJldHVybnMgeyBUYWcgfSBuZXcgcmlvdCB0YWcgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gVGFnJDEoZWwsIG9wdHMpIHtcbiAgLy8gZ2V0IHRoZSB0YWcgcHJvcGVydGllcyBmcm9tIHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxuICB2YXIgcmVmID0gdGhpcztcbiAgdmFyIG5hbWUgPSByZWYubmFtZTtcbiAgdmFyIHRtcGwgPSByZWYudG1wbDtcbiAgdmFyIGNzcyA9IHJlZi5jc3M7XG4gIHZhciBhdHRycyA9IHJlZi5hdHRycztcbiAgdmFyIG9uQ3JlYXRlID0gcmVmLm9uQ3JlYXRlO1xuICAvLyByZWdpc3RlciBhIG5ldyB0YWcgYW5kIGNhY2hlIHRoZSBjbGFzcyBwcm90b3R5cGVcbiAgaWYgKCFfX1RBR19JTVBMW25hbWVdKSB7XG4gICAgdGFnJDEobmFtZSwgdG1wbCwgY3NzLCBhdHRycywgb25DcmVhdGUpO1xuICAgIC8vIGNhY2hlIHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxuICAgIF9fVEFHX0lNUExbbmFtZV0uY2xhc3MgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICB9XG5cbiAgLy8gbW91bnQgdGhlIHRhZyB1c2luZyB0aGUgY2xhc3MgaW5zdGFuY2VcbiAgbW91bnRUbyhlbCwgbmFtZSwgb3B0cywgdGhpcyk7XG4gIC8vIGluamVjdCB0aGUgY29tcG9uZW50IGNzc1xuICBpZiAoY3NzKSB7IHN0eWxlTWFuYWdlci5pbmplY3QoKTsgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IHJpb3QgdGFnIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgbmFtZSAtIG5hbWUvaWQgb2YgdGhlIG5ldyByaW90IHRhZ1xuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIHRtcGwgLSB0YWcgdGVtcGxhdGVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBjc3MgLSBjdXN0b20gdGFnIGNzc1xuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGF0dHJzIC0gcm9vdCB0YWcgYXR0cmlidXRlc1xuICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gdXNlciBmdW5jdGlvblxuICogQHJldHVybnMgeyBTdHJpbmcgfSBuYW1lL2lkIG9mIHRoZSB0YWcganVzdCBjcmVhdGVkXG4gKi9cbmZ1bmN0aW9uIHRhZyQxKG5hbWUsIHRtcGwsIGNzcywgYXR0cnMsIGZuKSB7XG4gIGlmIChpc0Z1bmN0aW9uKGF0dHJzKSkge1xuICAgIGZuID0gYXR0cnM7XG5cbiAgICBpZiAoL15bXFx3LV0rXFxzPz0vLnRlc3QoY3NzKSkge1xuICAgICAgYXR0cnMgPSBjc3M7XG4gICAgICBjc3MgPSAnJztcbiAgICB9IGVsc2VcbiAgICAgIHsgYXR0cnMgPSAnJzsgfVxuICB9XG5cbiAgaWYgKGNzcykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNzcykpXG4gICAgICB7IGZuID0gY3NzOyB9XG4gICAgZWxzZVxuICAgICAgeyBzdHlsZU1hbmFnZXIuYWRkKGNzcyk7IH1cbiAgfVxuXG4gIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gIF9fVEFHX0lNUExbbmFtZV0gPSB7IG5hbWU6IG5hbWUsIHRtcGw6IHRtcGwsIGF0dHJzOiBhdHRycywgZm46IGZuIH07XG5cbiAgcmV0dXJuIG5hbWVcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgcmlvdCB0YWcgaW1wbGVtZW50YXRpb24gKGZvciB1c2UgYnkgdGhlIGNvbXBpbGVyKVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIG5hbWUgLSBuYW1lL2lkIG9mIHRoZSBuZXcgcmlvdCB0YWdcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICB0bXBsIC0gdGFnIHRlbXBsYXRlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgY3NzIC0gY3VzdG9tIHRhZyBjc3NcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBhdHRycyAtIHJvb3QgdGFnIGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIHVzZXIgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgU3RyaW5nIH0gbmFtZS9pZCBvZiB0aGUgdGFnIGp1c3QgY3JlYXRlZFxuICovXG5mdW5jdGlvbiB0YWcyJDEobmFtZSwgdG1wbCwgY3NzLCBhdHRycywgZm4pIHtcbiAgaWYgKGNzcykgeyBzdHlsZU1hbmFnZXIuYWRkKGNzcywgbmFtZSk7IH1cblxuICBfX1RBR19JTVBMW25hbWVdID0geyBuYW1lOiBuYW1lLCB0bXBsOiB0bXBsLCBhdHRyczogYXR0cnMsIGZuOiBmbiB9O1xuXG4gIHJldHVybiBuYW1lXG59XG5cbi8qKlxuICogTW91bnQgYSB0YWcgdXNpbmcgYSBzcGVjaWZpYyB0YWcgaW1wbGVtZW50YXRpb25cbiAqIEBwYXJhbSAgIHsgKiB9IHNlbGVjdG9yIC0gdGFnIERPTSBzZWxlY3RvciBvciBET00gbm9kZS9zXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHRhZ05hbWUgLSB0YWcgaW1wbGVtZW50YXRpb24gbmFtZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRzIC0gdGFnIGxvZ2ljXG4gKiBAcmV0dXJucyB7IEFycmF5IH0gbmV3IHRhZ3MgaW5zdGFuY2VzXG4gKi9cbmZ1bmN0aW9uIG1vdW50JDEoc2VsZWN0b3IsIHRhZ05hbWUsIG9wdHMpIHtcbiAgdmFyIHRhZ3MgPSBbXTtcbiAgdmFyIGVsZW0sIGFsbFRhZ3M7XG5cbiAgZnVuY3Rpb24gcHVzaFRhZ3NUbyhyb290KSB7XG4gICAgaWYgKHJvb3QudGFnTmFtZSkge1xuICAgICAgdmFyIHJpb3RUYWcgPSBnZXRBdHRyKHJvb3QsIElTX0RJUkVDVElWRSksIHRhZztcblxuICAgICAgLy8gaGF2ZSB0YWdOYW1lPyBmb3JjZSByaW90LXRhZyB0byBiZSB0aGUgc2FtZVxuICAgICAgaWYgKHRhZ05hbWUgJiYgcmlvdFRhZyAhPT0gdGFnTmFtZSkge1xuICAgICAgICByaW90VGFnID0gdGFnTmFtZTtcbiAgICAgICAgc2V0QXR0cihyb290LCBJU19ESVJFQ1RJVkUsIHRhZ05hbWUpO1xuICAgICAgfVxuXG4gICAgICB0YWcgPSBtb3VudFRvKHJvb3QsIHJpb3RUYWcgfHwgcm9vdC50YWdOYW1lLnRvTG93ZXJDYXNlKCksIG9wdHMpO1xuXG4gICAgICBpZiAodGFnKVxuICAgICAgICB7IHRhZ3MucHVzaCh0YWcpOyB9XG4gICAgfSBlbHNlIGlmIChyb290Lmxlbmd0aClcbiAgICAgIHsgZWFjaChyb290LCBwdXNoVGFnc1RvKTsgfSAvLyBhc3N1bWUgbm9kZUxpc3RcbiAgfVxuXG4gIC8vIGluamVjdCBzdHlsZXMgaW50byBET01cbiAgc3R5bGVNYW5hZ2VyLmluamVjdCgpO1xuXG4gIGlmIChpc09iamVjdCh0YWdOYW1lKSkge1xuICAgIG9wdHMgPSB0YWdOYW1lO1xuICAgIHRhZ05hbWUgPSAwO1xuICB9XG5cbiAgLy8gY3Jhd2wgdGhlIERPTSB0byBmaW5kIHRoZSB0YWdcbiAgaWYgKGlzU3RyaW5nKHNlbGVjdG9yKSkge1xuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgPT09ICcqJyA/XG4gICAgICAvLyBzZWxlY3QgYWxsIHJlZ2lzdGVyZWQgdGFnc1xuICAgICAgLy8gJiB0YWdzIGZvdW5kIHdpdGggdGhlIHJpb3QtdGFnIGF0dHJpYnV0ZSBzZXRcbiAgICAgIGFsbFRhZ3MgPSBzZWxlY3RUYWdzKCkgOlxuICAgICAgLy8gb3IganVzdCB0aGUgb25lcyBuYW1lZCBsaWtlIHRoZSBzZWxlY3RvclxuICAgICAgc2VsZWN0b3IgKyBzZWxlY3RUYWdzKHNlbGVjdG9yLnNwbGl0KC8sICovKSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgdG8gcGFzcyBhbHdheXMgYSBzZWxlY3RvclxuICAgIC8vIHRvIHRoZSBxdWVyeVNlbGVjdG9yQWxsIGZ1bmN0aW9uXG4gICAgZWxlbSA9IHNlbGVjdG9yID8gJCQoc2VsZWN0b3IpIDogW107XG4gIH1cbiAgZWxzZVxuICAgIC8vIHByb2JhYmx5IHlvdSBoYXZlIHBhc3NlZCBhbHJlYWR5IGEgdGFnIG9yIGEgTm9kZUxpc3RcbiAgICB7IGVsZW0gPSBzZWxlY3RvcjsgfVxuXG4gIC8vIHNlbGVjdCBhbGwgdGhlIHJlZ2lzdGVyZWQgYW5kIG1vdW50IHRoZW0gaW5zaWRlIHRoZWlyIHJvb3QgZWxlbWVudHNcbiAgaWYgKHRhZ05hbWUgPT09ICcqJykge1xuICAgIC8vIGdldCBhbGwgY3VzdG9tIHRhZ3NcbiAgICB0YWdOYW1lID0gYWxsVGFncyB8fCBzZWxlY3RUYWdzKCk7XG4gICAgLy8gaWYgdGhlIHJvb3QgZWxzIGl0J3MganVzdCBhIHNpbmdsZSB0YWdcbiAgICBpZiAoZWxlbS50YWdOYW1lKVxuICAgICAgeyBlbGVtID0gJCQodGFnTmFtZSwgZWxlbSk7IH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIHNlbGVjdCBhbGwgdGhlIGNoaWxkcmVuIGZvciBhbGwgdGhlIGRpZmZlcmVudCByb290IGVsZW1lbnRzXG4gICAgICB2YXIgbm9kZUxpc3QgPSBbXTtcblxuICAgICAgZWFjaChlbGVtLCBmdW5jdGlvbiAoX2VsKSB7IHJldHVybiBub2RlTGlzdC5wdXNoKCQkKHRhZ05hbWUsIF9lbCkpOyB9KTtcblxuICAgICAgZWxlbSA9IG5vZGVMaXN0O1xuICAgIH1cbiAgICAvLyBnZXQgcmlkIG9mIHRoZSB0YWdOYW1lXG4gICAgdGFnTmFtZSA9IDA7XG4gIH1cblxuICBwdXNoVGFnc1RvKGVsZW0pO1xuXG4gIHJldHVybiB0YWdzXG59XG5cbi8vIENyZWF0ZSBhIG1peGluIHRoYXQgY291bGQgYmUgZ2xvYmFsbHkgc2hhcmVkIGFjcm9zcyBhbGwgdGhlIHRhZ3NcbnZhciBtaXhpbnMgPSB7fTtcbnZhciBnbG9iYWxzID0gbWl4aW5zW0dMT0JBTF9NSVhJTl0gPSB7fTtcbnZhciBtaXhpbnNfaWQgPSAwO1xuXG4vKipcbiAqIENyZWF0ZS9SZXR1cm4gYSBtaXhpbiBieSBpdHMgbmFtZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgbmFtZSAtIG1peGluIG5hbWUgKGdsb2JhbCBtaXhpbiBpZiBvYmplY3QpXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9ICBtaXggLSBtaXhpbiBsb2dpY1xuICogQHBhcmFtICAgeyBCb29sZWFuIH0gZyAtIGlzIGdsb2JhbD9cbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gIHRoZSBtaXhpbiBsb2dpY1xuICovXG5mdW5jdGlvbiBtaXhpbiQxKG5hbWUsIG1peCwgZykge1xuICAvLyBVbm5hbWVkIGdsb2JhbFxuICBpZiAoaXNPYmplY3QobmFtZSkpIHtcbiAgICBtaXhpbiQxKChcIl9fXCIgKyAobWl4aW5zX2lkKyspICsgXCJfX1wiKSwgbmFtZSwgdHJ1ZSk7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgc3RvcmUgPSBnID8gZ2xvYmFscyA6IG1peGlucztcblxuICAvLyBHZXR0ZXJcbiAgaWYgKCFtaXgpIHtcbiAgICBpZiAoaXNVbmRlZmluZWQoc3RvcmVbbmFtZV0pKVxuICAgICAgeyB0aHJvdyBuZXcgRXJyb3IoKFwiVW5yZWdpc3RlcmVkIG1peGluOiBcIiArIG5hbWUpKSB9XG5cbiAgICByZXR1cm4gc3RvcmVbbmFtZV1cbiAgfVxuXG4gIC8vIFNldHRlclxuICBzdG9yZVtuYW1lXSA9IGlzRnVuY3Rpb24obWl4KSA/XG4gICAgZXh0ZW5kKG1peC5wcm90b3R5cGUsIHN0b3JlW25hbWVdIHx8IHt9KSAmJiBtaXggOlxuICAgIGV4dGVuZChzdG9yZVtuYW1lXSB8fCB7fSwgbWl4KTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgYWxsIHRoZSB0YWdzIGluc3RhbmNlcyBjcmVhdGVkXG4gKiBAcmV0dXJucyB7IEFycmF5IH0gYWxsIHRoZSB0YWdzIGluc3RhbmNlc1xuICovXG5mdW5jdGlvbiB1cGRhdGUkMSgpIHtcbiAgcmV0dXJuIGVhY2goX19UQUdTX0NBQ0hFLCBmdW5jdGlvbiAodGFnKSB7IHJldHVybiB0YWcudXBkYXRlKCk7IH0pXG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIkMShuYW1lKSB7XG4gIF9fVEFHX0lNUExbbmFtZV0gPSBudWxsO1xufVxuXG52YXIgdmVyc2lvbiQxID0gJ3YzLjguMSc7XG5cblxudmFyIGNvcmUgPSBPYmplY3QuZnJlZXplKHtcblx0VGFnOiBUYWckMSxcblx0dGFnOiB0YWckMSxcblx0dGFnMjogdGFnMiQxLFxuXHRtb3VudDogbW91bnQkMSxcblx0bWl4aW46IG1peGluJDEsXG5cdHVwZGF0ZTogdXBkYXRlJDEsXG5cdHVucmVnaXN0ZXI6IHVucmVnaXN0ZXIkMSxcblx0dmVyc2lvbjogdmVyc2lvbiQxXG59KTtcblxuLyoqXG4gKiBXZSBuZWVkIHRvIHVwZGF0ZSBvcHRzIGZvciB0aGlzIHRhZy4gVGhhdCByZXF1aXJlcyB1cGRhdGluZyB0aGUgZXhwcmVzc2lvbnNcbiAqIGluIGFueSBhdHRyaWJ1dGVzIG9uIHRoZSB0YWcsIGFuZCB0aGVuIGNvcHlpbmcgdGhlIHJlc3VsdCBvbnRvIG9wdHMuXG4gKiBAdGhpcyBUYWdcbiAqIEBwYXJhbSAgIHtCb29sZWFufSBpc0xvb3AgLSBpcyBpdCBhIGxvb3AgdGFnP1xuICogQHBhcmFtICAgeyBUYWcgfSAgcGFyZW50IC0gcGFyZW50IHRhZyBub2RlXG4gKiBAcGFyYW0gICB7IEJvb2xlYW4gfSAgaXNBbm9ueW1vdXMgLSBpcyBpdCBhIHRhZyB3aXRob3V0IGFueSBpbXBsPyAoYSB0YWcgbm90IHJlZ2lzdGVyZWQpXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9ICBvcHRzIC0gdGFnIG9wdGlvbnNcbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSAgaW5zdEF0dHJzIC0gdGFnIGF0dHJpYnV0ZXMgYXJyYXlcbiAqL1xuZnVuY3Rpb24gdXBkYXRlT3B0cyhpc0xvb3AsIHBhcmVudCwgaXNBbm9ueW1vdXMsIG9wdHMsIGluc3RBdHRycykge1xuICAvLyBpc0Fub255bW91cyBgZWFjaGAgdGFncyB0cmVhdCBgZG9tYCBhbmQgYHJvb3RgIGRpZmZlcmVudGx5LiBJbiB0aGlzIGNhc2VcbiAgLy8gKGFuZCBvbmx5IHRoaXMgY2FzZSkgd2UgZG9uJ3QgbmVlZCB0byBkbyB1cGRhdGVPcHRzLCBiZWNhdXNlIHRoZSByZWd1bGFyIHBhcnNlXG4gIC8vIHdpbGwgdXBkYXRlIHRob3NlIGF0dHJzLiBQbHVzLCBpc0Fub255bW91cyB0YWdzIGRvbid0IG5lZWQgb3B0cyBhbnl3YXlcbiAgaWYgKGlzTG9vcCAmJiBpc0Fub255bW91cykgeyByZXR1cm4gfVxuICB2YXIgY3R4ID0gaXNMb29wID8gaW5oZXJpdFBhcmVudFByb3BzLmNhbGwodGhpcykgOiBwYXJlbnQgfHwgdGhpcztcblxuICBlYWNoKGluc3RBdHRycywgZnVuY3Rpb24gKGF0dHIpIHtcbiAgICBpZiAoYXR0ci5leHByKSB7IHVwZGF0ZUV4cHJlc3Npb24uY2FsbChjdHgsIGF0dHIuZXhwcik7IH1cbiAgICAvLyBub3JtYWxpemUgdGhlIGF0dHJpYnV0ZSBuYW1lc1xuICAgIG9wdHNbdG9DYW1lbChhdHRyLm5hbWUpLnJlcGxhY2UoQVRUUlNfUFJFRklYLCAnJyldID0gYXR0ci5leHByID8gYXR0ci5leHByLnZhbHVlIDogYXR0ci52YWx1ZTtcbiAgfSk7XG59XG5cbi8qKlxuICogTWFuYWdlIHRoZSBtb3VudCBzdGF0ZSBvZiBhIHRhZyB0cmlnZ2VyaW5nIGFsc28gdGhlIG9ic2VydmFibGUgZXZlbnRzXG4gKiBAdGhpcyBUYWdcbiAqIEBwYXJhbSB7IEJvb2xlYW4gfSB2YWx1ZSAtIC4ub2YgdGhlIGlzTW91bnRlZCBmbGFnXG4gKi9cbmZ1bmN0aW9uIHNldE1vdW50U3RhdGUodmFsdWUpIHtcbiAgdmFyIHJlZiA9IHRoaXMuX187XG4gIHZhciBpc0Fub255bW91cyA9IHJlZi5pc0Fub255bW91cztcblxuICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaXNNb3VudGVkJywgdmFsdWUpO1xuXG4gIGlmICghaXNBbm9ueW1vdXMpIHtcbiAgICBpZiAodmFsdWUpIHsgdGhpcy50cmlnZ2VyKCdtb3VudCcpOyB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ3VubW91bnQnKTtcbiAgICAgIHRoaXMub2ZmKCcqJyk7XG4gICAgICB0aGlzLl9fLndhc0NyZWF0ZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIFRhZyBjcmVhdGlvbiBmYWN0b3J5IGZ1bmN0aW9uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7IE9iamVjdCB9IGltcGwgLSBpdCBjb250YWlucyB0aGUgdGFnIHRlbXBsYXRlLCBhbmQgbG9naWNcbiAqIEBwYXJhbSB7IE9iamVjdCB9IGNvbmYgLSB0YWcgb3B0aW9uc1xuICogQHBhcmFtIHsgU3RyaW5nIH0gaW5uZXJIVE1MIC0gaHRtbCB0aGF0IGV2ZW50dWFsbHkgd2UgbmVlZCB0byBpbmplY3QgaW4gdGhlIHRhZ1xuICovXG5mdW5jdGlvbiBjcmVhdGVUYWcoaW1wbCwgY29uZiwgaW5uZXJIVE1MKSB7XG4gIGlmICggaW1wbCA9PT0gdm9pZCAwICkgaW1wbCA9IHt9O1xuICBpZiAoIGNvbmYgPT09IHZvaWQgMCApIGNvbmYgPSB7fTtcblxuICB2YXIgdGFnID0gY29uZi5jb250ZXh0IHx8IHt9O1xuICB2YXIgb3B0cyA9IGV4dGVuZCh7fSwgY29uZi5vcHRzKTtcbiAgdmFyIHBhcmVudCA9IGNvbmYucGFyZW50O1xuICB2YXIgaXNMb29wID0gY29uZi5pc0xvb3A7XG4gIHZhciBpc0Fub255bW91cyA9ICEhY29uZi5pc0Fub255bW91cztcbiAgdmFyIHNraXBBbm9ueW1vdXMgPSBzZXR0aW5ncyQxLnNraXBBbm9ueW1vdXNUYWdzICYmIGlzQW5vbnltb3VzO1xuICB2YXIgaXRlbSA9IGNvbmYuaXRlbTtcbiAgLy8gYXZhaWxhYmxlIG9ubHkgZm9yIHRoZSBsb29wZWQgbm9kZXNcbiAgdmFyIGluZGV4ID0gY29uZi5pbmRleDtcbiAgLy8gQWxsIGF0dHJpYnV0ZXMgb24gdGhlIFRhZyB3aGVuIGl0J3MgZmlyc3QgcGFyc2VkXG4gIHZhciBpbnN0QXR0cnMgPSBbXTtcbiAgLy8gZXhwcmVzc2lvbnMgb24gdGhpcyB0eXBlIG9mIFRhZ1xuICB2YXIgaW1wbEF0dHJzID0gW107XG4gIHZhciBleHByZXNzaW9ucyA9IFtdO1xuICB2YXIgcm9vdCA9IGNvbmYucm9vdDtcbiAgdmFyIHRhZ05hbWUgPSBjb25mLnRhZ05hbWUgfHwgZ2V0VGFnTmFtZShyb290KTtcbiAgdmFyIGlzVmlydHVhbCA9IHRhZ05hbWUgPT09ICd2aXJ0dWFsJztcbiAgdmFyIGlzSW5saW5lID0gIWlzVmlydHVhbCAmJiAhaW1wbC50bXBsO1xuICB2YXIgZG9tO1xuXG4gIC8vIG1ha2UgdGhpcyB0YWcgb2JzZXJ2YWJsZVxuICBpZiAoIXNraXBBbm9ueW1vdXMpIHsgb2JzZXJ2YWJsZSQxKHRhZyk7IH1cbiAgLy8gb25seSBjYWxsIHVubW91bnQgaWYgd2UgaGF2ZSBhIHZhbGlkIF9fVEFHX0lNUEwgKGhhcyBuYW1lIHByb3BlcnR5KVxuICBpZiAoaW1wbC5uYW1lICYmIHJvb3QuX3RhZykgeyByb290Ll90YWcudW5tb3VudCh0cnVlKTsgfVxuXG4gIC8vIG5vdCB5ZXQgbW91bnRlZFxuICBkZWZpbmVQcm9wZXJ0eSh0YWcsICdpc01vdW50ZWQnLCBmYWxzZSk7XG5cbiAgZGVmaW5lUHJvcGVydHkodGFnLCAnX18nLCB7XG4gICAgaXNBbm9ueW1vdXM6IGlzQW5vbnltb3VzLFxuICAgIGluc3RBdHRyczogaW5zdEF0dHJzLFxuICAgIGlubmVySFRNTDogaW5uZXJIVE1MLFxuICAgIHRhZ05hbWU6IHRhZ05hbWUsXG4gICAgaW5kZXg6IGluZGV4LFxuICAgIGlzTG9vcDogaXNMb29wLFxuICAgIGlzSW5saW5lOiBpc0lubGluZSxcbiAgICAvLyB0YWdzIGhhdmluZyBldmVudCBsaXN0ZW5lcnNcbiAgICAvLyBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gdXNlIHdlYWsgbWFwcyBoZXJlIGJ1dCB3ZSBjYW4gbm90IGludHJvZHVjZSBicmVha2luZyBjaGFuZ2VzIG5vd1xuICAgIGxpc3RlbmVyczogW10sXG4gICAgLy8gdGhlc2UgdmFycyB3aWxsIGJlIG5lZWRlZCBvbmx5IGZvciB0aGUgdmlydHVhbCB0YWdzXG4gICAgdmlydHM6IFtdLFxuICAgIHdhc0NyZWF0ZWQ6IGZhbHNlLFxuICAgIHRhaWw6IG51bGwsXG4gICAgaGVhZDogbnVsbCxcbiAgICBwYXJlbnQ6IG51bGwsXG4gICAgaXRlbTogbnVsbFxuICB9KTtcblxuICAvLyBjcmVhdGUgYSB1bmlxdWUgaWQgdG8gdGhpcyB0YWdcbiAgLy8gaXQgY291bGQgYmUgaGFuZHkgdG8gdXNlIGl0IGFsc28gdG8gaW1wcm92ZSB0aGUgdmlydHVhbCBkb20gcmVuZGVyaW5nIHNwZWVkXG4gIGRlZmluZVByb3BlcnR5KHRhZywgJ19yaW90X2lkJywgdWlkKCkpOyAvLyBiYXNlIDEgYWxsb3dzIHRlc3QgIXQuX3Jpb3RfaWRcbiAgZGVmaW5lUHJvcGVydHkodGFnLCAncm9vdCcsIHJvb3QpO1xuICBleHRlbmQodGFnLCB7IG9wdHM6IG9wdHMgfSwgaXRlbSk7XG4gIC8vIHByb3RlY3QgdGhlIFwidGFnc1wiIGFuZCBcInJlZnNcIiBwcm9wZXJ0eSBmcm9tIGJlaW5nIG92ZXJyaWRkZW5cbiAgZGVmaW5lUHJvcGVydHkodGFnLCAncGFyZW50JywgcGFyZW50IHx8IG51bGwpO1xuICBkZWZpbmVQcm9wZXJ0eSh0YWcsICd0YWdzJywge30pO1xuICBkZWZpbmVQcm9wZXJ0eSh0YWcsICdyZWZzJywge30pO1xuXG4gIGlmIChpc0lubGluZSB8fCBpc0xvb3AgJiYgaXNBbm9ueW1vdXMpIHtcbiAgICBkb20gPSByb290O1xuICB9IGVsc2Uge1xuICAgIGlmICghaXNWaXJ0dWFsKSB7IHJvb3QuaW5uZXJIVE1MID0gJyc7IH1cbiAgICBkb20gPSBta2RvbShpbXBsLnRtcGwsIGlubmVySFRNTCwgaXNTdmcocm9vdCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgdGFnIGV4cHJlc3Npb25zIGFuZCBvcHRpb25zXG4gICAqIEBwYXJhbSAgIHsgKiB9ICBkYXRhIC0gZGF0YSB3ZSB3YW50IHRvIHVzZSB0byBleHRlbmQgdGhlIHRhZyBwcm9wZXJ0aWVzXG4gICAqIEByZXR1cm5zIHsgVGFnIH0gdGhlIGN1cnJlbnQgdGFnIGluc3RhbmNlXG4gICAqL1xuICBkZWZpbmVQcm9wZXJ0eSh0YWcsICd1cGRhdGUnLCBmdW5jdGlvbiB0YWdVcGRhdGUoZGF0YSkge1xuICAgIHZhciBuZXh0T3B0cyA9IHt9O1xuICAgIHZhciBjYW5UcmlnZ2VyID0gdGFnLmlzTW91bnRlZCAmJiAhc2tpcEFub255bW91cztcblxuICAgIC8vIGluaGVyaXQgcHJvcGVydGllcyBmcm9tIHRoZSBwYXJlbnQgdGFnXG4gICAgaWYgKGlzQW5vbnltb3VzICYmIHBhcmVudCkgeyBleHRlbmQodGFnLCBwYXJlbnQpOyB9XG4gICAgZXh0ZW5kKHRhZywgZGF0YSk7XG5cbiAgICB1cGRhdGVPcHRzLmFwcGx5KHRhZywgW2lzTG9vcCwgcGFyZW50LCBpc0Fub255bW91cywgbmV4dE9wdHMsIGluc3RBdHRyc10pO1xuXG4gICAgaWYgKFxuICAgICAgY2FuVHJpZ2dlciAmJlxuICAgICAgdGFnLmlzTW91bnRlZCAmJlxuICAgICAgaXNGdW5jdGlvbih0YWcuc2hvdWxkVXBkYXRlKSAmJiAhdGFnLnNob3VsZFVwZGF0ZShkYXRhLCBuZXh0T3B0cylcbiAgICApIHtcbiAgICAgIHJldHVybiB0YWdcbiAgICB9XG5cbiAgICBleHRlbmQob3B0cywgbmV4dE9wdHMpO1xuXG4gICAgaWYgKGNhblRyaWdnZXIpIHsgdGFnLnRyaWdnZXIoJ3VwZGF0ZScsIGRhdGEpOyB9XG4gICAgdXBkYXRlQWxsRXhwcmVzc2lvbnMuY2FsbCh0YWcsIGV4cHJlc3Npb25zKTtcbiAgICBpZiAoY2FuVHJpZ2dlcikgeyB0YWcudHJpZ2dlcigndXBkYXRlZCcpOyB9XG5cbiAgICByZXR1cm4gdGFnXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBtaXhpbiB0byB0aGlzIHRhZ1xuICAgKiBAcmV0dXJucyB7IFRhZyB9IHRoZSBjdXJyZW50IHRhZyBpbnN0YW5jZVxuICAgKi9cbiAgZGVmaW5lUHJvcGVydHkodGFnLCAnbWl4aW4nLCBmdW5jdGlvbiB0YWdNaXhpbigpIHtcbiAgICBlYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24gKG1peCkge1xuICAgICAgdmFyIGluc3RhbmNlO1xuICAgICAgdmFyIG9iajtcbiAgICAgIHZhciBwcm9wcyA9IFtdO1xuXG4gICAgICAvLyBwcm9wZXJ0aWVzIGJsYWNrbGlzdGVkIGFuZCB3aWxsIG5vdCBiZSBib3VuZCB0byB0aGUgdGFnIGluc3RhbmNlXG4gICAgICB2YXIgcHJvcHNCbGFja2xpc3QgPSBbJ2luaXQnLCAnX19wcm90b19fJ107XG5cbiAgICAgIG1peCA9IGlzU3RyaW5nKG1peCkgPyBtaXhpbiQxKG1peCkgOiBtaXg7XG5cbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBtaXhpbiBpcyBhIGZ1bmN0aW9uXG4gICAgICBpZiAoaXNGdW5jdGlvbihtaXgpKSB7XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgbmV3IG1peGluIGluc3RhbmNlXG4gICAgICAgIGluc3RhbmNlID0gbmV3IG1peCgpO1xuICAgICAgfSBlbHNlIHsgaW5zdGFuY2UgPSBtaXg7IH1cblxuICAgICAgdmFyIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGluc3RhbmNlKTtcblxuICAgICAgLy8gYnVpbGQgbXVsdGlsZXZlbCBwcm90b3R5cGUgaW5oZXJpdGFuY2UgY2hhaW4gcHJvcGVydHkgbGlzdFxuICAgICAgZG8geyBwcm9wcyA9IHByb3BzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmogfHwgaW5zdGFuY2UpKTsgfVxuICAgICAgd2hpbGUgKG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmogfHwgaW5zdGFuY2UpKVxuXG4gICAgICAvLyBsb29wIHRoZSBrZXlzIGluIHRoZSBmdW5jdGlvbiBwcm90b3R5cGUgb3IgdGhlIGFsbCBvYmplY3Qga2V5c1xuICAgICAgZWFjaChwcm9wcywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAvLyBiaW5kIG1ldGhvZHMgdG8gdGFnXG4gICAgICAgIC8vIGFsbG93IG1peGlucyB0byBvdmVycmlkZSBvdGhlciBwcm9wZXJ0aWVzL3BhcmVudCBtaXhpbnNcbiAgICAgICAgaWYgKCFjb250YWlucyhwcm9wc0JsYWNrbGlzdCwga2V5KSkge1xuICAgICAgICAgIC8vIGNoZWNrIGZvciBnZXR0ZXJzL3NldHRlcnNcbiAgICAgICAgICB2YXIgZGVzY3JpcHRvciA9IGdldFByb3BEZXNjcmlwdG9yKGluc3RhbmNlLCBrZXkpIHx8IGdldFByb3BEZXNjcmlwdG9yKHByb3RvLCBrZXkpO1xuICAgICAgICAgIHZhciBoYXNHZXR0ZXJTZXR0ZXIgPSBkZXNjcmlwdG9yICYmIChkZXNjcmlwdG9yLmdldCB8fCBkZXNjcmlwdG9yLnNldCk7XG5cbiAgICAgICAgICAvLyBhcHBseSBtZXRob2Qgb25seSBpZiBpdCBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0IG9uIHRoZSBpbnN0YW5jZVxuICAgICAgICAgIGlmICghdGFnLmhhc093blByb3BlcnR5KGtleSkgJiYgaGFzR2V0dGVyU2V0dGVyKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFnLCBrZXksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWdba2V5XSA9IGlzRnVuY3Rpb24oaW5zdGFuY2Vba2V5XSkgP1xuICAgICAgICAgICAgICBpbnN0YW5jZVtrZXldLmJpbmQodGFnKSA6XG4gICAgICAgICAgICAgIGluc3RhbmNlW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gaW5pdCBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgYXV0b21hdGljYWxseVxuICAgICAgaWYgKGluc3RhbmNlLmluaXQpXG4gICAgICAgIHsgaW5zdGFuY2UuaW5pdC5iaW5kKHRhZykob3B0cyk7IH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0YWdcbiAgfSk7XG5cbiAgLyoqXG4gICAqIE1vdW50IHRoZSBjdXJyZW50IHRhZyBpbnN0YW5jZVxuICAgKiBAcmV0dXJucyB7IFRhZyB9IHRoZSBjdXJyZW50IHRhZyBpbnN0YW5jZVxuICAgKi9cbiAgZGVmaW5lUHJvcGVydHkodGFnLCAnbW91bnQnLCBmdW5jdGlvbiB0YWdNb3VudCgpIHtcbiAgICByb290Ll90YWcgPSB0YWc7IC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHRhZyBqdXN0IGNyZWF0ZWRcblxuICAgIC8vIFJlYWQgYWxsIHRoZSBhdHRycyBvbiB0aGlzIGluc3RhbmNlLiBUaGlzIGdpdmUgdXMgdGhlIGluZm8gd2UgbmVlZCBmb3IgdXBkYXRlT3B0c1xuICAgIHBhcnNlQXR0cmlidXRlcy5hcHBseShwYXJlbnQsIFtyb290LCByb290LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChhdHRyLCBleHByKSB7XG4gICAgICBpZiAoIWlzQW5vbnltb3VzICYmIFJlZkV4cHIuaXNQcm90b3R5cGVPZihleHByKSkgeyBleHByLnRhZyA9IHRhZzsgfVxuICAgICAgYXR0ci5leHByID0gZXhwcjtcbiAgICAgIGluc3RBdHRycy5wdXNoKGF0dHIpO1xuICAgIH1dKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgcm9vdCBhZGRpbmcgY3VzdG9tIGF0dHJpYnV0ZXMgY29taW5nIGZyb20gdGhlIGNvbXBpbGVyXG4gICAgd2Fsa0F0dHJzKGltcGwuYXR0cnMsIGZ1bmN0aW9uIChrLCB2KSB7IGltcGxBdHRycy5wdXNoKHtuYW1lOiBrLCB2YWx1ZTogdn0pOyB9KTtcbiAgICBwYXJzZUF0dHJpYnV0ZXMuYXBwbHkodGFnLCBbcm9vdCwgaW1wbEF0dHJzLCBmdW5jdGlvbiAoYXR0ciwgZXhwcikge1xuICAgICAgaWYgKGV4cHIpIHsgZXhwcmVzc2lvbnMucHVzaChleHByKTsgfVxuICAgICAgZWxzZSB7IHNldEF0dHIocm9vdCwgYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTsgfVxuICAgIH1dKTtcblxuICAgIC8vIGluaXRpYWxpYXRpb25cbiAgICB1cGRhdGVPcHRzLmFwcGx5KHRhZywgW2lzTG9vcCwgcGFyZW50LCBpc0Fub255bW91cywgb3B0cywgaW5zdEF0dHJzXSk7XG5cbiAgICAvLyBhZGQgZ2xvYmFsIG1peGluc1xuICAgIHZhciBnbG9iYWxNaXhpbiA9IG1peGluJDEoR0xPQkFMX01JWElOKTtcblxuICAgIGlmIChnbG9iYWxNaXhpbiAmJiAhc2tpcEFub255bW91cykge1xuICAgICAgZm9yICh2YXIgaSBpbiBnbG9iYWxNaXhpbikge1xuICAgICAgICBpZiAoZ2xvYmFsTWl4aW4uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICB0YWcubWl4aW4oZ2xvYmFsTWl4aW5baV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGltcGwuZm4pIHsgaW1wbC5mbi5jYWxsKHRhZywgb3B0cyk7IH1cblxuICAgIGlmICghc2tpcEFub255bW91cykgeyB0YWcudHJpZ2dlcignYmVmb3JlLW1vdW50Jyk7IH1cblxuICAgIC8vIHBhcnNlIGxheW91dCBhZnRlciBpbml0LiBmbiBtYXkgY2FsY3VsYXRlIGFyZ3MgZm9yIG5lc3RlZCBjdXN0b20gdGFnc1xuICAgIGVhY2gocGFyc2VFeHByZXNzaW9ucy5hcHBseSh0YWcsIFtkb20sIGlzQW5vbnltb3VzXSksIGZ1bmN0aW9uIChlKSB7IHJldHVybiBleHByZXNzaW9ucy5wdXNoKGUpOyB9KTtcblxuICAgIHRhZy51cGRhdGUoaXRlbSk7XG5cbiAgICBpZiAoIWlzQW5vbnltb3VzICYmICFpc0lubGluZSkge1xuICAgICAgd2hpbGUgKGRvbS5maXJzdENoaWxkKSB7IHJvb3QuYXBwZW5kQ2hpbGQoZG9tLmZpcnN0Q2hpbGQpOyB9XG4gICAgfVxuXG4gICAgZGVmaW5lUHJvcGVydHkodGFnLCAncm9vdCcsIHJvb3QpO1xuXG4gICAgLy8gaWYgd2UgbmVlZCB0byB3YWl0IHRoYXQgdGhlIHBhcmVudCBcIm1vdW50XCIgb3IgXCJ1cGRhdGVkXCIgZXZlbnQgZ2V0cyB0cmlnZ2VyZWRcbiAgICBpZiAoIXNraXBBbm9ueW1vdXMgJiYgdGFnLnBhcmVudCkge1xuICAgICAgdmFyIHAgPSBnZXRJbW1lZGlhdGVDdXN0b21QYXJlbnRUYWcodGFnLnBhcmVudCk7XG4gICAgICBwLm9uZSghcC5pc01vdW50ZWQgPyAnbW91bnQnIDogJ3VwZGF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNldE1vdW50U3RhdGUuY2FsbCh0YWcsIHRydWUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG90aGVyd2lzZSBpdCdzIG5vdCBhIGNoaWxkIHRhZyB3ZSBjYW4gdHJpZ2dlciBpdHMgbW91bnQgZXZlbnRcbiAgICAgIHNldE1vdW50U3RhdGUuY2FsbCh0YWcsIHRydWUpO1xuICAgIH1cblxuICAgIHRhZy5fXy53YXNDcmVhdGVkID0gdHJ1ZTtcblxuICAgIHJldHVybiB0YWdcblxuICB9KTtcblxuICAvKipcbiAgICogVW5tb3VudCB0aGUgdGFnIGluc3RhbmNlXG4gICAqIEBwYXJhbSB7IEJvb2xlYW4gfSBtdXN0S2VlcFJvb3QgLSBpZiBpdCdzIHRydWUgdGhlIHJvb3Qgbm9kZSB3aWxsIG5vdCBiZSByZW1vdmVkXG4gICAqIEByZXR1cm5zIHsgVGFnIH0gdGhlIGN1cnJlbnQgdGFnIGluc3RhbmNlXG4gICAqL1xuICBkZWZpbmVQcm9wZXJ0eSh0YWcsICd1bm1vdW50JywgZnVuY3Rpb24gdGFnVW5tb3VudChtdXN0S2VlcFJvb3QpIHtcbiAgICB2YXIgZWwgPSB0YWcucm9vdDtcbiAgICB2YXIgcCA9IGVsLnBhcmVudE5vZGU7XG4gICAgdmFyIHRhZ0luZGV4ID0gX19UQUdTX0NBQ0hFLmluZGV4T2YodGFnKTtcblxuICAgIGlmICghc2tpcEFub255bW91cykgeyB0YWcudHJpZ2dlcignYmVmb3JlLXVubW91bnQnKTsgfVxuXG4gICAgLy8gY2xlYXIgYWxsIGF0dHJpYnV0ZXMgY29taW5nIGZyb20gdGhlIG1vdW50ZWQgdGFnXG4gICAgd2Fsa0F0dHJzKGltcGwuYXR0cnMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBpZiAoc3RhcnRzV2l0aChuYW1lLCBBVFRSU19QUkVGSVgpKVxuICAgICAgICB7IG5hbWUgPSBuYW1lLnNsaWNlKEFUVFJTX1BSRUZJWC5sZW5ndGgpOyB9XG5cbiAgICAgIHJlbUF0dHIocm9vdCwgbmFtZSk7XG4gICAgfSk7XG5cbiAgICAvLyByZW1vdmUgYWxsIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICB0YWcuX18ubGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGRvbSkge1xuICAgICAgT2JqZWN0LmtleXMoZG9tW1JJT1RfRVZFTlRTX0tFWV0pLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGRvbVtSSU9UX0VWRU5UU19LRVldW2V2ZW50TmFtZV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyByZW1vdmUgdGFnIGluc3RhbmNlIGZyb20gdGhlIGdsb2JhbCB0YWdzIGNhY2hlIGNvbGxlY3Rpb25cbiAgICBpZiAodGFnSW5kZXggIT09IC0xKSB7IF9fVEFHU19DQUNIRS5zcGxpY2UodGFnSW5kZXgsIDEpOyB9XG5cbiAgICAvLyBjbGVhbiB1cCB0aGUgcGFyZW50IHRhZ3Mgb2JqZWN0XG4gICAgaWYgKHBhcmVudCAmJiAhaXNBbm9ueW1vdXMpIHtcbiAgICAgIHZhciBwdGFnID0gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHBhcmVudCk7XG5cbiAgICAgIGlmIChpc1ZpcnR1YWwpIHtcbiAgICAgICAgT2JqZWN0XG4gICAgICAgICAgLmtleXModGFnLnRhZ3MpXG4gICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKHRhZ05hbWUpIHsgcmV0dXJuIGFycmF5aXNoUmVtb3ZlKHB0YWcudGFncywgdGFnTmFtZSwgdGFnLnRhZ3NbdGFnTmFtZV0pOyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5aXNoUmVtb3ZlKHB0YWcudGFncywgdGFnTmFtZSwgdGFnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1bm1vdW50IGFsbCB0aGUgdmlydHVhbCBkaXJlY3RpdmVzXG4gICAgaWYgKHRhZy5fXy52aXJ0cykge1xuICAgICAgZWFjaCh0YWcuX18udmlydHMsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2LnBhcmVudE5vZGUpIHsgdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHYpOyB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBhbGxvdyBleHByZXNzaW9ucyB0byB1bm1vdW50IHRoZW1zZWx2ZXNcbiAgICB1bm1vdW50QWxsKGV4cHJlc3Npb25zKTtcbiAgICBlYWNoKGluc3RBdHRycywgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGEuZXhwciAmJiBhLmV4cHIudW5tb3VudCAmJiBhLmV4cHIudW5tb3VudCgpOyB9KTtcblxuICAgIC8vIGNsZWFyIHRoZSB0YWcgaHRtbCBpZiBpdCdzIG5lY2Vzc2FyeVxuICAgIGlmIChtdXN0S2VlcFJvb3QpIHsgc2V0SW5uZXJIVE1MKGVsLCAnJyk7IH1cbiAgICAvLyBvdGhlcndpc2UgZGV0YWNoIHRoZSByb290IHRhZyBmcm9tIHRoZSBET01cbiAgICBlbHNlIGlmIChwKSB7IHAucmVtb3ZlQ2hpbGQoZWwpOyB9XG5cbiAgICAvLyBjdXN0b20gaW50ZXJuYWwgdW5tb3VudCBmdW5jdGlvbiB0byBhdm9pZCByZWx5aW5nIG9uIHRoZSBvYnNlcnZhYmxlXG4gICAgaWYgKHRhZy5fXy5vblVubW91bnQpIHsgdGFnLl9fLm9uVW5tb3VudCgpOyB9XG5cbiAgICAvLyB3ZWlyZCBmaXggZm9yIGEgd2VpcmQgZWRnZSBjYXNlICMyNDA5IGFuZCAjMjQzNlxuICAgIC8vIHNvbWUgdXNlcnMgbWlnaHQgdXNlIHlvdXIgc29mdHdhcmUgbm90IGFzIHlvdSd2ZSBleHBlY3RlZFxuICAgIC8vIHNvIEkgbmVlZCB0byBhZGQgdGhlc2UgZGlydHkgaGFja3MgdG8gbWl0aWdhdGUgdW5leHBlY3RlZCBpc3N1ZXNcbiAgICBpZiAoIXRhZy5pc01vdW50ZWQpIHsgc2V0TW91bnRTdGF0ZS5jYWxsKHRhZywgdHJ1ZSk7IH1cblxuICAgIHNldE1vdW50U3RhdGUuY2FsbCh0YWcsIGZhbHNlKTtcblxuICAgIGRlbGV0ZSB0YWcucm9vdC5fdGFnO1xuXG4gICAgcmV0dXJuIHRhZ1xuICB9KTtcblxuICByZXR1cm4gdGFnXG59XG5cbi8qKlxuICogRGV0ZWN0IHRoZSB0YWcgaW1wbGVtZW50YXRpb24gYnkgYSBET00gbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSBuZWVkIHRvIHBhcnNlIHRvIGdldCBpdHMgdGFnIGltcGxlbWVudGF0aW9uXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IGl0IHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGltcGxlbWVudGF0aW9uIG9mIGEgY3VzdG9tIHRhZyAodGVtcGxhdGUgYW5kIGJvb3QgZnVuY3Rpb24pXG4gKi9cbmZ1bmN0aW9uIGdldFRhZyhkb20pIHtcbiAgcmV0dXJuIGRvbS50YWdOYW1lICYmIF9fVEFHX0lNUExbZ2V0QXR0cihkb20sIElTX0RJUkVDVElWRSkgfHxcbiAgICBnZXRBdHRyKGRvbSwgSVNfRElSRUNUSVZFKSB8fCBkb20udGFnTmFtZS50b0xvd2VyQ2FzZSgpXVxufVxuXG4vKipcbiAqIE1vdmUgdGhlIHBvc2l0aW9uIG9mIGEgY3VzdG9tIHRhZyBpbiBpdHMgcGFyZW50IHRhZ1xuICogQHRoaXMgVGFnXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHRhZ05hbWUgLSBrZXkgd2hlcmUgdGhlIHRhZyB3YXMgc3RvcmVkXG4gKiBAcGFyYW0gICB7IE51bWJlciB9IG5ld1BvcyAtIGluZGV4IHdoZXJlIHRoZSBuZXcgdGFnIHdpbGwgYmUgc3RvcmVkXG4gKi9cbmZ1bmN0aW9uIG1vdmVDaGlsZFRhZyh0YWdOYW1lLCBuZXdQb3MpIHtcbiAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50O1xuICB2YXIgdGFncztcbiAgLy8gbm8gcGFyZW50IG5vIG1vdmVcbiAgaWYgKCFwYXJlbnQpIHsgcmV0dXJuIH1cblxuICB0YWdzID0gcGFyZW50LnRhZ3NbdGFnTmFtZV07XG5cbiAgaWYgKGlzQXJyYXkodGFncykpXG4gICAgeyB0YWdzLnNwbGljZShuZXdQb3MsIDAsIHRhZ3Muc3BsaWNlKHRhZ3MuaW5kZXhPZih0aGlzKSwgMSlbMF0pOyB9XG4gIGVsc2UgeyBhcnJheWlzaEFkZChwYXJlbnQudGFncywgdGFnTmFtZSwgdGhpcyk7IH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgY2hpbGQgdGFnIGluY2x1ZGluZyBpdCBjb3JyZWN0bHkgaW50byBpdHMgcGFyZW50XG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGNoaWxkIC0gY2hpbGQgdGFnIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IG9wdHMgLSB0YWcgb3B0aW9ucyBjb250YWluaW5nIHRoZSBET00gbm9kZSB3aGVyZSB0aGUgdGFnIHdpbGwgYmUgbW91bnRlZFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBpbm5lckhUTUwgLSBpbm5lciBodG1sIG9mIHRoZSBjaGlsZCBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHBhcmVudCAtIGluc3RhbmNlIG9mIHRoZSBwYXJlbnQgdGFnIGluY2x1ZGluZyB0aGUgY2hpbGQgY3VzdG9tIHRhZ1xuICogQHJldHVybnMgeyBPYmplY3QgfSBpbnN0YW5jZSBvZiB0aGUgbmV3IGNoaWxkIHRhZyBqdXN0IGNyZWF0ZWRcbiAqL1xuZnVuY3Rpb24gaW5pdENoaWxkVGFnKGNoaWxkLCBvcHRzLCBpbm5lckhUTUwsIHBhcmVudCkge1xuICB2YXIgdGFnID0gY3JlYXRlVGFnKGNoaWxkLCBvcHRzLCBpbm5lckhUTUwpO1xuICB2YXIgdGFnTmFtZSA9IG9wdHMudGFnTmFtZSB8fCBnZXRUYWdOYW1lKG9wdHMucm9vdCwgdHJ1ZSk7XG4gIHZhciBwdGFnID0gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHBhcmVudCk7XG4gIC8vIGZpeCBmb3IgdGhlIHBhcmVudCBhdHRyaWJ1dGUgaW4gdGhlIGxvb3BlZCBlbGVtZW50c1xuICBkZWZpbmVQcm9wZXJ0eSh0YWcsICdwYXJlbnQnLCBwdGFnKTtcbiAgLy8gc3RvcmUgdGhlIHJlYWwgcGFyZW50IHRhZ1xuICAvLyBpbiBzb21lIGNhc2VzIHRoaXMgY291bGQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGN1c3RvbSBwYXJlbnQgdGFnXG4gIC8vIGZvciBleGFtcGxlIGluIG5lc3RlZCBsb29wc1xuICB0YWcuX18ucGFyZW50ID0gcGFyZW50O1xuXG4gIC8vIGFkZCB0aGlzIHRhZyB0byB0aGUgY3VzdG9tIHBhcmVudCB0YWdcbiAgYXJyYXlpc2hBZGQocHRhZy50YWdzLCB0YWdOYW1lLCB0YWcpO1xuXG4gIC8vIGFuZCBhbHNvIHRvIHRoZSByZWFsIHBhcmVudCB0YWdcbiAgaWYgKHB0YWcgIT09IHBhcmVudClcbiAgICB7IGFycmF5aXNoQWRkKHBhcmVudC50YWdzLCB0YWdOYW1lLCB0YWcpOyB9XG5cbiAgcmV0dXJuIHRhZ1xufVxuXG4vKipcbiAqIExvb3AgYmFja3dhcmQgYWxsIHRoZSBwYXJlbnRzIHRyZWUgdG8gZGV0ZWN0IHRoZSBmaXJzdCBjdXN0b20gcGFyZW50IHRhZ1xuICogQHBhcmFtICAgeyBPYmplY3QgfSB0YWcgLSBhIFRhZyBpbnN0YW5jZVxuICogQHJldHVybnMgeyBPYmplY3QgfSB0aGUgaW5zdGFuY2Ugb2YgdGhlIGZpcnN0IGN1c3RvbSBwYXJlbnQgdGFnIGZvdW5kXG4gKi9cbmZ1bmN0aW9uIGdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyh0YWcpIHtcbiAgdmFyIHB0YWcgPSB0YWc7XG4gIHdoaWxlIChwdGFnLl9fLmlzQW5vbnltb3VzKSB7XG4gICAgaWYgKCFwdGFnLnBhcmVudCkgeyBicmVhayB9XG4gICAgcHRhZyA9IHB0YWcucGFyZW50O1xuICB9XG4gIHJldHVybiBwdGFnXG59XG5cbi8qKlxuICogVHJpZ2dlciB0aGUgdW5tb3VudCBtZXRob2Qgb24gYWxsIHRoZSBleHByZXNzaW9uc1xuICogQHBhcmFtICAgeyBBcnJheSB9IGV4cHJlc3Npb25zIC0gRE9NIGV4cHJlc3Npb25zXG4gKi9cbmZ1bmN0aW9uIHVubW91bnRBbGwoZXhwcmVzc2lvbnMpIHtcbiAgZWFjaChleHByZXNzaW9ucywgZnVuY3Rpb24gKGV4cHIpIHtcbiAgICBpZiAoZXhwci51bm1vdW50KSB7IGV4cHIudW5tb3VudCh0cnVlKTsgfVxuICAgIGVsc2UgaWYgKGV4cHIudGFnTmFtZSkgeyBleHByLnRhZy51bm1vdW50KHRydWUpOyB9XG4gICAgZWxzZSBpZiAoZXhwci51bm1vdW50KSB7IGV4cHIudW5tb3VudCgpOyB9XG4gIH0pO1xufVxuXG4vKipcbiAqIEdldCB0aGUgdGFnIG5hbWUgb2YgYW55IERPTSBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIHdhbnQgdG8gcGFyc2VcbiAqIEBwYXJhbSAgIHsgQm9vbGVhbiB9IHNraXBEYXRhSXMgLSBoYWNrIHRvIGlnbm9yZSB0aGUgZGF0YS1pcyBhdHRyaWJ1dGUgd2hlbiBhdHRhY2hpbmcgdG8gcGFyZW50XG4gKiBAcmV0dXJucyB7IFN0cmluZyB9IG5hbWUgdG8gaWRlbnRpZnkgdGhpcyBkb20gbm9kZSBpbiByaW90XG4gKi9cbmZ1bmN0aW9uIGdldFRhZ05hbWUoZG9tLCBza2lwRGF0YUlzKSB7XG4gIHZhciBjaGlsZCA9IGdldFRhZyhkb20pO1xuICB2YXIgbmFtZWRUYWcgPSAhc2tpcERhdGFJcyAmJiBnZXRBdHRyKGRvbSwgSVNfRElSRUNUSVZFKTtcbiAgcmV0dXJuIG5hbWVkVGFnICYmICF0bXBsLmhhc0V4cHIobmFtZWRUYWcpID9cbiAgICBuYW1lZFRhZyA6IGNoaWxkID8gY2hpbGQubmFtZSA6IGRvbS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuLyoqXG4gKiBTZXQgdGhlIHByb3BlcnR5IG9mIGFuIG9iamVjdCBmb3IgYSBnaXZlbiBrZXkuIElmIHNvbWV0aGluZyBhbHJlYWR5XG4gKiBleGlzdHMgdGhlcmUsIHRoZW4gaXQgYmVjb21lcyBhbiBhcnJheSBjb250YWluaW5nIGJvdGggdGhlIG9sZCBhbmQgbmV3IHZhbHVlLlxuICogQHBhcmFtIHsgT2JqZWN0IH0gb2JqIC0gb2JqZWN0IG9uIHdoaWNoIHRvIHNldCB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7IFN0cmluZyB9IGtleSAtIHByb3BlcnR5IG5hbWVcbiAqIEBwYXJhbSB7IE9iamVjdCB9IHZhbHVlIC0gdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eSB0byBiZSBzZXRcbiAqIEBwYXJhbSB7IEJvb2xlYW4gfSBlbnN1cmVBcnJheSAtIGVuc3VyZSB0aGF0IHRoZSBwcm9wZXJ0eSByZW1haW5zIGFuIGFycmF5XG4gKiBAcGFyYW0geyBOdW1iZXIgfSBpbmRleCAtIGFkZCB0aGUgbmV3IGl0ZW0gaW4gYSBjZXJ0YWluIGFycmF5IHBvc2l0aW9uXG4gKi9cbmZ1bmN0aW9uIGFycmF5aXNoQWRkKG9iaiwga2V5LCB2YWx1ZSwgZW5zdXJlQXJyYXksIGluZGV4KSB7XG4gIHZhciBkZXN0ID0gb2JqW2tleV07XG4gIHZhciBpc0FyciA9IGlzQXJyYXkoZGVzdCk7XG4gIHZhciBoYXNJbmRleCA9ICFpc1VuZGVmaW5lZChpbmRleCk7XG5cbiAgaWYgKGRlc3QgJiYgZGVzdCA9PT0gdmFsdWUpIHsgcmV0dXJuIH1cblxuICAvLyBpZiB0aGUga2V5IHdhcyBuZXZlciBzZXQsIHNldCBpdCBvbmNlXG4gIGlmICghZGVzdCAmJiBlbnN1cmVBcnJheSkgeyBvYmpba2V5XSA9IFt2YWx1ZV07IH1cbiAgZWxzZSBpZiAoIWRlc3QpIHsgb2JqW2tleV0gPSB2YWx1ZTsgfVxuICAvLyBpZiBpdCB3YXMgYW4gYXJyYXkgYW5kIG5vdCB5ZXQgc2V0XG4gIGVsc2Uge1xuICAgIGlmIChpc0Fycikge1xuICAgICAgdmFyIG9sZEluZGV4ID0gZGVzdC5pbmRleE9mKHZhbHVlKTtcbiAgICAgIC8vIHRoaXMgaXRlbSBuZXZlciBjaGFuZ2VkIGl0cyBwb3NpdGlvblxuICAgICAgaWYgKG9sZEluZGV4ID09PSBpbmRleCkgeyByZXR1cm4gfVxuICAgICAgLy8gcmVtb3ZlIHRoZSBpdGVtIGZyb20gaXRzIG9sZCBwb3NpdGlvblxuICAgICAgaWYgKG9sZEluZGV4ICE9PSAtMSkgeyBkZXN0LnNwbGljZShvbGRJbmRleCwgMSk7IH1cbiAgICAgIC8vIG1vdmUgb3IgYWRkIHRoZSBpdGVtXG4gICAgICBpZiAoaGFzSW5kZXgpIHtcbiAgICAgICAgZGVzdC5zcGxpY2UoaW5kZXgsIDAsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlc3QucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgb2JqW2tleV0gPSBbZGVzdCwgdmFsdWVdOyB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFuIGl0ZW0gZnJvbSBhbiBvYmplY3QgYXQgYSBnaXZlbiBrZXkuIElmIHRoZSBrZXkgcG9pbnRzIHRvIGFuIGFycmF5LFxuICogdGhlbiB0aGUgaXRlbSBpcyBqdXN0IHJlbW92ZWQgZnJvbSB0aGUgYXJyYXkuXG4gKiBAcGFyYW0geyBPYmplY3QgfSBvYmogLSBvYmplY3Qgb24gd2hpY2ggdG8gcmVtb3ZlIHRoZSBwcm9wZXJ0eVxuICogQHBhcmFtIHsgU3RyaW5nIH0ga2V5IC0gcHJvcGVydHkgbmFtZVxuICogQHBhcmFtIHsgT2JqZWN0IH0gdmFsdWUgLSB0aGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5IHRvIGJlIHJlbW92ZWRcbiAqIEBwYXJhbSB7IEJvb2xlYW4gfSBlbnN1cmVBcnJheSAtIGVuc3VyZSB0aGF0IHRoZSBwcm9wZXJ0eSByZW1haW5zIGFuIGFycmF5XG4qL1xuZnVuY3Rpb24gYXJyYXlpc2hSZW1vdmUob2JqLCBrZXksIHZhbHVlLCBlbnN1cmVBcnJheSkge1xuICBpZiAoaXNBcnJheShvYmpba2V5XSkpIHtcbiAgICB2YXIgaW5kZXggPSBvYmpba2V5XS5pbmRleE9mKHZhbHVlKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7IG9ialtrZXldLnNwbGljZShpbmRleCwgMSk7IH1cbiAgICBpZiAoIW9ialtrZXldLmxlbmd0aCkgeyBkZWxldGUgb2JqW2tleV07IH1cbiAgICBlbHNlIGlmIChvYmpba2V5XS5sZW5ndGggPT09IDEgJiYgIWVuc3VyZUFycmF5KSB7IG9ialtrZXldID0gb2JqW2tleV1bMF07IH1cbiAgfSBlbHNlIGlmIChvYmpba2V5XSA9PT0gdmFsdWUpXG4gICAgeyBkZWxldGUgb2JqW2tleV07IH0gLy8gb3RoZXJ3aXNlIGp1c3QgZGVsZXRlIHRoZSBrZXlcbn1cblxuLyoqXG4gKiBNb3VudCBhIHRhZyBjcmVhdGluZyBuZXcgVGFnIGluc3RhbmNlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHJvb3QgLSBkb20gbm9kZSB3aGVyZSB0aGUgdGFnIHdpbGwgYmUgbW91bnRlZFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSB0YWdOYW1lIC0gbmFtZSBvZiB0aGUgcmlvdCB0YWcgd2Ugd2FudCB0byBtb3VudFxuICogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRzIC0gb3B0aW9ucyB0byBwYXNzIHRvIHRoZSBUYWcgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY3R4IC0gb3B0aW9uYWwgY29udGV4dCB0aGF0IHdpbGwgYmUgdXNlZCB0byBleHRlbmQgYW4gZXhpc3RpbmcgY2xhc3MgKCB1c2VkIGluIHJpb3QuVGFnIClcbiAqIEByZXR1cm5zIHsgVGFnIH0gYSBuZXcgVGFnIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIG1vdW50VG8ocm9vdCwgdGFnTmFtZSwgb3B0cywgY3R4KSB7XG4gIHZhciBpbXBsID0gX19UQUdfSU1QTFt0YWdOYW1lXTtcbiAgdmFyIGltcGxDbGFzcyA9IF9fVEFHX0lNUExbdGFnTmFtZV0uY2xhc3M7XG4gIHZhciBjb250ZXh0ID0gY3R4IHx8IChpbXBsQ2xhc3MgPyBPYmplY3QuY3JlYXRlKGltcGxDbGFzcy5wcm90b3R5cGUpIDoge30pO1xuICAvLyBjYWNoZSB0aGUgaW5uZXIgSFRNTCB0byBmaXggIzg1NVxuICB2YXIgaW5uZXJIVE1MID0gcm9vdC5faW5uZXJIVE1MID0gcm9vdC5faW5uZXJIVE1MIHx8IHJvb3QuaW5uZXJIVE1MO1xuICB2YXIgY29uZiA9IGV4dGVuZCh7IHJvb3Q6IHJvb3QsIG9wdHM6IG9wdHMsIGNvbnRleHQ6IGNvbnRleHQgfSwgeyBwYXJlbnQ6IG9wdHMgPyBvcHRzLnBhcmVudCA6IG51bGwgfSk7XG4gIHZhciB0YWc7XG5cbiAgaWYgKGltcGwgJiYgcm9vdCkgeyB0YWcgPSBjcmVhdGVUYWcoaW1wbCwgY29uZiwgaW5uZXJIVE1MKTsgfVxuXG4gIGlmICh0YWcgJiYgdGFnLm1vdW50KSB7XG4gICAgdGFnLm1vdW50KHRydWUpO1xuICAgIC8vIGFkZCB0aGlzIHRhZyB0byB0aGUgdmlydHVhbERvbSB2YXJpYWJsZVxuICAgIGlmICghY29udGFpbnMoX19UQUdTX0NBQ0hFLCB0YWcpKSB7IF9fVEFHU19DQUNIRS5wdXNoKHRhZyk7IH1cbiAgfVxuXG4gIHJldHVybiB0YWdcbn1cblxuLyoqXG4gKiBtYWtlcyBhIHRhZyB2aXJ0dWFsIGFuZCByZXBsYWNlcyBhIHJlZmVyZW5jZSBpbiB0aGUgZG9tXG4gKiBAdGhpcyBUYWdcbiAqIEBwYXJhbSB7IHRhZyB9IHRoZSB0YWcgdG8gbWFrZSB2aXJ0dWFsXG4gKiBAcGFyYW0geyByZWYgfSB0aGUgZG9tIHJlZmVyZW5jZSBsb2NhdGlvblxuICovXG5mdW5jdGlvbiBtYWtlUmVwbGFjZVZpcnR1YWwodGFnLCByZWYpIHtcbiAgdmFyIGZyYWcgPSBjcmVhdGVGcmFnKCk7XG4gIG1ha2VWaXJ0dWFsLmNhbGwodGFnLCBmcmFnKTtcbiAgcmVmLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGZyYWcsIHJlZik7XG59XG5cbi8qKlxuICogQWRkcyB0aGUgZWxlbWVudHMgZm9yIGEgdmlydHVhbCB0YWdcbiAqIEB0aGlzIFRhZ1xuICogQHBhcmFtIHsgTm9kZSB9IHNyYyAtIHRoZSBub2RlIHRoYXQgd2lsbCBkbyB0aGUgaW5zZXJ0aW5nIG9yIGFwcGVuZGluZ1xuICogQHBhcmFtIHsgVGFnIH0gdGFyZ2V0IC0gb25seSBpZiBpbnNlcnRpbmcsIGluc2VydCBiZWZvcmUgdGhpcyB0YWcncyBmaXJzdCBjaGlsZFxuICovXG5mdW5jdGlvbiBtYWtlVmlydHVhbChzcmMsIHRhcmdldCkge1xuICB2YXIgdGhpcyQxID0gdGhpcztcblxuICB2YXIgaGVhZCA9IGNyZWF0ZURPTVBsYWNlaG9sZGVyKCk7XG4gIHZhciB0YWlsID0gY3JlYXRlRE9NUGxhY2Vob2xkZXIoKTtcbiAgdmFyIGZyYWcgPSBjcmVhdGVGcmFnKCk7XG4gIHZhciBzaWI7XG4gIHZhciBlbDtcblxuICB0aGlzLnJvb3QuaW5zZXJ0QmVmb3JlKGhlYWQsIHRoaXMucm9vdC5maXJzdENoaWxkKTtcbiAgdGhpcy5yb290LmFwcGVuZENoaWxkKHRhaWwpO1xuXG4gIHRoaXMuX18uaGVhZCA9IGVsID0gaGVhZDtcbiAgdGhpcy5fXy50YWlsID0gdGFpbDtcblxuICB3aGlsZSAoZWwpIHtcbiAgICBzaWIgPSBlbC5uZXh0U2libGluZztcbiAgICBmcmFnLmFwcGVuZENoaWxkKGVsKTtcbiAgICB0aGlzJDEuX18udmlydHMucHVzaChlbCk7IC8vIGhvbGQgZm9yIHVubW91bnRpbmdcbiAgICBlbCA9IHNpYjtcbiAgfVxuXG4gIGlmICh0YXJnZXQpXG4gICAgeyBzcmMuaW5zZXJ0QmVmb3JlKGZyYWcsIHRhcmdldC5fXy5oZWFkKTsgfVxuICBlbHNlXG4gICAgeyBzcmMuYXBwZW5kQ2hpbGQoZnJhZyk7IH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gYSB0ZW1wb3JhcnkgY29udGV4dCBjb250YWluaW5nIGFsc28gdGhlIHBhcmVudCBwcm9wZXJ0aWVzXG4gKiBAdGhpcyBUYWdcbiAqIEBwYXJhbSB7IFRhZyB9IC0gdGVtcG9yYXJ5IHRhZyBjb250ZXh0IGNvbnRhaW5pbmcgYWxsIHRoZSBwYXJlbnQgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBpbmhlcml0UGFyZW50UHJvcHMoKSB7XG4gIGlmICh0aGlzLnBhcmVudCkgeyByZXR1cm4gZXh0ZW5kKE9iamVjdC5jcmVhdGUodGhpcyksIHRoaXMucGFyZW50KSB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogTW92ZSB2aXJ0dWFsIHRhZyBhbmQgYWxsIGNoaWxkIG5vZGVzXG4gKiBAdGhpcyBUYWdcbiAqIEBwYXJhbSB7IE5vZGUgfSBzcmMgIC0gdGhlIG5vZGUgdGhhdCB3aWxsIGRvIHRoZSBpbnNlcnRpbmdcbiAqIEBwYXJhbSB7IFRhZyB9IHRhcmdldCAtIGluc2VydCBiZWZvcmUgdGhpcyB0YWcncyBmaXJzdCBjaGlsZFxuICovXG5mdW5jdGlvbiBtb3ZlVmlydHVhbChzcmMsIHRhcmdldCkge1xuICB2YXIgdGhpcyQxID0gdGhpcztcblxuICB2YXIgZWwgPSB0aGlzLl9fLmhlYWQ7XG4gIHZhciBzaWI7XG4gIHZhciBmcmFnID0gY3JlYXRlRnJhZygpO1xuXG4gIHdoaWxlIChlbCkge1xuICAgIHNpYiA9IGVsLm5leHRTaWJsaW5nO1xuICAgIGZyYWcuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIGVsID0gc2liO1xuICAgIGlmIChlbCA9PT0gdGhpcyQxLl9fLnRhaWwpIHtcbiAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgc3JjLmluc2VydEJlZm9yZShmcmFnLCB0YXJnZXQuX18uaGVhZCk7XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEdldCBzZWxlY3RvcnMgZm9yIHRhZ3NcbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSB0YWdzIC0gdGFnIG5hbWVzIHRvIHNlbGVjdFxuICogQHJldHVybnMgeyBTdHJpbmcgfSBzZWxlY3RvclxuICovXG5mdW5jdGlvbiBzZWxlY3RUYWdzKHRhZ3MpIHtcbiAgLy8gc2VsZWN0IGFsbCB0YWdzXG4gIGlmICghdGFncykge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoX19UQUdfSU1QTCk7XG4gICAgcmV0dXJuIGtleXMgKyBzZWxlY3RUYWdzKGtleXMpXG4gIH1cblxuICByZXR1cm4gdGFnc1xuICAgIC5maWx0ZXIoZnVuY3Rpb24gKHQpIHsgcmV0dXJuICEvW14tXFx3XS8udGVzdCh0KTsgfSlcbiAgICAucmVkdWNlKGZ1bmN0aW9uIChsaXN0LCB0KSB7XG4gICAgICB2YXIgbmFtZSA9IHQudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICByZXR1cm4gbGlzdCArIFwiLFtcIiArIElTX0RJUkVDVElWRSArIFwiPVxcXCJcIiArIG5hbWUgKyBcIlxcXCJdXCJcbiAgICB9LCAnJylcbn1cblxuXG52YXIgdGFncyA9IE9iamVjdC5mcmVlemUoe1xuXHRnZXRUYWc6IGdldFRhZyxcblx0bW92ZUNoaWxkVGFnOiBtb3ZlQ2hpbGRUYWcsXG5cdGluaXRDaGlsZFRhZzogaW5pdENoaWxkVGFnLFxuXHRnZXRJbW1lZGlhdGVDdXN0b21QYXJlbnRUYWc6IGdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyxcblx0dW5tb3VudEFsbDogdW5tb3VudEFsbCxcblx0Z2V0VGFnTmFtZTogZ2V0VGFnTmFtZSxcblx0YXJyYXlpc2hBZGQ6IGFycmF5aXNoQWRkLFxuXHRhcnJheWlzaFJlbW92ZTogYXJyYXlpc2hSZW1vdmUsXG5cdG1vdW50VG86IG1vdW50VG8sXG5cdG1ha2VSZXBsYWNlVmlydHVhbDogbWFrZVJlcGxhY2VWaXJ0dWFsLFxuXHRtYWtlVmlydHVhbDogbWFrZVZpcnR1YWwsXG5cdGluaGVyaXRQYXJlbnRQcm9wczogaW5oZXJpdFBhcmVudFByb3BzLFxuXHRtb3ZlVmlydHVhbDogbW92ZVZpcnR1YWwsXG5cdHNlbGVjdFRhZ3M6IHNlbGVjdFRhZ3Ncbn0pO1xuXG4vKipcbiAqIFJpb3QgcHVibGljIGFwaVxuICovXG52YXIgc2V0dGluZ3MgPSBzZXR0aW5ncyQxO1xudmFyIHV0aWwgPSB7XG4gIHRtcGw6IHRtcGwsXG4gIGJyYWNrZXRzOiBicmFja2V0cyxcbiAgc3R5bGVNYW5hZ2VyOiBzdHlsZU1hbmFnZXIsXG4gIHZkb206IF9fVEFHU19DQUNIRSxcbiAgc3R5bGVOb2RlOiBzdHlsZU1hbmFnZXIuc3R5bGVOb2RlLFxuICAvLyBleHBvcnQgdGhlIHJpb3QgaW50ZXJuYWwgdXRpbHMgYXMgd2VsbFxuICBkb206IGRvbSxcbiAgY2hlY2s6IGNoZWNrLFxuICBtaXNjOiBtaXNjLFxuICB0YWdzOiB0YWdzXG59O1xuXG4vLyBleHBvcnQgdGhlIGNvcmUgcHJvcHMvbWV0aG9kc1xudmFyIFRhZyA9IFRhZyQxO1xudmFyIHRhZyA9IHRhZyQxO1xudmFyIHRhZzIgPSB0YWcyJDE7XG52YXIgbW91bnQgPSBtb3VudCQxO1xudmFyIG1peGluID0gbWl4aW4kMTtcbnZhciB1cGRhdGUgPSB1cGRhdGUkMTtcbnZhciB1bnJlZ2lzdGVyID0gdW5yZWdpc3RlciQxO1xudmFyIHZlcnNpb24gPSB2ZXJzaW9uJDE7XG52YXIgb2JzZXJ2YWJsZSA9IG9ic2VydmFibGUkMTtcblxudmFyIHJpb3QkMSA9IGV4dGVuZCh7fSwgY29yZSwge1xuICBvYnNlcnZhYmxlOiBvYnNlcnZhYmxlJDEsXG4gIHNldHRpbmdzOiBzZXR0aW5ncyxcbiAgdXRpbDogdXRpbCxcbn0pO1xuXG5leHBvcnRzLnNldHRpbmdzID0gc2V0dGluZ3M7XG5leHBvcnRzLnV0aWwgPSB1dGlsO1xuZXhwb3J0cy5UYWcgPSBUYWc7XG5leHBvcnRzLnRhZyA9IHRhZztcbmV4cG9ydHMudGFnMiA9IHRhZzI7XG5leHBvcnRzLm1vdW50ID0gbW91bnQ7XG5leHBvcnRzLm1peGluID0gbWl4aW47XG5leHBvcnRzLnVwZGF0ZSA9IHVwZGF0ZTtcbmV4cG9ydHMudW5yZWdpc3RlciA9IHVucmVnaXN0ZXI7XG5leHBvcnRzLnZlcnNpb24gPSB2ZXJzaW9uO1xuZXhwb3J0cy5vYnNlcnZhYmxlID0gb2JzZXJ2YWJsZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHJpb3QkMTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Jpb3QvcmlvdC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgcmlvdCBmcm9tICdyaW90JztcbmltcG9ydCAncmlvdC1ob3QtcmVsb2FkJztcbmltcG9ydCAnLi9hcHAudGFnJztcblxucmlvdC5tb3VudCgneC1hcHAnLCB7XG4gICAgdGl0bGU6ICdSaW90SlMnLFxuICAgIG9wdGlvbnM6IFtcbiAgICAgICAgJ2VzNicsXG4gICAgICAgICdzdHlsdXMnLFxuICAgICAgICAnaG90bG9hZCcsXG4gICAgXVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWFpbi5qcyIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cywgcmVxdWlyZSgncmlvdCcpKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnLCAncmlvdCddLCBmYWN0b3J5KSA6XG5cdChmYWN0b3J5KChnbG9iYWwucmlvdEhvdFJlbG9hZCA9IGdsb2JhbC5yaW90SG90UmVsb2FkIHx8IHt9KSxnbG9iYWwucmlvdCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMscmlvdCkgeyAndXNlIHN0cmljdCc7XG5cbnZhciBub25TdGF0ZSA9ICdpc01vdW50ZWQgb3B0cycuc3BsaXQoJyAnKTtcblxuZnVuY3Rpb24gcmVsb2FkKG5hbWUpIHtcbiAgcmlvdC51dGlsLnN0eWxlTWFuYWdlci5pbmplY3QoKTtcblxuICB2YXIgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKChuYW1lICsgXCIsIFtkYXRhLWlzPVwiICsgbmFtZSArIFwiXVwiKSk7XG4gIHZhciB0YWdzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbCA9IGVsZW1zW2ldLCBvbGRUYWcgPSBlbC5fdGFnLCB2O1xuICAgIHJlbG9hZC50cmlnZ2VyKCdiZWZvcmUtdW5tb3VudCcsIG9sZFRhZyk7XG4gICAgb2xkVGFnLnVubW91bnQodHJ1ZSk7IC8vIGRldGFjaCB0aGUgb2xkIHRhZ1xuXG4gICAgLy8gcmVzZXQgdGhlIGlubmVySFRNTCBhbmQgYXR0cmlidXRlcyB0byBob3cgdGhleSB3ZXJlIGJlZm9yZSBtb3VudFxuICAgIGVsLmlubmVySFRNTCA9IG9sZFRhZy5fXy5pbm5lckhUTUw7XG4gICAgKG9sZFRhZy5fXy5pbnN0QXR0cnMgfHwgW10pLm1hcChmdW5jdGlvbihhdHRyKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTtcbiAgICB9KTtcblxuICAgIC8vIGNvcHkgb3B0aW9ucyBmb3IgY3JlYXRpbmcgdGhlIG5ldyB0YWdcbiAgICB2YXIgbmV3T3B0cyA9IHt9O1xuICAgIGZvcihrZXkgaW4gb2xkVGFnLm9wdHMpIHtcbiAgICAgIG5ld09wdHNba2V5XSA9IG9sZFRhZy5vcHRzW2tleV07XG4gICAgfVxuICAgIG5ld09wdHMucGFyZW50ID0gb2xkVGFnLnBhcmVudDtcblxuICAgIC8vIGNyZWF0ZSB0aGUgbmV3IHRhZ1xuICAgIHJlbG9hZC50cmlnZ2VyKCdiZWZvcmUtbW91bnQnLCBuZXdPcHRzLCBvbGRUYWcpO1xuICAgIHZhciBuZXdUYWcgPSByaW90Lm1vdW50KGVsLCBuZXdPcHRzKVswXTtcblxuICAgIC8vIGNvcHkgc3RhdGUgZnJvbSB0aGUgb2xkIHRvIG5ldyB0YWdcbiAgICBmb3IodmFyIGtleSBpbiBvbGRUYWcpIHtcbiAgICAgIHYgPSBvbGRUYWdba2V5XTtcbiAgICAgIGlmICh+bm9uU3RhdGUuaW5kZXhPZihrZXkpKSB7IGNvbnRpbnVlIH1cbiAgICAgIG5ld1RhZ1trZXldID0gdjtcbiAgICB9XG4gICAgbmV3VGFnLnVwZGF0ZSgpO1xuICAgIHRhZ3MucHVzaChuZXdUYWcpO1xuICAgIHJlbG9hZC50cmlnZ2VyKCdhZnRlci1tb3VudCcsIG5ld1RhZywgb2xkVGFnKTtcbiAgfVxuXG4gIHJldHVybiB0YWdzXG59XG5cbnJpb3Qub2JzZXJ2YWJsZShyZWxvYWQpO1xucmlvdC5yZWxvYWQgPSByZWxvYWQ7XG5pZiAocmlvdC5kZWZhdWx0KSB7IHJpb3QuZGVmYXVsdC5yZWxvYWQgPSByZWxvYWQ7IH1cblxuZXhwb3J0cy5yZWxvYWQgPSByZWxvYWQ7XG5leHBvcnRzWydkZWZhdWx0J10gPSByZWxvYWQ7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9yaW90LWhvdC1yZWxvYWQvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiPHgtYXBwPlxuICAgIDxoMT57IHRpdGxlIH08L2gxPlxuICAgIFxuICAgIDx1bD5cbiAgICAgICAgPGxpIGVhY2g9eyBvcHRpb24gaW4gb3B0cy5vcHRpb25zIH0+XG4gICAgICAgICAgICB7IG9wdGlvbiB9XG4gICAgICAgIDwvbGk+XG4gICAgPC91bD5cbjwveC1hcHA+XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYXBwLnRhZyJdLCJzb3VyY2VSb290IjoiIn0=