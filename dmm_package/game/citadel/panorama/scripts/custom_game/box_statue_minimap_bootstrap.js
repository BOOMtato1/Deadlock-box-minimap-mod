/*
  Integration entrypoint.
  Wire this into whatever existing HUD script loads in your current mod stack.

  Required:
  1) Include this script + box_statue_minimap_data.js + box_statue_minimap.js.
  2) Call BoxStatueMinimap.init(minimapPanel) once minimap panel exists.
  3) Call onClaimed/onRespawned from game events.
*/

(function () {
  function findMinimapPanel() {
    // Adjust selector to your current HUD layout.
    return $('#MinimapContainer') || $('#Minimap') || $.GetContextPanel();
  }

  function initWhenReady() {
    var minimap = findMinimapPanel();
    if (!minimap || !$.GetContextPanel().BoxStatueMinimap) {
      $.Schedule(0.25, initWhenReady);
      return;
    }

    $.GetContextPanel().BoxStatueMinimap.init(minimap);
  }

  initWhenReady();

  // Replace with your real event subscriptions.
  // Example pseudo-events:
  // GameEvents.Subscribe('box_claimed', function(ev){ $.GetContextPanel().BoxStatueMinimap.onClaimed(ev.spawn_id); });
  // GameEvents.Subscribe('box_respawned', function(ev){ $.GetContextPanel().BoxStatueMinimap.onRespawned(ev.spawn_id); });
})();
