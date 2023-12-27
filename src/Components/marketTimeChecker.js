// marketTimeChecker.js
import { findMarketStatusUtils } from '../utils';

import { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const useMarketTimeChecker = () => {
  const [isMarketOpen, setIsMarketOpen] = useState(false);

  useEffect(() => {
    const checkMarketStatus = async() => {
        const now = moment().tz('America/New_York'); // Assuming US Eastern Time (ET)
        const marketOpen = moment('09:00', 'HH:mm').tz('America/New_York');
        const marketClose = moment('16:00', 'HH:mm').tz('America/New_York');
  
        // Ensure that the current time is formatted in the same way as marketOpen and marketClose
        const currentTime = moment(now.format('HH:mm'), 'HH:mm').tz('America/New_York');
  
        const isOpen = currentTime.isBetween(marketOpen, marketClose);

        if(isOpen)
        {
          const isMarketLive=await findMarketStatusUtils();
          if(isMarketLive==-1)
          return;
          else
          {
            if(isMarketLive==0)
            setIsMarketOpen(false);
            else if(isMarketLive==1)
            setIsMarketOpen(true)
          }

          console.log(isMarketLive)
        }
    };

    // Check market status every 5 minutes
    const intervalId = setInterval(checkMarketStatus, 1 * 60 * 1000);

    // Initial check when the component using the hook mounts
    checkMarketStatus();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return isMarketOpen;
};

export default useMarketTimeChecker;
