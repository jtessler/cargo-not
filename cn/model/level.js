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
 * @param {number} margin The space between each stack (in pixels).
 * @param {Array.<!cn.model.Stack>} start The initial stack configuration.
 * @param {Array.<!cn.model.Stack>} end The final stack configuration.
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Level = function(height, margin, start, end) {
  var width =
      goog.array.reduce(
          start,
          function(width, stack) { return width + stack.width; },
          0) +
      margin * (start.length + 1);
  goog.base(this, width, height, 'yellow');
  this.path.moveTo(0, 0)
           .lineTo(width, 0)
           .lineTo(width, height)
           .lineTo(0, height)
           .lineTo(0, 0);
  this.stacks = start;

  this.forEachSubModel(
      function(stack, i, stacks) {
        stack.setPosition(
            (i == 0) ?
                margin :
                margin + stacks[i - 1].getX() + stacks[i - 1].width,
            -stack.height);
      });
};
goog.inherits(cn.model.Level, cn.model.PathModel);


/**
 * The underlying implementation of the level's stacks
 * @type {Array.<!cn.model.Stack>}
 */
cn.model.Stack.prototype.stacks;


/**
 * Overrides function to translate all cargo stacks as well.
 * @inheritDoc
 */
cn.model.Level.prototype.translate = function(dx, dy) {
  this.forEachSubModel(function(stack) { stack.translate(dx, dy); });
  return goog.base(this, 'translate', dx, dy);
};


/**
 * @return {!cn.model.Stack} The stack with the greatest cargo size.
 */
cn.model.Level.prototype.getLargestStack = function() {
  return goog.array.reduce(
      this.stacks,
      function(maxStack, stack) {
        return stack.size() > maxStack.size() ? stack : maxStack;
      },
      this.stacks[0]);
};


/**
 * @inheritDoc
 */
cn.model.Level.prototype.forEachSubModel = function(f, opt_obj) {
  goog.array.forEach(this.stacks, f, opt_obj);
};
