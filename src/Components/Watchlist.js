import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserDataContext, ComponentDataContext } from '../App'
import { getWatchlistUtils } from '../utils'
import { Button } from '@cred/neopop-web/lib/components'
import { useAuth0 } from '@auth0/auth0-react'
import WatchlistCard from './WatchlistCard'
import BuyDialog from './BuyDialog'


const Watchlist = () => {


  const [isLoading, setIsLoading] = useState(true);



  const { setSelectedComponent, failAlert } = useContext(ComponentDataContext);
  const [Watchlist, setWatchlist] = useState([]);

  const { loginWithRedirect } = useAuth0();

  const [userObject, setUserObject, isLoggedIn, setIsLoggedIn] = useContext(UserDataContext);



  async function getWatchlist() {
    setIsLoading(true);
    const result = await getWatchlistUtils(userObject?._id);
    if (result != undefined) {
      console.log("Got the WatchList from WatchList Component", result);
      setWatchlist(result.watchlist)
    }
    else
      console.log("Failed to get the watchlist")

    setIsLoading(false)

  }

  //for deleting local instance of watchlist 
  async function deleteFromLocal(stockSymbol) {
    let WatchlistDuplicate = [...Watchlist]; // Replace with your actual Watchlist array

    // Use the filter function to create a new array excluding the object with the specified stockSymbol
    const updatedWatchlist = WatchlistDuplicate.filter(item => item.stockSymbol !== stockSymbol);
    setWatchlist(updatedWatchlist);

  }


  useEffect(() => {
    document.title = "WatchList"
    setSelectedComponent("Watchlist");
    window.scrollTo(0, 0)
    if (isLoggedIn)
      getWatchlist();
  }, []);

  useEffect(() => {
    console.log("Watchlist State is Setted", Watchlist);


  }, [Watchlist])

  const [isOpen, setIsOpen] = useState(0);//1 for buy stock and 2 for sell stock
  function closeTheDialog() {
    setIsOpen(0);
  }

  const [stockToBuy, setStockToBuy] = useState("");
  useEffect(() => {
    console.log("Buying ", stockToBuy);
  }, [stockToBuy]);



  return (
    <div className=" transition-all md:pt-16 duration-500 select-none text-white  pt-[62px] overflow-hidden w-full bg-gradient-to-b from-black to-slate-800 bg-[linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8520658263305322) 100%)] text-white">

      {
        isOpen == 2 ? <></> :
          isOpen == 1 ?
            <div className='w-[100vw]   md:w-fit fixed z-30  bottomUp  md:right-[350px]  bottom-0 roll-out '>
              <BuyDialog stockToBuy={stockToBuy} closeTheDialog={closeTheDialog} />
            </div> : <></>
      }

      {


        !isLoggedIn ?
          <div className={`  flex justify-center  md:max-w-[60%] min-h-4/5  min-h-[calc(100vh-61px)] max-h-4/5 md:min-w-[60%] w-full   content-center   self-center max-h-[calc(100vh-61px)]  mx-auto p-3 md:p-5`}>
            <span className='m-auto text-lg md:text-3xl text-center flex flex-col justify-center items-center gap-3'>
              <span className='m-auto text-lg md:text-3xl text-center'>Login To Use WatchList</span>
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
            <div className={`  flex justify-center  md:max-w-[60%] min-h-4/5  min-h-[calc(100vh-61px)] max-h-4/5 max-h-[calc(100vh-61px)] md:min-w-[60%] w-full   content-center   self-center max-h-[calc(100vh-61px)]  mx-auto p-3 md:p-5`}>
              <span className='m-auto text-2xl md:text-2xl text-center'>Loading...</span>
            </div>
            :

            Watchlist.length == 0 ?
              <div className={`  flex justify-center  md:max-w-[60%] min-h-4/5  min-h-[calc(100vh-61px)] max-h-4/5 max-h-[calc(100vh-61px)] md:min-w-[60%] w-full   content-center   self-center max-h-[calc(100vh-61px)]  mx-auto p-3 md:p-5`}>
                <span className='m-auto text-lg md:text-3xl text-center'>No Stocks...</span>
              </div> :
              <div className='min-h-4/5  min-h-[calc(100vh-61px)]  mt-1'>
                {
                  Watchlist.map((item) => {
                    return (
                      <div className='transition-all duration-500 '><WatchlistCard deleteFromLocal={deleteFromLocal} item={item} setIsOpen={setIsOpen} setStockToBuy={setStockToBuy} /></div>
                    )
                  })
                }
              </div>
      }
    </div >
  )
}

export default Watchlist