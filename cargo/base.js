/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cargo.base');

goog.require('goog.dom');

cargo.base.init = function() {
  var node = goog.dom.createTextNode("Hello, World!");
  goog.dom.appendChild(document.body, node);
};
goog.exportSymbol('init', cargo.base.init);
