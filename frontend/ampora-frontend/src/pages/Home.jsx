import React from 'react'
import icon1 from '../assets/adapter.png'
import roadtrip from '../assets/road-trip.png'
import mark from '../assets/placeholder.png'
const Home = () => {
  return (
    <div className='flex flex-col w-screen  bg-[#EDFFFF]'>
      <div className='w-12/12  flex justify-center items-center mt-2'>

        <div className='w-5/12 h-[50vh] bg-[#2EC770] rounded-tl-[50px] rounded-bl-[50px] -skew-x-12 bg-[url(./assets/bg1.jpg)]'></div>
        <div className='w-5/12 h-[50vh] bg-[#D0FBE7] rounded-tr-[50px] rounded-br-[50px] -skew-x-12'>
          <h2 className=' mt-5 font-bold text-black text-[50px] text-center'>POWER YOUR RV</h2>
          <div className='mt-5 w-12/12 flex justify-center items-center'>
            <input type="text" className='w-8/12  h-[50px] border-2 border-[#2EC770] rounded-[50px] bg-white' />
          </div>

          <div className=' mt-8 w-12/12 flex justify-center items-center'>
            <div className='w-2/12 border-5 border-[#2EC770] -skew-x-12 bg-white h-[100px]'></div>
            <div className=' ms-2 w-2/12 border-5 border-[#2EC770] -skew-x-12 bg-white h-[100px]'></div>
            <div className=' ms-2 w-2/12 border-5 border-[#2EC770] -skew-x-12 bg-white h-[100px]'></div>
          </div>

        </div>


      </div>

      <div className=' mt-8 w-12/12 flex justify-center items-center'>
        <div className='mx-2 w-2/12 rounded-2xl shadow-md/30  bg-white h-[200px] flex flex-col gap-5 justify-center items-center p-5 hover:shadow-2xl'>
          <h2 className='text-center mt-5 font-bold text-black text-[20px]'>FIND STATIONS</h2>
          <img src={mark} className="mx-5 w-[50px] h-[50px]" />

        </div>
        <div className='mx-2 w-2/12 rounded-2xl shadow-md/30  bg-white h-[200px] flex flex-col gap-5 justify-center items-center p-5 hover:shadow-2xl'>
          <h2 className='text-center mt-5 font-bold text-black text-[20px]'>PLAN TRIP</h2>
          <img src={roadtrip} className="mx-5 w-[50px] h-[50px]" />

        </div>
        <div className='mx-2 w-2/12 rounded-2xl shadow-md/30  bg-white h-[200px] flex flex-col gap-5 justify-center items-center p-5 hover:shadow-2xl'>
          <h2 className='text-center mt-5 font-bold text-black text-[20px]'>FIND STATIONS</h2>
          <img src={mark} className="mx-5 w-[50px] h-[50px]" />

        </div>

      </div>

      <div className='w-12/12 flex justify-center items-center bg-[#D0FBE7] h-[200px] mt-5 '>
        <h2 className=' mt-5 font-bold text-black text-[30px] text-center'> Why you choose us</h2>
      </div>

      <div className=' mt-8 w-12/12 flex justify-center items-center'>
        <div className='mx-2 w-2/12 rounded-2xl shadow-md/30  bg-white h-[200px] p-5 hover:shadow-2xl'>
          <h2 className='text-center mt-5 font-bold text-[#2EC770] text-[50px]'>100+</h2>
          <p className='text-center mt-2 font-medium text-black text-[10px]'>Station actives</p>

        </div>
        <div className='mx-2 w-2/12 rounded-2xl shadow-md/30  bg-white h-[200px] p-5 hover:shadow-2xl'>
          <h2 className='text-center mt-5 font-bold text-[#2EC770] text-[50px]'>100+</h2>
          <p className='text-center mt-2 font-medium text-black text-[10px]'>Station actives</p>

        </div>
        <div className='mx-2 w-2/12 rounded-2xl shadow-md/30  bg-white h-[200px] p-5 hover:shadow-2xl'>
          <h2 className='text-center mt-5 font-bold text-[#2EC770] text-[50px]'>100+</h2>
          <p className='text-center mt-2 font-medium text-black text-[10px]'>Station actives</p>

        </div>



      </div>

      <div className='w-12/12  flex justify-center items-center mt-8'>

        <div className='w-5/12 h-[40vh] bg-[#F8F8F8] rounded-tl-[50px] rounded-bl-[50px] '>
          <h2 className=' mt-5 font-bold text-black text-[30px] ms-5'>Power up your life</h2>
          <div className='flex mt-5'>
            <img src={icon1} className="mx-5 w-[100px] h-[100px]" />
            <div className='flex flex-col justify-center items-center gap-3'>
              <h2 className=' mt-5 font-bold text-black text-[20px] text-center'>Lighting fast charging</h2>
              <p className='text-black'>Lighting fast charging Lighting fast charging
                Lighting fast </p>

              <div className='w-4/12 border-2 flex justify-center text-center items-center h-[50px] border-emerald-400 bg-white text-black rounded-2xl'>See chargers</div>

            </div>
          </div>

        </div>
        <div className='w-5/12 h-[40vh] bg-[#74FABD] rounded-tr-[50px] rounded-br-[50px] '>
          <h2 className=' mt-5 font-bold text-black text-[30px] ms-5'>Effortless Trip planning</h2>
          <div className='flex mt-5'>
            <img src={roadtrip} className="mx-5 w-[100px] h-[100px]" />
            <div className='flex flex-col justify-center items-center gap-3'>
              <h2 className=' mt-5 font-bold text-black text-[20px] text-center'>Lighting fast charging</h2>
              <p className='text-black'>Lighting fast charging Lighting fast charging
                Lighting fast </p>

              <div className='px-4 border-2 flex justify-center text-center items-center h-[50px] border-emerald-400 bg-white text-black rounded-2xl'>Plan your next trip</div>

            </div>
          </div>

        </div>


      </div>


    </div>


  )
}

export default Home