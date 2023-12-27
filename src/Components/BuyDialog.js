import React, { useContext, useEffect, useState } from 'react'
import Logo from "../Images/close-lg-svgrepo-com (1).svg"
import { buyStock, findTheBalance, sellTheStock } from '../utils';
import { ComponentDataContext, UserDataContext } from '../App';
import { Button } from '@cred/neopop-web/lib/components';
import { getStockQuote } from '../utils';

import useMarketTimeChecker from './marketTimeChecker';


const BuyDialog = ({ closeTheDialog, stockToBuy ,updateHoldingCardForBuying}) => {

    const isMarketLive = useMarketTimeChecker();


    // const stockQuote={c:120.34,l:110.33,h:222.32};
    const [quantity, setQuantity] = useState(1);
    const [isResultfound, setIsResultFound] = useState(0);//0-> Loading , -1 -> Data not fetched , 1 -> Data Fetched
    const [stockQuote, setStockQuote] = useState({});

    const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);
    const [currentBalance, setCurrentBalance] = useState(0);
    const { failAlert, successAlert, infoAlert } = useContext(ComponentDataContext)


    async function getStockQuoteLocal() {
        const balanceResult = await findTheBalance(userObject._id);
        if (balanceResult == -1)
            setCurrentBalance(Infinity);
        else setCurrentBalance(balanceResult);
        const result = await getStockQuote(stockToBuy);
        if (result == undefined || result.c == Infinity) {
            setIsResultFound(-1);
        }
        else {
            setStockQuote(result);
            setIsResultFound(1);
        }


    }
    useEffect(() => {
        getStockQuoteLocal();
    }, [stockToBuy]);


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    return (
        <div>
            <div className=' z-30 fixed md:absolute bottom-0 min-w-[100vw] max-w-[100vw] lg:min-w-[350px] lg:max-w-[350px]  h-[500px] bg-black border-slate-700  border-2  text-white rounded-lg mx-auto'>

                <button className=' absolute p-3 flex justify-center right-0 mr-2 text-lg' onClick={() => {
                    closeTheDialog();
                }}><img src={Logo} className='  w-8' ></img></button>

                <div className='w-full flex flex-col align-middle items-center'>
                    <span className=' text-3xl font-bold text-slate-400 m-2'>{stockToBuy}</span>


                    {
                        isResultfound == 0 ?
                            <div className='w-full min-h-[400px] flex  '>
                                <span className='m-auto text-xl'>Loading...</span>
                            </div>
                            :
                            isResultfound == -1 ?
                                <div className="w-full min-h-[400px] flex ">
                                    <span className='m-auto text-xl'>Failed To Fetch Data</span>
                                </div>
                                :
                                <div className='w-full flex flex-col align-middle items-center'>
                                    <span className='text-3xl m-2 font-extrabold text-emerald-500 select-none '>$ {Number(stockQuote?.c).toFixed(3)}</span>
                                    <div className='w-full flex  justify-around my-2 text-2xl select-none '>
                                        <div><span className='font-bold'>Low: </span><span className=' p-1  bg-red-600 rounded-md'>${Number(stockQuote.l).toFixed(2)}</span></div>
                                        <div><span className='font-bold'>High: </span><span className=' p-1  bg-green-600 rounded-md'>${Number(stockQuote.h).toFixed(2)}</span></div>
                                    </div>


                                    <span className='text-3xl mt-10 select-none '>Quantity</span>
                                    <div className='flex gap-5 text-2xl mt-4 select-none '>

                                        {
                                            quantity > 0 ? <button onClick={() => { setQuantity(quantity - 1) }} className=' text-[30px]  px-5 bg-slate-700 font-bold  rounded-md flex  justify-center  align-middle pb-2 '><span>-</span></button> :
                                                <button className=' text-[30px]  px-5 bg-slate-900 font-bold  rounded-md flex  justify-center  align-middle pb-2 '><span>-</span></button>
                                        }

                                        <input type='number' value={quantity} className='w-[100px] bg-black text-white text-center ' onChange={(e) => { setQuantity(Number(e.target.value)) }} />

                                        {
                                            <button onClick={() => { setQuantity(quantity + 1) }} className=' text-[30px]  px-4 bg-slate-700 font-bold  rounded-md flex  justify-center  align-middle pb-2 '><span className='mx-1'>+</span></button>
                                        }





                                    </div>
                                    <div className='w-full flex justify-center mt-3 gap-5'>
                                        <button onClick={() => {
                                            setQuantity(10)
                                        }} className={`text-[20px] px-2  font-bold rounded-md flex justify-center align-middle bg-slate-700    `}><span className='mx-1'>10</span></button>
                                        <button onClick={() => {
                                            setQuantity(25)
                                        }} className={`text-[20px] px-2  font-bold rounded-md flex justify-center align-middle bg-slate-700   `}><span className='mx-1'>25</span></button>
                                        <button onClick={() => {
                                            setQuantity(50)
                                        }} className={`text-[20px] px-2  font-bold rounded-md flex justify-center align-middle bg-slate-700   `}><span className='mx-1'>50</span></button>
                                        <button onClick={() => {
                                            setQuantity(100)
                                        }} className={`text-[20px] px-2  font-bold rounded-md flex justify-center align-middle bg-slate-700    `}><span className='mx-1'>100</span></button>



                                    </div>

                                    <div className='absolute w-full flex flex-col  justify-center gap-5 bottom-0 select-none '>

                                        {
                                            Number(quantity * stockQuote.c).toFixed(2) > currentBalance ? <span className=' self-center text-4xl font-bold text-indigo-500 opacity-60'>$ {Number(quantity * stockQuote.c).toFixed(2)}</span> :
                                                <span className=' self-center text-4xl font-bold text-indigo-500 opacity-100'>$ {Number(quantity * stockQuote.c).toFixed(2)}</span>

                                        }



                                        <Button

                                            textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}
                                            colorConfig={{ color: 'white', backgroundColor: '#15803D', edgeColors: { left: "black", top: 'black', right: '#D2D2D2', bottom: '#8A8A8A' } }}
                                            fullWidth={true}
                                            variant="secondary"
                                            kind="elevated"
                                            size="big"
                                            colorMode="dark"

                                            className='w-full  p-3 bg-green-700 text-3xl font-bold' onClick={async () => {

                                                if (!isMarketLive) {
                                                    failAlert("Order FAILED! Market is Not Live!", "top-center");
                                                    await sleep(3000);
                                                    infoAlert("Market is Active from 7:00 PM to 1:30 AM IST(Indian Standard Time) on Working days.", "top-center", 5000)
                                                    return;
                                                }


                                                const result = await buyStock(userObject._id, stockToBuy, stockQuote?.c, quantity, new Date());
                                                getStockQuoteLocal();
                                                if (result == 0) {
                                                    failAlert("Failed To Execute Order!", "top-center");
                                                }
                                                else if (result == -1) {
                                                    failAlert(`Not Enough Balance To Trade! \n Current Balance: ${"$" + Number(currentBalance).toFixed(2)}`, "top-center");
                                                }
                                                else if (result == 1) {
                                                    if(updateHoldingCardForBuying)
                                                    updateHoldingCardForBuying();
                                                    successAlert(`Successfully Bought ${stockToBuy}`, 'top-center');
                                                }
                                            }}>BUY</Button>
                                    </div>
                                </div>
                    }




                </div>

            </div>

        </div>
    )
}

export default BuyDialog