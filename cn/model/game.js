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
goog.require('cn.model.Log');
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

  this.bot = new cn.model.Bot();
  this.program = new cn.model.Program();
  this.loadLevel(cn.LevelData.levels['Cargo 101']);
  this.log = new cn.model.Log();
  this.log.record('loaded level Cargo 101');
};
goog.inherits(cn.model.Game, cn.model.PathModel);


/** @type {!cn.model.Bot} */
cn.model.Game.prototype.bot;


/** @type {!cn.model.Level} */
cn.model.Game.prototype.level;


/** @type {!cn.model.Level} */
cn.model.Game.prototype.goal;


/** @type {!cn.LevelData} */
cn.model.Game.prototype.levelData;


/** @type {!cn.model.Program} */
cn.model.Game.prototype.program;


/** @type {!cn.model.Log} */
cn.model.Game.prototype.log;


/** @type {string} */
cn.model.Game.prototype.id;


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
      cn.constants.GAME_MARGIN + Math.floor(this.bot.height / 2));
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
  this.bot.position = this.levelData.botPosition;
  this.setupModelPositions();
};


/**
 * @param {!cn.LevelData} levelData The level to load.
 */
cn.model.Game.prototype.loadLevel = function(levelData) {
  this.levelData = levelData;
  this.level = new cn.model.Level(levelData.initial);
  this.goal = new cn.model.Level(levelData.goal);
  this.program.init(levelData.functions);
  this.reset();
};
