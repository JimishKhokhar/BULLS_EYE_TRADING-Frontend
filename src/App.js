import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer'
import DashBoard from './Components/Dashboard';
import { Context, createContext, useContext, useEffect, useState } from 'react';
import Peers from './Components/Peers';
import LandingComponent from './Components/LandingComponent';
import Stocks from './Components/Stocks';
import { BrowserRouter, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import LoginComponent from './Components/LoginComponent';
import Signup from './Components/Signup';
import Portfolio from './Components/Portfolio';
import TradeHistory from './Components/TradeHistory';
import Rankings from './Components/Rankings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { findOrCreateUser } from './utils';
import { useSearchParams } from 'react-router-dom';
import { URLSearchParamsInit } from 'react-router-dom';
import MainMenu from './Components/MainMenu';
import Watchlist from './Components/Watchlist'


//AUTH0 Imports
import { useAuth0 } from "@auth0/auth0-react";
import UserCover from './Components/UserCover';
import FixedButtons from './Components/FixedButtons';

// Total Users
import { getTotalUsersUtils } from './utils';


export const CurrStockContext = createContext();
export const CurrentStockDataContext = createContext();
export const StockReloaderContext = createContext();
export const UserDataContext = createContext();
export const PeersDataContext = createContext();
export const ComponentDataContext = createContext();



const router1 = createBrowserRouter([
  {
    path: "/",
    element: <div>
      <Header />
      <LandingComponent />
      <MainMenu/>
    </div>,
    index:true
  },
  {
    path: "/stocks",
    element: <div >
      <Header />
      <Stocks  />
      <MainMenu/>
    </div>
  },
  {
    path: "/profile",
    element: <div>
      <Header />
      <UserCover />
      <MainMenu/>
    </div>
  },
  {
    path: "/Portfolio",
    element: <div>
      <Header />
      <Portfolio />
      <MainMenu/>
    </div>
  },
  {
    path: "/TradeHistory",
    element: <div>
      <Header />
      <TradeHistory />
      <MainMenu/>
    </div>
  },
  {
    path: "/Rankings",
    element: <div>
      <Header />
      <Rankings />
      <MainMenu/>
    </div>
  },
  {
    path: "/Watchlist",
    element: <div>
      <Header />
      <Watchlist/>
      <MainMenu/>
    </div>
  }
]);



function App() {

  const [currentStock, setCurrentStock] = useState("AAPL");
  const [data, setData] = useState({});
  const [isReloadAllStocks, setIsReloadAllStocks] = useState(false);
  const [userObject, setUserObject] = useState({ name: "Jimish" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [livePricesGlobal,setLivePricesGlobal]=useState({});
  const [stockToSell,setStockToSell]=useState(currentStock);
  const [maxQuantityToSell,setMaxQuantityToSell]=useState(1);
  const [holdingIdToSell,setHoldingIdToSell]=useState(undefined);

  //live prices of portfolio
  const [livePrices, setLivePrices] = useState({});
  const [isLimitOver,setIsLimitOver]=useState(false);

  //Live Prices for WatchList
  const [watchlistLivePrices,setWatchlistLivePrices]=useState({});

  //Total Users
  const [totalUsers,setTotalUsers]=useState(-1);

  
  // const [searchParams, setSearchParams] = useSearchParams();
  // let errorMessage=searchParams.get("error");
  // if(errorMessage=="access_denied")
  // {
  //   toast.error("Please Verify Your Email Before Logging In. Verification Email Sent!", {
  //     position: "top-center",
  //     autoClose: 7000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "light",
  //   });
  // }
  


  const [peers, setPeers] = useState([]);

  const [selectedComponent, setSelectedComponent] = useState("");


  const { isAuthenticated , user } = useAuth0();

  


  const successAlert = (m, position, duration = 3000) => {
    toast.success(m, {
      position: position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  const failAlert = (m, position, duration = 3000) => {
    toast.error(m, {
      position: position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  const infoAlert = (m, position,duration = 3000) => {
    toast.info(m, {
      position: position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }


  const [errorMessage,setErrorMessage]=useState("");
  const [longError,setLongError]=useState("");


  async function getTheUsers()
  {
    const users=await getTotalUsersUtils();
    console.log("from app.js   ",users)
    setTotalUsers(users);
  }

  async function findTotalUsers()
  {
     await getTheUsers();
  }



  useEffect(() => {
    //getting Total Users
    findTotalUsers();

    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    setErrorMessage(params.get('error'));
    setLongError(params.get('error_description'));

    // Retrieve UserObject and isLoggedIn from session storage when the component loads
    const UserObjectStr = sessionStorage.getItem("userObject");
    const isLoggedInStr = sessionStorage.getItem("isLoggedIn");

    if (UserObjectStr && isLoggedInStr) {
      setUserObject(JSON.parse(UserObjectStr));
      setIsLoggedIn(JSON.parse(isLoggedInStr));
    }
    else {
      setUserObject({});
      setIsLoggedIn(false);
    }


  }, []);

  useEffect(()=>{

    if(longError=='Please verify your email before logging in.' )
    {
      toast.info("Please Verify Your Email Before Logging In. Verification Email Sent!", {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
    }

  },[errorMessage]);


  async function findMongoUserAndUpdateStateVarialble(name,email,sub)
  {
    const response=await findOrCreateUser(name,email,sub);
    
    setUserObject(response);
  }


  useEffect(() => {
    // Store UserObject and isLoggedIn in session storage when they change

    console.log("Halo bhai ",isAuthenticated,user)

    if(user)
    {
      successAlert("Welcome "+user.name,"top-right")
      const mongoUser=findMongoUserAndUpdateStateVarialble(user.name,user.email,user.sub);
    }
    else console.log("NOT USER")
    


    sessionStorage.setItem("userObject", JSON.stringify(userObject));
    sessionStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isAuthenticated]);


 
  useEffect(()=>{
    if(userObject.sub)
    {
      setIsLoggedIn(true);   
    }
    console.log("My user Object Updated",userObject)
  },[userObject])

  




  return (
    <div>
      <CurrentStockDataContext.Provider value={[data, setData]}>
        <CurrStockContext.Provider value={[currentStock, setCurrentStock]}>
          <StockReloaderContext.Provider value={[isReloadAllStocks, setIsReloadAllStocks]}>
            <UserDataContext.Provider value={[userObject, setUserObject, isLoggedIn, setIsLoggedIn]}>
              <PeersDataContext.Provider value={[peers, setPeers]}>
                <ComponentDataContext.Provider value={{ totalUsers,setTotalUsers,watchlistLivePrices,setWatchlistLivePrices,livePrices,setLivePrices,isLimitOver,setIsLimitOver,selectedComponent, setSelectedComponent, successAlert, failAlert, infoAlert,livePricesGlobal,setLivePricesGlobal ,stockToSell,setStockToSell,maxQuantityToSell,setMaxQuantityToSell,holdingIdToSell,setHoldingIdToSell }}>
                  <div>
                    <RouterProvider router={router1} />
                    <ToastContainer className=" mt-10" />
                    
                    <Footer />
                  </div>
                </ComponentDataContext.Provider>
              </PeersDataContext.Provider>
            </UserDataContext.Provider>
          </StockReloaderContext.Provider>
        </CurrStockContext.Provider>
      </CurrentStockDataContext.Provider>
    </div>
  );
}

export default App;
