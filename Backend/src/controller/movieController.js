import { StatusCodes } from "http-status-codes";
import Movie from "../models/moviesModel.js";
import {  cloudinaryInstance } from "../config/cloudinaryConfig.js"




export const addMovies = async(req, res)=>{
    console.log("hitting");

    try {

        if(!req.file){
            return res.status(StatusCodes.CONFLICT).json({success: false, message: 'No file uploaded'});
        }
        cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
            if (err) {
              console.log(err, "error");
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error",
              });
            }

            const imageUrl = result.url;
           console.log(imageUrl);
            const {title, duration, genre, language, releaseDate, actorName, director, description} = req.body;
      
            const newMovie = new Movie({
                title,
                duration,
                genre,
                releaseDate,
                description,
                language,
                actorName,
                director,
                posterUrl : imageUrl,
            });
            await newMovie.save();
            
            if (!newMovie) {
              return res.status(StatusCodes.NOT_FOUND).json({message:"Movies not created"});
            }
            res.status(StatusCodes.CREATED).json({ message: "Movie created successfully", movie: newMovie});
          });
    } catch (error) {
        console.log("Error in add movie controller", error.message);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
};

export const Movies = async (req, res) => {
  try {
      const movies = await Movie.find();
      res.status(StatusCodes.CREATED).json(movies);
  }
  catch (error) {
      console.log("Error in movies controller", error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};


export const deleteMovieById = async (req, res) => {
  try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
          return res.status(404).json({ error: 'Movie not found' });
      }
      const publicId = movie.image.split('/').pop().split('.')[0];
      await cloudinaryInstance.uploader.destroy(publicId); 
      await Movie.deleteOne({ _id: req.params.id });
      res.status(StatusCodes.ACCEPTED).json({ message: 'Movie deleted successfully' });
  } catch (error) {
      console.error('Error in delete movie controller', error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
};

export const  totalMovies = async (req, res) => {

  try {
      const movies = await Movie.find();
      res.status(StatusCodes.CREATED).json({ totalMovies: movies.length });
  } catch (error) {
      console.error('Error fetching total movies:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};