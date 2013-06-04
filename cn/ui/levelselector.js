/**
 * @fileoverview The level selector UI, represented as two TabBar objects.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.ui.LevelSelector');

goog.require('cn.LevelData.levelpacks');
goog.require('cn.LevelData.levels');
goog.require('cn.constants');
goog.require('cn.model.Game');
goog.require('cn.ui.ClassComponent');
goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.ui.Component');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar');



/**
 * @param {!cn.model.Game} game The game model to render.
 * @param {!cn.ui.GameUi} ui A pointer to parent game UI.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {cn.ui.ClassComponent}
 */
cn.ui.LevelSelector = function(game, ui, opt_domHelper) {
  goog.base(this, cn.constants.LEVEL_SELECTOR_CLASS_NAME, opt_domHelper);
  this.game_ = game;
  this.ui_ = ui;

  // Setup the level pack selector, e.g. "Easy", "Medium", "Hard".
  this.levelpackTabBar_ = new goog.ui.TabBar(
      goog.ui.TabBar.Location.TOP, null, opt_domHelper);
  this.levelTabBars_ = [];
  this.addChild(this.levelpackTabBar_, true);

  // Setup the level selectors for each level pack.
  goog.object.forEach(cn.LevelData.levelpacks, function(levels, name) {
    var tab = new goog.ui.Tab(null);
    tab.setTooltip(name);
    this.levelpackTabBar_.addChild(tab, true);

    var levelTabBar = new goog.ui.TabBar(
        goog.ui.TabBar.Location.START, null, opt_domHelper);
    goog.array.forEach(levels, function(level) {
      levelTabBar.addChild(new goog.ui.Tab(level), true);
    });
    levelTabBar.setVisible(false);
    this.levelTabBars_.push(levelTabBar);

    this.addChild(levelTabBar, true);
  }, this);
};
goog.inherits(cn.ui.LevelSelector, cn.ui.ClassComponent);


/**
 * @inheritDoc
 */
cn.ui.LevelSelector.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // Event handler for level pack selector.
  this.getHandler().listen(this.levelpackTabBar_,
      goog.ui.Component.EventType.SELECT,
      function(e) {
        goog.array.forEach(this.levelTabBars_, function(levelTabBar, index) {
          levelTabBar.setVisible(
              index == this.levelpackTabBar_.getSelectedTabIndex());
        }, this);
      });
  this.levelpackTabBar_.setSelectedTabIndex(0);

  // Event handler for each level selector.
  goog.array.forEach(this.levelTabBars_, function(levelTabBar) {
    this.getHandler().listen(levelTabBar,
        goog.ui.Component.EventType.SELECT,
        function(e) {
          // Deselect all other levels.
          goog.array.forEach(this.levelTabBars_, function(otherTabBar) {
            if (levelTabBar !== otherTabBar) {
              otherTabBar.setSelectedTabIndex(-1);
            }
          }, this);
          var levelName = levelTabBar.getSelectedTab().getCaption();
          var levelData = cn.LevelData.levels[levelName];
          cn.controller.loadLevel(this.game_, this.ui_, levelName, levelData);
        });
  }, this);
  this.levelTabBars_[0].setSelectedTabIndex(0);
};


/** @type {!goog.ui.TabBar} @private */
cn.ui.LevelSelector.prototype.levelpackTabBar_;


/** @type {!Array.<!goog.ui.TabBar>} @private */
cn.ui.LevelSelector.prototype.levelTabBars_;


/** @type {!cn.model.Game} @private */
cn.ui.LevelSelector.prototype.game_;


/** @type {!cn.ui.GameUi} @private */
cn.ui.LevelSelector.prototype.ui_;
