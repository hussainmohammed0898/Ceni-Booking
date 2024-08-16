import Theater from "../models/theaterModel.js";
import { StatusCodes } from "http-status-codes";
import  {  addMinutes, format, parse, isAfter,startOfDay }  from 'date-fns';
import Show from "../models/showModel.js";

export const addShow = async (req, res)=>{
    try {
        const { movieId, theaterId, showDate, showTime, price } = req.body;
  
        if (!movieId || !theaterId || !showDate || !showTime || !price) {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
        }
        const theater = await Theater.findById(theaterId);
        if (!theater) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Invalid theater ID" });
          }

      const combinedDateTimeString = `${showDate} ${showTime}`;
      const combinedDateTime = parse(combinedDateTimeString, "yyyy-MM-dd h:mm a", new Date());
      if (isNaN(combinedDateTime)) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Invalid date or time format" });
      }
      const existingShow = await Show.findOne({
        theater: theaterId,
        showDate: combinedDateTime,
      });
      const existingShows = await Show.find({
        theater: theaterId,
        showDate: {
          $gte: addMinutes(combinedDateTime, -150),
          $lte: addMinutes(combinedDateTime, 150),
        }
    });

    if (existingShows.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Another show exists within 3 hours of the specified time" });
    }

    const seatingPattern = theater.seatingPattern;

    const showSeatingpattern = JSON.parse(JSON.stringify(seatingPattern));
    const newShow = new Show({
        movieId: movieId,
        theater: theaterId,
        showDate: combinedDateTime,
        showSeating: showSeatingpattern,
        price
      });
  
      const savedShow = await newShow.save();
      res.status(StatusCodes).json(savedShow);
  

      
          
        
    } catch (error) {
        console.log("Error in add show controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}


export const GetShowsByDate = async (req, res) => {
    const { date, movieId } = req.query;
    try {
      if (!date || !movieId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Date and movieId are required' });
      }
  
      const selectedDate = new Date(date);
      const startOfSelectedDate = startOfDay(selectedDate);
      const endOfSelectedDate = new Date(startOfSelectedDate);
      endOfSelectedDate.setDate(endOfSelectedDate.getDate() + 1);

      const shows = await Show.find({
        showDate: {
          $gte: startOfSelectedDate,
          $lte: endOfSelectedDate,
        },
        movieId,
      }).populate('theater').populate('movieId');
    
      const currentDateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    
      const formattedShows = shows.reduce((acc, show) => {
        if (!isAfter(show.showDate, currentDateTime)) return acc;
    
        const theaterName = show.theater.name;
    
        if (!acc[theaterName]) {
          acc[theaterName] = {
            theater: theaterName,
            theaterLocation: show.theater.location,
            movieName: show.movieId.title,
            showTimes: [],
          };
        }
    
        acc[theaterName].showTimes.push({
          showTime: format(show.showDate, 'h:mm a'),
          showId: show._id,
        });
    
        return acc;
      }, {});
    
      res.status(StatusCodes.OK).json(Object.values(formattedShows));
    } catch (error) {
      console.error('Error fetching shows:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
  };
  
  
  
  export const ShowSeats = async (req, res) => {
      console.log("Fetching seating pattern");
      try {
        const { showId } = req.params;
        console.log('ShowId:', showId);
    
        const show = await Show.findById(showId);
    
    
        if (!show) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "Show not found" });
        }
        
        res.status(StatusCodes.OK).json({ showSeating: show.showSeating,price: show.price});
  
      } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching seating pattern" });
      }
    };
  
    export const ShowStats = async (req, res) => {
        try {
            const shows = await Show.find();
            const upComingShows = shows.filter(show => show.showDate > new Date());
            res.status(StatusCodes.OK).json({ totalShows: shows.length, upComingShows: upComingShows.length});
    
        } catch (error) {
            console.error('Error fetching total shows:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
      }

      export const getShowByOwner = async (req, res) => {
        const ownerId = req.owner.ownerId;
        try {
          const theaters = await Theater.find({ owner: ownerId });
      
          if (theaters.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No theaters found for this owner" });
          }
          const theaterIds = theaters.map(theater => theater._id);
          const shows = await Show.find({ theater: { $in: theaterIds } }).populate('movieId');
      
          const showDetails = shows.map(show => {
            const theater = theaters.find(t => t._id.equals(show.theater));
            return {
              movieName: show.movieId.title,
              movieImage: show.movieId.image,
              showDate: show.showDate,
              price: show.price,
              theaterName: theater.name
            };
          });
      
          res.status(StatusCodes.OK).json(showDetails);
        } catch (error) {
          console.log("Error in get shows controller", error.message);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
      };
    
    