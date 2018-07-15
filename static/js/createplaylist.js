var tempo = 0;
var bps = 60/tempo;
var bpms = bps*1000;

function updateTempo() {
    var givenTempo = document.getElementById('tempo_input').value;
    tempo = parseInt(givenTempo);
    bps = 60/tempo;
    bpms = bps*1000;
    console.log("tempo updated: " + bps);
}

function playtempo() {
    console.log("Play Tempo");
    setInterval(play_beat, bpms);
}

function submitInfo() {
    var givenTempo = document.getElementById('tempo_input').value;
    tempo = parseInt(givenTempo);
    var givenName = document.getElementById('playlist_name').value;
    console.log("Submit Info: " + tempo + " " + givenName);
    $.ajax({
        url: 'https://api.spotify.com/v1/me/tracks',
        headers: {
          'Authorization': 'Bearer ' + authorization
        },
        success: function(response) {
          var faved_songs = response;
          console.log(response);
        }
    });
}

function play_beat() {
    var sound = document.getElementById('linkAudio');
    sound.play();
}