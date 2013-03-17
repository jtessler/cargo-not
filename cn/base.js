/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn');

goog.require('cn.controller');


/**
 * Sets up the UI and initializes all game code.
 */
cn.main = function() {
  cn.controller.init();
};
goog.exportSymbol('main', cn.main);
