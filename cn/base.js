/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.base');

goog.require('cn.model.Bot');
goog.require('cn.view.Scene');
goog.require('goog.fx.anim');
goog.require('goog.graphics.CanvasGraphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.base.main = function() {
  var scene = new cn.view.Scene();
  var bot = new cn.model.Bot();

  scene.render(bot);
  goog.fx.anim.registerAnimation(scene);
};
goog.exportSymbol('main', cn.base.main);
