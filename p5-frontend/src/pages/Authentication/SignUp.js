import bgimage from "../../assets/socialmedia.webp";

// react imports
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// mui imports
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// constant imports
import {
  emailRegex,
  passwordRegex,
  mobileRegex,
  fullnameRegex,
  emailMessages,
  passwordMessages,
  mobileMessages,
  name,
} from "../../constants/constants";

export default function Signup() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, } = useForm();

  // signup
  const onSubmit = async (data) => {

    if (data.password === data.cpassword){
      const requestBody = {
        query: `mutation {
          createUser(userInput: {
            username: "${data.username}",
            name: "${data.name}",
            email: "${data.email}",
            mobile: "${data.mobile}",
            password: "${data.password}",})
            {
              _id
              email
            }
          }`,
        };
        
        try {
          const response = await axios.post("http://localhost:8000/graphql", requestBody, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          if (response.status !== 200 && response.status !== 201) {
            throw new Error("Failed!");
          }
          if (response.data.errors !== undefined) {

            console.log(response.data.errors[0].message.slice(0, 6));
            if (response.data.errors[0].message === "User exist already") {
              toast.error("User exist already");
            }
            if(response.data.errors[0].message.slice(0, 6) === "E11000"){
              toast.error("username is not available");
            }
          }
          else{
            toast.success("Successfully Signed Up");
            navigate("/signin");
          }
          
          return response;
        } catch (error) {
          console.log(error);
        }
        
      }
      else{
        toast.error("Passwords don't match");
      }

  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "93vh" }}>
      <Box
        sx={{
          height: "100vh",
          width: { xl: "75%", lg: "60%", md: "50%", sm: "0%", xs: "0%" },
          backgroundImage: `url(${bgimage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></Box>
      <Box
        sx={{
          width: { xl: "25%", lg: "40%", md: "50%", sm: "100%", xs: "100%" },
          height: "500px",
        }}
      >
        <Container
          component="main"
          sx={{ width: 450, marginTop: 0, paddingTop: 20 }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    autoComplete="given-name"
                    name="fullName"
                    required
                    fullWidth
                    id="fullName"
                    label="Full Name"
                    autoFocus
                    {...register("fullName", {
                      required: true,
                      pattern: fullnameRegex,
                    })}
                  />
                  
                  {errors.fullName && (
                    <Box
                      component="p"
                      sx={{ color: "red", textAlign: "left", fontSize: 14 }}
                    >
                      {name.fullName}
                    </Box>
                  )}
                </Grid>


                <Grid item xs={6}>
                  <TextField
                    autoComplete="given-name"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="username"
                    autoFocus
                    {...register("username", {
                      required: true,
                      // pattern: fullnameRegex,
                    })}
                  />
                  
                  {/* {errors.fullName && (
                    <Box
                      component="p"
                      sx={{ color: "red", textAlign: "left", fontSize: 14 }}
                    >
                      {name.fullName}
                    </Box>
                  )} */}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    {...register("email", {
                      required: true,
                      pattern: emailRegex,
                    })}
                  />
                  {errors.email && (
                    <Box
                      component="p"
                      sx={{ color: "red", textAlign: "left", fontSize: 15 }}
                    >
                      {emailMessages.invalid}
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="mobile"
                    label="Mobile number"
                    name="mobile"
                    autoComplete="mobile"
                    {...register("mobile", {
                      required: true,
                      pattern: mobileRegex,
                      minLength: 10,
                      maxLength: 10,
                    })}
                  />
                  {errors.mobile && (
                    <Box
                      component="p"
                      sx={{ color: "red", textAlign: "left", fontSize: 15 }}
                    >
                      {mobileMessages.invalid}
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    {...register("password", {
                      required: true,
                      pattern: passwordRegex,
                    })}
                  />
                  {errors.password && (
                    <Box
                      component="p"
                      sx={{ color: "red", textAlign: "left", fontSize: 15 }}
                    >
                      {passwordMessages.weak}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="cpassword"
                    label="Confirm Password"
                    type="password"
                    id="cpassword"
                    autoComplete="confirm-password"
                    {...register("cpassword", {
                      required: true,
                      pattern: passwordRegex,
                    })}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/signin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}