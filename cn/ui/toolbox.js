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
goog.require('goog.style');



/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.Toolbox = function(opt_domHelper) {
  goog.base(this, cn.constants.TOOLBOX_CLASS_NAME, opt_domHelper);
  this.dragDropGroup_ = new goog.fx.DragDropGroup();
};
goog.inherits(cn.ui.Toolbox, cn.ui.ClassComponent);


/**
 * @inheritDoc
 */
cn.ui.Toolbox.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.dragDropGroup_.init();

  var EventType = goog.fx.AbstractDragDrop.EventType;
  this.getHandler().listen(this.dragDropGroup_, EventType.DRAGSTART,
      function(e) {
        goog.style.setOpacity(e.dragSourceItem.element, 0.5);
      });
  this.getHandler().listen(this.dragDropGroup_, EventType.DRAGEND,
      function(e) {
        goog.style.setOpacity(e.dragSourceItem.element, 1.0);
      });
};


/** @return {!goog.fx.DragDropGroup} The drag drop group. */
cn.ui.Toolbox.prototype.getDragDropGroup = function() {
  return this.dragDropGroup_;
};


/** @type {!goog.fx.DragDropGroup} @private */
cn.ui.Toolbox.prototype.dragDropGroup_;



/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.Toolbox}
 */
cn.ui.ConditionToolbox = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
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
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.Toolbox}
 */
cn.ui.CommandToolbox = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
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
