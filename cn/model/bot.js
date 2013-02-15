/**
 * @fileoverview The bot model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Bot');

goog.require('cn.model.PathModel');



/**
 * @param {number} width The model's drawn width (in pixels).
 * @param {number} height The model's drawn height (in pixels).
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Bot = function(width, height) {
  goog.base(this, width, height, 'yellow');
  this.path.moveTo(0, 0)
           .lineTo(width, 0)
           .lineTo(width, height)
           .lineTo(3 * Math.floor(width / 4), height)
           .lineTo(3 * Math.floor(width / 4), Math.floor(height / 3))
           .lineTo(Math.floor(width / 4), Math.floor(height / 3))
           .lineTo(Math.floor(width / 4), height)
           .lineTo(0, height)
           .lineTo(0, 0);
  this.position = 0;
};
goog.inherits(cn.model.Bot, cn.model.PathModel);


/**
 * The bot's current cargo slot position.
 * @type {number}
 */
cn.model.Bot.prototype.position;
