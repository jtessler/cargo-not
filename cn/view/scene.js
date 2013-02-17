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
 * @param {!cn.model.Stack} stack The stack of boxes to draw.
 */
cn.view.Scene.prototype.render = function(bot, stack) {
  this.canvas_.render();

  // TODO(joseph): Refactor drawPath to another function.
  this.canvas_.drawPath(bot.path, bot.stroke, bot.fill);

  stack.translate(0, 490);
  this.canvas_.drawPath(stack.path, stack.stroke, stack.fill);

  stack.forEach(
      function(cargo, i) {
        cargo.translate(10, 470 - 20 * i);
        this.canvas_.drawPath(cargo.path, cargo.stroke, cargo.fill);
      }, this);
};


/**
 * @inheritDoc
 */
cn.view.Scene.prototype.onAnimationFrame = function(now) {
  this.canvas_.redraw();
};
