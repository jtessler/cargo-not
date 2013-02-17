/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn');

goog.require('cn.model.Bot');
goog.require('cn.model.Cargo');
goog.require('cn.model.CargoColor');
goog.require('cn.model.Stack');
goog.require('cn.view.Scene');
goog.require('goog.fx.anim');
goog.require('goog.graphics.CanvasGraphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.main = function() {
  var scene = new cn.view.Scene();
  var bot = new cn.model.Bot(40, 30);
  var stack = new cn.model.Stack(40, 10);
  var col = cn.model.CargoColor;
  stack.addCargo(new cn.model.Cargo(20, col.RED));
  stack.addCargo(new cn.model.Cargo(20, col.GREEN));
  stack.addCargo(new cn.model.Cargo(20, col.BLUE));
  stack.addCargo(new cn.model.Cargo(20, col.YELLOW));

  scene.render(bot, stack);
  goog.fx.anim.registerAnimation(scene);
};
goog.exportSymbol('main', cn.main);
