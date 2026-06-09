export function searchFlights(query, flights) {
  return flights.filter((flight) => {
    return (
      normalize(flight.from) === normalize(query.from) &&
      normalize(flight.via) === normalize(query.via) &&
      normalize(flight.to) === normalize(query.to) &&
      flight.departureDate >= query.dateRange.start &&
      flight.departureDate <= query.dateRange.end &&
      Number(flight.availableSeats) >= Number(query.adults) &&
      Number(flight.layoverHours) >= Number(query.minLayover) &&
      Number(flight.layoverHours) <= Number(query.maxLayover)
    );
  });
}

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}
