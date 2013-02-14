/**
 * @fileoverview The stack model, which contains a stack of cargo boxes.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Stack');

goog.require('cn.model.PathModel');
goog.require('goog.array');



/**
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Stack = function() {
  goog.base(this, 'yellow');
  this.path.moveTo(0, 3)
           .lineTo(4, 3)
           .lineTo(4, 4)
           .lineTo(0, 4)
           .lineTo(0, 3);
  this.array_ = new Array();
};
goog.inherits(cn.model.Stack, cn.model.PathModel);


/**
 * The underlying implementation of the stack's stack of cargo boxes.
 * @type {Array.<cn.model.Cargo>}
 * @private
 */
cn.model.Stack.prototype.array_;


/**
 * @param {!cn.model.Cargo} cargo The cargo box to add.
 */
cn.model.Stack.prototype.add = function(cargo) {
  this.array_.push(cargo);
};


/**
 * @return {cn.model.Cargo} The removed cargo box.
 */
cn.model.Stack.prototype.lift = function() {
  return this.array_.pop();
};


/**
 * @return {number} The height of the stack.
 */
cn.model.Stack.prototype.getHeight = function() {
  return this.array_.length;
};


/**
 * @param {function(this: S, cn.model.Cargo, number, ?): ?} f The function to
 *     call for every element. This function takes 3 arguments (the element, the
 *     index and the array). The return value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @template S
 */
cn.model.Stack.prototype.forEach = function(f, opt_obj) {
  goog.array.forEach(this.array_, f, opt_obj);
};
