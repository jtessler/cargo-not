/**
 * @fileoverview The controls, e.g. play and pause, encapsulated as a collection
 * of buttons and a slider in a div.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.Controls');

goog.require('cn.constants');
goog.require('cn.ui.ClassComponent');
goog.require('goog.ui.Button');
goog.require('goog.ui.Slider');



/**
 * @param {!cn.model.Game} game The game model to render.
 * @param {!cn.ui.GameUi} ui A pointer to parent game UI.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.Controls = function(game, ui, opt_domHelper) {
  goog.base(this, cn.constants.CONTROLS_CLASS_NAME, opt_domHelper);
  this.game_ = game;
  this.ui_ = ui;

  var newButton = function(tooltip) {
    var button = new goog.ui.Button(null);
    button.setTooltip(tooltip);
    return button;
  };
  this.playButton_ = newButton('Play');
  this.pauseButton_ = newButton('Pause');
  this.rewindButton_ = newButton('Rewind');
  this.resetButton_ = newButton('Reset');
  this.hintButton_ = newButton('Show Hint');
  this.slider_ = new goog.ui.Slider();

  this.pauseButton_.setEnabled(false);
  this.rewindButton_.setEnabled(false);
  this.slider_.setMinimum(cn.constants.BOT_SPEED_MIN);
  this.slider_.setMaximum(cn.constants.BOT_SPEED_MAX);
  this.slider_.setMoveToPointEnabled(true);

  this.addChild(this.playButton_, true);
  this.addChild(this.pauseButton_, true);
  this.addChild(this.rewindButton_, true);
  this.addChild(this.resetButton_, true);
  //this.addChild(this.hintButton_, true);
  this.addChild(this.slider_, true);
};
goog.inherits(cn.ui.Controls, cn.ui.ClassComponent);


/**
 * @inheritDoc
 */
cn.ui.Controls.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var EventType = goog.ui.Component.EventType;

  // Event handler for the play button.
  this.getHandler().listen(this.playButton_, EventType.ACTION, function() {
    if (this.rewindButton_.isEnabled()) {
      //cn.controller.resume(animator);
    } else {
      //cn.controller.play(game, animator, this);
    }
    this.playButton_.setEnabled(false);
    this.pauseButton_.setEnabled(true);
    this.rewindButton_.setEnabled(true);
    this.resetButton_.setEnabled(false);
  });

  // Event handler for the pause button.
  this.getHandler().listen(this.pauseButton_, EventType.ACTION, function() {
    //cn.controller.pause(animator);
    this.pauseButton_.setEnabled(false);
    this.playButton_.setEnabled(true);
  });

  // Event handler for the rewind button.
  this.getHandler().listen(this.rewindButton_, EventType.ACTION, function() {
    cn.controller.reset(this.game_, this.ui_);
  });

  // Event handler for the reset button.
  this.getHandler().listen(this.resetButton_, EventType.ACTION, function() {
    /*cn.controller.clearProgram(game);
    this.forEachRegisterElement_(function(r, c, element) {
      if (c != 0) {
        goog.dom.removeChildren(element);
      }
    });*/
  });

  // Event handler for the game speed slider.
  this.getHandler().listen(this.slider_, EventType.CHANGE, function() {
    cn.controller.setBotSpeed(this.game_, this.slider_.getValue());
  });
};


/**
 * Reset the state of all control buttons.
 */
cn.ui.Controls.prototype.reset = function() {
  this.playButton_.setEnabled(true);
  this.pauseButton_.setEnabled(false);
  this.rewindButton_.setEnabled(false);
  this.resetButton_.setEnabled(true);
};


/** @type {!cn.model.Game} @private */
cn.ui.Controls.prototype.game_;


/** @type {!cn.ui.GameUi} @private */
cn.ui.Controls.prototype.ui_;


/** @type {!goog.ui.Button} @private */
cn.view.ProgramEditor.prototype.playButton_;


/** @type {!goog.ui.Button} @private */
cn.view.ProgramEditor.prototype.pauseButton_;


/** @type {!goog.ui.Button} @private */
cn.view.ProgramEditor.prototype.rewindButton_;


/** @type {!goog.ui.Button} @private */
cn.view.ProgramEditor.prototype.resetButton_;


/** @type {!goog.ui.Button} @private */
cn.view.ProgramEditor.prototype.hintButton_;


/** @type {!goog.ui.Slider} @private */
cn.view.ProgramEditor.prototype.slider_;
