/**
 * @fileoverview An interface marking a model as resettable.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Resettable');



/**
 * @interface
 */
cn.model.Resettable = function() {};


/**
 * Resets all attributes.
 */
cn.model.Resettable.prototype.reset = function() {};
