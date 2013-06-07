/**
 * @fileoverview A canvas graphics wrapper class with built-in animation
 * support.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.AnimatedGameCanvas');

goog.require('cn.constants');
goog.require('cn.ui.GameCanvas');
goog.require('goog.dom.classes');
goog.require('goog.fx.anim');
goog.require('goog.fx.anim.Animated');



/**
 * @param {number=} opt_width The entire game's screen width.
 * @param {number=} opt_height The entire game's screen height.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.GameCanvas}
 * @implements {goog.fx.anim.Animated}
 */
cn.ui.AnimatedGameCanvas = function(opt_width, opt_height, opt_domHelper) {
  goog.base(this, opt_width, opt_height, opt_domHelper);
  this.update_ = goog.nullFunction;
  this.isAnimating_ = true;
};
goog.inherits(cn.ui.AnimatedGameCanvas, cn.ui.GameCanvas);


/**
 * @param {function(): boolean} canStep A function that returns true until the
 *     animation should end.
 * @param {function()} step A function that updates some model's appearance
 *     every step of the animation.
 * @param {function()} finish A function that runs after the animation ends.
 */
cn.ui.AnimatedGameCanvas.prototype.attachAnimation = function(
    canStep, step, finish) {
  this.update_ = goog.bind(function() {
    if (canStep()) {
      step();
    } else {
      this.detachAnimation();
      finish();
    }
  }, this);
  this.resume();
};


/**
 * Detaches the animation function.
 */
cn.ui.AnimatedGameCanvas.prototype.detachAnimation = function() {
  this.update_ = goog.nullFunction;
};


/**
 * Pauses all updates and animations.
 */
cn.ui.AnimatedGameCanvas.prototype.pause = function() {
  this.isAnimating_ = false;
};


/**
 * Pauses all updates and animations.
 */
cn.ui.AnimatedGameCanvas.prototype.resume = function() {
  this.isAnimating_ = true;
};


/**
 * Ensures that no animation continues when clearing the canvas.
 * @inheritDoc
 */
cn.ui.AnimatedGameCanvas.prototype.clear = function() {
  goog.base(this, 'clear');
  this.detachAnimation();
};


/**
 * @inheritDoc
 */
cn.ui.AnimatedGameCanvas.prototype.onAnimationFrame = function(now) {
  if (this.isAnimating_) {
    this.update_();
    this.redraw();
  }
};


/**
 * @inheritDoc
 */
cn.ui.AnimatedGameCanvas.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  goog.fx.anim.registerAnimation(this);
  goog.dom.classes.add(this.getElement(),
      cn.constants.ANIMATED_GAME_CANVAS_CLASS_NAME);
};


/**
 * The function called on every animation that updates model positions. This
 * function is set by the controller.
 * @type {function()}
 * @private
 */
cn.ui.AnimatedGameCanvas.prototype.update_;


/**
 * If true, updates and animations occur.
 * @type {boolean}
 * @private
 */
cn.ui.AnimatedGameCanvas.prototype.isAnimating_;
