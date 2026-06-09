export function searchFlights(query, flights) {
  return flights.filter((flight) => {
    return (
      normalize(flight.route.origin.city) === normalize(query.from) &&
      normalize(flight.route.stopover.city) === normalize(query.via) &&
      normalize(flight.route.destination.city) === normalize(query.to) &&
      flight.route.departureDate >= query.dateRange.start &&
      flight.route.departureDate <= query.dateRange.end &&
      Number(flight.availability.seats) >= Number(query.adults) &&
      Number(flight.duration.layoverMinutes) >= Number(query.minLayover) * 60 &&
      Number(flight.duration.layoverMinutes) <= Number(query.maxLayover) * 60
    );
  });
}

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}
