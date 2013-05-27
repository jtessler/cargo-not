/**
 * @fileoverview The base UI class composed of every game-related UI component.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.model.Game');
goog.provide('cn.ui.GameUi');

goog.require('goog.ui.Component');



/**
 * @param {!cn.model.Game} game The game model to render.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.Component}
 */
cn.ui.GameUi = function(game, opt_domHelper) {
  goog.base(this, opt_domHelper);

  // TODO(joseph): Implement these classes.
  this.levelSelector = new cn.ui.LevelTabBar(game, this);
  this.goalCanvas = new cn.ui.GameCanvas(game, this);
  this.animatedCanvas = new cn.ui.AnimatedGameCanvas(game, this);
  this.controls = new cn.ui.Controls(game, this);
  this.programEditor = new cn.ui.ProgramEditor(game, this);

  this.addChild(this.levelSelector);
  this.addChild(this.goalCanvas);
  this.addChild(this.animatedCanvas);
  this.addChild(this.controls);
  this.addChild(this.programEditor);
};
goog.inherits(cn.ui.GameUi, goog.ui.Component);


/**
 * @inheritDoc
 */
cn.ui.GameUi.prototype.decorateInternal = function(element) {
  goog.base(element, 'decorateInternal', element);
  goog.style.setStyle(element, {
    'text-align': 'center',
    'background-color': 'lightgray',
    'padding': '25px'
  });
};
