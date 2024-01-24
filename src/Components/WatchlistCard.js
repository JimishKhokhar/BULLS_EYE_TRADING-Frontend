import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button } from '@cred/neopop-web/lib/components'
import SellDialog from './sellDialog'
import Dialog from './Dialog'
import { useContext } from 'react'
import { ComponentDataContext, UserDataContext} from '../App'
import BuyDialog from './BuyDialog'
import { getStockQuote } from '../utils'
import { deleteFromWatchlistUtils } from '../utils'


const WatchlistCard = ({ item, setIsOpen, setStockToBuy ,deleteFromLocal }) => {

    const { successAlert, failAlert, infoAlert } = useContext(ComponentDataContext);
    const { watchlistLivePrices, setWatchlistLivePrices } = useContext(ComponentDataContext);
    const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);

    const [low, setLow] = useState(-1);
    const [high, setHigh] = useState(-1);
    const [close, setClose] = useState(-1);


    async function findStockQuote(stock) {
        const result = await getStockQuote(stock);
        return result;
    }

    async function findIt() {
        let stockSymbol = item.stockSymbol;
        if (stockSymbol in watchlistLivePrices) {
            setLow(watchlistLivePrices[stockSymbol].l);
            setHigh(watchlistLivePrices[stockSymbol].h);
            setClose(watchlistLivePrices[stockSymbol].c);
        }
        else {
            const stockQuote = await findStockQuote(stockSymbol);
            console.log("From " + stockSymbol, stockQuote)
            if (stockQuote.c == Infinity) {
                setLow(-2);
                setHigh(-2);
                setClose(-2);
            }
            else {
                watchlistLivePrices[stockSymbol] = stockQuote
                setLow(stockQuote.l);
                setHigh(stockQuote.h);
                setClose(stockQuote.c);

                console.log(watchlistLivePrices)
            }

        }
    }

    async function deleteFromWatchlistLocal()
    {
        const resultOfDeletion=await deleteFromWatchlistUtils(userObject._id,item.stockSymbol);
        if(resultOfDeletion==1)
        {
            successAlert(`${item.stockSymbol} Deleted Successfully From WatchList!`);
            deleteFromLocal(item.stockSymbol)
        } 
        else if(resultOfDeletion==-1)
            failAlert("User Not Found!");
        else if(resultOfDeletion==-2)
            failAlert("Stock not Found in WatchList");
        else failAlert("Internal Server Error");
    }


    useEffect(() => {

        findIt();

    }, [])

    return (
        <div>

            <div className='md:p-2 px-2 py-1'>

                <div className=' p-2 flex justify-start md:p-4  flex-col w-full md:max-w-[50%] bg-slate-700 mx-auto rounded-lg '>
                    <div className='text-2xl md:text-3xl  overflow-hidden w-full bg-black md:bg-slate-700  font-bold shadow-custom rounded-lg  pb-1  flex justify-center md:justify-between gap-3 '>
                        <span className='text-white  md:px-3 md:py-1 bg-black rounded-lg'>{item.stockName}</span>
                        <span className='text-gray-400 hidden md:block'>{item.stockSymbol}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1  w-full text-xl z-20    items-center  md:px-5">
                        <div className=' self-center flex flex-col md:flex-row items-baseline md:gap-3 ' >
                            <div className='w-full md:w-fit text-center  '>Low </div>
                            <span className='hidden md:inline'>→</span>
                            {
                                low == -1 ?
                                    <span className='text-lg mx-auto md:mx-0'>Loading..</span>
                                    :
                                    low == -2 ?
                                        <span className='text-lg mx-auto md:mx-0'>No Data</span>
                                        :
                                        <div className='text-md md:text-2xl font-bold w-full md:w-fit text-center  '> {"$" + new Number(low).toFixed(2)}</div>
                            }

                        </div>

                        <div className='self-center mx-auto flex flex-col  md:flex-row items-baseline  gap-1' >
                            <div className='w-full md:w-fit text-center '>Prev. Close </div>
                            <span className='hidden md:inline'>→</span>
                            <div className='text-md md:text-2xl  w-full md:w-fit text-center'>

                                {
                                    low == -1 ?
                                        <span className='text-lg mx-auto md:mx-0'>Loading..</span>
                                        :
                                        low == -2 ?
                                            <span className='text-lg mx-auto md:mx-0'>No Data</span>
                                            :
                                            <div className='text-md md:text-2xl font-bold w-full md:w-fit text-center '>{"$" + Number(close).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' })}</div>
                                }



                            </div>
                        </div>

                        <div className=' self-center md:ml-auto flex flex-col md:flex-row items-baseline md:gap-3  ' >
                            <div className='w-full md:w-fit text-center '>High</div>
                            <span className='hidden md:inline'>→</span>
                            <div className='text-md md:text-2xl  w-full md:w-fit text-center'>

                                {
                                    low == -1 ?
                                        <span className='text-lg mx-auto md:mx-0'>Loading..</span>
                                        :
                                        low == -2 ?
                                            <span className='text-lg mx-auto md:mx-0'>No Data</span>
                                            :
                                            <div className='text-md  md:text-2xl   font-bold w-full md:w-fit text-center'>
                                                {"$" + Number(high).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' })}
                                            </div>
                                }

                            </div>
                        </div>

                    </div>

                    <div className='min-w-full flex justify-end my-auto z-20 px-3'>

                        <div className={`grid grid-cols-3 justify-center items-center gap-2 md:gap-4 mt-2 w-full  md:w-fit transition-all duration-300  `} >
                            <Button
                                textStyle={{ fontWeight: 'bold', fontSize: '15', fontType: 'Josefin Sans' }}
                                fullWidth={true}
                                variant="primary"
                                kind="elevated"
                                size="small"
                                colorMode="dark"
                                onClick={() => {
                                    deleteFromWatchlistLocal();
                                }}
                                className='px-4 py-1 bg-red-600'

                            ><span>Delete</span></Button>
                            <Button

                                textStyle={{ fontWeight: 'bold', fontSize: '15', fontType: 'Josefin Sans' }}
                                colorConfig={{ color: 'white', backgroundColor: '#15803D', edgeColors: { left: "#334155", top: '#334155', right: '#D2D2D2', bottom: '#8A8A8A' } }}
                                fullWidth={true}
                                variant="secondary"
                                kind="elevated"
                                size="small"
                                colorMode="dark"


                                className=' py-1 bg-green-700 text-xl font-bold '
                                onClick={() => { setIsOpen(1); setStockToBuy(item.stockSymbol) }}

                            >BUY</Button>
                            <Button

                                textStyle={{ fontWeight: 'bold', fontSize: '15', fontType: 'Josefin Sans' }}
                                colorConfig={{ color: 'white', backgroundColor: '#DC2626', edgeColors: { left: "#334155", top: '#334155', right: '#D2D2D2', bottom: '#8A8A8A' } }}
                                fullWidth={true}
                                variant="secondary"
                                kind="elevated"
                                size="small"
                                colorMode="dark"
                                onClick={() => {
                                    setIsOpen(2);
                                    setStockToBuy(item.stockSymbol);
                                }}
                                className='px-4 py-1 bg-red-600'

                            >SELL</Button>

                        </div>

                    </div>



                </div>

            </div>
        </div>
    )
}

export default WatchlistCard