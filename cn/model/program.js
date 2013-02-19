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
