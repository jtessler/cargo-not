/**
 * @fileoverview The canvas graphics wrapper and all drawing logic.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.view.Scene');

goog.require('cn.model.Game');
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
 * @param {!cn.model.Game} game The game model to draw.
 */
cn.view.Scene.prototype.render = function(game) {
  this.canvas_.render();
  this.renderModel_(game);
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
