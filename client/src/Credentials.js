import dotenv from 'dotenv';
dotenv.config()

const Credentials = () => {

    return {
        ClientId: process.env.REACT_APP_SPOTIFY_API_ID,
        ClientSecret: process.env.REACT_APP_SPOTIFY_API_SECRET
    }
}

export { Credentials };