import React from 'react'
import UserStatus from './dashboard/UserStatus'
import TransactionStatus from './dashboard/TransactionStatus'
import BookingStatus from './dashboard/BookingStatus'
import ReviewStatus from './dashboard/ReviewStatus'
import MovieStatus from './dashboard/MovieStatus'
import NewUsersChart from './dashboard/NewUsersChart'
import ShowStatus from './dashboard/ShowStatus'



export default function AdminDashboard() {
  return (
    <div className='min-h-screen   mx-5 my-8  animate-fade-in '>
      <div className="grid lg:grid-cols-3 md:grid-cols-3  sm:grid-cols-3 mt-4 grid-cols-1 gap-6 ">
       <UserStatus/>
       <TransactionStatus/>
       <BookingStatus/>
      </div>
      <div className="grid lg:grid-cols-2  md:grid-cols-2 sm:grid-cols-2 mt-8 grid-cols-1 gap-6">
       <NewUsersChart/>
        <div className="grid lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1  grid-cols-1 gap-6 ">
          <ShowStatus/>
        </div>
      <ReviewStatus/>
      <MovieStatus/>
      </div>
    </div>
  )
}