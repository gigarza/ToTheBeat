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

function play_beat() {
    var sound = document.getElementById('linkAudio');
    sound.play();
}

function submitInfo() {
    var givenTempo = document.getElementById('tempo_input').value;
    tempo = parseInt(givenTempo);
    var givenName = document.getElementById('playlist_name').value;
    var songs_to_add = null;
    console.log("Submit Info: " + tempo + " " + givenName);
    $.ajax({
        url: 'https://api.spotify.com/v1/me/tracks',
        headers: {
          'Authorization': 'Bearer ' + authorization
        },
        success: function(response) {
          var faved_songs = JSON.stringify(response);
          console.log(faved_songs);
          songs_to_add = goThroughSongs(faved_songs, tempo);
        }
    });
    $.ajax({
        url: 'https://api.spotify.com/v1/users/' + client_id +/playlists',
        headers: {
          'Authorization': 'Bearer ' + authorization,
          'Content-Type': 'application/json'
        },
        data: "{\"name\":\"" + givenName + "\",\"public\":false}",
        success: function(response) {
            //add the songs!
            //send to result
        }
    });
}

function goThroughSongs(faved,tempo) {
    //go through faved to get the spotify track ID
    //with the track id look for tempo
    //if within range, add it to result
}