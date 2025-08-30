import react from "react";
import { useState, useEffect } from "react";
import {userPrams} from "react-router-dom";


function Dashboard() {

    const { username } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect (() => {
        fetch(`/profile/${username}`)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Failed to fetch profile");
            }
        })
        .then((data) => setProfile(data))
        .catch((err) => console.error(err));
    })

  if(!profile) {
    return <div>Loading...</div>;
  }
    return (
        <>
            <h1>{profile.username}</h1>
            {console.log(profile)}
        </>
  );
}

export default Dashboard;