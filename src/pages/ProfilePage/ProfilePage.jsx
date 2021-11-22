import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import Loading from "../../components/Loader/Loader";
import ProfileBio from "../../components/ProfileBio/ProfileBio";
import PostFeed from "../../components/PostFeed/PostFeed";
import { useParams } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import userService from "../../utils/userService";
import * as likesApi from "../../utils/likesApi";

export default function ProfilePage(props) {
    console.log(props, "on line 12")
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // This variable name is coming from the route definition in app.js
  const { username } = useParams();

  useEffect(() => {
    // async and await on this anoymous function ^

    getProfile();
  }, [username]);

  async function getProfile() {
    try {
      const data = await userService.getProfile(username);
      setPosts(data.posts);
      setUser(data.user);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function addLike(postId) {
    try {
      const data = await likesApi.create(postId);
      console.log(data, " <- this is data the response from likes create");
      getProfile();
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }

  async function removeLike(likesId) {
    try {
      const data = await likesApi.removeLike(likesId);
      console.log(data, " <- this is data the response from likes delete");
      getProfile(false);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }

  // Always check the error before loading, because if there is an error
  // we know something went wrong with the fetch call, therefore the http request
  // is complete
  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Grid celled container stackable>
      <Grid.Row columns={1}>
        <Grid.Column>
          <ProfileBio setUser={setUser} user={props.user} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
         {props.user.bio && props.user.bio}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column style={{ maxWidth: 750 }}>
          <PostFeed
            isProfile={true}
            posts={posts}
            numPhotosCol={3}
            user={props.user}
			addLike={addLike}
			removeLike={removeLike}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}







