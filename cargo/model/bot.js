/**
 * @fileoverview The bot model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cargo.model.Bot');



/**
 * @constructor
 */
cargo.model.Bot = function() {

  /**
   * The bot's current cargo slot position.
   * @type {number}
   */
  this.position = 0;

  /**
   * The bot's currently held cargo. Can be empty.
   * @type {?cargo.model.Cargo}
   */
  this.cargo = null;
};


/**
 * @nosideeffects
 * @return {boolean} True if the bot is currently holding cargo.
 */
cargo.model.Bot.prototype.isHoldingCargo = function() {
  return goog.isDefAndNotNull(this.cargo);
};
