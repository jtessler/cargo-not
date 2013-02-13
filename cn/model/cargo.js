/**
 * @fileoverview The cargo box model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Cargo');

goog.require('goog.graphics.Path');
goog.require('goog.graphics.SolidFill');



/**
 * @param {string} color The cargo box's color.
 * @constructor
 */
cn.model.Cargo = function(color) {
  this.path = new goog.graphics.Path();
  this.path.moveTo(1, 1)
           .lineTo(3, 1)
           .lineTo(3, 3)
           .lineTo(1, 3)
           .lineTo(1, 1);
  this.fill = new goog.graphics.SolidFill(color);
};


/**
 * The Cargo box's path representation.
 * @type {!goog.graphics.Path}
 */
cn.model.Cargo.prototype.path;


/**
 * The cargo box's color
 * @type {goog.graphics.Fill}
 */
cn.model.Cargo.prototype.fill;
