let TidalClient = require('../');
let credentials = require('./.config.json');

let api = new TidalClient(credentials.tidal);

async function test_playlists(delete_playlist_after_testing) {

  // get the id of the current user
  let user_id = await api.getMyID();
  console.log(user_id);

  // query more information about current user
  let user = await api.getUser({id: user_id});
  console.log(user);

  // get all playlists of current user
  let result = await api.getPlaylists({id: user_id});
  let current_playlists = result.items;
  let playlists_resume = current_playlists.map(playlist => playlist.title).filter((value, index) => index < 5);
  console.log('listing first 5 playlists of current user: \n',playlists_resume)

  // search some musics
  let track_results = await api.search({type: 'tracks', query: 'The Beatles', limit: 10});
  let beatles_tracks = track_results.tracks.items;
  let beatles_tracks_resume = beatles_tracks.map(playlist => playlist.title);
  console.log('list of beatles tracks:',beatles_tracks_resume);

  // lookup for a specific playlist
  let TEST_PLAYLIST = 'Test playlist'
  let filtered_playlists = current_playlists.filter( playlist => playlist.title == TEST_PLAYLIST );
  let test_playlist = filtered_playlists[0]

  // create a new playlist if necessary
  if (test_playlist == undefined){
    test_playlist = await api.createPlaylist({title: TEST_PLAYLIST, description: 'Automatically created playlist.'});
    console.log('created a new playlist.')
  }
  console.log('test playlist uuid is:' + test_playlist.uuid)

  // add musics to the beginning of the playlist
  result = await api.addPlaylistTracks({playlist: test_playlist, tracks: beatles_tracks, toIndex: 0});
  console.log(beatles_tracks.length + ' tracks added to playlist ', result);

  // get tracks in the playlist
  result = await api.getPlaylistTracks({playlist: test_playlist})
  let musics_on_test_playlist = result.items;
  let number_of_musics_on_test_playlist = result.totalNumberOfItems;
  console.log('Musics on the playlist now : \n',number_of_musics_on_test_playlist);

  // we added new music to the beginning. so we can delete old musics from the end.
  let number_of_musics_to_keep = beatles_tracks.length;
  let number_of_musics_to_delete = number_of_musics_on_test_playlist - number_of_musics_to_keep;
  let positions_to_delete = [...Array(number_of_musics_to_delete).keys()].map(v => v+number_of_musics_to_keep);
  result = await api.deletePlaylistTracks({playlist: test_playlist, trackPositions: positions_to_delete});
  console.log(number_of_musics_to_delete + ' tracks deleted from the playlist');

  // get tracks in the playlist again
  result = await api.getPlaylistTracks({playlist: test_playlist})
  musics_on_test_playlist = result.items;
  number_of_musics_on_test_playlist = result.totalNumberOfItems;
  console.log('Musics on the playlist now : \n',number_of_musics_on_test_playlist);

  if (delete_playlist_after_testing) {
    result = await api.deletePlaylist(test_playlist);
    console.log('Playlist deleted. \n')
  }

}

let DELETE_PLAYLIST_AFTER_TEST = true;

test_playlists(DELETE_PLAYLIST_AFTER_TEST);
