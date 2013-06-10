/**
 * @fileoverview A simple component subclass to hold any given list of
 * components with an optional header text.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.ClassContainer');

goog.require('cn.constants');
goog.require('cn.ui.ClassComponent');
goog.require('goog.array');
goog.require('goog.ui.Control');
goog.require('goog.ui.ControlRenderer');



/**
 * @param {string|!Array.<string>} className The CSS class name or list of
 *     class names to attach.
 * @param {!goog.ui.Component|!Array.<!goog.ui.Component>} component The
 *     component or list of components to put in the container.
 * @param {string?=} opt_heading Optional text heading.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.ClassContainer = function(
    className, component, opt_heading, opt_domHelper) {
  goog.base(this, className, opt_domHelper);

  if (goog.isDefAndNotNull(opt_heading)) {
    this.addChild(
        new goog.ui.Control(
            opt_heading,
            goog.ui.ControlRenderer.getCustomRenderer(
                goog.ui.ControlRenderer, cn.constants.HEADING_CLASS_NAME),
            opt_domHelper),
        true);
  }

  goog.array.forEach(goog.isArray(component) ? component : [component],
      function(comp) {
        this.addChild(comp, true);
      }, this);
};
goog.inherits(cn.ui.ClassContainer, cn.ui.ClassComponent);
