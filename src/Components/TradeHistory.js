import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@cred/neopop-web/lib/components'
import { UserDataContext, ComponentDataContext } from '../App'
import { findTradeHistory } from '../utils'
import { useAuth0 } from '@auth0/auth0-react'

const TradeHistory = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);

  const [tradeHistory, setTradeHistory] = useState([]);

  const { setSelectedComponent, failAlert } = useContext(ComponentDataContext);

  const { loginWithRedirect } = useAuth0();

  async function findHistory() {

    setIsLoading(true);

    const response = await findTradeHistory(userObject._id);
    if (response == []) {
      //do Fail Alert
      failAlert("Error in Fetching The Trade History!", 'top-right');
      setIsLoading(false);
      return;
    }
    const historyArray = response[0]?.allTrades;

    if (historyArray?.length > 0) {
      const reversedTrades = [...historyArray]?.reverse();
      setTradeHistory(reversedTrades);
    }

    setIsLoading(false);
  }



  useEffect(() => {
    document.title="Trade History"
    setSelectedComponent("Portfolio");
    if (isLoggedIn) {

      console.log(userObject._id)
      findHistory();
    }
  }, []);

  useEffect(() => {
    console.log(tradeHistory)
  }, [tradeHistory])

  return (
    <div className="pt-[5px]  min-w-[100%] overflow-hidden   text-white">

      <div className={`  flex justify-center   w-full   content-center   ${isLoggedIn || tradeHistory?.length == 0 ? "min-h-4/5  min-h-[calc(70vh-61px)] max-h-4/5" : "self-center max-h-[calc(70vh-61px)] min-h-[calc(100vh-61px)]"}  mx-auto  md:px-5`}>
        <div className={` ${isLoggedIn || tradeHistory?.length == 0 ? "min-h-4/5  max-h-4/5" : "self-center min-h-4/5"}   flex justify-center content-center w-full  align-middle `}>
          <div className={` w-full   ${isLoggedIn || tradeHistory?.length == 0 ? "" : "self-center "}  `}>

            {
              !isLoggedIn ?
                <div className={` min-w-full flex justify-center  md:max-w-[60%] min-h-4/5  min-h-[calc(100vh-61px)] max-h-4/5 md:min-w-[60%] w-full   content-center   self-center max-h-[calc(100vh-61px)]  mx-auto p-3 md:p-5`}>
                  <span className=' min-w-full m-auto  text-lg md:text-3xl text-center flex flex-col gap-3 justify-center items-center  '>
                    <span className='min-w-full m-auto text-lg md:text-3xl text-center '>Login To See History</span>
                    <Button
                      variant="secondary"
                      kind="elevated"
                      size="big"
                      colorMode="dark"
                      textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}

                      onClick={loginWithRedirect} >Login</Button>
                  </span>
                </div>
                :
                isLoading ?
                  <div className='w-full h-full   '>
                    <div className={`flex flex-col  justify-center  h-full m-auto `}>
                      <span className='text-3xl p-10 text-center'>Loading...</span>

                    </div>
                  </div> :


                  (!isLoggedIn && isLoading == false) ?
                    <div className={`flex flex-col  ${isLoggedIn ? "" : "justify-center  h-full"}`}>
                      <div className='text-3xl p-10 text-center'>Login To Trade</div>
                      <Button
                        variant="secondary"
                        kind="elevated"
                        size="big"
                        colorMode="dark"
                        textStyle={{ fontWeight: 'bold', fontSize: '30', fontType: 'Josefin Sans' }}

                        Title={"Login"} GoTo={"/login"} />
                    </div> :
                    <div className='h-full min-w-full  '>
                      <div className='flex flex-col   gap-2 min-w-full h-full  '>
                        {
                          tradeHistory.length == 0 ?
                            <div className='w-full h-full  '>
                              <div className={`flex flex-col  justify-center  h-full m-auto `}>
                                <span className='text-3xl p-10 text-center'>No Trades!</span>

                              </div>
                            </div>

                            :
                            tradeHistory?.map((trade) => {
                              return (
                                <div className='max-w-full  flex flex-col md:gap-3 md:my-1  p-3 px-3 md:px-5 shadow-custom-box rounded-md min-w-full bg-slate-700'>
                                  <div className='flex justify-between w-full  items-center'>
                                    <span className='text-2xl font-bold text-bold shadow-custom'>{trade.stock}</span>
                                    <span className='text-lg '>{new Date(trade.tradeTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }).toString()}</span>
                                  </div>
                                  <div className='flex md:flex-row flex-col  text-lg md:text-2xl  md:justify-between'>
                                    <span className='  text-white'>{`${trade.tradeType == 'S' ? "Sold" : "Bought"} ${Number(trade.quantity).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'INR' })} Stock${trade.quantity > 1 ? "s" : ""} at Price ${"$" + Number(trade.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' })} `}</span>
                                    <span className='flex gap-2 items-center ' >
                                      <span >{`Balance Change `}</span>

                                      {
                                        trade.tradeType == 'S' ? <span className='font-bold text-green-500'>{"+ $" + Number(Number(trade.quantity) * Number(trade.price)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' })}</span>
                                          : <span className='font-bold text-red-600'>{"- $" + Number(Number(trade.quantity) * Number(trade.price)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'INR' })}</span>
                                      }


                                    </span>
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

export default TradeHistory