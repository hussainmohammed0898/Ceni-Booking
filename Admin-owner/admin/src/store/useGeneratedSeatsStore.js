import create from 'zustand';

export const useGeneratedSeatsStore = create((set) => ({
    generatedSeats: [],
    setGeneratedSeats: (seats) => set({ generatedSeats: seats }),
}));