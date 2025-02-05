  function formatDate_yyyymmdd_to_ddmmyyyy(dateString) {
    // Split the input date string into an array [YYYY, MM, DD]
    const [year, month, day] = dateString.split('-');
    
    // Rearrange the array elements and join them with a hyphen
    return `${day}.${month}.${year}`;
  }

export {formatDate_yyyymmdd_to_ddmmyyyy};