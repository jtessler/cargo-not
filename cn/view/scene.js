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
  this.canvas_ = new goog.graphics.CanvasGraphics(500, 500);
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

  this.renderModel_(level.setPosition(200, 350));
  this.renderModel_(
      bot.setPosition(
          level.stacks[0].getX(),
          level.getLargestStack().getTopCargo().getY() - bot.height * 2));
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
 * @inheritDoc
 */
cn.view.Scene.prototype.onAnimationFrame = function(now) {
  this.canvas_.redraw();
};
