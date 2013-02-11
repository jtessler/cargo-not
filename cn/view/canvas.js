/**
 * @fileoverview The canvas view control.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.view.canvas');


/**
 * The affine transform object for all object transforms.
 * @type {!goog.graphics.AffineTransform}
 * @private
 */
cn.view.canvas.tx_ = goog.graphics.AffineTransform();

/**
 * @param {!goog.graphics.CanvasGraphics} canvas The graphics context.
 * @param {!cn.model.Bot} bot The bot to draw.
 */
cn.view.canvas.drawBot = function(canvas, bot) {
};
