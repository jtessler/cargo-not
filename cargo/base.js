/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cargo.base');

goog.require('goog.dom');


/**
 * Sets up the UI and initializes all game code.
 */
cargo.base.main = function() {
  var node = goog.dom.createTextNode('Hello, World!');
  goog.dom.appendChild(goog.dom.getDocument().body, node);
};
goog.exportSymbol('main', cargo.base.main);
