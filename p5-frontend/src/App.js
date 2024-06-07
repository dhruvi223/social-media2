import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'

import ProfilPage from './pages/ProfilPage';
import Signup from './pages/Authentication/SignUp';
import Signin from './pages/Authentication/SignIn';
import Home from './pages/Home';
import SavedPosts from './pages/SavedPosts';

const token = localStorage.getItem('token');
console.log(token);

function App() {
  return (
    <div className="App">
    <Toaster/>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={token ? <Home/>: <Navigate to = "/signin" replace= {true}/>}/>
      <Route path='/profile' element={token ? <ProfilPage/> :<Navigate to="/signin" replace = {true} />}/>
      <Route path='/savedposts' element={token ? <SavedPosts/> :<Navigate to="/signin" replace = {true} />}/>
      <Route path='/signup' element={!token ? <Signup/>: <Navigate to = "/profile" replace= {true}/>}/>
      <Route path='/signin' element={!token ? <Signin/>: <Navigate to = "/profile" replace= {true}/>}/>

    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
