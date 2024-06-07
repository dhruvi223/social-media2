import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@mui/material";

//api import
import {api} from '../api/api'

function Home() {
  const [allPosts, setAllPosts] = useState([]);

  const handleSavePost = async (id) => { 
    console.log(id);

    const token2 = JSON.stringify(localStorage.getItem("token"));
    const token = token2.slice(1, -1);

    const requestBody = {
      query: `
      mutation{
        bookEvent(eventId:"${id}"){
          createdAt
          event{
            caption
          }
        }
      }
      `,
    };

    const response = await api(requestBody);

   }

  useEffect(() => {
    const asyncFn = async () => {
      const requestBody = {
        query: `query{
              events{
               _id
               caption
               date
               image
             }
             }`,
      };


      const response = await api(requestBody);
      setAllPosts(response.events);
    };
    asyncFn();
  }, []);


  return <div>
    {
      Object.keys(allPosts).map((key) => (
        <Button onClick={() => {handleSavePost(allPosts[key]._id)}}>{allPosts[key].caption}</Button>
      ))
    }
  </div>;
}

export default Home;
