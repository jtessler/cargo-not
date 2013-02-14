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



/**
 * @constructor
 * @extends {cn.model.Cargo}
 */
cn.model.CargoBlue = function() {
  goog.base(this, 'blue');
};
goog.inherits(cn.model.CargoBlue, cn.model.Cargo);



/**
 * @constructor
 * @extends {cn.model.Cargo}
 */
cn.model.CargoGreen = function() {
  goog.base(this, 'green');
};
goog.inherits(cn.model.CargoGreen, cn.model.Cargo);



/**
 * @constructor
 * @extends {cn.model.Cargo}
 */
cn.model.CargoRed = function() {
  goog.base(this, 'red');
};
goog.inherits(cn.model.CargoRed, cn.model.Cargo);



/**
 * @constructor
 * @extends {cn.model.Cargo}
 */
cn.model.CargoYellow = function() {
  goog.base(this, 'yellow');
};
goog.inherits(cn.model.CargoYellow, cn.model.Cargo);
