/**
 * @fileoverview The canvas graphics wrapper for the "goal" configuration.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.view.Goal');

goog.require('cn.constants');



/**
 * @param {number=} opt_width The goal view's screen width.
 * @param {number=} opt_height The goal view's screen height.
 * @constructor
 */
cn.view.Goal = function(opt_width, opt_height) {
  this.canvas_ = new goog.graphics.CanvasGraphics(
      opt_width || cn.constants.GAME_WIDTH,
      opt_height || cn.constants.GOAL_HEIGHT);
  this.canvas_.render();
};


/**
 * The underlying graphics implementation.
 * @type {!goog.graphics.CanvasGraphics}
 * @private
 */
cn.view.Goal.prototype.canvas_;


/**
 * Initializes the given canvas by scaling and drawing the game models at the
 * appropriate positions.
 * @param {!cn.model.Game} game The game model to draw.
 */
cn.view.Goal.prototype.render = function(game) {
  this.canvas_.clear();
  this.renderModel_(game.goal);
};


/**
 * Draws a given model with its corresponding stroke and fill styles. If the
 * model is composed of any sub-models, those are recursively drawn as well.
 * @param {!cn.model.PathModel} model The model to draw.
 * @private
 */
cn.view.Goal.prototype.renderModel_ = function(model) {
  this.canvas_.drawPath(model.path, model.stroke, model.fill);
  model.forEachSubModel(function(model) { this.renderModel_(model); }, this);
};
