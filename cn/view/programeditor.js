/**
 * @fileoverview A table wrapper that displays a program model, where each table
 * element is a drag-n-drop target for program instructions. Also includes a
 * toolbox as the drag-n-drop source.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.view.ProgramEditor');

goog.require('cn.controller');
goog.require('cn.model.Command');
goog.require('cn.model.Condition');
goog.require('cn.model.Game');
goog.require('cn.model.Program');
goog.require('cn.view.Animator');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.fx.AbstractDragDrop.EventType');
goog.require('goog.fx.DragDropGroup');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.ui.Button');



/**
 * @param {!cn.model.Game} game The game model that includes the program to
 *     render.
 * @param {!cn.view.Animator} animator The animator window to attach events to.
 * @constructor
 */
cn.view.ProgramEditor = function(game, animator) {

  // TODO(joseph): Append these elsewhere.

  this.playButton_ = new goog.ui.Button('Play');
  this.pauseButton_ = new goog.ui.Button('Pause');
  this.resetButton_ = new goog.ui.Button('Reset');
  this.pauseButton_.setEnabled(false);
  this.resetButton_.setEnabled(false);
  this.playButton_.render();
  this.pauseButton_.render();
  this.resetButton_.render();
  this.registerButtonEvents_(game, animator);

  this.dragGroupToolbox_ = new goog.fx.DragDropGroup();
  this.dragGroupRegister_ = new goog.fx.DragDropGroup();
  this.dropGroupFunction_ = new goog.fx.DragDropGroup();
  this.dragGroupToolbox_.addTarget(this.dropGroupFunction_);
  this.dragGroupRegister_.addTarget(this.dropGroupFunction_);
  this.dragGroupToolbox_.init();
  this.dragGroupRegister_.init();
  this.registerDragEvents_(game);

  this.toolboxTable_ = goog.dom.createElement(goog.dom.TagName.TABLE);
  this.initToolbox_();
  goog.dom.getDocument().body.appendChild(this.toolboxTable_);

  this.registerTable_ = goog.dom.createElement(goog.dom.TagName.TABLE);
  this.initRegisters(game.program);
  goog.dom.getDocument().body.appendChild(this.registerTable_);
};


/**
 * @type {!goog.fx.DragDropGroup}
 * @private
 */
cn.view.ProgramEditor.prototype.dragGroupToolbox_;


/**
 * @type {!goog.fx.DragDropGroup}
 * @private
 */
cn.view.ProgramEditor.prototype.dragGroupRegister_;


/**
 * @type {!goog.fx.DragDropGroup}
 * @private
 */
cn.view.ProgramEditor.prototype.dropGroupFunction_;


/**
 * @type {!goog.ui.Button}
 * @private
 */
cn.view.ProgramEditor.prototype.playButton_;


/**
 * @type {!goog.ui.Button}
 * @private
 */
cn.view.ProgramEditor.prototype.pauseButton_;


/**
 * @type {!goog.ui.Button}
 * @private
 */
cn.view.ProgramEditor.prototype.resetButton_;


/**
 * @type {!Element}
 * @private
 */
cn.view.ProgramEditor.prototype.toolboxTable_;


/**
 * @type {!Element}
 * @private
 */
cn.view.ProgramEditor.prototype.registerTable_;


/**
 * @private
 */
cn.view.ProgramEditor.prototype.initToolbox_ = function() {
  var tr = goog.dom.createElement(goog.dom.TagName.TR);
  goog.object.forEach(
      cn.model.Command,
      function(command, key) {
        var td = goog.dom.createElement(goog.dom.TagName.TD);
        var div = this.createRegisterView_('pink');
        this.dragGroupToolbox_.addItem(div, {f: -1, i: -1, command: command});

        // TODO(joseph): Don't use the enum text here.
        goog.dom.setTextContent(div, key);
        td.appendChild(div);
        tr.appendChild(td);
      },
      this);
  this.toolboxTable_.appendChild(tr);
};


/**
 * @param {!cn.model.Program} program The program to build a table view for.
 */
cn.view.ProgramEditor.prototype.initRegisters = function(program) {
  this.dropGroupFunction_.removeItems();
  goog.dom.removeChildren(this.registerTable_);
  goog.array.forEach(
      program.functions,
      function(instructions, f) {
        var tr = goog.dom.createElement(goog.dom.TagName.TR);
        var td = goog.dom.createElement(goog.dom.TagName.TD);
        var div = this.createRegisterView_('lightgray');
        goog.dom.setTextContent(div, 'F' + f);
        td.appendChild(div);
        tr.appendChild(td);

        goog.array.forEach(
            instructions,
            function(instruction, i) {
              var td = goog.dom.createElement(goog.dom.TagName.TD);
              var div = this.createRegisterView_('lightyellow');
              this.dropGroupFunction_.addItem(div, {f: f, i: i});
              td.appendChild(div);
              tr.appendChild(td);
            },
            this);
        this.registerTable_.appendChild(tr);
      },
      this);
};


/**
 * @param {string} color The background color to draw.
 * @return {!Element} The div wrapper for a register "block".
 * @private
 */
cn.view.ProgramEditor.prototype.createRegisterView_ = function(color) {
  var div = goog.dom.createElement(goog.dom.TagName.DIV);
  goog.style.setUnselectable(div, true);
  goog.style.setStyle(div, {
    'background-color': color,
    'width': '50px',
    'height': '50px',
    'text-align': 'center',
    'border': '1px solid black'
  });
  return div;
};


/**
 * @param {!cn.model.Game} game The game model that includes the program to
 *     render.
 * @param {!cn.view.Animator} animator The animator window to attach events to.
 * @private
 */
cn.view.ProgramEditor.prototype.registerButtonEvents_ =
    function(game, animator) {
  var EventType = goog.ui.Component.EventType;
  goog.events.listen(this.playButton_, EventType.ACTION, function() {
    if (this.resetButton_.isEnabled()) {
      cn.controller.resume(animator);
    } else {
      cn.controller.play(game, animator, this);
    }
    this.playButton_.setEnabled(false);
    this.pauseButton_.setEnabled(true);
    this.resetButton_.setEnabled(true);
  }, false, this);

  goog.events.listen(this.pauseButton_, EventType.ACTION, function() {
    cn.controller.pause(animator);
    this.pauseButton_.setEnabled(false);
    this.playButton_.setEnabled(true);
  }, false, this);

  goog.events.listen(this.resetButton_, EventType.ACTION, function() {
    cn.controller.reset(game, animator, this);
    this.resetButton_.setEnabled(false);
    this.pauseButton_.setEnabled(false);
    this.playButton_.setEnabled(true);
  }, false, this);
};


/**
 * @param {!cn.model.Game} game The current game.
 * @private
 */
cn.view.ProgramEditor.prototype.registerDragEvents_ = function(game) {
  var EventType = goog.fx.AbstractDragDrop.EventType;

  goog.events.listen(this.dragGroupToolbox_, EventType.DRAGSTART, function(e) {
    if (!game.program.hasStarted()) {
      goog.style.setOpacity(e.dragSourceItem.element, 0.5);
    }
  });
  goog.events.listen(this.dragGroupRegister_, EventType.DRAGSTART, function(e) {
    if (!game.program.hasStarted()) {
      var data = e.dragSourceItem.data;
      cn.controller.removeCommand(game, data.f, data.i);
      data.f = -1;
      data.i = -1;
      goog.style.setOpacity(e.dragSourceItem.element, 0.5);
    }
  });

  goog.events.listen(this.dragGroupToolbox_, EventType.DRAGEND, function(e) {
    if (!game.program.hasStarted()) {
      goog.style.setOpacity(e.dragSourceItem.element, 1.0);
    }
  });
  goog.events.listen(this.dragGroupRegister_, EventType.DRAGEND, function(e) {
    if (!game.program.hasStarted()) {
      if (goog.object.containsKey(e.dragSourceItem.data, 'out')) {
        goog.dom.removeNode(e.dragSourceItem.element);
      } else {
        goog.style.setOpacity(e.dragSourceItem.element, 1.0);
      }
    }
  });

  goog.events.listen(this.dropGroupFunction_, EventType.DRAGOVER, function(e) {
    if (!game.program.hasStarted()) {
      e.dropTargetItem.element.style.background = 'yellow';
    }
  });
  goog.events.listen(this.dragGroupRegister_, EventType.DRAGOVER, function(e) {
    if (!game.program.hasStarted()) {
      goog.object.remove(e.dragSourceItem.data, 'out');
    }
  });

  goog.events.listen(this.dropGroupFunction_, EventType.DRAGOUT, function(e) {
    if (!game.program.hasStarted()) {
      e.dropTargetItem.element.style.background = 'lightyellow';
    }
  });
  goog.events.listen(this.dragGroupRegister_, EventType.DRAGOUT, function(e) {
    if (!game.program.hasStarted()) {
      goog.object.set(e.dragSourceItem.data, 'out', true);
    }
  });

  goog.events.listen(this.dropGroupFunction_, EventType.DROP, function(e) {
    if (game.program.hasStarted()) {
      return;
    }
    var element = e.dragSourceItem.element;
    var data = e.dragSourceItem.data;
    var ptr = e.dropTargetItem.data;

    // Clone the command element if coming from the toolbox.
    if (e.dragSource == this.dragGroupToolbox_) {
      element = e.dragSourceItem.element.cloneNode(true);
      data = goog.object.clone(data);
      this.dragGroupRegister_.addItem(element, data);
    }

    // Update the style and add the element to the register's DOM.
    goog.style.setOpacity(element, 1.0);
    e.dropTargetItem.element.style.background = 'lightyellow';
    goog.dom.removeChildren(e.dropTargetItem.element);
    e.dropTargetItem.element.appendChild(element);

    // Update the actual program model.
    cn.controller.setCommand(game, ptr.f, ptr.i, e.dragSourceItem.data.command);
    data.f = ptr.f;
    data.i = ptr.i;
  }, false, this);
};


/**
 * Sets all registers to half transparency except for the register at the given
 * pointer (and it's possible caller).
 * @param {!cn.model.Program} program The program to get execution info from.
 */
cn.view.ProgramEditor.prototype.highlightExecution = function(program) {
  var f = program.getCurrentFunction();
  var i = program.getCurrentInstruction();
  var callerF = program.getCallerFunction();
  var callerI = program.getCallerInstruction();
  goog.array.forEach(
      goog.dom.getChildren(this.registerTable_),
      function(tr, regF) {
        goog.array.forEach(
            goog.dom.getChildren(tr),
            function(td, regI) {
              // Highlight the executing command.
              if (regF == f && regI == i) {
                goog.style.setOpacity(goog.dom.getFirstElementChild(td), 1.0);
              }
              // Highlight (slightly) the executing function and caller.
              else if (regF == f && regI == 0 ||
                       regF == callerF && regI == callerI) {
                goog.style.setOpacity(goog.dom.getFirstElementChild(td), 0.5);
              }
              // Otherwise, set the element to nearly transparent.
              else {
                goog.style.setOpacity(goog.dom.getFirstElementChild(td), 0.25);
              }
            });
      });
};


/**
 * Sets all registers to fully opaque.
 */
cn.view.ProgramEditor.prototype.unhighlightExecution = function() {
  // TODO(joseph): Refactor this for each into a shared private function.
  goog.array.forEach(
      goog.dom.getChildren(this.registerTable_),
      function(tr) {
        goog.array.forEach(
            goog.dom.getChildren(tr),
            function(td) {
              goog.style.setOpacity(goog.dom.getFirstElementChild(td), 1.0);
            });
      });
};
