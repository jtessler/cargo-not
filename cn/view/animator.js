/**
 * @fileoverview The canvas graphics wrapper and all drawing logic.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.view.Animator');

goog.require('cn.constants');
goog.require('cn.model.Game');
goog.require('goog.fx.anim');
goog.require('goog.fx.anim.Animated');
goog.require('goog.graphics.CanvasGraphics');



/**
 * @param {Element=} opt_parent Optional parent to render into.
 * @param {number=} opt_width The entire game's screen width.
 * @param {number=} opt_height The entire game's screen height.
 * @constructor
 * @implements {goog.fx.anim.Animated}
 */
cn.view.Animator = function(opt_parent, opt_width, opt_height) {
  this.canvas_ = new goog.graphics.CanvasGraphics(
      opt_width || cn.constants.GAME_WIDTH,
      opt_height || cn.constants.GAME_HEIGHT);
  this.update_ = goog.nullFunction;
  this.isAnimating_ = true;
  goog.fx.anim.registerAnimation(this);
  this.canvas_.render(opt_parent);
};


/**
 * The underlying graphics implementation.
 * @type {!goog.graphics.CanvasGraphics}
 * @private
 */
cn.view.Animator.prototype.canvas_;


/**
 * The function called on every animation that updates model positions. This
 * function is set by the controller.
 * @type {function()}
 * @private
 */
cn.view.Animator.prototype.update_;


/**
 * If true, updates and animations occur.
 * @type {boolean}
 * @private
 */
cn.view.Animator.prototype.isAnimating_;


/**
 * Initializes the given canvas by scaling and drawing the game models at the
 * appropriate positions.
 * @param {!cn.model.Game} game The game model to draw.
 */
cn.view.Animator.prototype.render = function(game) {
  this.canvas_.clear();
  this.renderModel_(game);
};


/**
 * Draws a given model with its corresponding stroke and fill styles. If the
 * model is composed of any sub-models, those are recursively drawn as well.
 * @param {!cn.model.PathModel} model The model to draw.
 * @private
 */
cn.view.Animator.prototype.renderModel_ = function(model) {
  this.canvas_.drawPath(model.path, model.stroke, model.fill);
  model.forEachSubModel(function(model) { this.renderModel_(model); }, this);
};


/**
 * @param {function(): boolean} canStep A function that returns true until the
 *     animation should end.
 * @param {function()} step A function that updates some model's appearance
 *     every step of the animation.
 * @param {function()} finish A function that runs after the animation ends.
 */
cn.view.Animator.prototype.attachAnimation = function(canStep, step, finish) {
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
cn.view.Animator.prototype.detachAnimation = function() {
  this.update_ = goog.nullFunction;
};


/**
 * Pauses all updates and animations.
 */
cn.view.Animator.prototype.pause = function() {
  this.isAnimating_ = false;
};


/**
 * Pauses all updates and animations.
 */
cn.view.Animator.prototype.resume = function() {
  this.isAnimating_ = true;
};


/**
 * @inheritDoc
 */
cn.view.Animator.prototype.onAnimationFrame = function(now) {
  if (this.isAnimating_) {
    this.update_();
    this.canvas_.redraw();
  }
};
