/**
 * @fileoverview The bot model.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Bot');

goog.require('cn.model.PathModel');



/**
 * @param {number} size The side length of the bot's inner area, i.e. where it
 *     stores the cargo box. This should be the same size as a cargo box.
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Bot = function(size) {
  var width = size * 2;
  var height = Math.floor(size * 1.5);
  goog.base(this, width, height, 'yellow');
  this.path.moveTo(0, 0)
           .lineTo(width, 0)
           .lineTo(width, height)
           .lineTo(Math.floor(size * 1.5), height)
           .lineTo(Math.floor(size * 1.5), height - size)
           .lineTo(Math.floor(size / 2), height - size)
           .lineTo(Math.floor(size / 2), height)
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
