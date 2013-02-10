/**
 * @fileoverview The bot model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Bot');



/**
 * @constructor
 */
cn.model.Bot = function() {

  /**
   * The bot's current cargo slot position.
   * @type {number}
   */
  this.position = 0;

  /**
   * The bot's currently held cargo. Can be empty.
   * @type {?cn.model.Cargo}
   */
  this.cargo = null;
};


/**
 * @return {boolean} True if the bot is currently holding cargo.
 */
cn.model.Bot.prototype.isHoldingCargo = function() {
  return goog.isDefAndNotNull(this.cargo);
};
