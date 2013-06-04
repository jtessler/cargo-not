/**
 * @fileoverview The super model representing any model that contains a path for
 * drawing and a fill color.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.PathModel');

goog.require('cn.model.Resettable');
goog.require('goog.graphics.AffineTransform');
goog.require('goog.graphics.Path');
goog.require('goog.graphics.SolidFill');
goog.require('goog.graphics.Stroke');



/**
 * @param {number} width The model's drawn width (in pixels).
 * @param {number} height The model's drawn height (in pixels).
 * @param {string} color The model's fill color.
 * @constructor
 * @implements {cn.model.Resettable}
 */
cn.model.PathModel = function(width, height, color) {
  if (!goog.math.isInt(width) || !goog.math.isInt(height)) {
    throw Error('width and height must be integers');
  }

  this.width = width;
  this.height = height;
  this.path = new goog.graphics.Path();
  this.stroke = cn.model.PathModel.defaultStroke_;
  this.fill = new goog.graphics.SolidFill(color);
};


/**
 * The underlying affine transform object for all model transforms.
 * @type {!goog.graphics.AffineTransform}
 * @private
 */
cn.model.PathModel.tx_ = new goog.graphics.AffineTransform();


/**
 * The default stroke style used for all models.
 * @type {!goog.graphics.Stroke}
 * @private
 */
cn.model.PathModel.defaultStroke_ = new goog.graphics.Stroke(2, 'white');


/**
 * @type {number}
 * @const
 */
cn.model.PathModel.prototype.width;


/**
 * @type {number}
 * @const
 */
cn.model.PathModel.prototype.height;


/**
 * The model's path representation.
 * @type {!goog.graphics.Path}
 */
cn.model.PathModel.prototype.path;


/**
 * The model's stroke style.
 * @type {!goog.graphics.Stroke}
 */
cn.model.PathModel.prototype.stroke;


/**
 * The model's fill color.
 * @type {!goog.graphics.Fill}
 */
cn.model.PathModel.prototype.fill;


/**
 * @return {number} The model's top left x-coordinate.
 */
cn.model.PathModel.prototype.getX = function() {
  return this.path.getCurrentPoint()[0];
};


/**
 * @return {number} The model's top left y-coordinate.
 */
cn.model.PathModel.prototype.getY = function() {
  return this.path.getCurrentPoint()[1];
};


/**
 * Performs a translation transform on the model. If the model is composed of
 * any sub-models, those are recursively translated as well.
 * @param {number} dx The x translation delta.
 * @param {number} dy The y translation delta.
 * @return {!cn.model.PathModel} The current model (for chaining).
 */
cn.model.PathModel.prototype.translate = function(dx, dy) {
  this.path.transform(cn.model.PathModel.tx_.setToTranslation(dx, dy));
  this.forEachSubModel(function(model) { model.translate(dx, dy); });
  return this;
};


/**
 * Performs a scale transform on the model, preserving aspect ratio. If the
 * model is composed of any sub-models, those are recursively translated as
 * well.
 * @param {number} s The scale factor.
 * @return {!cn.model.PathModel} The current model (for chaining).
 */
cn.model.PathModel.prototype.scale = function(s) {
  this.path.transform(cn.model.PathModel.tx_.setToScale(s, s));
  this.forEachSubModel(function(model) { model.scale(s); });
  return this;
};


/**
 * If the model is composed of any sub-models, those coordinates are recursively
 * updated as well.
 * @param {number} x The new x value.
 * @param {number} y The new y value.
 * @return {!cn.model.PathModel} The current model (for chaining).
 */
cn.model.PathModel.prototype.setPosition = function(x, y) {
  return this.translate(x - this.getX(), y - this.getY());
};


/**
 * By default, this function is a no-op. If a subclass is composed of models,
 * e.g. a stack containing cargo, it must implement this method accordingly.
 * @param {function(this: S, !cn.model.PathModel, number, ?): ?} f The function
 *    to call for every element. This function takes 3 arguments (the element,
 *    the index and the array). The return value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @template S
 */
cn.model.PathModel.prototype.forEachSubModel = function(f, opt_obj) {};


/**
 * @inheritDoc
 */
cn.model.PathModel.prototype.reset = function() {
  this.forEachSubModel(function(model) { model.reset(); });
};
