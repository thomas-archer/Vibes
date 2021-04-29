import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import { createPost } from '../../actions/posts';
import useStyles from './styles';

import Dropdown from './Dropdown';
import { Credentials } from '../../Credentials';
import axios from "axios"

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ genre: ''});
  const post = useSelector((state) => (currentId ? state.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));


  const spotify = Credentials(); 

  const [token, setToken] = useState('');
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});

  useEffect(() => {

        axios('https://accounts.spotify.com/api/token', {
            headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
        .then(tokenResponse => {      
            setToken(tokenResponse.data.access_token);

            axios(' https://api.spotify.com/v1/recommendations/available-genre-seeds', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
            })
            .then (genreResponse => {        
              setGenres({
                  selectedGenre: genres.selectedGenre,
                  listOfGenresFromAPI: genreResponse.data.genres
              })
            });

        
        });
    }, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]);

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ genre: '' });
  };

  const genreChanged = val => {
    setGenres({
      selectedGenre: val, 
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    var ran_track;
    var q = encodeURIComponent(genres.selectedGenre)
    axios(`https://api.spotify.com/v1/search?q=genre:%22${q}%22&type=track&limit=50`, {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + token
        }
    })
    .then(tracksResponse => {
        if(tracksResponse.data.tracks.items.length>=49) {
          var ran_track_num = Math.floor(Math.random(10)*50)
          ran_track = tracksResponse.data.tracks.items[ran_track_num].id
          dispatch(createPost({ ...postData, name: user?.result?.name, spotify_id: ran_track, genre: genres.selectedGenre }))
          clear()
        }
        //If genre is invalid
        else {
          console.log('Invalid Genre')
          clear()
        }
    });
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please sign in to generate random songs.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post.genre}"` : 'Generate a random song'}</Typography>
        <Dropdown label="Genre :" fullWidth variant='outlined'  options={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} changed={genreChanged} />

        {/* <TextField name="genre" variant="outlined" label="Genre" fullWidth value={postData.genre} onChange={(e) => setPostData({ ...postData, genre: e.target.value })} /> */}

        {/* <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div> */}
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        {/* <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button> */}
      </form>
    </Paper>
  );
};

export default Form;
