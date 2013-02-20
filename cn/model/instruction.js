/**
 * @fileoverview The lists of actions that determine the bot's behavior.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Command');
goog.provide('cn.model.Condition');
goog.provide('cn.model.Instruction');


/**
 * Enum for all possible program commands.
 * @enum {string}
 */
cn.model.Command = {
  LEFT: 'move the bot left',
  RIGHT: 'move the bot right',
  DOWN: 'drop or pickup cargo',
  F0: 'move to program f0',
  F1: 'move to program f1',
  F2: 'move to program f2',
  F3: 'move to program f3'
};


/**
 * Enum for all possible program conditionals.
 * @enum {string}
 */
cn.model.Condition = {
  NONE: 'if the bot has no cargo',
  ANY: 'if the bot has any cargo',
  RED: 'if the bot has red cargo',
  GREEN: 'if the bot has green cargo',
  BLUE: 'if the bot has blue cargo',
  YELLOW: 'if the bot has yellow cargo'
};



/**
 * @constructor
 */
cn.model.Instruction = function() {
  this.command = null;
  this.condition = null;
};


/** @type {?cn.model.Command} */
cn.model.Instruction.prototype.command;


/** @type {?cn.model.Condition} */
cn.model.Instruction.prototype.condition;


/** @return {boolean} True if the instruction has a command. */
cn.model.Instruction.prototype.hasCommand = function() {
  return goog.isDefAndNotNull(this.command);
};


/**
 * @param {!cn.model.Bot} bot The bot to test the condition against.
 * @return {boolean} True if there is no condition or the given bot passes the
 *     condition.
 */
cn.model.Instruction.prototype.passesCondition = function(bot) {
  var cond = cn.model.Condition;
  var col = cn.model.CargoColor;
  switch (this.condition) {
    case cond.NONE: return !bot.hasCargo();
    case cond.ANY: return bot.hasCargo();
    case cond.RED: return bot.hasCargo(col.RED);
    case cond.GREEN: return bot.hasCargo(col.GREEN);
    case cond.BLUE: return bot.hasCargo(col.BLUE);
    case cond.YELLOW: return bot.hasCargo(col.YELLOW);
  }
  return true;
};


/** @return {boolean} True if the command is F0, F1, F2, or F3. */
cn.model.Instruction.prototype.isFunctionCall = function() {
  return this.command == cn.model.Command.F0 ||
      this.command == cn.model.Command.F1 ||
      this.command == cn.model.Command.F2 ||
      this.command == cn.model.Command.F3;
};


/**
 * @return {number} The function number to call or -1 if not a function call.
 */
cn.model.Instruction.prototype.getFunctionCall = function() {
  switch (this.command) {
    case cn.model.Command.F0: return 0;
    case cn.model.Command.F1: return 1;
    case cn.model.Command.F2: return 2;
    case cn.model.Command.F3: return 3;
  }
  return -1;
};
