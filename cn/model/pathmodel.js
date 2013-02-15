/**
 * @fileoverview The super model representing any model that contains a path for
 * drawing and a fill color.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.PathModel');

goog.require('goog.color');
goog.require('goog.graphics.Path');
goog.require('goog.graphics.SolidFill');



/**
 * @param {number} width The model's drawn width (in pixels).
 * @param {number} height The model's drawn height (in pixels).
 * @param {string} color The model's fill color.
 * @constructor
 */
cn.model.PathModel = function(width, height, color) {
  if (!goog.math.isInt(width) || !goog.math.isInt(height)) {
    throw Error('width and height must be integers');
  }
  if (!goog.color.isValidColor(color)) {
    throw Error(color + ' is not a valid color');
  }

  this.width = width;
  this.height = height;
  this.path = new goog.graphics.Path();
  this.fill = new goog.graphics.SolidFill(color);
};


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
 * The model's color
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
