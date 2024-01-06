export async function getAllSearchResults(searchText)
{
    const resultResponse=await fetch(`https://finnhub.io/api/v1/search?q=${searchText}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    const result=await resultResponse.json();

    const commonStocks=result.result.filter((stock)=>{
      return stock.type=="Common Stock" && !stock.symbol.includes(".");
    });
    
    console.log(commonStocks);
    return commonStocks;
}

export function formatMillisecondsToDateTime(milliseconds,isSet900,isAgainStart) {
  const date = new Date((milliseconds*1000));

  const formatted_date=new Date(Date.parse(date.toLocaleString('en-US', { timeZone: 'America/New_York' })))
  const AmericanMilliseconds=Date.parse(formatted_date)

  // console.log("American TIME",new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))

  

  // console.log(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));


  //American
  let year = formatted_date.getFullYear();
  let month = String(formatted_date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  let day = String(formatted_date.getDate()).padStart(2, '0');
  let hours = String(formatted_date.getHours()).padStart(2, '0');
  let minutes = String(formatted_date.getMinutes()).padStart(2, '0');
  let seconds = String(formatted_date.getSeconds()).padStart(2, '0');


  if(isSet900)
  {
    let AmericanDate=Date.parse(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

    if(isAgainStart)
    {
      AmericanDate=Date.parse(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))- 86400000;
    }


    let FinalAmericanTime=new Date(AmericanDate);

    year = FinalAmericanTime.getFullYear();
    month = String(FinalAmericanTime.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    day = String(FinalAmericanTime.getDate()).padStart(2, '0');

    

    hours="9";
    minutes="00";
    seconds="00";
  }


  // // Extract date components
  // const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  // const day = String(date.getDate()).padStart(2, '0');
  // const hours = String(date.getHours()).padStart(2, '0');
  // const minutes = String(date.getMinutes()).padStart(2, '0');
  // const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format the date
  // const formattedDate = `${year}-${month}-${day}`;

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
  // console.log("HI_______________________________________",formattedDate,isSet900)

  if(isAgainStart)
  {
    console.warn(formattedDate)
  }


  // console.log(formattedDate);
  return formattedDate.toString();
}