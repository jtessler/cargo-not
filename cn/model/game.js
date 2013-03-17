/**
 * @fileoverview The game model, which is composed of every model used in a
 * single game.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Game');

goog.require('cn.LevelData.levels');
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

  var levelData = cn.LevelData.levels['Mirror 2'];
  this.level = new cn.model.Level(levelData.initial);
  this.goal = new cn.model.Level(levelData.goal);
  this.bot = new cn.model.Bot();
  this.program = new cn.model.Program();
  this.program.init(8, 8, 8, 5);
  this.setupModelPositions();
};
goog.inherits(cn.model.Game, cn.model.PathModel);


/** @type {!cn.model.Bot} */
cn.model.Game.prototype.bot;


/** @type {!cn.model.Level} */
cn.model.Game.prototype.level;


/** @type {!cn.model.Level} */
cn.model.Game.prototype.goal;


/** @type {!cn.model.Program} */
cn.model.Game.prototype.program;


/**
 * Sets up the game models' positions.
 */
cn.model.Game.prototype.setupModelPositions = function() {
  this.goal.setPosition(
      Math.floor((this.width - this.level.width) / 2),
      cn.constants.GOAL_HEIGHT - this.level.height - cn.constants.GAME_MARGIN);
  this.level.setPosition(
      Math.floor((this.width - this.level.width) / 2),
      this.height - this.level.height - cn.constants.GAME_MARGIN);
  this.bot.setPosition(
      this.level.stacks[this.bot.position].getX(),
      cn.constants.GAME_MARGIN + this.bot.height);
};


/**
 * @inheritDoc
 */
cn.model.Game.prototype.forEachSubModel = function(f, opt_obj) {
  goog.array.forEach([this.bot, this.level], f, opt_obj);
};


/**
 * @inheritDoc
 */
cn.model.Game.prototype.reset = function() {
  goog.base(this, 'reset');
  this.program.reset();
  // TODO(joseph): Update position based on level data.
  this.bot.position = 0;
  this.setupModelPositions();
};
