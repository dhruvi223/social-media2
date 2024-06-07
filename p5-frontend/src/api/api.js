import axios from "axios";

export const api = async (requestBody) => { 


    const token2 = JSON.stringify(localStorage.getItem("token"));
    const token = token2.slice(1, -1);
    try {
        const response = await axios.post(
          "http://localhost:8000/graphql",
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }

}



