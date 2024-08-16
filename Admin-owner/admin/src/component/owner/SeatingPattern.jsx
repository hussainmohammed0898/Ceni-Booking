import React, { useEffect } from 'react'
import { useGeneratedSeatsStore } from '../../store/useGeneratedSeatsStore';

function SeatingPattern({ rows, setRows, columns, setColumns, seatingPattern, setSeatingPattern }) {
    const setGeneratedSeats = useGeneratedSeatsStore((state) => state.setGeneratedSeats);



    useEffect(() => {
        const generatedPattern = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                generatedPattern.push({ row: String.fromCharCode(65 + r), number: c + 1, status: 'available' });
            }
        }
        setSeatingPattern(generatedPattern);
        setGeneratedSeats(generatedPattern);
    }, [rows, columns, setSeatingPattern, setGeneratedSeats]);

    const toggleSeatStatus = (index) => {
        const updatedPattern = seatingPattern.map((seat, idx) =>
            idx === index
                ? { ...seat, status: seat.status === 'available' ? 'reserved' : 'available' }
                : seat
        );
        setSeatingPattern(updatedPattern);
        setGeneratedSeats(updatedPattern);
    };
  return (
    <div className='h-full flex flex-col justify-center items-center w-full'>
            <div className="flex space-x-4 my-4 items-center m-5 flex-col sm:flex-row w-full">
                <div className='flex flex-col mr-0 sm:mr-5 mb-5 sm:mb-0 w-full'>
                    <label className='mb-2'>Rows</label>
                    <input
                        type="number"
                        value={rows}
                        onChange={(e) => setRows(parseInt(e.target.value))}
                        className="input input-bordered mx-2"
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <label className='mb-2'>Columns</label>
                    <input
                        type="number"
                        value={columns}
                        onChange={(e) => setColumns(parseInt(e.target.value))}
                        className="input input-bordered  mx-2"
                    />
                </div>
            </div>
            <h1 className='block md:hidden'>Please use desktop view for generating seats </h1>
            <div className="hidden md:inline-grid  mt-4 grid  gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(50px, 1fr))` }}>
            {seatingPattern.map((seat, index) => (
                    <div key={index} className={`p-2 border rounded text-center cursor-pointer ${seat.status === 'reserved' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                    onClick={() => toggleSeatStatus(index)}
                    >
                        {seat.row}{seat.number} - {seat.status}
                    </div>
                ))} 
            </div>
        </div>
  )
}

export default SeatingPattern