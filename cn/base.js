/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.base');

goog.require('cn.model.Bot');
goog.require('cn.model.CargoGreen');
goog.require('cn.model.Stack');
goog.require('cn.view.Scene');
goog.require('goog.fx.anim');
goog.require('goog.graphics.CanvasGraphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.base.main = function() {
  var scene = new cn.view.Scene();
  var bot = new cn.model.Bot();
  var stack = new cn.model.Stack();
  stack.add(new cn.model.CargoGreen());

  scene.render(bot, stack);
  goog.fx.anim.registerAnimation(scene);
};
goog.exportSymbol('main', cn.base.main);
