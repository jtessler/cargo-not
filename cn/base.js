/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.base');

goog.require('cn.model.Bot');
goog.require('cn.view.canvas');
goog.require('goog.graphics.CanvasGraphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.base.main = function() {
  var canvas = new goog.graphics.CanvasGraphics(500, 500);
  canvas.render();
  var bot = new cn.model.Bot();

  cn.view.canvas.init(canvas, bot);
};
goog.exportSymbol('main', cn.base.main);
