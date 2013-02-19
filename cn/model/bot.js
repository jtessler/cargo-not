/**
 * @fileoverview The bot model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Bot');

goog.require('cn.model.PathModel');



/**
 * @param {number} innerSize The side length of the bot's inner area, i.e. where
 *     it stores the cargo box. This should be the same size as a cargo box.
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Bot = function(innerSize) {
  var innerX = Math.floor(innerSize / 2);
  var innerY = innerX;
  var width = innerSize * 2;
  var height = innerY + innerSize;
  goog.base(this, width, height, 'yellow');
  this.path.moveTo(0, 0)
           .lineTo(width, 0)
           .lineTo(width, height)
           .lineTo(innerX + innerSize, height)
           .lineTo(innerX + innerSize, innerY)
           .lineTo(innerX, innerY)
           .lineTo(innerX, height)
           .lineTo(0, height)
           .lineTo(0, 0);
  this.position = 0;
  this.cargo_ = null;
};
goog.inherits(cn.model.Bot, cn.model.PathModel);


/**
 * The bot's current cargo slot position.
 * @type {number}
 */
cn.model.Bot.prototype.position;


/**
 * The bot's held cargo (can be empty).
 * @type {?cn.model.Cargo}
 * @private
 */
cn.model.Bot.prototype.cargo_;


/**
 * @return {number} The top left x-coordinate of the bot's inner area.
 */
cn.model.PathModel.prototype.getInnerX = function() {
  return this.getX() + Math.floor(this.width / 4);
};


/**
 * @return {number} The top left y-coordinate of the bot's inner area.
 */
cn.model.PathModel.prototype.getInnerY = function() {
  return this.getY() + Math.floor(this.width / 4);
};


/**
 * @param {!cn.model.Cargo} cargo The cargo to attach.
 */
cn.model.Bot.prototype.attachCargo = function(cargo) {
  if (!this.hasCargo()) {
    cargo.setPosition(this.getInnerX(), this.getInnerY());
    this.cargo_ = cargo;
  }
};


/**
 * @param {cn.model.CargoColor=} opt_color If given a color, this function also
 *     checks if the held cargo matches said color.
 * @return {boolean} True if the bot is carrying cargo.
 */
cn.model.Bot.prototype.hasCargo = function(opt_color) {
  return goog.isDefAndNotNull(this.cargo_) &&
      (!goog.isDef(opt_color) || this.cargo_.color == opt_color);
};


/**
 * Bot's only sub-model is its possible cargo, so we only need to bind the given
 * function to the single sub-model.
 * @inheritDoc
 */
cn.model.Bot.prototype.forEachSubModel = function(f, opt_obj) {
  if (this.hasCargo()) {
    goog.bind(f, opt_obj, this.cargo_, 0, null)();
  }
};
