/**
 * @fileoverview A table wrapper that displays a program model, where each table
 * element is a drag-n-drop target for program instructions. Also includes a
 * toolbox as the drag-n-drop source.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.view.ProgramEditor');

goog.require('cn.constants');
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
goog.require('goog.ui.Slider');



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
  this.clearButton_ = new goog.ui.Button('Clear');
  this.pauseButton_.setEnabled(false);
  this.resetButton_.setEnabled(false);
  this.playButton_.render();
  this.pauseButton_.render();
  this.resetButton_.render();
  this.clearButton_.render();
  this.registerButtonEvents_(game, animator);

  var slider = new goog.ui.Slider();
  slider.setMinimum(cn.constants.BOT_SPEED_MIN);
  slider.setMaximum(cn.constants.BOT_SPEED_MAX);
  slider.setMoveToPointEnabled(true);
  slider.createDom();
  goog.style.setStyle(slider.getElement(), {
    'background-color': 'lightgray',
    'width': '150px',
    'height': '20px',
    'position': 'relative',
    'overflow': 'hidden',
    'border': '1px solid gray'
  });
  goog.style.setStyle(goog.dom.getFirstElementChild(slider.getElement()), {
    'background-color': 'gray',
    'width': '20px',
    'height': '100%',
    'position': 'absolute',
    'overflow': 'hidden'
  });
  slider.render();
  goog.events.listen(slider, goog.ui.Component.EventType.CHANGE, function() {
    cn.controller.setBotSpeed(game, slider.getValue());
  });

  this.toolboxCmdDrag_ = new goog.fx.DragDropGroup();
  this.registerCmdDrag_ = new goog.fx.DragDropGroup();
  this.registerCmdDrop_ = new goog.fx.DragDropGroup();
  this.toolboxCmdDrag_.addTarget(this.registerCmdDrop_);
  this.registerCmdDrag_.addTarget(this.registerCmdDrop_);
  this.toolboxCmdDrag_.init();
  this.registerCmdDrag_.init();
  this.initCmdDragEvents_(game);

  this.toolboxCondDrag_ = new goog.fx.DragDropGroup();
  this.registerCondDrag_ = new goog.fx.DragDropGroup();
  this.registerCondDrop_ = new goog.fx.DragDropGroup();
  this.toolboxCondDrag_.addTarget(this.registerCondDrop_);
  this.registerCondDrag_.addTarget(this.registerCondDrop_);
  this.toolboxCondDrag_.init();
  this.registerCondDrag_.init();
  this.initCondDragEvents_(game);

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
cn.view.ProgramEditor.prototype.toolboxCmdDrag_;


/**
 * @type {!goog.fx.DragDropGroup}
 * @private
 */
cn.view.ProgramEditor.prototype.registerCmdDrag_;


/**
 * @type {!goog.fx.DragDropGroup}
 * @private
 */
cn.view.ProgramEditor.prototype.registerCmdDrop_;


/**
 * @type {!goog.fx.DragDropGroup}
 * @private
 */
cn.view.ProgramEditor.prototype.toolboxCondDrag_;


/**
 * @type {!goog.fx.DragDropGroup}
 * @private
 */
cn.view.ProgramEditor.prototype.registerCondDrag_;


/**
 * @type {!goog.fx.DragDropGroup}
 * @private
 */
cn.view.ProgramEditor.prototype.registerCondDrop_;


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
 * @type {!goog.ui.Button}
 * @private
 */
cn.view.ProgramEditor.prototype.clearButton_;


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
      cn.model.Condition,
      function(cond, key) {
        var td = goog.dom.createElement(goog.dom.TagName.TD);
        var div = this.createRegisterView_('pink', 20);
        this.toolboxCondDrag_.addItem(div, {f: -1, i: -1, condition: cond});

        // TODO(joseph): Don't use the enum text here. Use images.
        goog.dom.setTextContent(div, key.substring(0, 4));
        td.appendChild(div);
        tr.appendChild(td);
      },
      this);
  this.toolboxTable_.appendChild(tr);

  tr = goog.dom.createElement(goog.dom.TagName.TR);
  goog.object.forEach(
      cn.model.Command,
      function(command, key) {
        var td = goog.dom.createElement(goog.dom.TagName.TD);
        var div = this.createRegisterView_('pink', 50);
        this.toolboxCmdDrag_.addItem(div, {f: -1, i: -1, command: command});

        // TODO(joseph): Don't use the enum text here. Use images.
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
  this.registerCmdDrop_.removeItems();
  goog.dom.removeChildren(this.registerTable_);
  goog.array.forEach(
      program.functions,
      function(instructions, f) {
        var tr = goog.dom.createElement(goog.dom.TagName.TR);
        var td = goog.dom.createElement(goog.dom.TagName.TD);
        var div = this.createRegisterView_('lightgray', 71);
        // TODO(joseph): Use an image here instead.
        goog.dom.setTextContent(div, 'F' + f);
        td.appendChild(div);
        tr.appendChild(td);

        goog.array.forEach(
            instructions,
            function(instruction, i) {
              var td = goog.dom.createElement(goog.dom.TagName.TD);
              var div = this.createRegisterView_('lightyellow', 20);
              goog.style.setStyle(div, 'border-bottom', 'none');
              this.registerCondDrop_.addItem(div, {f: f, i: i});
              td.appendChild(div);

              div = this.createRegisterView_('lightyellow', 50);
              this.registerCmdDrop_.addItem(div, {f: f, i: i});
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
 * @param {number} height The height, in pixels.
 * @return {!Element} The div wrapper for a register "block".
 * @private
 */
cn.view.ProgramEditor.prototype.createRegisterView_ = function(color, height) {
  var div = goog.dom.createElement(goog.dom.TagName.DIV);
  goog.style.setUnselectable(div, true);
  goog.style.setStyle(div, {
    'background-color': color,
    'width': '50px',
    'text-align': 'center',
    'border': '1px solid black'
  });
  goog.style.setHeight(div, height);
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
    this.clearButton_.setEnabled(false);
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
    this.clearButton_.setEnabled(true);
  }, false, this);

  goog.events.listen(this.clearButton_, EventType.ACTION, function() {
    cn.controller.clearProgram(game);
    this.forEachRegisterElement_(function(r, c, element) {
      if (c != 0) {
        goog.dom.removeChildren(element);
      }
    });
  }, false, this);
};


/**
 * @param {!cn.model.Game} game The current game.
 * @private
 */
cn.view.ProgramEditor.prototype.initCmdDragEvents_ = function(game) {
  var EventType = goog.fx.AbstractDragDrop.EventType;

  goog.events.listen(this.toolboxCmdDrag_, EventType.DRAGSTART, function(e) {
    if (!game.program.hasStarted()) {
      goog.style.setOpacity(e.dragSourceItem.element, 0.5);
    }
  });
  goog.events.listen(this.registerCmdDrag_, EventType.DRAGSTART, function(e) {
    if (!game.program.hasStarted()) {
      var data = e.dragSourceItem.data;
      cn.controller.removeCommand(game, data.f, data.i);
      data.f = -1;
      data.i = -1;
      goog.style.setOpacity(e.dragSourceItem.element, 0.5);
    }
  });

  goog.events.listen(this.toolboxCmdDrag_, EventType.DRAGEND, function(e) {
    if (!game.program.hasStarted()) {
      goog.style.setOpacity(e.dragSourceItem.element, 1.0);
    }
  });
  goog.events.listen(this.registerCmdDrag_, EventType.DRAGEND, function(e) {
    if (!game.program.hasStarted()) {
      if (goog.object.containsKey(e.dragSourceItem.data, 'out')) {
        goog.dom.removeNode(e.dragSourceItem.element);
      } else {
        goog.style.setOpacity(e.dragSourceItem.element, 1.0);
      }
    }
  });

  goog.events.listen(this.registerCmdDrop_, EventType.DRAGOVER, function(e) {
    if (!game.program.hasStarted()) {
      e.dropTargetItem.element.style.background = 'yellow';
    }
  });
  goog.events.listen(this.registerCmdDrag_, EventType.DRAGOVER, function(e) {
    if (!game.program.hasStarted()) {
      goog.object.remove(e.dragSourceItem.data, 'out');
    }
  });

  goog.events.listen(this.registerCmdDrop_, EventType.DRAGOUT, function(e) {
    if (!game.program.hasStarted()) {
      e.dropTargetItem.element.style.background = 'lightyellow';
    }
  });
  goog.events.listen(this.registerCmdDrag_, EventType.DRAGOUT, function(e) {
    if (!game.program.hasStarted()) {
      goog.object.set(e.dragSourceItem.data, 'out', true);
    }
  });

  goog.events.listen(this.registerCmdDrop_, EventType.DROP, function(e) {
    if (game.program.hasStarted()) {
      return;
    }
    var element = e.dragSourceItem.element;
    var data = e.dragSourceItem.data;
    var ptr = e.dropTargetItem.data;

    // Clone the command element if coming from the toolbox.
    if (e.dragSource == this.toolboxCmdDrag_) {
      element = e.dragSourceItem.element.cloneNode(true);
      data = goog.object.clone(data);
      this.registerCmdDrag_.addItem(element, data);
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
 * @param {!cn.model.Game} game The current game.
 * @private
 */
cn.view.ProgramEditor.prototype.initCondDragEvents_ = function(game) {
  // TODO(joseph): Refactor this copied code.
  var EventType = goog.fx.AbstractDragDrop.EventType;

  goog.events.listen(this.toolboxCondDrag_, EventType.DRAGSTART, function(e) {
    if (!game.program.hasStarted()) {
      goog.style.setOpacity(e.dragSourceItem.element, 0.5);
    }
  });
  goog.events.listen(this.registerCondDrag_, EventType.DRAGSTART, function(e) {
    if (!game.program.hasStarted()) {
      var data = e.dragSourceItem.data;
      cn.controller.removeCondition(game, data.f, data.i);
      data.f = -1;
      data.i = -1;
      goog.style.setOpacity(e.dragSourceItem.element, 0.5);
    }
  });

  goog.events.listen(this.toolboxCondDrag_, EventType.DRAGEND, function(e) {
    if (!game.program.hasStarted()) {
      goog.style.setOpacity(e.dragSourceItem.element, 1.0);
    }
  });
  goog.events.listen(this.registerCondDrag_, EventType.DRAGEND, function(e) {
    if (!game.program.hasStarted()) {
      if (goog.object.containsKey(e.dragSourceItem.data, 'out')) {
        goog.dom.removeNode(e.dragSourceItem.element);
      } else {
        goog.style.setOpacity(e.dragSourceItem.element, 1.0);
      }
    }
  });

  goog.events.listen(this.registerCondDrop_, EventType.DRAGOVER, function(e) {
    if (!game.program.hasStarted()) {
      e.dropTargetItem.element.style.background = 'yellow';
    }
  });
  goog.events.listen(this.registerCondDrag_, EventType.DRAGOVER, function(e) {
    if (!game.program.hasStarted()) {
      goog.object.remove(e.dragSourceItem.data, 'out');
    }
  });

  goog.events.listen(this.registerCondDrop_, EventType.DRAGOUT, function(e) {
    if (!game.program.hasStarted()) {
      e.dropTargetItem.element.style.background = 'lightyellow';
    }
  });
  goog.events.listen(this.registerCondDrag_, EventType.DRAGOUT, function(e) {
    if (!game.program.hasStarted()) {
      goog.object.set(e.dragSourceItem.data, 'out', true);
    }
  });

  goog.events.listen(this.registerCondDrop_, EventType.DROP, function(e) {
    if (game.program.hasStarted()) {
      return;
    }
    var element = e.dragSourceItem.element;
    var data = e.dragSourceItem.data;
    var ptr = e.dropTargetItem.data;

    // Clone the condition element if coming from the toolbox.
    if (e.dragSource == this.toolboxCondDrag_) {
      element = e.dragSourceItem.element.cloneNode(true);
      data = goog.object.clone(data);
      this.registerCondDrag_.addItem(element, data);
    }

    // Update the style and add the element to the register's DOM.
    goog.style.setOpacity(element, 1.0);
    e.dropTargetItem.element.style.background = 'lightyellow';
    goog.dom.removeChildren(e.dropTargetItem.element);
    e.dropTargetItem.element.appendChild(element);

    // Update the actual program model.
    cn.controller.setCondition(
        game, ptr.f, ptr.i, e.dragSourceItem.data.condition);
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
  this.forEachRegisterElement_(
      function(regF, regI, element) {
        // Highlight the executing command.
        if (regF == f && regI == i) {
          goog.style.setOpacity(element, 1.0);
        }
        // Highlight (slightly) the executing function and caller.
        else if (regF == f && regI == 0 ||
                 regF == callerF && regI == callerI) {
          goog.style.setOpacity(element, 0.5);
        }
        // Otherwise, set the element to nearly transparent.
        else {
          goog.style.setOpacity(element, 0.25);
        }
      });
};


/**
 * Sets all registers to fully opaque.
 */
cn.view.ProgramEditor.prototype.unhighlightExecution = function() {
  this.forEachRegisterElement_(function(r, c, element) {
    goog.style.setOpacity(element, 1.0);
  });
};


/**
 * @param {function(this: S, number, number, Element, number, ?): ?}
 *     f The function to call for every element. This function takes 5 arguments
 *     (the row, column, the element, element index, and the array). The return
 *     value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @template S
 * @private
 */
cn.view.ProgramEditor.prototype.forEachRegisterElement_ = function(f, opt_obj) {
  goog.array.forEach(
      goog.dom.getChildren(this.registerTable_),
      function(tr, r) {
        goog.array.forEach(
            goog.dom.getChildren(tr),
            function(td, c) {
              goog.array.forEach(
                  goog.dom.getChildren(td),
                  goog.bind(f, opt_obj, r, c));
            }, opt_obj);
      }, opt_obj);
};
