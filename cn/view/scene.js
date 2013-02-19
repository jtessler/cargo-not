/**
 * @fileoverview The canvas graphics wrapper and all drawing logic.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.view.Scene');

goog.require('goog.fx.anim.Animated');
goog.require('goog.graphics.CanvasGraphics');



/**
 * @constructor
 * @implements {goog.fx.anim.Animated}
 */
cn.view.Scene = function() {
  this.canvas_ = new goog.graphics.CanvasGraphics(600, 300);
};


/**
 * The underlying graphics implementation.
 * @type {!goog.graphics.CanvasGraphics}
 */
cn.view.Scene.prototype.canvas_;


/**
 * Initializes the given canvas by scaling and drawing the game models at the
 * appropriate positions.
 * @param {!cn.model.Bot} bot The bot to draw.
 * @param {!cn.model.Level} level The level configuration to draw.
 */
cn.view.Scene.prototype.render = function(bot, level) {
  this.canvas_.render();

  // TODO(joseph): Refactor the margin to a constant.
  var margin = 1;
  this.renderModel_(
      level.setPosition(
          Math.floor((this.canvas_.getPixelSize().width - level.width) / 2),
          this.canvas_.getPixelSize().height - level.height - margin));
  this.renderModel_(bot.setPosition(level.stacks[0].getX(), margin));
};


/**
 * Draws a given model with its corresponding stroke and fill styles. If the
 * model is composed of any sub-models, those are recursively drawn as well.
 * @param {!cn.model.PathModel} model The model to draw.
 * @private
 */
cn.view.Scene.prototype.renderModel_ = function(model) {
  this.canvas_.drawPath(model.path, model.stroke, model.fill);
  model.forEachSubModel(function(model) { this.renderModel_(model); }, this);
};


/**
 * @param {function(): boolean} f A function that updates some model's
 *     appearance every step of the animation and returns true until the
 *     animation should end.
 */
cn.view.Scene.prototype.runUntilFalse = function(f) {
  // TODO(joseph): Implement this function.
};


/**
 * @inheritDoc
 */
cn.view.Scene.prototype.onAnimationFrame = function(now) {
  this.canvas_.redraw();
};
