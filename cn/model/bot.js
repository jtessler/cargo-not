/**
 * @fileoverview The bot model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Bot');

goog.require('goog.graphics.Path');



/**
 * @constructor
 */
cn.model.Bot = function() {
  this.cargo = null;
  this.path = new goog.graphics.Path;
  this.position = 0;
};


/**
 * The bot's currently held cargo. Can be empty (null).
 * @type {?cn.model.Cargo}
 */
cn.model.Bot.prototype.cargo;


/**
 * The bot's path representation.
 * @type {!goog.graphics.Path}
 */
cn.model.Bot.prototype.path;


/**
 * The bot's current cargo slot position.
 * @type {number}
 */
cn.model.Bot.prototype.position;


/**
 * @return {boolean} True if the bot is currently holding cargo.
 */
cn.model.Bot.prototype.isHoldingCargo = function() {
  return goog.isDefAndNotNull(this.cargo);
};
