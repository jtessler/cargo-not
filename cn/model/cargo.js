/**
 * @fileoverview The cargo box model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Cargo');
goog.provide('cn.model.CargoColor');

goog.require('cn.constants');
goog.require('cn.model.PathModel');


/**
 * Enum for all possible cargo colors.
 * @enum {string}
 */
cn.model.CargoColor = {
  RED: 'ff0033',
  GREEN: '339933',
  BLUE: '#003399',
  YELLOW: '#ffcc00'
};



/**
 * @param {cn.model.CargoColor} color The model's fill color.
 * @param {number=} opt_size The model's drawn side width (in pixels).
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Cargo = function(color, opt_size) {
  var size = opt_size || cn.constants.CARGO_SIZE;
  goog.base(this, size, size, color);
  this.path.moveTo(0, 0)
           .lineTo(size, 0)
           .lineTo(size, size)
           .lineTo(0, size)
           .lineTo(0, 0);
  this.color = color;
};
goog.inherits(cn.model.Cargo, cn.model.PathModel);


/** @type {cn.model.CargoColor} */
cn.model.Cargo.prototype.color;
