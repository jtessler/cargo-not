/**
 * @fileoverview The stack model, which contains a stack of cargo boxes.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Stack');

goog.require('cn.model.PathModel');
goog.require('goog.array');



/**
 * @param {number} length The model's drawn length (in pixels).
 * @param {number} height The model's drawn height (in pixels).
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Stack = function(length, height) {
  goog.base(this, length, height, 'yellow');
  this.path.moveTo(0, 0)
           .lineTo(length, 0)
           .lineTo(length, height)
           .lineTo(0, height)
           .lineTo(0, 0);
  this.boxes_ = new Array();
};
goog.inherits(cn.model.Stack, cn.model.PathModel);


/**
 * The underlying implementation of the stack's stack of cargo boxes.
 * @type {Array.<cn.model.Cargo>}
 * @private
 */
cn.model.Stack.prototype.boxes_;


/**
 * @param {!cn.model.Cargo} cargo The cargo box to add.
 */
cn.model.Stack.prototype.add = function(cargo) {
  this.boxes_.push(cargo);
};


/**
 * @return {cn.model.Cargo} The removed cargo box.
 */
cn.model.Stack.prototype.lift = function() {
  return this.boxes_.pop();
};


/**
 * @return {number} The height of the stack.
 */
cn.model.Stack.prototype.getHeight = function() {
  return this.boxes_.length;
};


/**
 * @param {function(this: S, cn.model.Cargo, number, ?): ?} f The function to
 *     call for every element. This function takes 3 arguments (the element, the
 *     index and the array). The return value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @template S
 */
cn.model.Stack.prototype.forEach = function(f, opt_obj) {
  goog.array.forEach(this.boxes_, f, opt_obj);
};
