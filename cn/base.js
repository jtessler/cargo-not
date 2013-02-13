/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.base');

goog.require('cn.model.Bot');
goog.require('cn.view.Canvas');
goog.require('goog.fx.anim');
goog.require('goog.graphics.CanvasGraphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.base.main = function() {
  var canvas = new cn.view.Canvas();
  var bot = new cn.model.Bot();

  canvas.render(bot);
  goog.fx.anim.registerAnimation(canvas);
};
goog.exportSymbol('main', cn.base.main);
