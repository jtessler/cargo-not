/**
 * @fileoverview The canvas graphics wrapper and all drawing logic.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.view.Scene');

goog.require('goog.fx.anim.Animated');
goog.require('goog.graphics.AffineTransform');
goog.require('goog.graphics.CanvasGraphics');
goog.require('goog.graphics.SolidFill');
goog.require('goog.graphics.Stroke');



/**
 * @constructor
 * @implements {goog.fx.anim.Animated}
 */
cn.view.Scene = function() {
  this.canvas_ = new goog.graphics.CanvasGraphics(500, 500);
  this.tx_ = new goog.graphics.AffineTransform();
  this.stroke_ = new goog.graphics.Stroke(2, 'black');
  this.fill_ = new goog.graphics.SolidFill('yellow');
};


/**
 * The underlying graphics implementation.
 * @type {!goog.graphics.CanvasGraphics}
 */
cn.view.Scene.prototype.canvas_;


/**
 * The affine transform object for all object transforms.
 * @type {!goog.graphics.AffineTransform}
 * @private
 */
cn.view.Scene.prototype.tx_;


/**
 * The default stroke style.
 * @type {!goog.graphics.Stroke}
 * @private
 */
cn.view.Scene.prototype.stroke_;


/**
 * The default fill style.
 * @type {!goog.graphics.Fill}
 * @private
 */
cn.view.Scene.prototype.fill_;


/**
 * Initializes the given canvas by scaling and drawing the game models at the
 * appropriate positions.
 * @param {!cn.model.Bot} bot The bot to draw.
 */
cn.view.Scene.prototype.render = function(bot) {
  this.canvas_.render();

  this.bot = bot;
  bot.path.transform(this.tx_.setToScale(10, 10).translate(10, 10));
  this.canvas_.drawPath(bot.path, this.stroke_, this.fill_);
};


/**
 * @inheritDoc
 */
cn.view.Scene.prototype.onAnimationFrame = function(now) {
  this.canvas_.redraw();
};
