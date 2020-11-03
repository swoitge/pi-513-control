var player, targetLatency, minDrift, catchupPlaybackRate, liveCatchupLatencyThreshold;

function init() {
    var video,
        url = "http://localhost:8080/glass_live_manifest.mpd";

    video = document.querySelector("video");
    player = dashjs.MediaPlayer().create();
    player.initialize(video, url, true);
    player.updateSettings({'streaming': {'lowLatencyEnabled': true}});

    //applyParameters();

    return player;
}

function applyParameters() {
    targetLatency = parseFloat(document.getElementById("target-latency").value, 10);
    minDrift = parseFloat(document.getElementById("min-drift").value, 10);
    catchupPlaybackRate = parseFloat(document.getElementById("catchup-playback-rate").value, 10);
    liveCatchupLatencyThreshold = parseFloat(document.getElementById("catchup-threshold").value, 10);

    player.updateSettings({
        'streaming': {
            'liveDelay': targetLatency,
            'liveCatchUpMinDrift': minDrift,
            'liveCatchUpPlaybackRate': catchupPlaybackRate,
            "liveCatchupLatencyThreshold": liveCatchupLatencyThreshold,
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  var player = init();

  setInterval(function () {
      var dashMetrics = player.getDashMetrics();
      var settings = player.getSettings();

      var currentLatency = parseFloat(player.getCurrentLiveLatency(), 10);
      document.getElementById("latency-tag").innerHTML = currentLatency + " secs";

      document.getElementById("mindrift-tag").innerHTML = settings.streaming.liveCatchUpMinDrift + " secs";

      var currentPlaybackRate = player.getPlaybackRate();
      document.getElementById("playbackrate-tag").innerHTML = Math.round(currentPlaybackRate * 100) / 100;

      var currentBuffer = dashMetrics.getCurrentBufferLevel("video");
      document.getElementById("buffer-tag").innerHTML = currentBuffer + " secs";

      document.getElementById("catchup-threshold-tag").innerHTML = settings.streaming.liveCatchupLatencyThreshold + " secs";

  }, 200);
});
