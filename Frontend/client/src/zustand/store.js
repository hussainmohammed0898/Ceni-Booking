import { create } from 'zustand'


const useMovieTitleStore = create((set) => ({
    movieTitle: '',
    setMovieTitle: (title) => set({ movieTitle: title }),
  }));
  
  export default useMovieTitleStore;