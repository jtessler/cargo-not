/**
 * @fileoverview A simple class component subclass exposing drag drop
 * capabilities.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.DragDropComponent');

goog.require('cn.ui.ClassComponent');
goog.require('goog.fx.DragDropGroup');



/**
 * @param {string|!Array.<string>} className The CSS class name or list of
 *     class names to attach.
 * @param {!goog.fx.DragDropGroup} dragDropGroup The drag drop group to add this
 *     component's element to.
 * @param {Object=} opt_data Data associated with the source/target.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.DragDropComponent = function(
    className, dragDropGroup, opt_data, opt_domHelper) {
  goog.base(this, className, opt_domHelper);
  this.dragDropGroup_ = dragDropGroup;
  this.data_ = opt_data || null;
};
goog.inherits(cn.ui.DragDropComponent, cn.ui.ClassComponent);


/**
 * Add this element to the drag drop group upon rendering.
 * @inheritDoc
 */
cn.ui.DragDropComponent.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.dragDropGroup_.addItem(this.getElement(), this.data_);
};


/**
 * Remove this element from the drag drop group when disposing.
 * @inheritDoc
 */
cn.ui.DragDropComponent.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.dragDropGroup_.removeItem(this.getElement());
};


/** @type {!goog.fx.DragDropGroup} @private */
cn.ui.DragDropComponent.prototype.dragDropGroup_;


/** @type {Object?} @private */
cn.ui.DragDropComponent.prototype.data_;
