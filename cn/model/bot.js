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
  this.path = new goog.graphics.Path();
  this.path.moveTo(0, 0)
           .lineTo(4, 0)
           .lineTo(4, 3)
           .lineTo(3, 3)
           .lineTo(3, 1)
           .lineTo(1, 1)
           .lineTo(1, 3)
           .lineTo(0, 3)
           .lineTo(0, 0);
  this.position = 0;
};


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
