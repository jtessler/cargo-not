/**
 * @fileoverview A simple component subclass exposing class names.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.ClassComponent');

goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.ui.Component');



/**
 * @param {string|!Array.<string>} className The CSS class name or list of
 *     class names to attach.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.Component}
 */
cn.ui.ClassComponent = function(className, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.classNames_ = goog.isArray(className) ? className : [className];
};
goog.inherits(cn.ui.ClassComponent, goog.ui.Component);


/**
 * @inheritDoc
 */
cn.ui.ClassComponent.prototype.createDom = function() {
  this.decorateInternal(this.getDomHelper().createDom(
      goog.dom.TagName.DIV, this.classNames_.join(' ')));
};


/** @type {!Array.<string>} @private */
cn.ui.ClassComponent.prototype.classNames_;
