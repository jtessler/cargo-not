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
 * @param {string} color The model's fill color.
 * @constructor
 */
cn.model.PathModel = function(color) {
  if (!goog.color.isValidColor(color)) {
    throw Error(color + ' is not a valid color');
  }
  this.path = new goog.graphics.Path();
  this.fill = new goog.graphics.SolidFill(color);
};


/**
 * The model's path representation.
 * @type {!goog.graphics.Path}
 */
cn.model.PathModel.prototype.path;


/**
 * The cargo box's color
 * @type {!goog.graphics.Fill}
 */
cn.model.PathModel.prototype.fill;
