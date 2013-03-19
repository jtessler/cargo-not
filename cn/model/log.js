/**
 * @fileoverview The log model, mapping timestamps to actions.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Log');

goog.require('goog.json');
goog.require('goog.object');
goog.require('goog.string');



/**
 * @constructor
 */
cn.model.Log = function() {
  this.log_ = {};
};


/**
 * @type {Object.<string, string>}
 * @private
 */
cn.model.Log.prototype.log_;


/**
 * @param {string} action The action to log.
 */
cn.model.Log.prototype.record = function(action) {
  goog.object.set(this.log_, goog.string.buildString(goog.now()), action);
};


/**
 * Clears the log.
 */
cn.model.Log.prototype.clear = function() {
  goog.object.clear(this.log_);
};


/**
 * @param {string} id The ID to add.
 */
cn.model.Log.prototype.setId = function(id) {
  goog.object.set(this.log_, 'id', id);
};


/**
 * @return {number} The size of the log.
 */
cn.model.Log.prototype.size = function() {
  return goog.object.getCount(this.log_);
};


/**
 * @return {string} The JSON representation of the log.
 */
cn.model.Log.prototype.serialize = function() {
  return goog.json.serialize(this.log_);
};
