function sumSalary(salaries) {
  // ваш код...
  let res = 0;
  
  for (let unit in salaries) {

    let unitValue = salaries[unit];

    if (Number.isFinite (unitValue)) {
      res = res + unitValue;
    }
  }
  return (res);
  
}
