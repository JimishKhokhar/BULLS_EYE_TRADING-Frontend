import React from 'react'
import upward from "../Images/move-upward-svgrepo-com.svg";
import downward from "../Images/move-downward-svgrepo-com.png"

const TopThreeCard = ({ src, trader }) => {
    return (
        <div>
            <div className='w-full  flex  md:flex-col gap-2 py-2 md:p-5 align-middle  md:bg-transparent bg-black rounded-lg '>
                <img src={src} className='w-[25%] md:w-[50%]   self-center' />

                <div className='md:block hidden'>
                    <div className='flex justify-center  md:mx-auto flex-col  md:w-full' style={{ minWidth: '100%', maxWidth: '100%', wordWrap: 'break-word' }}>
                        <div className='md:block hidden'>
                            <div className=' text-xl md:text-2xl font-bold text-center shadow-custom max-two-lines' style={{ maxWidth: "100%", wordWrap: 'break-word' }}>{trader?.username}</div>
                        </div>
                        <div className='md:hidden block'>
                            <div className=' text-xl md:text-2xl font-bold  shadow-custom max-two-lines' style={{ maxWidth: "70%", wordWrap: 'break-word' }}>{trader?.username}</div>
                        </div>

                        <div className='flex gap-2 justify-start md:justify-center '>
                            <span className=' text-xl md:text-2xl  text-center shadow-custom '>Net Worth→ </span>
                            <span className=' text-xl md:text-2xl  text-center shadow-custom text-green-500'>${trader?.netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' })}</span>
                        </div>
                        <div className='w-full flex justify-start align-middle  md:justify-center   '>
                            {

                                trader?.netWorth >= 25000 ?
                                    <div className=' self-center'><div className=' self-center  ml-auto flex items-baseline gap-3' ><div className='h-fit text-lg md:text-2xl'>Returns→</div> <div className='text-lg md:text-2xl font-bold text-green-400'> {`${(Number(Number(Number(trader?.netWorth) - 25000) / 25000) * 100).toFixed(2)} `}%</div> <img src={upward} className='w-[20px]' /> </div></div> :
                                    <div className=' self-center'><div className=' self-center ml-auto flex items-baseline gap-3 ' ><div className='h-fit text-lg md:text-2xl'>Returns→</div> <div className='text-lg md:text-2xl font-bold text-red-500 '> {`${(Number(Number(Number(trader?.netWorth) - 25000) / 25000 * 100)).toFixed(2)} `}%</div> <span><img src={downward} className='w-[20px]' /></span> </div></div>

                            }
                        </div>
                    </div>
                </div>
                <div className='md:hidden block'>
                    <div className='flex justify-center  md:mx-auto flex-col  md:w-full  mx-auto' style={{ minWidth: '90vw', maxWidth: '90vw', wordWrap: 'break-word' }}>
                        <div className='md:block hidden'>
                            <div className=' text-xl md:text-2xl font-bold text-center shadow-custom max-two-lines' style={{ maxWidth: "100%", wordWrap: 'break-word' }}>{trader?.username}</div>
                        </div>
                        <div className='md:hidden block'>
                            <div className=' text-xl md:text-2xl font-bold  shadow-custom max-two-lines' style={{ maxWidth: "60vw", wordWrap: 'break-word' }}>{trader?.username}</div>
                        </div>

                        <div className='flex gap-2 justify-start md:justify-center  ' style={{ maxWidth: "60vw", wordWrap: 'break-word' }}>
                            <span className=' text-xl md:text-2xl  text-center shadow-custom ' >{`Net Worth→`} </span>
                            <span className=' text-xl md:text-2xl  text-center shadow-custom text-green-500'>${trader?.netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' })}</span>
                        </div>
                        <div className='w-full flex justify-start align-middle  md:justify-center   '>
                            {

                                trader?.netWorth >= 25000 ?
                                    <div className=' self-center' style={{ maxWidth: "60vw", wordWrap: 'break-word' }}><div className=' self-center  ml-auto flex items-baseline gap-3' ><div className='h-fit text-lg md:text-2xl'>Returns→</div> <div className='text-lg md:text-2xl font-bold text-green-400'> {`${(Number(Number(Number(trader?.netWorth) - 25000) / 25000) * 100).toFixed(2)}%`}</div> <img src={upward} className='w-[20px]' /> </div></div> :
                                    <div className=' self-center' style={{ maxWidth: "60vw", wordWrap: 'break-word' }}><div className=' self-center ml-auto flex items-baseline gap-3 ' ><div className='h-fit text-lg md:text-2xl'>Returns→</div> <div className='text-lg md:text-2xl font-bold text-red-500 '> {`${(Number(Number(Number(trader?.netWorth) - 25000) / 25000 * 100)).toFixed(2)}%`}</div> <span><img src={downward} className='w-[20px]' /></span> </div></div>

                            }
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default TopThreeCard