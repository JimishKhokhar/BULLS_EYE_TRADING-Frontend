import React from 'react'
import upward from "../Images/move-upward-svgrepo-com.svg";
import downward from "../Images/move-downward-svgrepo-com.png"
import { sellTheStock } from '../utils';
import { ComponentDataContext } from '../App';
import { useContext } from 'react';
import { Button } from '@cred/neopop-web/lib/components';
import { useState } from 'react';


const moment = require('moment-timezone');



const HoldingCard = ({ isPricesLoading, stock, totalPrice, quantity, broughtAt, livePrices, holdingObject, id, user_id, isOpen, setIsOpen
    ,setStockToBuy
}) => {

    //History Object variables
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    



    const istDateString = moment.utc(broughtAt).tz('Asia/Kolkata').format('DD MMMM, YYYY hh:mm:ss A');

    const avgPrice = totalPrice / quantity

    const marketValue = Number(quantity * livePrices[stock]);
    const gainLoss = Number(quantity * (livePrices[stock] - avgPrice)).toFixed(2);
    const returnPercentage = ((gainLoss / (quantity * avgPrice)) * 100).toFixed(2);

    const { successAlert, failAlert, infoAlert, stockToSell, setStockToSell, maxQuantityToSell, setMaxQuantityToSell
        , holdingIdToSell, setHoldingIdToSell } = useContext(ComponentDataContext);

    const reversedTrades = [...holdingObject.trades].reverse();



    return (
        <div className={ ` select-none overflow-hidden holding-card text-white bg-slate-700 min-w-full max-w-full rounded-md  md:px-10 transition-all duration-300 ${isOpen ? 'md:pr-28' : ''} `}>
            <div className={`flex justify-start p-2 md:p-3   flex-col `}>
                <div className='text-2xl md:text-3xl  w-full  bg-black md:bg-slate-700  font-bold shadow-custom rounded-lg pb-1 md:pb-2  flex justify-center md:justify-start' onClick={() => { setIsOpen(!isOpen) }}>
                    <span className=' text-white  md:px-3  md:py-1 mt-1 bg-black rounded-lg'>{stock}</span>
                    
                </div>

                <div className="grid grid-cols-3 gap-1 md:gap-4 w-full text-xl z-20 ">
                    <div className=' self-center flex flex-col md:flex-row items-baseline md:gap-3 ' >
                        <div className='w-full md:w-fit text-center  text-lg  md:text-xl'>Quantity </div>
                        <span className='hidden md:inline'>→</span>
                        <div className='text-md md:text-2xl font-bold w-full md:w-fit text-center '> {new Number(quantity).toFixed(0)}</div>
                    </div>

                    <div className=' self-center mx-auto flex flex-col  md:flex-row items-baseline md:gap-3' >
                        <div className='w-full md:w-fit text-center text-lg md:text-xl'>Avg. Price </div>
                        <span className='hidden md:inline'>→</span>
                        <div className='text-md md:text-2xl font-bold w-full md:w-fit text-center'>
                            {"$" + Number(avgPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' })}
                        </div>
                    </div>

                    <div className=' self-center md:ml-auto flex flex-col md:flex-row items-baseline md:gap-3' >
                        <div className='w-full md:w-fit text-center text-lg md:text-xl'>Live Price</div>
                        <span className='hidden md:inline'>→</span>
                        <div className='text-md md:text-2xl font-bold w-full md:w-fit text-center'>
                            {
                                isPricesLoading ? "Loading.." : stock in livePrices ?"$"+ livePrices[stock] : "---"

                            }
                        </div>
                    </div>

                </div>

                <div className="grid grid-cols-3 md:gap-3 w-full text-xl z-20 mt-2">


                    <div className=' self-center  flex flex-col md:flex-row items-baseline' >
                        <div className='w-full md:w-fit text-center md:text-xl text-lg'>Market Value </div>
                        <span className='hidden md:inline'>→</span>
                        <div className='text-md md:text-2xl font-bold w-full md:w-fit text-center'>
                            {"$" + marketValue.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                currency: 'INR'
                            })}
                        </div>
                    </div>


                    {
                        gainLoss >= 0 ?
                            <div className=' self-center mx-auto flex flex-col md:flex-row items-baseline md:gap-3' >
                                <div className='w-full md:w-fit text-center md:text-xl text-lg'>Gain Loss </div>
                                <span className='hidden md:inline'>→</span>
                                <div className='text-md md:text-2xl text-green-400 font-bold w-full md:w-fit text-center'>

                                    {
                                        isPricesLoading ? <span className='text-white'>Loading...</span> : stock in livePrices ? "$" + gainLoss.toLocaleString('en-IN', {
                                            maximumFractionDigits: 2,
                                            currency: 'INR'
                                        }) : "---"
                                    }</div>
                            </div> :

                            <div className=' self-center mx-auto flex flex-col md:flex-row items-baseline md:gap-3' >
                                <div className='w-full md:w-fit text-center md:text-xl text-lg'>Gain Loss </div>
                                <span className='hidden md:inline'>→</span>
                                <div className='text-md md:text-2xl text-red-500 font-bold w-full md:w-fit text-center'>
                                    {
                                        isPricesLoading ? <span className='text-white'>Loading...</span> : stock in livePrices ?"- $" + Math.abs(gainLoss).toLocaleString('en-IN', {
                                            maximumFractionDigits: 2,
                                            currency: 'INR'
                                        }) : "---"
                                    }</div>
                            </div>


                    }

                    {
                        returnPercentage >= '0' ?
                            <div className=' self-center md:ml-auto flex flex-col md:flex-row items-baseline md:gap-3' >
                                <div className='w-full md:w-fit text-center text-lg md:text-xl'>Returns</div>
                                <span className='hidden md:inline'>→</span>
                                <span className='mx-auto text-md md:text-2xl font-bold text-green-400 flex'>
                                    {
                                        !isPricesLoading ? "+"+returnPercentage.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' }) : "---"
                                    }%
                                    <img src={upward} className='w-[20px]' />
                                </span>

                            </div> :
                            <div className=' self-center md:ml-auto flex flex-col md:flex-row items-baseline md:gap-3' >
                                <div className='w-full md:w-fit text-center text-lg md:text-xl'>Returns  </div>
                                <span className='hidden md:inline'>→</span>
                                 <span className='mx-auto text-md md:text-2xl font-bold text-red-500 flex  items-center justify-center align-middle'> {
                                !isPricesLoading ? returnPercentage.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' }) : "---"
                                }%
                                <img src={downward} className='w-[20px]' />
                                 </span>

                            </div>
                    }


                </div>




                <div className='min-w-full flex justify-between my-auto z-20'>
                    <div className=' w-fit h-fit mt-2'>
                        <Button

                            textStyle={{ fontWeight: 'bold', fontSize: '15', fontType: 'Josefin Sans' }}
                            // colorConfig={{ color: 'white', backgroundColor: '#15803D', edgeColors: { left: "#334155", top: '#334155', right: '#D2D2D2', bottom: '#8A8A8A' } }}

                            variant="primary"
                            kind="elevated"
                            size="small"
                            colorMode="dark"

                            className=' py-1 bg-green-700 text-xl font-bold '
                            onClick={() => {
                                // openHistory();
                                setIsHistoryOpen(!isHistoryOpen);
                            }}
                        >History</Button>
                    </div>
                    <div className={`grid grid-cols-2 gap-2 md:gap-4 mt-2  transition-all duration-300 -mr-10 `} >

                        <Button

                            textStyle={{ fontWeight: 'bold', fontSize: '15', fontType: 'Josefin Sans' }}
                            colorConfig={{ color: 'white', backgroundColor: '#15803D', edgeColors: { left: "#334155", top: '#334155', right: '#D2D2D2', bottom: '#8A8A8A' } }}
                            fullWidth={true}
                            variant="secondary"
                            kind="elevated"
                            size="small"
                            colorMode="dark"

                            className=' py-1 bg-green-700 text-xl font-bold '
                            onClick={() => {
                                    
                                setIsOpen(2);
                                setStockToBuy(stock);
                                
                            }}
                        >Buy More</Button>
                        <Button

                            textStyle={{ fontWeight: 'bold', fontSize: '15', fontType: 'Josefin Sans' }}
                            colorConfig={{ color: 'white', backgroundColor: '#DC2626', edgeColors: { left: "#334155", top: '#334155', right: '#D2D2D2', bottom: '#8A8A8A' } }}

                            variant="secondary"
                            kind="elevated"
                            size="small"
                            colorMode="dark"

                            className='px-4 py-1 bg-red-600'
                            onClick={() => {

                                setHoldingIdToSell(id);
                                setStockToSell(stock);
                                setMaxQuantityToSell(quantity);


                                setIsOpen(1);



                            }}
                        >Sell</Button>
                    </div>

                </div>



                {
                    isHistoryOpen ?
                        <div className='roll-down flex flex-col gap-3 w-9/10 mt-3 transition-transform duration-500 transform translate-y-0'>
                            {/* <p>History</p> */}
                            {

                                reversedTrades.map((trade) => {

                                    return (
                                        <span className='text-lg font-bold  px-3 p-1 rounded-md' style={{border:"2px solid white"}}>{`${trade.tradeType == 'S' ? "Sold" : "Bought"} ${trade.quantity} Stock${trade.quantity > 1 ? "s" : ""} at Price ${Number(trade.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' })} on ${new Date(trade.tradeTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }).toString()}`}</span>

                                    )

                                })
                            }

                        </div>
                        : <>
                        </>
                }
            </div>

        </div>
    );
};

export default HoldingCard