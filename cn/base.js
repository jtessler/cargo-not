/**
 * @fileoverview The entry point.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn');

goog.require('cn.model.Game');
goog.require('cn.view.Animator');
goog.require('goog.array');
goog.require('goog.fx.anim');
goog.require('goog.graphics.CanvasGraphics');


/**
 * Sets up the UI and initializes all game code.
 */
cn.main = function() {
  var game = new cn.model.Game();
  var animator = new cn.view.Animator();
  animator.render(game);
  goog.fx.anim.registerAnimation(animator);
};
goog.exportSymbol('main', cn.main);
