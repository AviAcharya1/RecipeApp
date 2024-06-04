import './App.css'
import Login from "./components/Login.jsx";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Register from "./components/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import PrivateComponent from "./components/PrivateComponent.jsx";
import Recipes from "./components/Recipes.jsx";
import AddRecipe from "./components/AddRecipe.jsx";
import LikedProducts from "./components/likedProducts.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";

function App() {


  return (
    <Router>
      <Navbar/>
      
      <Routes>
        <Route path='/signup' element={<Register/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        <Route path='/login' element={<Login/>}/>

        <Route element={<PrivateComponent/>}>
          <Route path='/favouriteRecipes'element={<LikedProducts/>}/>
          <Route path='/recipes'element={<Recipes/>}/>
          <Route path='/'element={<Recipes/>}/>
          <Route path='/addRecipe'element={<AddRecipe/>}/>
        </Route> 
      </Routes>
    </Router>
  )
}

export default App
