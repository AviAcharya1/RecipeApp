import React, { useEffect, useState } from "react";
import "../styles/RecipeStyle.css";
import { Link } from "react-router-dom";
import "../styles/Searchbar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { FiLink } from "react-icons/fi";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { RiShareForwardLine } from "react-icons/ri";
import { RiAddLargeFill } from "react-icons/ri";
import { GrFavorite } from "react-icons/gr";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showShareOptions, setShowShareOptions] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = () => {
    fetch("http://localhost:8001/auth/recipe/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch recipe data");
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        const response = await fetch(
          `http://localhost:8001/auth/recipe/${recipeId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          toast.success("Recipe deleted successfully");
          setTimeout(() => {
            window.location = "/recipes";
          }, 4000);
        } else {
          getRecipes();
          window.location = "/recipes";
        }
      }
    } catch (error) {
      toast.error("An error occurred while deleting the recipe:", error);
      setTimeout(() => {
        window.location.href = "/recipes";
      }, 3000);
    }
  };

  const handleAddToFavorites = async (recipeId) => {
    try {
      const response = await fetch(
        `http://localhost:8001/auth/likedRecipes/${recipeId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("Recipe added to favorites successfully");
        setTimeout(() => {
          window.location.href = "/favouriteRecipes";
        }, 4000);
      } else {
        const data = await response.json();
        if (data.error === "Recipe already exists in your favorites") {
          toast.warn("Recipe already exists in your favorites");
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.error("An error occurred while adding to favorites:", error);
    }
  };

  const SearchRecipes = async (query) => {
    try {
      if (query) {
        setIsSearching(true);

        const response = await fetch(
          `http://localhost:8001/auth/searchRecipes/${query}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const searchedRecipes = await response.json();
          setRecipes(searchedRecipes);
        } else {
          setRecipes([]);
          const errorData = await response.json();
          toast.error(
            errorData.error || "An error occurred while searching for recipes."
          );
        }
      } else {
        setIsSearching(false);
        getRecipes();
      }
      setSearchQuery("");
    } catch (error) {
      console.error("Error searching recipes:", error);
      toast.error("An error occurred while searching for recipes.");
    }
  };

  const handleShareClick = (recipeId) => {
    setShowShareOptions((prevState) => ({
      ...prevState,
      [recipeId]: !prevState[recipeId],
    }));
  };
  const copyRecipeToClipboard = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Recipe link copied to clipboard.");
      })
      .catch((err) => {
        console.error("Error copying recipe link to clipboard:", err);
        toast.error(
          "An error occurred while copying the recipe link to clipboard."
        );
      });
  };

  const handleShareRecipe = (recipe) => {
    const shareUrl = window.location.href;
    const title = recipe.title;
    const text = `Check out this recipe: ${recipe.title}`;

    const toggleShareOptions = () => handleShareClick(recipe._id);

    if (showShareOptions[recipe._id]) {
      return (
        <div className="share-options">
          <FacebookShareButton quote={text} url={shareUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton title={text} url={shareUrl}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <WhatsappShareButton title={text} url={shareUrl}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <button
            className="copy-link-button"
            onClick={() => copyRecipeToClipboard(shareUrl)}
          >
            <FiLink />
          </button>
          <button
          className="back-button"
          onClick={toggleShareOptions}
        >
          <IoArrowBackCircleOutline />
        </button>
        </div>
      );
    }

    return (
      <button className="share-button" onClick={toggleShareOptions}>
        <RiShareForwardLine />
      </button>
    );
  };

  return (
    <div className="Recipes">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearching ? (
          <button onClick={() => SearchRecipes("")}>Back</button>
        ) : (
          <button onClick={() => SearchRecipes(searchQuery)}>Search</button> )}
      </div>

      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div key={recipe._id} className="Recipe">
            <h2>{recipe.title}</h2>
            <img src={recipe.imageUrl} alt={recipe.title} />
            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients.length > 0 && (
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              )}
            </ul>
            <div className="instructions-container">
              <h3>Instructions:</h3>
              {recipe.instructions.match(/^\d+\./) ? (
                <div className="instructions-text">
                  {recipe.instructions.split("\n").map((step, index) => (
                    <p key={index}>{step}</p>
                  ))}
                </div>
              ) : (
                <ol className="instructions-list">
                  {recipe.instructions.split("\n").map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              )}
            </div>

          <div className="functionalities">
          <button
              className="delete-button"
              onClick={() => handleDeleteRecipe(recipe._id)}
            >
              Delete
            </button>
            <button
              className="add-to-favorites-button"
              onClick={() => handleAddToFavorites(recipe._id)}
            >
              <GrFavorite />
            </button>
            <Link to={"/addRecipe"} className="add">Add more<RiAddLargeFill /></Link>
            <div className="share-container">
              {handleShareRecipe(recipe)}
            </div>
          </div>
          </div>
        ))
      ) : (
        <h2 className="no-recipes">No Recipes Found</h2>
      )}
      <ToastContainer />
    </div>
  );
};

export default Recipes;

