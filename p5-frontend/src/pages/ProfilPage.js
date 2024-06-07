//react imports
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// api call import
import { api } from "../api/api";

//mui imorts

import {
  CssBaseline,
  Box,
  Container,
  Typography,
  Modal,
  Button,
  styled,
  Dialog,
  useMediaQuery,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  OutlinedInput
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

//mui icons
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import thread from "../assets/thread.svg";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddAPhotoTwoToneIcon from "@mui/icons-material/AddAPhotoTwoTone";
import SendIcon from "@mui/icons-material/Send";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import Avatar from "@mui/material/Avatar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

//icon import
import profile from "../assets/profile2.png";

function ProfilPage() {
  const navigate = useNavigate();
  const [myposts, setMyPosts] = useState([]);

  // upload image/video in post
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");

  const [user, setUser] = useState({});

  // add caption
  const [input, setInput] = useState("");
  const [input2, setInput2] = useState("");
  const handleAddCaption = () => {
    setInput2(input);
    setInput("");
  };

  // for menu of creating post
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // modal of creating post

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  // modal for edit profile
  const [open3, setOpen3] = useState(false);

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open3) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open3]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen3 = () => {
    console.log("clicked");
    setOpen3(true);
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  // upload file

  const VisuallyHiddenInput = styled("input")({
    clipPath: "inset(50%)",
    backgroundColor: "black",
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
  });

  // set image after upload
  const handleImageupload = async (e) => {
    setFile(e.target.files[0]);
    const file2 = e.target.files[0];

    let imageUrl = null;

    if (file2) {
      imageUrl = await uploadFileToRestEndpoint(file2);
    }
    setImage(imageUrl);
  };

  // function for uploading image to rest endpoint
  const uploadFileToRestEndpoint = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:8000/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.fileUrl;
  };

  // create post

  const createPost = async () => {
    const token2 = JSON.stringify(localStorage.getItem("token"));
    const token = token2.slice(1, -1);

    const requestBody = {
      query: `mutation{
        createEvent(eventInput: {caption: "${input2}", date: "2024-06-05T05:12:07.511Z", image: "${image}"}) {
          _id
        }
      }`,
    };

    const data = await api(requestBody);
  };

  const handlePost = (event) => {
    event.preventDefault();
    handleOpen2();
    // handleClose();
  };

  // retriving posts of user

  useEffect(() => {
    const userId = JSON.stringify(localStorage.getItem("loggedinuserId"));
    const asyncFn = async () => {
      const requestBody = {
        query: `query{
          event(userId: ${userId}){
           _id
           caption
           date
           image
         }
         }`,
      };

      const data = await api(requestBody);
      setMyPosts(data.event);
    };
    asyncFn();
  }, []);

  useEffect(() => {
    const userId = JSON.stringify(localStorage.getItem("loggedinuserId"));
    const asyncFn = async () => {
      const requestBody = {
        query: `query{
          user(userId:${userId}){
            username
            name
            bio
            profileImage
            email
            mobile
          }
        }`,
      };

      const data = await api(requestBody);
      setUser(data.user);
    };
    asyncFn();
  }, []);

  console.log(user.profileImage);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <Box sx={{ height: "100vh", padding: "40px" }}>
          {/* username part */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <LockOutlinedIcon fontSize="large" />
              <Typography
                fontSize={"23px"}
                sx={{
                  paddingLeft: "10px",
                  paddingTop: "2px",
                  fontWeight: "bold",
                }}
              >
                {user.username}
              </Typography>
              <KeyboardArrowDownOutlinedIcon
                fontSize="medium"
                sx={{ marginTop: "8px", paddingLeft: "2px" }}
              />
            </Box>

            <Box>
              <img src={thread} style={{ width: "25px" }}></img>

              {/* creat post/story */}
              {/* <IconButton > */}
              <AddOutlinedIcon
                onClick={handleClick}
                fontSize="medium"
                sx={{ border: 2, borderRadius: 1.5, marginLeft: "25px" }}
              />
              {/* </IconButton> */}
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handlePost}>
                  <GridOnOutlinedIcon fontSize="small" />
                  <Typography fontSize={"16px"} sx={{ paddingLeft: "10px" }}>
                    Post
                  </Typography>
                </MenuItem>

                {/* create post */}

                <Modal open={open2} onClose={handleClose2}>
                  <Box sx={style}>
                    <Box sx={{ height: "80%" }}>
                      <Button
                        sx={{
                          height: "100%",
                          width: "100%",
                          backgroundColor: "initial",
                          color: "inherit",
                          border: "initial",
                          boxShadow: "initial",
                          "&:hover": {
                            backgroundColor: "initial",
                            boxShadow: "initial",
                          },
                          "&:active": {
                            backgroundColor: "initial",
                            boxShadow: "initial",
                          },
                          "&.Mui-disabled": {
                            backgroundColor: "initial",
                            boxShadow: "initial",
                          },
                        }}
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={
                          !image ? (
                            <AddAPhotoTwoToneIcon
                              sx={{ width: 100, height: 100 }}
                            />
                          ) : (
                            <Box sx={{ width: 350, height: 350 }}>
                              <img
                                src={"http://localhost:8000" + image}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </Box>
                          )
                        }
                      >
                        <VisuallyHiddenInput
                          type="file"
                          onChange={handleImageupload}
                        />
                      </Button>
                    </Box>

                    <Box sx={{ height: "20%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          paddingTop: 1,
                          paddingX: 4,
                        }}
                      >
                        <Typography fontWeight={600} fontSize={17}>
                          {" "}
                          Caption
                        </Typography>
                        <Typography fontSize={17} sx={{ marginLeft: "10px" }}>
                          {input2}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "inline",
                          color: "gray",
                          display: "flex",
                          paddingTop: 1,
                          paddingX: 3.5,
                          fontSize: 14,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Add caption"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          style={{
                            border: "none",
                            outline: "none",
                            background: "none",
                            color: "inherit",
                            fontSize: 17,
                          }}
                        />
                        <IconButton onClick={handleAddCaption}>
                          {input.length !== 0 ? (
                            <SendIcon sx={{ color: "green" }} />
                          ) : (
                            <SendIcon />
                          )}
                        </IconButton>
                      </Box>
                      <button onClick={createPost}>post</button>
                    </Box>
                  </Box>
                </Modal>
              </Menu>

              {/* menu */}

              <MenuIcon
                sx={{ marginLeft: "25px", fontSize: "33px", paddingTop: "5px" }}
              />
            </Box>
          </Box>

          {/* profile image part */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: 6,
            }}
          >
            <Box sx={{}}>
              <Avatar
                alt="Profile image"
                // src={"http://localhost:8000" + user.profileImage}
                src={profile}
                sx={{ width: 160, height: 160 }}
              />
              {/* <Typography fontWeight={600} fontSize={18} sx = {{ marginTop: 2}}> Full Name</Typography> */}
              <Box sx={{ display: "flex", placeContent: "left", marginTop: 2 }}>
                <Typography
                  fontSize={"23px"}
                  sx={{
                    paddingLeft: "10px",
                    paddingTop: "2px",
                    fontWeight: "bold",
                  }}
                >
                  {user.name}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", placeContent: "left", marginTop: 1 }}>
                <Typography
                  fontSize={"20px"}
                  sx={{
                    paddingLeft: "10px",
                    paddingTop: "2px",
                  }}
                >
                  {user.bio}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{ display: "flex", flexDirection: "column", paddingTop: 5 }}
            >
              {/* <Box sx={{ display: "flex", placeContent: "left" }}>
                <Typography
                  fontSize={"23px"}
                  sx={{
                    paddingLeft: "10px",
                    paddingTop: "2px",
                    fontWeight: "bold",
                  }}
                >
                  {user.name}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", placeContent: "left" }}>
                <Typography
                  fontSize={"20px"}
                  sx={{
                    paddingLeft: "10px",
                    paddingTop: "2px",
                  }}
                >
                  {user.bio}
                </Typography>
              </Box> */}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  gap: 10,
                  marginTop: 2,
                }}
              >
                <Typography>{myposts.length}</Typography>
                <Typography>250</Typography>
                <Typography>300</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  gap: 10,
                }}
              >
                <Typography>Posts</Typography>
                <Typography>Followers</Typography>
                <Typography>Following</Typography>
              </Box>
            </Box>
          </Box>

          {/* share profile */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 6,
            }}
          >
            {/* edit profile */}
            <Box
              component="button"
              onClick={handleClickOpen3}
              sx={{
                border: "0px",
                paddingX: 4,
                borderRadius: 1,
                backgroundColor: "whitesmoke",
                textTransform: "none",
                color: "black",
              }}
            >
              <Typography fontWeight={600} fontSize={15} sx={{ marginTop: 1 }}>
                Edit Profile
              </Typography>
            </Box>
            <Dialog
              fullScreen={fullScreen}
              open={open3}
              onClose={handleClose3}
              scroll="paper"
              // aria-labelledby="responsive-dialog-title"
              aria-labelledby="scroll-dialog-title"
              aria-describedby="scroll-dialog-description"
              PaperProps={{
                component: "form",
                onSubmit: (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const formJson = Object.fromEntries(formData.entries());

                }
              }}
            >
              <DialogTitle id="scroll-dialog-title">Edit Profile</DialogTitle>
              <DialogContent dividers>
                <DialogContentText
                  id="scroll-dialog-description"
                  ref={descriptionElementRef}
                  tabIndex={-1}
                >


             <Box sx = {{display: "flex", justifyContent: "center"}}>
             <Avatar
                alt="Profile image"
                // src={"http://localhost:8000" + user.profileImage}
                src={profile}
                sx={{ width: 100, height: 100 }}
              />
             </Box>
              <Typography sx = {{display: "flex", justifyContent: "center"}}>Edit Avatar</Typography>
              
              <OutlinedInput placeholder="Please enter text" />
                
               </DialogContentText>
                                

              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose3}>Cancel</Button>
                <Button type="submit" onClick={handleClose3}>Edit</Button>
              </DialogActions>
            </Dialog>




            {/* edit profile ending */}
            <Box
              sx={{
                color: "initial",
                border: "0px",
                paddingX: 4,
                paddingY: 0,
                borderRadius: 1,
                backgroundColor: "whitesmoke",
              }}
            >
              <Typography fontWeight={600} fontSize={15} sx={{ marginTop: 1 }}>
                Share Profile
              </Typography>
            </Box>
            <Box
              sx={{
                border: "0px",
                paddingX: 2,
                borderRadius: 1,
                backgroundColor: "whitesmoke",
              }}
            >
              <PersonAddIcon sx={{ marginTop: 1 }} />
            </Box>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default ProfilPage;
