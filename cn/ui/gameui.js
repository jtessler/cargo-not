/**
 * @fileoverview The base UI class composed of every game-related UI component.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.GameUi');

goog.require('cn.constants');
goog.require('cn.model.Game');
goog.require('cn.ui.AnimatedGameCanvas');
goog.require('cn.ui.GameCanvas');
goog.require('cn.ui.LevelSelector');
goog.require('goog.dom.classes');
goog.require('goog.ui.Component');



/**
 * @param {!cn.model.Game} game The game model to render.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.Component}
 */
cn.ui.GameUi = function(game, opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.levelSelector = new cn.ui.LevelSelector(game, this);
  this.goalCanvas = new cn.ui.GameCanvas(
      cn.constants.GAME_WIDTH, cn.constants.GOAL_HEIGHT);
  this.animatedCanvas = new cn.ui.AnimatedGameCanvas();
  /*this.controls = new cn.ui.Controls(game, this);
  this.programEditor = new cn.ui.ProgramEditor(game, this);*/


  var container = new goog.ui.Component();
  container.addChild(this.levelSelector, true);
  container.addChild(this.goalCanvas, true);
  this.addChild(container, true);
  this.addChild(this.animatedCanvas, true);
  /*this.addChild(this.controls);
  this.addChild(this.programEditor);*/
};
goog.inherits(cn.ui.GameUi, goog.ui.Component);


/**
 * @inheritDoc
 */
cn.ui.GameUi.prototype.createDom = function() {
  this.decorateInternal(this.dom_.createElement('div'));
};


/**
 * @inheritDoc
 */
cn.ui.GameUi.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  goog.dom.classes.add(element, goog.getCssName('cn-game-ui'));
};
