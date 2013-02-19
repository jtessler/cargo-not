/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn');

goog.require('cn.model.Bot');
goog.require('cn.model.Cargo');
goog.require('cn.model.CargoColor');
goog.require('cn.model.Level');
goog.require('cn.model.Program');
goog.require('cn.model.Stack');
goog.require('cn.view.Scene');
goog.require('goog.array');
goog.require('goog.fx.anim');
goog.require('goog.graphics.CanvasGraphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.main = function() {
  var stacks = [new cn.model.Stack(40, 10),
                new cn.model.Stack(40, 10),
                new cn.model.Stack(40, 10)];
  goog.array.forEach(
      stacks,
      function(stack) {
        var col = cn.model.CargoColor;
        stack.addCargo(new cn.model.Cargo(20, col.RED));
        stack.addCargo(new cn.model.Cargo(20, col.GREEN));
        stack.addCargo(new cn.model.Cargo(20, col.BLUE));
        stack.addCargo(new cn.model.Cargo(20, col.YELLOW));
      });

  var program = new cn.model.Program();
  var level = new cn.model.Level(10, 30, stacks, stacks);
  var bot = new cn.model.Bot(20);
  bot.attachCargo(new cn.model.Cargo(20, cn.model.CargoColor.GREEN));
  var scene = new cn.view.Scene();
  scene.render(bot, level);
  goog.fx.anim.registerAnimation(scene);
};
goog.exportSymbol('main', cn.main);
