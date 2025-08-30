import React, { useEffect } from "react";
import { getAccessTokenFromCode } from "../spotifyAuth";

export default function Callback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      getAccessTokenFromCode(code)
        .then(() => {
          window.location.href = "/";
        })
        .catch(err => {
          console.error(err);
          alert("Failed to authenticate with Spotify");
        });
    }
  }, []);

  return <p>Authenticating with Spotify...</p>;
}
