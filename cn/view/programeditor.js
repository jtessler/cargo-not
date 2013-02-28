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
  this.dragGroup_ = new goog.fx.DragDropGroup();
  this.dropGroup_ = new goog.fx.DragDropGroup();
  this.dragGroup_.addTarget(this.dropGroup_);
  this.dragGroup_.init();

  // TODO(joseph): Append these elsewhere.
  // TODO(joseph): Refactor event handler code.

  this.playButton_ = new goog.ui.Button('Play');
  this.playButton_.render();
  goog.events.listen(
      this.playButton_,
      goog.ui.Component.EventType.ACTION,
      function() {
        if (this.resetButton_.isEnabled()) {
          cn.controller.resume(animator);
        } else {
          cn.controller.play(game, animator);
        }
        this.playButton_.setEnabled(false);
        this.pauseButton_.setEnabled(true);
        this.resetButton_.setEnabled(true);
      },
      false,
      this);

  this.pauseButton_ = new goog.ui.Button('Pause');
  this.pauseButton_.setEnabled(false);
  this.pauseButton_.render();
  goog.events.listen(
      this.pauseButton_,
      goog.ui.Component.EventType.ACTION,
      function() {
        cn.controller.pause(animator);
        this.pauseButton_.setEnabled(false);
        this.playButton_.setEnabled(true);
      },
      false,
      this);

  this.resetButton_ = new goog.ui.Button('Reset');
  this.resetButton_.setEnabled(false);
  this.resetButton_.render();
  goog.events.listen(
      this.resetButton_,
      goog.ui.Component.EventType.ACTION,
      function() {
        // TODO(joseph): Implement this function.
        //cn.controller.reset(game, animator);
        this.resetButton_.setEnabled(false);
        this.pauseButton_.setEnabled(false);
        this.playButton_.setEnabled(true);
      },
      false,
      this);

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
cn.view.ProgramEditor.prototype.dragGroup_;


/**
 * @type {!goog.fx.DragDropGroup}
 * @private
 */
cn.view.ProgramEditor.prototype.dropGroup_;


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
        this.dragGroup_.addItem(div, command);

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
  this.dropGroup_.removeItems();
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
              this.dropGroup_.addItem(div, instruction);
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
