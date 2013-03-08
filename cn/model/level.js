/**
 * @fileoverview The level model, composed of two immutable array of cargo
 * stacks. One represents the initial configuration, the second is the final
 * configuration.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Level');

goog.require('cn.LevelData');
goog.require('cn.constants');
goog.require('cn.model.PathModel');
goog.require('cn.model.Stack');
goog.require('goog.array');



/**
 * @param {!Array.<!cn.model.Stack>} initial The initial stack configuration.
 * @param {!Array.<!cn.model.Stack>} goal The final stack configuration.
 * @param {number=} opt_height The model's drawn height (in pixels).
 * @param {number=} opt_margin The space between each stack (in pixels).
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Level = function(initial, goal, opt_height, opt_margin) {
  var margin = opt_margin || cn.constants.STACK_WIDTH;
  goog.base(
      this,
      goog.array.reduce(
          initial,
          function(width, stack) { return width + stack.width; },
          0) +
      margin * (initial.length + 1),
      opt_height || cn.constants.LEVEL_HEIGHT,
      cn.constants.LEVEL_COLOR);
  this.path.moveTo(0, 0)
           .lineTo(this.width, 0)
           .lineTo(this.width, this.height)
           .lineTo(0, this.height)
           .lineTo(0, 0);
  this.stacks = initial;

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
 * @param {!cn.LevelData} levelData The level data from which to import.
 * @return {!cn.model.Level} The newly constructed level from the given data.
 */
cn.model.Level.fromLevelData = function(levelData) {
  return new cn.model.Level(
      cn.model.Level.mapStacks_(levelData.initial),
      cn.model.Level.mapStacks_(levelData.goal));
};


/**
 * @param {!Array.<!Array.<!cn.model.CargoColor>>} colors The stacks of colors
 *     to import.
 * @return {!Array.<!cn.model.Stack>} The newly constructed stack from the given
 *     data.
 * @private
 */
cn.model.Level.mapStacks_ = function(colors) {
  return goog.array.map(
      colors,
      function(colorStack) {
        var stack = new cn.model.Stack();
        goog.array.forEach(
            colorStack,
            function(color) {
              stack.addCargo(new cn.model.Cargo(color));
            });
        return stack;
      });
};


/**
 * The underlying implementation of the level's stacks
 * @type {Array.<!cn.model.Stack>}
 */
cn.model.Level.prototype.stacks;


/**
 * @inheritDoc
 */
cn.model.Level.prototype.forEachSubModel = function(f, opt_obj) {
  goog.array.forEach(this.stacks, f, opt_obj);
};
