/**
 * @fileoverview The drag source items container.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.CommandToolbox');
goog.provide('cn.ui.ConditionToolbox');
goog.provide('cn.ui.Toolbox');

goog.require('cn.constants');
goog.require('cn.model.Command');
goog.require('cn.model.Condition');
goog.require('cn.ui.ClassComponent');
goog.require('cn.ui.DragDropComponent');
goog.require('goog.fx.AbstractDragDrop.EventType');
goog.require('goog.fx.DragDropGroup');
goog.require('goog.object');



/**
 * @param {!cn.model.Game} game The game model to render.
 * @param {!cn.ui.GameUi} ui A pointer to parent game UI.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.Toolbox = function(game, ui, opt_domHelper) {
  goog.base(this, cn.constants.TOOLBOX_CLASS_NAME, opt_domHelper);
  this.game_ = game;
  this.ui_ = ui;
  this.dragDropGroup_ = new goog.fx.DragDropGroup();
};
goog.inherits(cn.ui.Toolbox, cn.ui.ClassComponent);


/** @return {!goog.fx.DragDropGroup} The drag drop group. */
cn.ui.Toolbox.prototype.getDragDropGroup = function() {
  return this.dragDropGroup_;
};


/** @type {!cn.model.Game} @private */
cn.ui.Toolbox.prototype.game_;


/** @type {!cn.ui.GameUi} @private */
cn.ui.Toolbox.prototype.ui_;


/** @type {!goog.fx.DragDropGroup} @private */
cn.ui.Toolbox.prototype.dragDropGroup_;



/**
 * @param {!cn.model.Game} game The game model to render.
 * @param {!cn.ui.GameUi} ui A pointer to parent game UI.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.Toolbox}
 */
cn.ui.ConditionToolbox = function(game, ui, opt_domHelper) {
  goog.base(this, game, ui, opt_domHelper);
  goog.object.forEach(
      cn.model.Condition,
      function(condition, key) {
        this.addChild(
            new cn.ui.DragDropComponent(
                [
                  cn.constants.CONDITION_CLASS_NAME,
                  cn.constants.CONDITION_CLASS_NAMES[key]
                ],
                this.getDragDropGroup(),
                {f: -1, i: -1, condition: condition},
                opt_domHelper),
            true);
      },
      this);
};
goog.inherits(cn.ui.ConditionToolbox, cn.ui.Toolbox);



/**
 * @param {!cn.model.Game} game The game model to render.
 * @param {!cn.ui.GameUi} ui A pointer to parent game UI.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.Toolbox}
 */
cn.ui.CommandToolbox = function(game, ui, opt_domHelper) {
  goog.base(this, game, ui, opt_domHelper);
  goog.object.forEach(
      cn.model.Command,
      function(command, key) {
        this.addChild(
            new cn.ui.DragDropComponent(
                [
                  cn.constants.COMMAND_CLASS_NAME,
                  cn.constants.COMMAND_CLASS_NAMES[key]
                ],
                this.getDragDropGroup(),
                {f: -1, i: -1, command: command},
                opt_domHelper),
            true);
      },
      this);
};
goog.inherits(cn.ui.CommandToolbox, cn.ui.Toolbox);
