/**
 * @fileoverview The level selector UI, represented as a TabBar subclass.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.LevelTabBar');

goog.require('cn.LevelData.levelpacks');
goog.require('cn.model.Game');
goog.require('goog.array');
goog.require('goog.string');
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

  // TODO(joseph): Handle this better.
  var levelpacks = [
    goog.getCssName('goog-tab-tutorial'),
    goog.getCssName('goog-tab-easy'),
    goog.getCssName('goog-tab-medium'),
    goog.getCssName('goog-tab-hard'),
    goog.getCssName('goog-tab-crazy'),
    goog.getCssName('goog-tab-impossible')
  ];
  goog.array.forEach(levelpacks, function(name) {
    var tab = new goog.ui.Tab(null);
    tab.setTooltip(goog.string.toTitleCase(name));
    tab.addClassName(name);
    this.addChild(tab, true);
  }, this);

  this.setSelectedTabIndex(0);
};
goog.inherits(cn.ui.LevelTabBar, goog.ui.TabBar);


/** @type {!cn.model.Game} @private */
cn.ui.LevelTabBar.prototype.game_;


/** @type {!cn.ui.GameUi} @private */
cn.ui.LevelTabBar.prototype.ui_;
