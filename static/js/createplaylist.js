/* Global variables for tempo information */
var tempo = 0;
var bps = 60/tempo;
var bpms = bps*1000;

/* Update the tempo as the user inputs; Calculate number of seconds between beats */
function updateTempo() {
    var givenTempo = document.getElementById('tempo_input').value;
    tempo = parseInt(givenTempo);
    bps = 60/tempo;
    bpms = bps*1000;
}

/* Play the music track according to the tempo */
function playtempo() {
    setInterval(play_beat, bpms);
}

/* Play the audio track for the beat */
function play_beat() {
    var sound = document.getElementById('linkAudio');
    sound.play();
}

/* Overall function to create playlist once user has clicked 'Submit' */
function submitInfo() {
    /* Grab user specified info */
    var givenTempo = document.getElementById('tempo_input').value;
    tempo = parseInt(givenTempo);
    var givenName = document.getElementById('playlist_name').value;
    var songs_to_add = [];
    /* Grab a user's "Favorite Songs" */
    $.ajax({
        url: 'https://api.spotify.com/v1/me/tracks',
        headers: {
          'Authorization': 'Bearer ' + authorization
        },
        success: function(response) {
          var faved_songs_string = JSON.stringify(response.items);
          var faved_songs = response.items;
          songs_to_add = goThroughSongs(faved_songs, tempo);
        }, complete: function (response) {
                var playlist_id = null;
                var jsonData = {
                  "name": givenName.toString(),
                  "public": false
                };
                /* Create a new playlist with user's given name for it */
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
                        var json_Songs = {
                          "uris": songs_to_add
                        };
                        /* Add the songs which match tempo range to the newly created playlist */
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
                                    /* Update frontend and backend accordingly */
                                    $.ajax({url: "playlist_info", data: {name: givenName, num: songs_to_add.length, tempo: givenTempo, id: playlist_id}});
                                    $('#result_end').text("*Playlist Created! Click Here to view info!*");
                                }
                            });
                    }
                });
        }
    });
}

/* Find the songs amongst the user's "Favorite Songs" which is in the appropriate range of the tempo given */
function goThroughSongs(faved,tempoGiven) {
    var result = [];
    for(var i = 0; i < faved.length; i++){
        var curr_track = faved[i];
        var track_id = curr_track.track.id;
        var track_uri = curr_track.track.uri;
        var track_tempo = 0;
        $.ajax({
            url: 'https://api.spotify.com/v1/audio-features/' + track_id,
            headers: {
              'Authorization': 'Bearer ' + authorization
            },
            success: function(response) {
              track_tempo = parseInt(response.tempo);
               if((tempoGiven - 5 <= track_tempo) && (track_tempo <= tempoGiven + 5)) {
                    result.push(response.uri);
                }
            }
        });
    }
    return result;
}