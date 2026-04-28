/*
  Deadlock Box + Golden Statue minimap state tracker.
  Runtime-safe: no imports, no Dota-specific globals required.

  Public API (global):
  - BoxStatueMinimap.init(panel)
  - BoxStatueMinimap.onClaimed(spawnId)
  - BoxStatueMinimap.onRespawned(spawnId)
  - BoxStatueMinimap.resetAll()
*/

(function () {
  var STATE_AVAILABLE = 'available';
  var STATE_CLAIMED = 'claimed';

  var stateById = {};
  var iconById = {};
  var rootPanel = null;

  function createIcon(spawn) {
    var icon = $.CreatePanel('Panel', rootPanel, 'BoxStatueIcon_' + spawn.id);
    icon.AddClass('BoxStatueMinimapIcon');
    icon.SetHasClass('is-box', spawn.type === 'box');
    icon.SetHasClass('is-gold-statue', spawn.type === 'golden_statue');

    // Minimap coordinates are normalized [0..1].
    icon.style.position = (spawn.minimapX * 100.0) + '% ' + (spawn.minimapY * 100.0) + '% 0';
    icon.style.visibility = 'visible';

    iconById[spawn.id] = icon;
    stateById[spawn.id] = STATE_AVAILABLE;
  }

  function setVisible(spawnId, isVisible) {
    var icon = iconById[spawnId];
    if (!icon) {
      return;
    }

    icon.style.visibility = isVisible ? 'visible' : 'collapse';
  }

  function ensureInit(panel) {
    if (rootPanel) {
      return;
    }

    rootPanel = panel;
    rootPanel.AddClass('BoxStatueMinimapRoot');

    for (var i = 0; i < BoxStatueSpawnPoints.length; i += 1) {
      createIcon(BoxStatueSpawnPoints[i]);
    }
  }

  function onClaimed(spawnId) {
    if (stateById[spawnId] === undefined) {
      return;
    }

    stateById[spawnId] = STATE_CLAIMED;
    setVisible(spawnId, false);
  }

  function onRespawned(spawnId) {
    if (stateById[spawnId] === undefined) {
      return;
    }

    stateById[spawnId] = STATE_AVAILABLE;
    setVisible(spawnId, true);
  }

  function resetAll() {
    var ids = Object.keys(stateById);
    for (var i = 0; i < ids.length; i += 1) {
      stateById[ids[i]] = STATE_AVAILABLE;
      setVisible(ids[i], true);
    }
  }

  function getState(spawnId) {
    return stateById[spawnId];
  }

  $.GetContextPanel().BoxStatueMinimap = {
    init: ensureInit,
    onClaimed: onClaimed,
    onRespawned: onRespawned,
    resetAll: resetAll,
    getState: getState,
  };
})();
