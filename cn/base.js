/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.base');

goog.require('cn.model.Bot');
goog.require('cn.model.Cargo');
goog.require('goog.graphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.base.main = function() {
  var canvas = new goog.graphics.CanvasGraphics(500, 500);
  canvas.render();

  var stroke = new goog.graphics.Stroke(2, 'black');
  var fill = new goog.graphics.SolidFill('blue');
  var path = new goog.graphics.Path();
  path.moveTo(0, 0)
      .lineTo(2, 0)
      .lineTo(2, 2)
      .lineTo(1, 1)
      .lineTo(0, 2)
      .lineTo(0, 0);
  path.transform(goog.graphics.AffineTransform.getScaleInstance(50, 50));
  path.transform(goog.graphics.AffineTransform.getTranslateInstance(100, 100));
  canvas.drawPath(path, stroke, fill);

  var bot = new cn.model.Bot();
  bot.cargo = new cn.model.Cargo([0, 0, 0]);
};
goog.exportSymbol('main', cn.base.main);
