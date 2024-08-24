import Theater from "../models/theaterModel.js";
import { StatusCodes } from "http-status-codes";
import  {  addMinutes, format, parse, isAfter,startOfDay, parseISO, endOfDay }  from 'date-fns';
import Show from "../models/showModel.js";

export const addShow = async (req, res) => {
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
      if (isNaN(combinedDateTime.getTime())) {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid date or time format" });
      }
      
      const lastShow = await Show.findOne({ theater: theaterId }).sort({ showDate: -1 });

      if (lastShow) {
          // Calculate the end time of the last show (assuming show duration is 2.5 hours)
          const lastShowEndTime = addMinutes(lastShow.showDate, 150); // 150 minutes = 2.5 hours

          // Ensure the new show's start time is at least 1 hour after the last show's end time
          if (combinedDateTime < addMinutes(lastShowEndTime, 60)) {
              return res.status(StatusCodes.BAD_REQUEST).json({
                  message: "New show must start at least 1 hour after the previous show ends",
              });
          }
      }

      const showSeatingPattern = JSON.parse(JSON.stringify(theater.seatingPattern));
      const newShow = new Show({
          movieId,
          theater: theaterId,
          showDate: combinedDateTime,
          showSeating: showSeatingPattern,
          price
      });

      const savedShow = await newShow.save();
      res.status(StatusCodes.CREATED).json(savedShow);

  } catch (error) {
      console.log("Error in add show controller", error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};


export const getShowsByDate = async (req, res) => {
  console.log("testing");
  console.log("query:",req.query);
  const { date, movieId } = req.query;
  
  
  try {
    if (!date || !movieId) {
      return res.status(400).json({ error: 'Date and movieId are required' });
    }

    const selectedDate = new Date(date);
    const startOfSelectedDate = startOfDay(selectedDate);
    const endOfSelectedDate = new Date(startOfSelectedDate);
    endOfSelectedDate.setDate(endOfSelectedDate.getDate() + 1);

    const query = {
      showDate: {
        $gte: startOfSelectedDate,
        $lt: endOfSelectedDate
      },
      movieId: movieId
    };

    const shows = await Show.find(query)
      .populate('theater')
      .populate('movieId');

    const groupedShows = shows.reduce((acc, show) => {
      const theaterName = show.theater.name;
      const movieName = show.movieId.title;
      const theaterLocation = show.theater.location;
      const showDateTime = show.showDate;

      if (!acc[theaterName]) {
        acc[theaterName] = { theater: theaterName, theaterLocation: theaterLocation, movieName: movieName, showTimes: [] };
      }

      const formattedShowTime = format(showDateTime, 'h:mm a');

 
      const currentDateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      if (isAfter(showDateTime, currentDateTime)) {
        acc[theaterName].showTimes.push({ showTime: formattedShowTime, showId: show._id });
      }

      return acc;
    }, {});

    const formattedShows = Object.values(groupedShows);
    res.status(200).json(formattedShows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
        console.log("testing");
        
        const ownerId = req.owner.data;
        console.log(ownerId);
        
        
        try {
          const theaters = await Theater.find({ owner: ownerId });
      
          if (theaters.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No theaters found for this owner" });
          }
          const theaterIds = theaters.map(theater => theater._id);
          const shows = await Show.find({ theater: { $in: theaterIds } }).populate('movieId');
      
          const showDetails = shows.map(show => {
            const theater = theaters.find(t => t._id.equals(show.theater));
            
            // Check if movieId is null
            if (!show.movieId) {
              return null; // or handle the case as needed
            }
            
            return {
              movieName: show.movieId.title,
              movieImage: show.movieId.image,
              showDate: show.showDate,
              price: show.price,
              theaterName: theater.name
            };
          }).filter(detail => detail !== null);
      
          res.status(StatusCodes.OK).json(showDetails);
        } catch (error) {
          console.log("Error in get shows controller", error.message);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
      };
    
    