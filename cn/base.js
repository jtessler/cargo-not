/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn');

goog.require('cn.controller');
goog.require('cn.model.Command');
goog.require('cn.view.Animator');
goog.require('cn.view.ProgramEditor');
goog.require('goog.array');
goog.require('goog.graphics.CanvasGraphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.main = function() {
  var game = new cn.model.Game();
  game.program.init(8, 8, 8, 5);
  game.program.addCommand(0, 0, cn.model.Command.DOWN);
  game.program.addCommand(0, 1, cn.model.Command.RIGHT);
  game.program.addCommand(0, 2, cn.model.Command.DOWN);
  game.program.addCommand(0, 3, cn.model.Command.LEFT);
  game.program.addCommand(0, 4, cn.model.Command.F0);
  var animator = new cn.view.Animator();
  animator.render(game);
  var editor = new cn.view.ProgramEditor(game, animator);
};
goog.exportSymbol('main', cn.main);
