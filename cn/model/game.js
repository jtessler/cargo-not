/**
 * @fileoverview The game model, which is composed of every model used in a
 * single game.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Game');

goog.require('cn.model.Bot');
goog.require('cn.model.Cargo');
goog.require('cn.model.CargoColor');
goog.require('cn.model.Level');
goog.require('cn.model.PathModel');
goog.require('cn.model.Program');
goog.require('cn.model.Stack');
goog.require('goog.array');



/**
 * @inheritDoc
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Game = function(width, height) {
  goog.base(this, width, height, 'lightyellow');
  this.path.moveTo(0, 0)
           .lineTo(width, 0)
           .lineTo(width, height)
           .lineTo(0, height)
           .lineTo(0, 0);

  var stacks = [new cn.model.Stack(40, 10),
                new cn.model.Stack(40, 10),
                new cn.model.Stack(40, 10)];
  goog.array.forEach(
      stacks,
      function(stack) {
        var col = cn.model.CargoColor;
        stack.addCargo(new cn.model.Cargo(20, col.RED));
        stack.addCargo(new cn.model.Cargo(20, col.GREEN));
        stack.addCargo(new cn.model.Cargo(20, col.BLUE));
        stack.addCargo(new cn.model.Cargo(20, col.YELLOW));
      });

  // TODO(joseph): Refactor these numbers to constants.
  this.level = new cn.model.Level(10, 30, stacks, stacks);
  this.level.setPosition(
      Math.floor((this.width - this.level.width) / 2),
      this.height - this.level.height - 1);

  this.bot = new cn.model.Bot(20);
  this.bot.setPosition(this.level.stacks[0].getX(), 1);

  this.program = new cn.model.Program();
};
goog.inherits(cn.model.Game, cn.model.PathModel);


/** @type {!cn.model.Bot} */
cn.model.Game.prototype.bot;


/** @type {!cn.model.Level} */
cn.model.Game.prototype.level;


/** @type {!cn.model.Program} */
cn.model.Game.prototype.program;


/**
 * @inheritDoc
 */
cn.model.Game.prototype.forEachSubModel = function(f, opt_obj) {
  goog.array.forEach([this.bot, this.level], f, opt_obj);
};
