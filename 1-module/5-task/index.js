function truncate(str, maxlength) {
  // ваш код...
  if (str.length > maxlength){
    return str.substr(0, maxlength-1) +  "…";
      }
    return str;
  }
