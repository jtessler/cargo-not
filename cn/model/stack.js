/**
 * @fileoverview The stack model, which contains a stack of cargo boxes.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Stack');

goog.require('cn.constants');
goog.require('cn.model.PathModel');
goog.require('goog.array');



/**
 * @param {number=} opt_width The stack's drawn width (in pixels).
 * @param {number=} opt_height The stack's drawn height (in pixels).
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Stack = function(opt_width, opt_height) {
  goog.base(
      this,
      opt_width || cn.constants.STACK_WIDTH,
      opt_height || cn.constants.STACK_HEIGHT,
      cn.constants.STACK_COLOR);
  this.path.moveTo(0, 0)
           .lineTo(this.width, 0)
           .lineTo(this.width, this.height)
           .lineTo(0, this.height)
           .lineTo(0, 0);
  this.boxes_ = new Array();
};
goog.inherits(cn.model.Stack, cn.model.PathModel);


/**
 * The underlying implementation of the stack's stack of cargo boxes.
 * @type {Array.<!cn.model.Cargo>}
 * @private
 */
cn.model.Stack.prototype.boxes_;


/**
 * Adds a given cargo box to the stack and updates its position relative to the
 * stack and its contents.
 * @param {!cn.model.Cargo} cargo The cargo box to add.
 */
cn.model.Stack.prototype.addCargo = function(cargo) {
  if (goog.array.isEmpty(this.boxes_)) {
    cargo.setPosition(
        this.getX() + Math.floor((this.width - cargo.width) / 2),
        this.getY() - cargo.height);
  } else {
    var topCargo = goog.array.peek(this.boxes_);
    cargo.setPosition(topCargo.getX(), topCargo.getY() - cargo.height);
  }
  this.boxes_.push(cargo);
};


/**
 * @return {!cn.model.Cargo} The removed cargo box.
 */
cn.model.Stack.prototype.liftCargo = function() {
  return this.boxes_.pop();
};


/**
 * @return {!cn.model.Cargo} The top cargo box.
 */
cn.model.Stack.prototype.getTopCargo = function() {
  return this.boxes_[this.size() - 1];
};


/**
 * @return {number} The size of the stack.
 */
cn.model.Stack.prototype.size = function() {
  return this.boxes_.length;
};


/**
 * @inheritDoc
 */
cn.model.Stack.prototype.forEachSubModel = function(f, opt_obj) {
  goog.array.forEach(this.boxes_, f, opt_obj);
};


/**
 * @param {!cn.model.Stack} other The stack to compare to.
 * @return {boolean} True if they're equal.
 */
cn.model.Stack.prototype.equals = function(other) {
  return goog.array.equals(
      this.boxes_,
      other.boxes_,
      function(a, b) { return a.color == b.color; });
};
