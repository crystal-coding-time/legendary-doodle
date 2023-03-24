// Function to add the suffix to the date
const addDateSuffix = (date) => {
    let dateStr = date.toString();
  
    // Gets the last character of the date string
    const lastDigit = dateStr.charAt(dateStr.length - 1);
  
    if (lastDigit === '1' && dateStr !== '11') {
      dateStr = `${dateStr}st`;
    } else if (lastDigit === '2' && dateStr !== '12') {
      dateStr = `${dateStr}nd`;
    } else if (lastDigit === '3' && dateStr !== '13') {
      dateStr = `${dateStr}rd`;
    } else {
      dateStr = `${dateStr}th`;
    }
  
    return dateStr;
  };
  
  // Function to format a timestamp
  module.exports = (
    timestamp,
    { monthLength = 'short', dateSuffix = true } = {}
  ) => {
    // Creates a month object with the month names
    const months = {
      0: monthLength === 'short' ? 'Jan' : 'January',
      1: monthLength === 'short' ? 'Feb' : 'February',
      2: monthLength === 'short' ? 'Mar' : 'March',
      3: monthLength === 'short' ? 'Apr' : 'April',
      4: monthLength === 'short' ? 'May' : 'May',
      5: monthLength === 'short' ? 'Jun' : 'June',
      6: monthLength === 'short' ? 'Jul' : 'July',
      7: monthLength === 'short' ? 'Aug' : 'August',
      8: monthLength === 'short' ? 'Sep' : 'September',
      9: monthLength === 'short' ? 'Oct' : 'October',
      10: monthLength === 'short' ? 'Nov' : 'November',
      11: monthLength === 'short' ? 'Dec' : 'December',
    };
  
    // Creates a new Date object using the timestamp
    const dateObj = new Date(timestamp);
  
    // Gets the formatted month from the months object
    const formattedMonth = months[dateObj.getMonth()];
  
    // Gets the day of the month with or without suffix based on the dateSuffix option
    const formattedDayOfMonth = dateSuffix
      ? addDateSuffix(dateObj.getDate())
      : dateObj.getDate();
  
    // Gets the year
    const formattedYear = dateObj.getFullYear();
  
    // Gets the hour in 12-hour format with AM or PM
    let formattedHour =
      dateObj.getHours() > 12
        ? Math.floor(dateObj.getHours() - 12)
        : dateObj.getHours();
  
    // If hour is 0 (12:00am), change it to 12
    if (formattedHour === 0) {
      formattedHour = 12;
    }
  
    // Gets the minutes and adds a leading zero if the minutes are less than 10
    const formattedMinutes = (dateObj.getMinutes() < 10 ? '0' : '') + dateObj.getMinutes();
  
    // Gets the period of the day (AM or PM) based on the hour
    const periodOfDay = dateObj.getHours() >= 12 ? 'PM' : 'AM';
  
    // Creates the formatted timestamp string
    const formattedTimeStamp = `${formattedMonth} ${formattedDayOfMonth}, ${formattedYear} at ${formattedHour}:${formattedMinutes} ${periodOfDay}`;
  
    return formattedTimeStamp;
  };
  