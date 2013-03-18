/**
 * @fileoverview The lists of actions that determine the bot's behavior.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Program');

goog.require('cn.model.Command');
goog.require('cn.model.Condition');
goog.require('cn.model.Instruction');
goog.require('cn.model.Resettable');
goog.require('goog.array');


/** @typedef {{f: number, i: number}} */
cn.model.Pointer;



/**
 * @constructor
 * @implements {cn.model.Resettable}
 */
cn.model.Program = function() {
  this.init([1]);
};


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


/** @type {Array.<Array.<!cn.model.Instruction>>} */
cn.model.Program.prototype.functions;


/**
 * @type {Array.<Array.<!cn.model.Pointer>>}
 * @private
 */
cn.model.Program.prototype.pointers_;


/**
 * Initialize the program with the given instruction lengths.
 * @param {Array.<number>} lengths Lengths for each function.
 */
cn.model.Program.prototype.init = function(lengths) {
  this.f_ = 0;
  this.i_ = 0;
  this.pointers_ = [];
  this.functions = [];
  goog.array.forEach(
      lengths,
      function(length) {
        this.functions.push(this.createFunction_(length));
      },
      this);
};


/**
 * Initialize a single function with the given length.
 * @param {number} length The length for the function.
 * @return {Array.<!cn.model.Instruction>} The newly created function.
 * @private
 */
cn.model.Program.prototype.createFunction_ = function(length) {
  var instructions = [];
  for (var i = 0; i < length; i++) {
    instructions.push(new cn.model.Instruction());
  }
  return instructions;
};


/**
 * @return {!cn.model.Instruction} The currently executing instruction.
 * @private
 */
cn.model.Program.prototype.current_ = function() {
  return this.functions[this.f_][this.i_];
};


/**
 * @return {boolean} True if the pointer is at the end of a function.
 * @private
 */
cn.model.Program.prototype.atEndOfFunction_ = function() {
  return this.i_ >= this.functions[this.f_].length ||
      !this.current_().hasCommand();
};


/**
 * @return {boolean} True if the program has a next instruction or can return
 *     to the caller from the current function.
 * @private
 */
cn.model.Program.prototype.hasNext_ = function() {
  return this.pointers_.length > 0 || !this.atEndOfFunction_();
};


/**
 * Updates the program pointers and returns the instruction to execute.
 * @param {!cn.model.Bot} bot The bot to check the instruction's condition
 *     against.
 * @return {?cn.model.Command} The next command or null if there are no more
 *     instructions to execute.
 */
cn.model.Program.prototype.next = function(bot) {
  if (!this.hasNext_()) {
    this.i_++;
    return null;
  }

  // Pop the most recent stack pointer and return to the caller by recursively
  // calling this function.
  if (this.atEndOfFunction_()) {
    var pointer = this.pointers_.pop();
    this.f_ = pointer.f;
    this.i_ = pointer.i;
    return this.next(bot);
  }

  var instruction = this.current_();

  // Skip this instruction if its condition fails.
  if (!instruction.passesCondition(bot)) {
    this.i_++;
    return this.next(bot);
  }

  // Update the pointer stack and call the function, then return the function
  // call instruction.
  if (instruction.isFunctionCall()) {
    this.pointers_.push({f: this.f_, i: this.i_ + 1});
    this.f_ = instruction.getFunctionCall();
    this.i_ = 0;
    return instruction.command;
  }

  // Simplest case. Just move to the next instruction.
  this.i_++;
  return instruction.command;
};


/**
 * @return {number} The current function index.
 */
cn.model.Program.prototype.getCurrentFunction = function() {
  return this.f_;
};


/**
 * @return {number} The current instruction index.
 */
cn.model.Program.prototype.getCurrentInstruction = function() {
  return this.i_;
};


/**
 * @return {number} The caller's function index or -1 if no caller.
 */
cn.model.Program.prototype.getCallerFunction = function() {
  return goog.array.isEmpty(this.pointers_) ?
      -1 :
      goog.array.peek(this.pointers_).f;
};


/**
 * @return {number} The caller's instruction index or -1 if no caller.
 */
cn.model.Program.prototype.getCallerInstruction = function() {
  return goog.array.isEmpty(this.pointers_) ?
      -1 :
      goog.array.peek(this.pointers_).i;
};


/**
 * Resets the current pointers and call stack.
 */
cn.model.Program.prototype.reset = function() {
  this.f_ = 0;
  this.i_ = 0;
  goog.array.clear(this.pointers_);
};


/**
 * Clears all commands and conditionals.
 */
cn.model.Program.prototype.clear = function() {
  goog.array.forEach(
    this.functions,
    function(instructions) {
      goog.array.forEach(
        instructions,
        function(instruction) {
          instruction.command = null;
          instruction.condition = null;
        });
    });
};


/**
 * @return {boolean} True if the program has started.
 */
cn.model.Program.prototype.hasStarted = function() {
  var isReset =
      this.f_ == 0 && this.i_ == 0 && goog.array.isEmpty(this.pointers_);
  return !isReset;
};
