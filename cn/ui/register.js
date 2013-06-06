/**
 * @fileoverview A register container and the two classes representing its
 * contents, i.e. a conditional and a command.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.Register');

goog.require('cn.ui.ClassComponent');
goog.require('cn.ui.DragDropComponent');



/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.Register = function(opt_domHelper) {
  // TODO(joseph): Refactor these class names to constants.
  goog.base(this, 'cn-register', opt_domHelper);

  this.condition_ = new cn.ui.ClassComponent(
      'cn-condition-register', opt_domHelper);
  this.command_ = new cn.ui.ClassComponent(
      'cn-command-register', opt_domHelper);

  this.addChild(this.condition_, true);
  this.addChild(this.command_, true);
};
goog.inherits(cn.ui.Register, cn.ui.ClassComponent);


/** @return {!Element} The condition register element. */
cn.ui.Register.prototype.getConditionRegisterElement = function() {
  return this.condition_.getElementStrict();
};


/** @return {!Element} The command register element. */
cn.ui.Register.prototype.getCommandRegisterElement = function() {
  return this.command_.getElementStrict();
};


/** @type {!cn.ui.ClassComponent} @private */
cn.ui.Register.prototype.condition_;


/** @type {!cn.ui.ClassComponent} @private */
cn.ui.Register.prototype.command_;
