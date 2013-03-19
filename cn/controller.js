/**
 * @fileoverview The stateless controller functions.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.controller');

goog.require('cn.model.Command');
goog.require('cn.model.Game');
goog.require('cn.view.Animator');
goog.require('cn.view.Goal');
goog.require('cn.view.LevelSelector');
goog.require('cn.view.ProgramEditor');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.net.XhrIo');


/**
 * Initializes everything and renders the DOM.
 */
cn.controller.init = function() {
  var id = prompt('Enter your student ID') || 'unknown';
  var center = goog.dom.createDom('center');
  var game = new cn.model.Game();
  game.id = id;
  var goal = new cn.view.Goal(center);
  var animator = new cn.view.Animator(center);
  var editor = new cn.view.ProgramEditor(game, animator, center);
  new cn.view.LevelSelector(game, goal, animator, editor, center);
  goog.dom.appendChild(goog.dom.getDocument().body, center);

  goal.render(game);
  animator.render(game);

  // Add an "on close" event to send the last log.
  goog.events.listen(window, goog.events.EventType.BEFOREUNLOAD, function(e) {
    cn.controller.sendLog(game);
  });
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.view.Animator} animator The animator in which to draw bot and
 *     cargo animations.
 * @param {!cn.view.ProgramEditor} editor The program editor to highlight
 *     registers as they're executed.
 */
cn.controller.play = function(game, animator, editor) {
  if (game.level.equals(game.goal)) {
    // TODO(joseph): Handle winning differently.
    var stars = game.getStars();
    game.log.record('won ' + stars + ' stars');
    alert('You won with ' + stars + ' stars!');
    return;
  }
  var command = game.program.next(game.bot);
  editor.highlightExecution(game.program);
  if (goog.isDefAndNotNull(command)) {
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
  if (game.bot.position == 0) {
    // TODO(joseph): Add a cleaner error notification.
    alert('Cannot move the bot any further left.');
    return;
  }
  var nextStack = game.level.stacks[game.bot.position - 1];
  animator.attachAnimation(
      function() { return game.bot.getX() > nextStack.getX(); },
      function() { game.bot.translate(-game.bot.speed, 0); },
      function() {
        game.bot.setPosition(nextStack.getX(), game.bot.getY());
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
  if (game.bot.position == game.level.stacks.length - 1) {
    // TODO(joseph): Add a cleaner error notification.
    alert('Cannot move the bot any further right.');
    return;
  }
  var nextStack = game.level.stacks[game.bot.position + 1];
  animator.attachAnimation(
      function() { return game.bot.getX() < nextStack.getX(); },
      function() { game.bot.translate(game.bot.speed, 0); },
      function() {
        game.bot.setPosition(nextStack.getX(), game.bot.getY());
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
        if (game.bot.hasCargo() || stack.size() == 0) {
          return game.bot.getY() < stack.getMaxY() - game.bot.height;
        }
        return game.bot.getInnerY() < stack.getMaxY();
      },
      function() { game.bot.translate(0, game.bot.speed); },
      function() {
        if (game.bot.hasCargo()) {
          stack.addCargo(game.bot.detachCargo());
        } else if (stack.size() > 0) {
          game.bot.attachCargo(stack.liftCargo());
        }
        game.bot.setPosition(
            game.bot.getX(),
            game.bot.hasCargo() || stack.size() == 0 ?
                stack.getMaxY() - game.bot.height :
                stack.getMaxY() + game.bot.getY() - game.bot.getInnerY());
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
      function() { game.bot.translate(0, -game.bot.speed); },
      function() {
        game.bot.setPosition(game.bot.getX(), endingY);
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
  game.log.record('set command [' + f + '][' + i + '] to ' + command);
  game.program.functions[f][i].command = command;
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {number} f The function to remove the command from.
 * @param {number} i The position in the function to remove the command from.
 */
cn.controller.removeCommand = function(game, f, i) {
  game.log.record('removed command [' + f + '][' + i + ']');
  game.program.functions[f][i].command = null;
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {number} f The function to add the condition to.
 * @param {number} i The position in the function to add the condition to.
 * @param {!cn.model.Condition} condition The condition.
 */
cn.controller.setCondition = function(game, f, i, condition) {
  game.log.record('set condition [' + f + '][' + i + '] to ' + condition);
  game.program.functions[f][i].condition = condition;
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {number} f The function to remove the condition from.
 * @param {number} i The position in the function to remove the condition from.
 */
cn.controller.removeCondition = function(game, f, i) {
  game.log.record('removed condition [' + f + '][' + i + ']');
  game.program.functions[f][i].condition = null;
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
  animator.render(game);
  editor.unhighlightExecution();
  editor.resetButtons();
};


/**
 * @param {!cn.model.Game} game The current game.
 */
cn.controller.clearProgram = function(game) {
  game.log.record('cleared registers');
  game.program.clear();
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {number} speed The new bot speed.
 */
cn.controller.setBotSpeed = function(game, speed) {
  game.bot.speed = speed;
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.view.Goal} goal The goal configuration to re-render.
 * @param {!cn.view.Animator} animator The animator to re-render.
 * @param {!cn.view.ProgramEditor} editor The program editor to clear and setup.
 * @param {string} name The level name.
 * @param {!cn.LevelData} levelData The new bot speed.
 */
cn.controller.loadLevel = function(
    game, goal, animator, editor, name, levelData) {
  cn.controller.sendLog(game);
  cn.controller.reset(game, animator, editor);
  game.loadLevel(levelData);
  goal.render(game);
  animator.render(game);
  editor.initRegisters(game.program);
  game.log.record('loaded level ' + name);
};


/**
 * @param {!cn.model.Game} game The current game.
 */
cn.controller.sendLog = function(game) {
  // Don't send meaningless logs.
  if (game.log.size() > 3) {
    game.log.setId(game.id);
    goog.net.XhrIo.send('/users/joseph/log.php', null, 'POST',
        game.log.serialize(), {'content-type': 'application/json'});
  }
  game.log.clear();
};
