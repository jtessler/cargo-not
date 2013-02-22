/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn');

goog.require('cn.controller');
goog.require('cn.model.Command');
goog.require('goog.array');
goog.require('goog.fx.anim');
goog.require('goog.graphics.CanvasGraphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.main = function() {
  var game = new cn.model.Game();
  game.program.init(5);
  game.program.addCommand(0, 0, cn.model.Command.DOWN);
  game.program.addCommand(0, 1, cn.model.Command.RIGHT);
  game.program.addCommand(0, 2, cn.model.Command.DOWN);
  game.program.addCommand(0, 3, cn.model.Command.LEFT);
  game.program.addCommand(0, 4, cn.model.Command.F0);
  var animator = new cn.view.Animator();
  animator.render(game);
  goog.fx.anim.registerAnimation(animator);
  cn.controller.play(game, animator);
};
goog.exportSymbol('main', cn.main);
