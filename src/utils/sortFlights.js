export function sortFlights(flights, sortBy) {
  const sortedFlights = [...flights];

  if (sortBy === 'price') {
    return sortedFlights.sort((first, second) => first.price.amount - second.price.amount);
  }

  if (sortBy === 'duration') {
    return sortedFlights.sort((first, second) => first.duration.totalMinutes - second.duration.totalMinutes);
  }

  return sortedFlights;
}
