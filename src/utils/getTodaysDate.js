export const getTodaysDate = () => {
  
  const d = new Date();

  //getting year, month and date of today
  let year = d.getFullYear(),month = d.getMonth()+1, date=d.getDate();
  if(month<10){
    month = '0'+month;
  }
  if(date < 10){
    date = '0'+date;
  }
  // returning today's date
  return year+'-'+month+'-'+date;
}