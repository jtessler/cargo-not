/**
 * @fileoverview The cargo box model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cargo.model.Cargo');

goog.require('goog.color');



/**
 * @param {!goog.color.Rgb} color The cargo box's color.
 * @constructor
 */
cargo.model.Cargo = function(color) {

  /**
   * @type {!goog.color.Rgb}
   */
  this.color = color;
};
