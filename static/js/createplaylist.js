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
    var songs_to_add = [];
    console.log("Submit Info: " + tempo + " " + givenName);
    $.ajax({
        url: 'https://api.spotify.com/v1/me/tracks',
        headers: {
          'Authorization': 'Bearer ' + authorization
        },
        success: function(response) {
          var faved_songs_string = JSON.stringify(response.items);
          // console.log(faved_songs_string);
          var faved_songs = response.items;
          songs_to_add = goThroughSongs(faved_songs, tempo);
        }
    });
    var playlist_id = null;
    $.ajax({
        url: 'https://api.spotify.com/v1/users/' + client_id + '/playlists',
        headers: {
          'Authorization': 'Bearer ' + authorization,
          'Content-Type': 'application/json'
        },
        data: "{\"name\":\"" + givenName + "\",\"public\":false}",
        success: function(response) {
            playlist_id = response.id
        }
    });
    $.ajax({
        url: 'https://api.spotify.com/v1/users/' + client_id + '/playlists/' + playlist_id + '/tracks',
        headers: {
          'Authorization': 'Bearer ' + authorization,
          'Content-Type': 'application/json'
        },
        data: '{"uris":' + songs_to_add + '}',
        success: function(response) {
        }
    });
     $.ajax({url: "result", success: function(result) {
     }});
}

function goThroughSongs(faved,tempoGiven) {
    console.log("I am in the other function");
    //go through faved to get the spotify track ID
    //with the track id look for tempo
    //if within range, add it to result
    var result = [];
    for(var i = 0; i < faved.length; i++){
        var track = faved[i];
        var track_id = track.id;
        var track_uri = track.uri;
        var track_tempo = 0;
        $.ajax({
            url: 'https://api.spotify.com/v1/audio-features/' + track_id,
            headers: {
              'Authorization': 'Bearer ' + authorization
            },
            success: function(response) {
              var track_tempo_string = JSON.stringify(response.tempo);
              track_tempo = response.tempo;
            }
        });
        if((tempoGiven - 5 <= track_tempo) || (track_tempo <= tempoGiven + 5)) {
            result.push(track_uri);
            if(result.length >= 100){
                break;
            }
        }
    }
    return result;
}