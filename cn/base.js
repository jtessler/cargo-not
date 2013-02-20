/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn');

goog.require('cn.model.Game');
goog.require('cn.view.Scene');
goog.require('goog.array');
goog.require('goog.fx.anim');
goog.require('goog.graphics.CanvasGraphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.main = function() {
  var game = new cn.model.Game();
  var scene = new cn.view.Scene();
  scene.render(game);
  goog.fx.anim.registerAnimation(scene);
};
goog.exportSymbol('main', cn.main);
