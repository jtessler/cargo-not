/**
 * @fileoverview The cargo box model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Cargo');
goog.provide('cn.model.CargoBlue');
goog.provide('cn.model.CargoGreen');
goog.provide('cn.model.CargoRed');
goog.provide('cn.model.CargoYellow');

goog.require('cn.model.PathModel');



/**
 * @param {number} size The model's drawn side width (in pixels).
 * @param {string} color The model's fill color.
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Cargo = function(size, color) {
  goog.base(this, size, size, color);
  this.path.moveTo(0, 0)
           .lineTo(size, 0)
           .lineTo(size, size)
           .lineTo(0, size)
           .lineTo(0, 0);
};
goog.inherits(cn.model.Cargo, cn.model.PathModel);



/**
 * @param {number} size The model's drawn side width (in pixels).
 * @constructor
 * @extends {cn.model.Cargo}
 */
cn.model.CargoBlue = function(size) {
  goog.base(this, size, 'blue');
};
goog.inherits(cn.model.CargoBlue, cn.model.Cargo);



/**
 * @param {number} size The model's drawn side width (in pixels).
 * @constructor
 * @extends {cn.model.Cargo}
 */
cn.model.CargoGreen = function(size) {
  goog.base(this, size, 'green');
};
goog.inherits(cn.model.CargoGreen, cn.model.Cargo);



/**
 * @param {number} size The model's drawn side width (in pixels).
 * @constructor
 * @extends {cn.model.Cargo}
 */
cn.model.CargoRed = function(size) {
  goog.base(this, size, 'red');
};
goog.inherits(cn.model.CargoRed, cn.model.Cargo);



/**
 * @param {number} size The model's drawn side width (in pixels).
 * @constructor
 * @extends {cn.model.Cargo}
 */
cn.model.CargoYellow = function(size) {
  goog.base(this, size, 'yellow');
};
goog.inherits(cn.model.CargoYellow, cn.model.Cargo);
