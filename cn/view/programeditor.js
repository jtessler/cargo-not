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
 * @param {Element=} opt_parent Optional parent to render into.
 * @constructor
 */
cn.view.ProgramEditor = function(game, animator, opt_parent) {
  var parentElement = opt_parent || goog.dom.getDocument().body;

  this.playButton_ = new goog.ui.Button('Play');
  this.pauseButton_ = new goog.ui.Button('Pause');
  this.resetButton_ = new goog.ui.Button('Rewind');
  this.clearButton_ = new goog.ui.Button('Clear Registers');
  this.hintButton_ = new goog.ui.Button('Show Hint');
  this.pauseButton_.setEnabled(false);
  this.resetButton_.setEnabled(false);
  this.playButton_.render(parentElement);
  this.pauseButton_.render(parentElement);
  this.resetButton_.render(parentElement);
  this.clearButton_.render(parentElement);
  this.hintButton_.render(parentElement);
  this.registerButtonEvents_(game, animator);

  var slider = new goog.ui.Slider();
  slider.setMinimum(cn.constants.BOT_SPEED_MIN);
  slider.setMaximum(cn.constants.BOT_SPEED_MAX);
  slider.setMoveToPointEnabled(true);
  slider.createDom();
  goog.style.setStyle(slider.getElement(), {
    'background-size': '350px 20px',
    'background-image': 'url("' + cn.constants.ROOT + 'png/speed_bar.png")',
    'width': '350px',
    'height': '20px',
    'position': 'relative',
    'margin-bottom': '20px',
    'overflow': 'hidden'
  });
  goog.style.setStyle(goog.dom.getFirstElementChild(slider.getElement()), {
    'background-size': '40px 20px',
    'background-image': 'url("' + cn.constants.ROOT + 'png/slider.png")',
    'width': '40px',
    'height': '20px',
    'position': 'absolute',
    'overflow': 'hidden'
  });
  slider.render(parentElement);
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
  goog.dom.appendChild(parentElement, this.toolboxTable_);

  this.registerTable_ = goog.dom.createElement(goog.dom.TagName.TABLE);
  this.initRegisters(game.program);
  goog.dom.appendChild(parentElement, this.registerTable_);
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
      function(cond) {
        var td = goog.dom.createElement(goog.dom.TagName.TD);
        var div = this.createRegisterView_(cond, 20);
        this.toolboxCondDrag_.addItem(div, {f: -1, i: -1, condition: cond});
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
        var div = this.createRegisterView_(command, 50);
        this.toolboxCmdDrag_.addItem(div, {f: -1, i: -1, command: command});
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
  this.registerCondDrop_.removeItems();
  this.registerCmdDrop_.removeItems();
  goog.dom.removeChildren(this.registerTable_);
  goog.array.forEach(
      program.functions,
      function(instructions, f) {
        var tr = goog.dom.createElement(goog.dom.TagName.TR);
        var td = goog.dom.createElement(goog.dom.TagName.TD);
        var div = this.createRegisterView_('f' + f + '_large', 71);
        td.appendChild(div);
        tr.appendChild(td);

        goog.array.forEach(
            instructions,
            function(instruction, i) {
              var td = goog.dom.createElement(goog.dom.TagName.TD);
              var div = this.createRegisterView_('drag_top', 20);
              goog.style.setStyle(div, 'border-bottom', '1px solid white');
              this.registerCondDrop_.addItem(div, {f: f, i: i});
              td.appendChild(div);

              div = this.createRegisterView_('drag_bottom', 50);
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
 * @param {string} image The background image name.
 * @param {number} height The height, in pixels.
 * @return {!Element} The div wrapper for a register "block".
 * @private
 */
cn.view.ProgramEditor.prototype.createRegisterView_ = function(image, height) {
  var div = goog.dom.createElement(goog.dom.TagName.DIV);
  goog.style.setUnselectable(div, true);
  goog.style.setStyle(div, {
    'background-size': '100%',
    'background-image': 'url("' + cn.constants.ROOT + 'png/' + image + '.png")',
    'width': '50px',
    'text-align': 'center'
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
  }, false, this);

  goog.events.listen(this.clearButton_, EventType.ACTION, function() {
    cn.controller.clearProgram(game);
    this.forEachRegisterElement_(function(r, c, element) {
      if (c != 0) {
        goog.dom.removeChildren(element);
      }
    });
  }, false, this);

  goog.events.listen(this.hintButton_, EventType.ACTION, function() {
    alert(game.levelData.hint);
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
      goog.style.setStyle(e.dropTargetItem.element, 'background-size', '0%');
    }
  });
  goog.events.listen(this.registerCmdDrag_, EventType.DRAGOVER, function(e) {
    if (!game.program.hasStarted()) {
      goog.object.remove(e.dragSourceItem.data, 'out');
    }
  });

  goog.events.listen(this.registerCmdDrop_, EventType.DRAGOUT, function(e) {
    if (!game.program.hasStarted()) {
      goog.style.setStyle(e.dropTargetItem.element, 'background-size', '100%');
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
    goog.style.setStyle(e.dropTargetItem.element, 'background-size', '100%');
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
      goog.style.setStyle(e.dropTargetItem.element, 'background-size', '0%');
    }
  });
  goog.events.listen(this.registerCondDrag_, EventType.DRAGOVER, function(e) {
    if (!game.program.hasStarted()) {
      goog.object.remove(e.dragSourceItem.data, 'out');
    }
  });

  goog.events.listen(this.registerCondDrop_, EventType.DRAGOUT, function(e) {
    if (!game.program.hasStarted()) {
      goog.style.setStyle(e.dropTargetItem.element, 'background-size', '100%');
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
    goog.style.setStyle(e.dropTargetItem.element, 'background-size', '100%');
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


/**
 * Reset buttons to default enabled values.
 */
cn.view.ProgramEditor.prototype.resetButtons = function() {
  this.resetButton_.setEnabled(false);
  this.pauseButton_.setEnabled(false);
  this.playButton_.setEnabled(true);
  this.clearButton_.setEnabled(true);
};
