/**
 * @fileoverview The stateless controller functions.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.controller');

goog.require('cn.model.Command');
goog.require('cn.model.Game');
goog.require('cn.view.Animator');


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.view.Animator} animator The animator in which to draw bot and
 *     cargo animations.
 * @param {!cn.view.ProgramEditor} editor The program editor to highlight
 *     registers as they're executed.
 */
cn.controller.play = function(game, animator, editor) {
  var command = game.program.next(game.bot);
  if (goog.isDefAndNotNull(command)) {
    editor.highlightExecution(game.program);
    switch (command) {
      case cn.model.Command.LEFT:
        cn.controller.moveLeft(game, animator, editor);
        break;
      case cn.model.Command.RIGHT:
        cn.controller.moveRight(game, animator, editor);
        break;
      case cn.model.Command.DOWN:
        cn.controller.moveDown(game, animator, editor);
        break;
      case cn.model.Command.F0:
      case cn.model.Command.F1:
      case cn.model.Command.F2:
      case cn.model.Command.F3:
        cn.controller.play(game, animator, editor);
        break;
      default:
        throw Error('Animation not implemented for "' + command + '"');
    }
  }
};


/**
 * @param {!cn.view.Animator} animator The animator to pause.
 */
cn.controller.pause = function(animator) {
  animator.pause();
};


/**
 * @param {!cn.view.Animator} animator The animator to resume.
 */
cn.controller.resume = function(animator) {
  animator.resume();
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.view.Animator} animator The animator in which to draw bot and
 *     cargo animations.
 * @param {!cn.view.ProgramEditor} editor The program editor to highlight
 *     registers as they're executed.
 */
cn.controller.moveLeft = function(game, animator, editor) {
  var nextStack = game.level.stacks[game.bot.position - 1];
  animator.attachAnimation(
      function() { return game.bot.getX() > nextStack.getX(); },
      function() { game.bot.translate(-1, 0); },
      function() {
        game.bot.position--;
        cn.controller.play(game, animator, editor);
      });
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.view.Animator} animator The animator in which to draw bot and
 *     cargo animations.
 * @param {!cn.view.ProgramEditor} editor The program editor to highlight
 *     registers as they're executed.
 */
cn.controller.moveRight = function(game, animator, editor) {
  var nextStack = game.level.stacks[game.bot.position + 1];
  animator.attachAnimation(
      function() { return game.bot.getX() < nextStack.getX(); },
      function() { game.bot.translate(1, 0); },
      function() {
        game.bot.position++;
        cn.controller.play(game, animator, editor);
      });
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.view.Animator} animator The animator in which to draw bot and
 *     cargo animations.
 * @param {!cn.view.ProgramEditor} editor The program editor to highlight
 *     registers as they're executed.
 */
cn.controller.moveDown = function(game, animator, editor) {
  var startingY = game.bot.getY();
  var stack = game.level.stacks[game.bot.position];
  animator.attachAnimation(
      function() {
        if (stack.size() > 0) {
          return game.bot.hasCargo() ?
              game.bot.getY() < stack.getTopCargo().getY() - game.bot.height :
              game.bot.getInnerY() < stack.getTopCargo().getY();
        }
        return game.bot.getY() < stack.getY() - game.bot.height;
      },
      function() { game.bot.translate(0, 1); },
      function() {
        if (game.bot.hasCargo()) {
          stack.addCargo(game.bot.detachCargo());
        } else if (stack.size() > 0) {
          game.bot.attachCargo(stack.liftCargo());
        }
        cn.controller.moveUp(game, animator, editor, startingY);
      });
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.view.Animator} animator The animator in which to draw bot and
 *     cargo animations.
 * @param {!cn.view.ProgramEditor} editor The program editor to highlight
 *     registers as they're executed.
 * @param {number} endingY The y value to move the bot to.
 */
cn.controller.moveUp = function(game, animator, editor, endingY) {
  animator.attachAnimation(
      function() { return game.bot.getY() > endingY; },
      function() { game.bot.translate(0, -1); },
      function() {
        cn.controller.play(game, animator, editor);
      });
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {number} f The function to add the command to.
 * @param {number} i The position in the function to add the command to.
 * @param {!cn.model.Command} command The command.
 */
cn.controller.setCommand = function(game, f, i, command) {
  game.program.addCommand(f, i, command);
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {number} f The function to remove the command from.
 * @param {number} i The position in the function to remove the command from.
 */
cn.controller.removeCommand = function(game, f, i) {
  game.program.removeCommand(f, i);
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.view.Animator} animator The animator to reset.
 * @param {!cn.view.ProgramEditor} editor The program editor from which to
 *     unhighlight registers.
 */
cn.controller.reset = function(game, animator, editor) {
  animator.detachAnimation();
  game.reset();
  animator.reRender(game);
  editor.unhighlightExecution();
};
