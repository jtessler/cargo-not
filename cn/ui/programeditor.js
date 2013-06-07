/**
 * @fileoverview The program editor, containing a list of function editors.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.ProgramEditor');

goog.require('cn.constants');
goog.require('cn.ui.ClassComponent');
goog.require('cn.ui.FunctionEditor');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.fx.AbstractDragDrop.EventType');
goog.require('goog.fx.DragDropGroup');
goog.require('goog.object');
goog.require('goog.style');



/**
 * @param {!cn.model.Game} game The game model to render.
 * @param {!cn.ui.GameUi} ui A pointer to parent game UI.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.ProgramEditor = function(game, ui, opt_domHelper) {
  goog.base(this, cn.constants.PROGRAM_EDITOR_CLASS_NAME, opt_domHelper);
  this.game_ = game;
  this.ui_ = ui;
  this.conditionDragDropGroup_ = new goog.fx.DragDropGroup();
  this.commandDragDropGroup_ = new goog.fx.DragDropGroup();

  // Wire each drag drop group to itself as a target.
  this.conditionDragDropGroup_.addTarget(this.conditionDragDropGroup_);
  this.commandDragDropGroup_.addTarget(this.commandDragDropGroup_);
};
goog.inherits(cn.ui.ProgramEditor, cn.ui.ClassComponent);


/**
 * Clears, then initializes the program editor.
 */
cn.ui.ProgramEditor.prototype.init = function() {
  this.removeChildren(true);
  goog.array.forEach(
      this.game_.program.functions,
      function(instructions, f) {
        this.addChild(
            new cn.ui.FunctionEditor(
                f, instructions,
                this.conditionDragDropGroup_, this.commandDragDropGroup_,
                this.getDomHelper()),
            true);
      },
      this);
};


/**
 * @inheritDoc
 */
cn.ui.ProgramEditor.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.conditionDragDropGroup_.init();
  this.commandDragDropGroup_.init();
  this.registerDragDropEvents(this.conditionDragDropGroup_);
  this.registerDragDropEvents(this.commandDragDropGroup_);
};


/**
 * Registers all drag drop events.
 * @param {!goog.fx.DragDropGroup} dragDropGroup The drag drop group.
 */
cn.ui.ProgramEditor.prototype.registerDragDropEvents = function(dragDropGroup) {
  var EventType = goog.fx.AbstractDragDrop.EventType;

  this.getHandler().listen(dragDropGroup, EventType.DRAGSTART,
      function(e) {
        var data = e.dragSourceItem.data;
        cn.controller.removeCommand(this.game_, data.f, data.i);
        goog.style.setOpacity(e.dragSourceItem.element, 0.5);
      });

  this.getHandler().listen(dragDropGroup, EventType.DRAGEND,
      function(e) {
        if (goog.object.containsKey(e.dragSourceItem.data, 'out')) {
          goog.dom.removeNode(e.dragSourceItem.element);
        } else {
          goog.style.setOpacity(e.dragSourceItem.element, 1.0);
        }
      });

  this.getHandler().listen(dragDropGroup, EventType.DRAGOVER,
      function(e) {
        goog.style.setStyle(e.dropTargetItem.element, 'background-size', '0%');
        goog.object.remove(e.dragSourceItem.data, 'out');
      });

  this.getHandler().listen(dragDropGroup, EventType.DRAGOUT,
      function(e) {
        goog.style.setStyle(
            e.dropTargetItem.element, 'background-size', '100%');
        goog.object.set(e.dragSourceItem.data, 'out', true);
      });

  this.getHandler().listen(dragDropGroup, EventType.DROP,
      function(e) {
        var source = e.dragSource;
        var element = e.dragSourceItem.element;
        var data = e.dragSourceItem.data;
        var ptr = e.dropTargetItem.data;

        // Clone the command element if coming from the toolbox.
        if (source === this.ui_.conditionToolbox.getDragDropGroup()) {
          element = e.dragSourceItem.element.cloneNode(true);
          data = goog.object.clone(data);
          this.conditionDragDropGroup_.addItem(element, data);
        } else if (source === this.ui_.commandToolbox.getDragDropGroup()) {
          element = e.dragSourceItem.element.cloneNode(true);
          data = goog.object.clone(data);
          this.commandDragDropGroup_.addItem(element, data);
        }

        // Update the style and add the element to the register's DOM.
        goog.style.setOpacity(element, 1.0);
        goog.style.setStyle(
            e.dropTargetItem.element, 'background-size', '100%');
        goog.dom.removeChildren(e.dropTargetItem.element);
        e.dropTargetItem.element.appendChild(element);

        // Update the actual program model.
        if (goog.object.containsKey(e.dragSourceItem.data, 'condition')) {
          cn.controller.setCondition(
              this.game_, ptr.f, ptr.i, e.dragSourceItem.data.condition);
        } else {
          cn.controller.setCommand(
              this.game_, ptr.f, ptr.i, e.dragSourceItem.data.command);
        }
        data.f = ptr.f;
        data.i = ptr.i;
      });
};


/** @return {!goog.fx.DragDropGroup} The condition drag drop group. */
cn.ui.ProgramEditor.prototype.getConditionDragDropGroup = function() {
  return this.conditionDragDropGroup_;
};


/** @return {!goog.fx.DragDropGroup} The command drag drop group. */
cn.ui.ProgramEditor.prototype.getCommandDragDropGroup = function() {
  return this.commandDragDropGroup_;
};


/** @type {!cn.model.Game} @private */
cn.ui.ProgramEditor.prototype.game_;


/** @type {!cn.ui.GameUi} @private */
cn.ui.ProgramEditor.prototype.ui_;


/** @type {!goog.fx.DragDropGroup} @private */
cn.ui.ProgramEditor.prototype.conditionDragDropGroup_;


/** @type {!goog.fx.DragDropGroup} @private */
cn.ui.ProgramEditor.prototype.commandDragDropGroup_;
