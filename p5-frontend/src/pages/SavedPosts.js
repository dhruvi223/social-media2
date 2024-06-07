import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {api} from '../api/api'

function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);

  const userId2 = JSON.stringify(localStorage.getItem("loggedinuserId"));
  const userId = userId2.slice(1, -1);

  useEffect(() => {
    const token2 = JSON.stringify(localStorage.getItem("token"));
    const token = token2.slice(1, -1);

    const asyncFn = async () => {
      const requestBody = {
        query: `query{
        bookings{
          user{
            _id
          }
          event{
            caption
            image
            creator{
              username
            }
          }
        }
        }`,
      };
    
      const data = await api(requestBody);
      setSavedPosts(data.bookings);

    };
    asyncFn();
  }, []);


  const myposts = savedPosts.filter((post) => {
    if (post.user._id == userId) {
      return post;
    }
  });
  
  return <div></div>;
}

export default SavedPosts;
