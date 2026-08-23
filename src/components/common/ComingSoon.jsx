import React from 'react'
import { Link } from 'react-router-dom'
import { SoonSvg, InstaIcon, LinkedinIcon, XIcon, FBicon } from '../../assets/SVGs/portfolio/main/ComingSoonSvgs'

const ComingSoon = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-25  py-10'>
      <div className="flex flex-col items-center justify-center gap-10 bg-re5d-100 sm:w-100 md:w-180 lg:w-200">
        <h1 className='text-3xl font-semibold'>We are Coming Soon !</h1>
        <div className="w-full">
          <SoonSvg />

        </div>
        <div className="flex flex-row w-full ite6ms-center jusytify-center md:h-18 h-12 ">
          <input className='w-full p-6 bg-gray-100 flex-1 ' type="text" placeholder='Enter your email' />
          <button className='h-full px-8 bg-[#1E60DB] text-center text-white text-manrope text-xl '>Notify Me</button>
        </div>
      </div>

      <div className='flex gap-0.25 items-center justify-center  flex-row'>
        <Link to="#"><FBicon /></Link>
        <Link to="#"><XIcon /></Link>
        <Link to="#"><LinkedinIcon /></Link>
        <Link to="#"><InstaIcon /></Link>
      </div>
    </div>
  )
}
export default ComingSoon



