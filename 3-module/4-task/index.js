function showSalary(users, age) {
  // ваш код...
  return users
     .filter(item => item.age <= age)
     .map(item => `${item.name}, ${item.balance}`)
     .join('\n');
    }
