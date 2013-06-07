/**
 * @fileoverview A register container containing the two components representing
 * its contents, i.e. a conditional and a command.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.Register');

goog.require('cn.constants');
goog.require('cn.ui.ClassComponent');
goog.require('cn.ui.DragDropComponent');



/**
 * @param {number} f The register's function index.
 * @param {number} i The register's instruction index.
 * @param {!goog.fx.DragDropGroup} conditionDragDropGroup The drag drop group to
 *     add this component's condition element to.
 * @param {!goog.fx.DragDropGroup} commandDragDropGroup The drag drop group to
 *     add this component's command element to.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.Register = function(
    f, i, conditionDragDropGroup, commandDragDropGroup, opt_domHelper) {
  goog.base(this, cn.constants.REGISTER_CLASS_NAME, opt_domHelper);

  var conditionRegister = new cn.ui.DragDropComponent(
      cn.constants.CONDITION_REGISTER_CLASS_NAME,
      conditionDragDropGroup,
      {f: f, i: i},
      opt_domHelper);
  var commandRegister = new cn.ui.DragDropComponent(
      cn.constants.COMMAND_REGISTER_CLASS_NAME,
      commandDragDropGroup,
      {f: f, i: i},
      opt_domHelper);

  this.addChild(conditionRegister, true);
  this.addChild(commandRegister, true);
};
goog.inherits(cn.ui.Register, cn.ui.ClassComponent);
