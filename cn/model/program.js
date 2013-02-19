/**
 * @fileoverview The lists of actions that determine the bot's behavior.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Program');

goog.require('cn.model.Command');
goog.require('cn.model.Condition');
goog.require('cn.model.Instruction');



/**
 * @constructor
 */
cn.model.Program = function() {
  this.init(1);
};


/** @type {Array.<Array.<!cn.model.Instruction>>} */
cn.model.Program.prototype.functions;


/**
 * Index of the currently executing function.
 * @type {number}
 * @private
 */
cn.model.Program.prototype.f_;


/**
 * Index of the currently executing instruction.
 * @type {number}
 * @private
 */
cn.model.Program.prototype.i_;


/**
 * Initialize the program with the given instruction lengths.
 * @param {...number} var_lengths The length for each function.
 */
cn.model.Program.prototype.init = function(var_lengths) {
  this.functions = [];
  this.f_ = 0;
  this.i_ = 0;
  goog.array.forEach(
      arguments,
      function(length) {
        this.functions.push(
            goog.array.repeat(new cn.model.Instruction(), length));
      },
      this);
};


/**
 * Adds a command to a given index.
 * @param {number} f The function to add the command to.
 * @param {number} i The position in the function to add the command to.
 * @param {cn.model.Command} command The command.
 */
cn.model.Program.prototype.addCommand = function(f, i, command) {
  this.functions[f][i].command = command;
};


/**
 * Remove the command at a given index. Removes any condition as well.
 * @param {number} f The function to remove the command from.
 * @param {number} i The position in the function to remove the command from.
 * @return {?cn.model.Command} The command removed or null if no command existed
 *     at the given index.
 */
cn.model.Program.prototype.removeCommand = function(f, i) {
  var command = this.functions[f][i].command;
  this.functions[f][i].command = null;
  this.functions[f][i].condition = null;
  return command;
};


/**
 * Adds a condition to a given index. Does nothing if the selected instruction
 * has no command.
 * @param {number} f The function to add the condition to.
 * @param {number} i The position in the function to add the condition to.
 * @param {cn.model.Condition} condition The condition.
 */
cn.model.Program.prototype.addCondition = function(f, i, condition) {
  this.functions[f][i].condition = condition;
};


/**
 * Remove the condition at a given index.
 * @param {number} f The function to remove the condition from.
 * @param {number} i The position in the function to remove the condition from.
 * @return {?cn.model.Condition} The condition removed or null if no condition
 *     existed at the given index.
 */
cn.model.Program.prototype.removeCondition = function(f, i) {
  var condition = this.functions[f][i].condition;
  this.functions[f][i].condition = null;
  return condition;
};
