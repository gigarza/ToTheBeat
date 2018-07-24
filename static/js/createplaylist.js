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
        }, complete: function (response) {
             console.log(songs_to_add);
                var playlist_id = null;
                var jsonData = {
                  "name": givenName.toString(),
                  "public": false
                };
                $.ajax({
                    type: "POST",
                    url: 'https://api.spotify.com/v1/users/' + client_id + '/playlists',
                    headers: {
                      'Authorization': 'Bearer ' + authorization
                    },
                    contentType: 'application/json',
                    data: JSON.stringify(jsonData),
                    dataType: 'json',
                    success: function(response) {
                        playlist_id = response.id;
                        console.log(JSON.stringify(response));
                        var json_Songs = {
                          "uris": songs_to_add
                        };
                            $.ajax({
                                type: "POST",
                                url: 'https://api.spotify.com/v1/users/' + client_id + '/playlists/' + playlist_id + '/tracks',
                                headers: {
                                  'Authorization': 'Bearer ' + authorization
                                },
                                contentType: 'application/json',
                                data: JSON.stringify(json_Songs),
                                dataType: 'json',
                                success: function(response) {
                                    console.log("I got here!");
                                    $.ajax({url: "playlist_info", data: {name: givenName, num: songs_to_add.length, tempo: givenTempo, id: playlist_id}});
                                    $('#result_end').text("*Playlist Created! Click Here to view info!*");
                                    console.log("I got here p2");
                                }
                            });
                    }
                });
        }
    });
}

function goThroughSongs(faved,tempoGiven) {
    console.log("I am in the other function");
    var result = [];
    for(var i = 0; i < faved.length; i++){
        var curr_track = faved[i];
        var track_id = curr_track.track.id;
        var track_uri = curr_track.track.uri;
        // console.log("Track: " + JSON.stringify(curr_track) + " ID: " + JSON.stringify(track_id) + " URI: " + JSON.stringify(track_uri));
        var track_tempo = 0;
        $.ajax({
            url: 'https://api.spotify.com/v1/audio-features/' + track_id,
            headers: {
              'Authorization': 'Bearer ' + authorization
            },
            success: function(response) {
              // console.log("TEMPO: " + response.tempo);
              track_tempo = parseInt(response.tempo);
               if((tempoGiven - 5 <= track_tempo) && (track_tempo <= tempoGiven + 5)) {
                    result.push(response.uri);
                }
            }
        });
    }
    // console.log("End of goThroughSongs: " + result.toString());
    return result;
}