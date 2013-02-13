/**
 * @fileoverview The canvas view control.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.view.canvas');

goog.require('goog.graphics.AffineTransform');
goog.require('goog.graphics.SolidFill');
goog.require('goog.graphics.Stroke');


/**
 * The affine transform object for all object transforms.
 * @type {!goog.graphics.AffineTransform}
 * @private
 */
cn.view.canvas.tx_ = new goog.graphics.AffineTransform();


/**
 * The default stroke style.
 * @type {!goog.graphics.Stroke}
 * @private
 */
cn.view.canvas.stroke_ = new goog.graphics.Stroke(2, 'black');


/**
 * The default fill style.
 * @type {!goog.graphics.Fill}
 * @private
 */
cn.view.canvas.fill_ = new goog.graphics.SolidFill('yellow');


/**
 * Initializes the given canvas by scaling and drawing the game models at the
 * appropriate positions.
 * @param {!goog.graphics.CanvasGraphics} canvas The graphics context.
 * @param {!cn.model.Bot} bot The bot to draw.
 */
cn.view.canvas.init = function(canvas, bot) {
  canvas.clear();

  var tx = cn.view.canvas.tx_;
  bot.path.transform(tx.setToScale(10, 10));
  bot.path.transform(tx.setToTranslation(100, 100));
  canvas.drawPath(bot.path, cn.view.canvas.stroke_, cn.view.canvas.fill_);
};


/**
 * @param {!goog.graphics.CanvasGraphics} canvas The graphics context.
 * @param {!cn.model.Bot} bot The bot to draw.
 */
cn.view.canvas.drawBot = function(canvas, bot) {
  canvas.redraw();
};
