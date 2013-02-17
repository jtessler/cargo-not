/**
 * @fileoverview The level model, composed of two immutable array of cargo
 * stacks. One represents the initial configuration, the second is the final
 * configuration.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Level');

goog.require('cn.model.PathModel');
goog.require('cn.model.Stack');
goog.require('goog.array');



/**
 * @param {number} height The model's drawn height (in pixels).
 * @param {Array.<!cn.model.Stack>} start The initial stack configuration.
 * @param {Array.<!cn.model.Stack>} end The final stack configuration.
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Level = function(height, start, end) {
  var width =
      goog.array.reduce(
          start,
          function(width, stack) { return width + stack.width; },
          0) +
      10 * (start.length + 1);
  goog.base(this, width, height, 'yellow');
  this.path.moveTo(0, 0)
           .lineTo(width, 0)
           .lineTo(width, height)
           .lineTo(0, height)
           .lineTo(0, 0);
  this.stacks_ = start;

  this.forEachStack(
      function(stack, i, array) {
        stack.setPosition(
            (i == 0) ?
                10 :
                10 + array[i - 1].getX() + array[i - 1].width,
            -stack.height);
      });
};
goog.inherits(cn.model.Level, cn.model.PathModel);


/**
 * The underlying implementation of the level's stacks
 * @type {Array.<!cn.model.Stack>}
 * @private
 */
cn.model.Stack.prototype.stacks_;


/**
 * Overrides function to translate all cargo stacks as well.
 * @inheritDoc
 */
cn.model.Level.prototype.translate = function(dx, dy) {
  this.forEachStack(function(stack) { stack.translate(dx, dy); });
  return goog.base(this, 'translate', dx, dy);
};


/**
 * @param {function(this: S, !cn.model.Stack, number, ?): ?} f The function to
 *     call for every element. This function takes 3 arguments (the element, the
 *     index and the array). The return value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @template S
 */
cn.model.Level.prototype.forEachStack = function(f, opt_obj) {
  goog.array.forEach(this.stacks_, f, opt_obj);
};
