/**
 * @fileoverview The select wrapper for levels.
 *
 * @author joseph@cs.utexas.edu (Joe Tessler)
 */

goog.provide('cn.view.LevelSelector');

goog.require('cn.LevelData.levelpacks');
goog.require('cn.LevelData.levels');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.object');



/**
 * @param {!cn.model.Game} game The game model.
 * @param {!cn.view.Goal} goal The goal configuration view.
 * @param {!cn.view.Animator} animator The animator window.
 * @param {!cn.view.ProgramEditor} editor The program editor view.
 * @param {Element=} opt_parent Optional parent to render into.
 * @constructor
 */
cn.view.LevelSelector = function(game, goal, animator, editor, opt_parent) {
  var parentElement = opt_parent || goog.dom.getDocument().body;
  var div = goog.dom.createDom('div');
  goog.object.forEach(cn.LevelData.levelpacks, function(levels, name) {
    var selector = goog.dom.createDom('select');
    selector.appendChild(goog.dom.createDom('option', null, name));
    goog.array.forEach(levels, function(level) {
      selector.appendChild(goog.dom.createDom('option', null, level));
    });
    div.appendChild(selector);
    goog.events.listen(selector, goog.events.EventType.CHANGE, function(e) {
      if (e.target.value != name) {
        var levelData = cn.LevelData.levels[e.target.value];
        cn.controller.loadLevel(
            game, goal, animator, editor, e.target.value, levelData);
      }
    });
  });
  goog.dom.insertChildAt(parentElement, div, 0);
};
