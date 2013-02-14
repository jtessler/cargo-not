/**
 * @fileoverview The cargo box model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Cargo');

goog.require('cn.model.PathModel');
goog.require('goog.graphics.Path');



/**
 * @inheritDoc
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Cargo = function(color) {
  goog.base(this, color);
  this.path.moveTo(1, 1)
           .lineTo(3, 1)
           .lineTo(3, 3)
           .lineTo(1, 3)
           .lineTo(1, 1);
};
goog.inherits(cn.model.Cargo, cn.model.PathModel);
