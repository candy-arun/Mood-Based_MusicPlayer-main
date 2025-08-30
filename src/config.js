export const SPOTIFY_CLIENT_ID = "2f210d2823734e9094857ae5580b4de2"; // From Spotify Dev Dashboard
export const SPOTIFY_REDIRECT_URI = "http://127.0.0.1:5173/callback";
export const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-modify-playback-state",
  "user-read-playback-state"
].join("%20"); // Encode spaces

export const MOOD_PLAYLISTS = {
  happy: "37i9dQZF1DXdPec7aLTmlC",     // Feel-Good Pop
  sad: "37i9dQZF1DX7qK8ma5wgG1",       // Sad Songs
  angry: "37i9dQZF1DWY6tYEFs22tT",     // Rock Hard
  surprised: "37i9dQZF1DWU0ScTcjJBdj", // Fresh Finds
  neutral: "37i9dQZF1DX4WYpdgoIcn6"    // Chill
};
