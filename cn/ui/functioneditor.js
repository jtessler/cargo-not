/**
 * @fileoverview A function container containing a list of registers.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.FunctionEditor');

goog.require('cn.constants');
goog.require('cn.ui.ClassComponent');
goog.require('cn.ui.Register');
goog.require('goog.array');



/**
 * @param {number} f The register's function index.
 * @param {Array.<!cn.model.Instruction>} instructions The actual function, i.e.
 *     list of instructions.
 * @param {!goog.fx.DragDropGroup} conditionDragDropGroup The drag drop group to
 *     add this component's condition element to.
 * @param {!goog.fx.DragDropGroup} commandDragDropGroup The drag drop group to
 *     add this component's command element to.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.FunctionEditor = function(
    f, instructions, conditionDragDropGroup, commandDragDropGroup,
    opt_domHelper) {
  // TODO(joseph): Refactor these class names to constants.
  goog.base(this, goog.getCssName('cn-function-editor'), opt_domHelper);

  // Add a 'fake' register for the large function image.
  this.addChild(
      new cn.ui.ClassComponent(
          [
            goog.getCssName('cn-register'),
            cn.constants.FUNCTION_CLASS_NAMES[f]
          ],
          opt_domHelper),
      true);

  // Add each instruction register.
  goog.array.forEach(
      instructions,
      function(instruction, i) {
        this.addChild(
            new cn.ui.Register(
                f, i, conditionDragDropGroup, commandDragDropGroup,
                opt_domHelper),
            true);
      },
      this);
};
goog.inherits(cn.ui.FunctionEditor, cn.ui.ClassComponent);
