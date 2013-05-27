/**
 * @fileoverview The level selector UI, represented as a TabBar subclass.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.LevelTabBar');

goog.require('cn.LevelData.levelpacks');
goog.require('cn.model.Game');
goog.require('goog.object');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar');



/**
 * @param {!cn.model.Game} game The game model to render.
 * @param {!cn.ui.GameUi} ui A pointer to parent game UI.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.TabBar}
 */
cn.ui.LevelTabBar = function(game, ui, opt_domHelper) {
  goog.base(this, goog.ui.TabBar.Location.TOP, null, opt_domHelper);
  this.game_ = game;
  this.ui_ = ui;

  goog.object.forEach(cn.LevelData.levelpacks, function(levels, name) {
    this.addChild(new goog.ui.Tab(name), true);
  }, this);
};
goog.inherits(cn.ui.LevelTabBar, goog.ui.TabBar);


/** @type {!cn.model.Game} @private */
cn.ui.LevelTabBar.prototype.game_;


/** @type {!cn.ui.GameUi} @private */
cn.ui.LevelTabBar.prototype.ui_;
