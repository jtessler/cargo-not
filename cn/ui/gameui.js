/**
 * @fileoverview The base UI class composed of every game-related UI component.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.GameUi');

goog.require('cn.constants');
goog.require('cn.model.Game');
goog.require('cn.ui.AnimatedGameCanvas');
goog.require('cn.ui.ClassComponent');
goog.require('cn.ui.CommandToolbox');
goog.require('cn.ui.ConditionToolbox');
goog.require('cn.ui.Controls');
goog.require('cn.ui.GameCanvas');
goog.require('cn.ui.LevelSelector');
goog.require('cn.ui.ProgramEditor');
goog.require('goog.style');
goog.require('goog.ui.Component');



/**
 * @param {!cn.model.Game} game The game model to render.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.GameUi = function(game, opt_domHelper) {
  goog.base(this, cn.constants.GAME_UI_CLASS_NAME, opt_domHelper);

  // TODO(joseph): Add these instance variable definitions.
  // TODO(joseph): Add opt_domHelper to constructors.
  this.levelSelector = new cn.ui.LevelSelector(game, this);
  this.goalCanvas = new cn.ui.GameCanvas(
      cn.constants.GOAL_WIDTH, cn.constants.GOAL_HEIGHT);
  this.animatedCanvas = new cn.ui.AnimatedGameCanvas();
  this.controls = new cn.ui.Controls(game, this);
  this.conditionToolbox = new cn.ui.ConditionToolbox();
  this.commandToolbox = new cn.ui.CommandToolbox();
  this.programEditor = new cn.ui.ProgramEditor(game, this);

  // Wire the drag drop source to target groups.
  this.conditionToolbox.getDragDropGroup().addTarget(
      this.programEditor.getConditionDragDropGroup());
  this.commandToolbox.getDragDropGroup().addTarget(
      this.programEditor.getCommandDragDropGroup());

  var container = new goog.ui.Component();
  container.addChild(this.levelSelector, true);
  container.addChild(this.goalCanvas, true);
  this.addChild(container, true);
  this.addChild(this.animatedCanvas, true);
  this.addChild(this.controls, true);
  container = new cn.ui.ClassComponent(
      cn.constants.TOOLBOX_CONTAINER_CLASS_NAME);
  container.addChild(this.conditionToolbox, true);
  container.addChild(this.commandToolbox, true);
  this.addChild(container, true);
  this.addChild(this.programEditor, true);
};
goog.inherits(cn.ui.GameUi, cn.ui.ClassComponent);


/**
 * Prevent users from selecting any element of the game UI.
 * @inheritDoc
 */
cn.ui.GameUi.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  goog.style.setUnselectable(this.getElement(), true);
};
