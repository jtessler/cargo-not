/**
 * @fileoverview The stateless controller functions.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.controller');

goog.require('cn.model.Command');
goog.require('cn.model.Game');
goog.require('cn.ui.GameUi');
goog.require('goog.dom');
goog.require('goog.net.XhrIo');


/**
 * Initializes everything and renders the DOM.
 */
cn.controller.init = function() {
  var game = new cn.model.Game();
  var ui = new cn.ui.GameUi(game);
  ui.render();
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.ui.GameUi} ui A pointer to the UI.
 */
cn.controller.play = function(game, ui) {
  if (game.level.equals(game.goal)) {
    // TODO(joseph): Handle winning differently.
    var stars = game.getStars();
    game.log.record('won ' + stars + ' stars');
    alert('You won with ' + stars + ' stars!');
    return;
  }
  var command = game.program.next(game.bot);
  ui.programEditor.highlightExecution();
  if (goog.isDefAndNotNull(command)) {
    switch (command) {
      case cn.model.Command.LEFT:
        cn.controller.moveLeft(game, ui);
        break;
      case cn.model.Command.RIGHT:
        cn.controller.moveRight(game, ui);
        break;
      case cn.model.Command.DOWN:
        cn.controller.moveDown(game, ui);
        break;
      case cn.model.Command.F0:
      case cn.model.Command.F1:
      case cn.model.Command.F2:
      case cn.model.Command.F3:
        cn.controller.play(game, ui);
        break;
      default:
        throw Error('Animation not implemented for "' + command + '"');
    }
  }
};


/**
 * @param {!cn.ui.GameUi} ui A pointer to the UI.
 */
cn.controller.pause = function(ui) {
  ui.animatedCanvas.pause();
};


/**
 * @param {!cn.ui.GameUi} ui A pointer to the UI.
 */
cn.controller.resume = function(ui) {
  ui.animatedCanvas.resume();
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.ui.GameUi} ui A pointer to the UI.
 */
cn.controller.moveLeft = function(game, ui) {
  if (game.bot.position == 0) {
    // TODO(joseph): Add a cleaner error notification.
    alert('Cannot move the bot any further left.');
    return;
  }
  var nextStack = game.level.stacks[game.bot.position - 1];
  ui.animatedCanvas.attachAnimation(
      function() { return game.bot.getX() > nextStack.getX(); },
      function() { game.bot.translate(-game.bot.speed, 0); },
      function() {
        game.bot.setPosition(nextStack.getX(), game.bot.getY());
        game.bot.position--;
        cn.controller.play(game, ui);
      });
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.ui.GameUi} ui A pointer to the UI.
 */
cn.controller.moveRight = function(game, ui) {
  if (game.bot.position == game.level.stacks.length - 1) {
    // TODO(joseph): Add a cleaner error notification.
    alert('Cannot move the bot any further right.');
    return;
  }
  var nextStack = game.level.stacks[game.bot.position + 1];
  ui.animatedCanvas.attachAnimation(
      function() { return game.bot.getX() < nextStack.getX(); },
      function() { game.bot.translate(game.bot.speed, 0); },
      function() {
        game.bot.setPosition(nextStack.getX(), game.bot.getY());
        game.bot.position++;
        cn.controller.play(game, ui);
      });
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.ui.GameUi} ui A pointer to the UI.
 */
cn.controller.moveDown = function(game, ui) {
  var startingY = game.bot.getY();
  var stack = game.level.stacks[game.bot.position];
  ui.animatedCanvas.attachAnimation(
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
        cn.controller.moveUp(game, ui, startingY);
      });
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.ui.GameUi} ui A pointer to the UI.
 * @param {number} endingY The y value to move the bot to.
 */
cn.controller.moveUp = function(game, ui, endingY) {
  ui.animatedCanvas.attachAnimation(
      function() { return game.bot.getY() > endingY; },
      function() { game.bot.translate(0, -game.bot.speed); },
      function() {
        game.bot.setPosition(game.bot.getX(), endingY);
        cn.controller.play(game, ui);
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
 * @param {!cn.ui.GameUi} ui A pointer to the UI.
 */
cn.controller.reset = function(game, ui) {
  game.reset();
  ui.animatedCanvas.clear();
  ui.animatedCanvas.drawPathModel(game);
  ui.controls.reset();
  ui.programEditor.unhighlightExecution();
};


/**
 * @param {!cn.model.Game} game The current game.
 * @param {!cn.ui.GameUi} ui A pointer to the UI.
 */
cn.controller.clearProgram = function(game, ui) {
  game.log.record('cleared registers');
  game.program.clear();
  ui.programEditor.clear();
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
 * @param {!cn.ui.GameUi} ui A pointer to the UI.
 * @param {string} name The level name.
 * @param {!cn.LevelData} levelData The new bot speed.
 */
cn.controller.loadLevel = function(game, ui, name, levelData) {
  cn.controller.sendLog(game);
  game.loadLevel(levelData);
  ui.goalCanvas.clear();
  ui.goalCanvas.drawPathModel(game.goal);
  ui.programEditor.init();
  cn.controller.reset(game, ui);
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
