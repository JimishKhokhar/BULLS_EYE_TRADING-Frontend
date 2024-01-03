import React from 'react'
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

import {
    AccountBalanceWallet as PortfolioIcon,
    History as TradeHistoryIcon,
    Person as ProfileIcon,
    TrendingUp as RankingsIcon,
} from '@mui/icons-material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';//stocks
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';//watch list
import LeaderboardIcon from '@mui/icons-material/Leaderboard';



import stocksBlack from "../Images/stocks-black.svg"
import stocksWhite from "../Images/stocks-white.svg"
import portfolioWhite from "../Images/portfolio-white.svg"
import portfolioBlack from "../Images/portfolio-black.svg"
import historyWhite from "../Images/history-white.svg"
import historyBlack from "../Images/history-black.svg"
import watchListBlack from "../Images/watchlist-black.svg"
import watchListWhite from "../Images/watchlist-white.svg"
import rankingsBlack from "../Images/rankings-black.svg"
import rankingsWhite from "../Images/rankings-white.svg"
import { ComponentDataContext } from '../App'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

import '../BottomNavbar.css'





const MainMenu = () => {
    const { selectedComponent, setSelectedComponent } = useContext(ComponentDataContext);

    const handleNavChange = (event, newValue) => {
        setSelectedComponent(newValue);
    };

    return (
        <div className='md:hidden block  bg-black'>
            <BottomNavigation
                value={selectedComponent}
                onChange={handleNavChange}
                showLabels
                sx={{
                    width: '100%',
                    position: 'fixed',
                    bottom: -4,
                    zIndex: 20,
                    colorScheme: 'dark',
                    backgroundColor: 'black','& .MuiBottomNavigationAction-root': {
                        // Adjust the spacing between menu items here
                        minWidth: 'auto'
                    },
                    height:'65px'
                }}

            >
                <Link to="/Stocks">

                    <div className={`${selectedComponent == 'Stocks' ? "bg-white" : ""}`}>
                        <BottomNavigationAction
                            label="Stocks" value="Stocks"
                            icon={<QueryStatsIcon style={{
                                color: selectedComponent === 'Stocks' ? 'black' : 'white',
                                fontSize:28
                            }} />}

                        />
                    </div>

                </Link>

                <Link to="/Watchlist">
                    <div className={`${selectedComponent == 'Watchlist' ? "bg-white" : ""}`}>
                        <BottomNavigationAction label="Watchlist" value="" icon={<PlaylistAddIcon style={{
                            color: selectedComponent === 'Watchlist' ? 'black' : 'white',
                            fontSize:28
                        }} />} />
                    </div>
                </Link>

                <Link to="/Portfolio">

                    <div className={`${selectedComponent == 'Portfolio' ? "bg-white" : ""}`}>
                        <BottomNavigationAction
                            label="Portfolio" value="Portfolio"
                            icon={<PortfolioIcon style={{
                                color: selectedComponent === 'Portfolio' ? 'black' : 'white',
                                fontSize:28
                            }} />}

                        />
                    </div>


                </Link>

                <Link to="/Rankings">

                    <div className={`${selectedComponent == 'Rankings' ? "bg-white" : ""}`}>
                        <BottomNavigationAction
                            label="Rankings" value="Rankings"
                            icon={<LeaderboardIcon style={{
                                color: selectedComponent === 'Rankings' ? 'black' : 'white',
                                fontSize:28
                            }} />}

                        />
                    </div>

                </Link>

                <Link to="/Profile">
                    <div className={`${selectedComponent == 'profile' ? "bg-white" : ""}`}>
                        <BottomNavigationAction
                            label="Profile"
                            value="Profile"
                            icon={<ProfileIcon style={{
                                color: selectedComponent === 'profile' ? 'black' : 'white',
                                fontSize:28
                            }} />}

                        />
                    </div>

                </Link>
            </BottomNavigation>
        </div>
    );

    //which Component is Selected
    // const { selectedComponent, setSelectedComponent } = useContext(ComponentDataContext);

    // return (
    //     <div className='w-[100vh] fixed md:hidden bottom-0  transition-all duration-700 rounded-t-3xl z-20 bg-black overflow-hidden'>
    //         <div class="fixed bottom-0 left-0 right-0  grid grid-cols-5 max-h-[66px] border-2 z-20 bg-black ">

    //             <Link to="/Stocks">
    //                 {
    //                     selectedComponent == "Stocks" ?
    //                         <div className='pt-3 pb-2 w-full flex h-full justify-center  bg-white items-start '>
    //                             <img src={stocksBlack} alt="Image 1" class=" max-h-[40px]  object-cover  cursor-pointer" />
    //                         </div> :
    //                         <div className='pt-3 pb-2 w-full flex justify-center items-start '>
    //                             <img src={stocksWhite} alt="Image 1" class=" max-h-[40px]  fill-green-200 object-cover  cursor-pointer" />
    //                         </div>

    //                 }
    //             </Link>

    //             <Link to="/Portfolio">
    //                 {
    //                     selectedComponent == "Portfolio" ?
    //                         <div className='pt-2  pb-2 bg-white h-full w-full flex justify-center items-start '>
    //                             <img src={watchListBlack} alt="Image 1" class=" max-h-[50px] object-cover  cursor-pointer" />
    //                         </div> :
    //                         <div className='pt-2  pb-2  w-full flex justify-center items-start '>
    //                             <img src={watchListWhite} alt="Image 1" class=" max-h-[50px] object-cover  cursor-pointer" />
    //                         </div>

    //                 }
    //             </Link>

    //             <Link to="/Portfolio">
    //                 {
    //                     selectedComponent == "Portfolio" ?
    //                         <div className='pt-2  pb-2 bg-white h-full w-full flex justify-center items-start '>
    //                             <img src={portfolioBlack} alt="Image 1" class=" max-h-[50px] object-cover  cursor-pointer" />
    //                         </div> :
    //                         <div className='pt-2  pb-2  w-full flex justify-center items-start '>
    //                             <img src={portfolioWhite} alt="Image 1" class=" max-h-[50px] object-cover  cursor-pointer" />
    //                         </div>

    //                 }
    //             </Link>

    //             <Link to="/TradeHistory">
    //                 {
    //                     selectedComponent == "TradeHistory" ?
    //                         <div className='pt-3  bg-white h-full  w-full flex justify-center items-start '>
    //                             <img src={historyBlack} alt="Image 1" class=" max-h-[43px] object-cover  cursor-pointer" />
    //                         </div> :
    //                         <div className='pt-3     w-full flex justify-center items-start '>
    //                             <img src={historyWhite} alt="Image 1" class=" max-h-[43px] object-cover  cursor-pointer" />
    //                         </div>

    //                 }
    //             </Link>


    //             <Link to="/profile">
    //                 {
    //                     selectedComponent == "profile" ?
    //                         <div className='pt-3  bg-white h-full   w-full flex justify-center items-start '>
    //                             <img src={rankingsBlack} alt="Image 1" class=" max-h-[43px] object-cover  cursor-pointer" />
    //                         </div> :
    //                         <div className='pt-3     w-full flex justify-center items-start '>
    //                             <img src={rankingsWhite} alt="Image 1" class=" max-h-[43px] object-cover  cursor-pointer" />
    //                         </div>

    //                 }
    //             </Link>






    //         </div>
    //     </div>
    // )
}

export default MainMenu