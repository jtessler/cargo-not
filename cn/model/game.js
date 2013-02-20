/**
 * @fileoverview The game model, which is composed of every model used in a
 * single game.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Game');

goog.require('cn.constants');
goog.require('cn.model.Bot');
goog.require('cn.model.Cargo');
goog.require('cn.model.CargoColor');
goog.require('cn.model.Level');
goog.require('cn.model.PathModel');
goog.require('cn.model.Program');
goog.require('cn.model.Stack');
goog.require('goog.array');



/**
 * @param {number=} opt_width The entire game's screen width.
 * @param {number=} opt_height The entire game's screen height.
 * @constructor
 * @extends {cn.model.PathModel}
 */
cn.model.Game = function(opt_width, opt_height) {
  goog.base(
      this,
      opt_width || cn.constants.GAME_WIDTH,
      opt_height || cn.constants.GAME_HEIGHT,
      cn.constants.GAME_COLOR);
  this.path.moveTo(0, 0)
           .lineTo(this.width, 0)
           .lineTo(this.width, this.height)
           .lineTo(0, this.height)
           .lineTo(0, 0);

  var stacks = [new cn.model.Stack(),
                new cn.model.Stack(),
                new cn.model.Stack()];
  goog.array.forEach(
      stacks,
      function(stack) {
        var col = cn.model.CargoColor;
        stack.addCargo(new cn.model.Cargo(col.RED));
        stack.addCargo(new cn.model.Cargo(col.GREEN));
        stack.addCargo(new cn.model.Cargo(col.BLUE));
        stack.addCargo(new cn.model.Cargo(col.YELLOW));
      });

  this.level = new cn.model.Level(stacks, stacks);
  this.level.setPosition(
      Math.floor((this.width - this.level.width) / 2),
      this.height - this.level.height - cn.constants.GAME_MARGIN);

  this.bot = new cn.model.Bot(20);
  this.bot.setPosition(
    this.level.stacks[0].getX(),
    cn.constants.GAME_MARGIN + this.bot.height);

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
