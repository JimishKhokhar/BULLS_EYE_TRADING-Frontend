import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import Dialog from './Dialog'
import { ComponentDataContext } from '../App';
import { findTheBalance, getTopTen } from '../utils';
import upward from "../Images/move-upward-svgrepo-com.svg";
import downward from "../Images/move-downward-svgrepo-com.png"

import gold from '../Images/gold-medal-svgrepo-com.svg'
import silver from '../Images/second-svgrepo-com.svg'
import bronze from '../Images/third-svgrepo-com.svg'

import TopThreeCard from './TopThreeCard';


const Rankings = () => {

  const [topTen, setTopTen] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);


  async function findTopTen() {
    const topTenFromUtils = await getTopTen();
    setTopTen(topTenFromUtils);
    console.log("From Rankings", topTenFromUtils);
  }
  async function findIt() {
    setIsDataLoading(true);
    await findTopTen();
    setIsDataLoading(false);
  }

  const { setSelectedComponent } = useContext(ComponentDataContext);

  useEffect(() => {
    document.title = "Rankings"
    setSelectedComponent("Rankings");
    window.scrollTo(0, 0)
    findIt()

  }, []);

  useEffect(() => {
    // setIsDataLoading(false);
    console.log("State Variable topTen", topTen)
  }, [topTen])


  return (

    <div className="relative w-full md:pt-20 pb-10 overflow-hidden  select-none bg-gradient-to-b from-black to-slate-800 bg-[linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8520658263305322) 100%)] text-white">

      <div className={`flex justify-center  md:max-w-[90%] w-full md:pt-0 pt-5  content-center ${topTen.length == 0 ? "max-h-[calc(100vh-61px)]" : ""}  mx-auto  min-h-[calc(100vh-61px)]  md:p-5`}>
        <div className={`  ${topTen.length == 0 ? "" : ""}  flex justify-center w-full  content-center align-middle `}>
          <div className={`w-full  ${isDataLoading ? "self-center align-middle flex justify-center  " : ""}  `}>

            {
              isDataLoading ?
                <span className=' text-3xl p-10 text-white'>Loading...</span>
                :
                <div className='   flex flex-col  md:pt-0 pt-14'>
                  <div className='w-[90vw]  mx-auto     md:min-w-[80%] md:max-w-[80%]  gap-3  grid grid-rows-3 grid-cols-none md:grid-cols-3 md:grid-rows-none md:gap-2'>




                    <TopThreeCard
                      src={gold}
                      trader={topTen[0]}
                    />

                    <TopThreeCard
                      src={silver}
                      trader={topTen[1]}
                    />

                    <TopThreeCard
                      src={bronze}
                      trader={topTen[2]}
                    />

                  </div>

                  <div className='flex flex-col gap-2 md:gap-4 -mt-2'>
                    {



                      topTen?.map((user, index) => {
                        return (
                          <div className='min-w-full px-2'>
                            <div className='md:min-w-[70%]  md:max-w-[70%] mx-auto    rounded-lg'>
                              {
                                index == 0 || index == 1 || index == 2 ?
                                  <div></div>
                                  :
                                  <div className='text-lg md:text-xl relative w-full flex md:flex-row flex-col align-middle  justify-between  rounded-lg py-1 md:py-3 bg-slate-700 '>
                                    <span className='flex gap-2 md:gap-3 align-middle md:pl-6 justify-start md:justify-center items-center'>
                                      <span className={` max-w-[20%] md:max-w-[40%] text-5xl md:text-7xl md:m-0 m-2  -top-3 font-bold shadow-custom-box-small bg-indigo-700 py-0 md:py-1 pt-1  pb-1 md:pt-2 md:pb-0  ${index == 9 ? "px-0 md:px-2" : "px-4 md:px-6"} rounded-full `}>{index + 1}</span>

                                      <div className='flex flex-col  min-w-[75%] '>
                                        {/* <span className=' text-xl md:text-2xl  md:pl-5  font-bold text-white  ' style={{ maxWidth: "70%", wordWrap: 'break-word' }}>{user.username} </span> */}
                                        <div className=' text-xl md:text-2xl font-bold  shadow-custom max-two-lines' style={{ maxWidth: "70vw", wordWrap: 'break-word' }}>{user?.username}</div>

                                        <span className=' text-xl   '>Net Worth: ${Number(user.netWorth).toFixed(2)}</span>
                                        {

                                          user.netWorth >= 25000 ?
                                            <div className=' md:self-start'><div className=' self-center  ml-auto flex items-baseline gap-3' ><div className='h-fit text-xl'>Returns→</div> <div className='text-xl font-bold text-green-400'> {`${(Number(Number(Number(user?.netWorth) - 25000) / 25000) * 100).toFixed(2)} `}%</div> <img src={upward} className='w-[20px]' /> </div></div> :
                                            <div className=' md:self-start'><div className=' self-center ml-auto flex items-baseline gap-3 ' ><div className='h-fit text-xl'>Returns→</div> <div className='text-xl font-bold text-red-500 '> {`${(Number(Number(Number(user?.netWorth) - 25000) / 25000) * 100).toFixed(2)} `}%</div> <span><img src={downward} className='w-[20px]' /></span> </div></div>

                                        }
                                      </div>



                                    </span>
                                    {/* <div className='flex flex-col pl-3 md:pl-0 justify-center pr-4  md:mt-5 align-center'>
                                      
                                    </div> */}
                                  </div>
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>

                </div>
            }



          </div>
        </div>
      </div>
    </div>
  )
}

export default Rankings