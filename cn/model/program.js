/**
 * @fileoverview The lists of actions that determine the bot's behavior.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Command');
goog.provide('cn.model.Condition');
goog.provide('cn.model.Program');


/**
 * Enum for all possible program commands.
 * @enum {string}
 */
cn.model.Command = {
  LEFT: 'move the bot left',
  RIGHT: 'move the bot right',
  DOWN: 'drop or pickup cargo',
  F1: 'move to program f1',
  F2: 'move to program f2',
  F3: 'move to program f3',
  F4: 'move to program f4'
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



/**
 * @constructor
 */
cn.model.Program = function() {
  this.init();
};


/** @type {Array.<Array.<!cn.model.Instruction>>} */
cn.model.Program.prototype.functions;


/**
 * Initialize the program with the given instruction lengths.
 * @param {...number} var_lengths The length for each function.
 */
cn.model.Program.prototype.init = function(var_lengths) {
  this.functions = [];
  goog.array.forEach(
      arguments,
      function(length) {
        this.functions.push(
            goog.array.repeat(new cn.model.Instruction(), length));
      },
      this);
};
