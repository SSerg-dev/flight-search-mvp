# 03-02 Normalized Flight Offer Contract — Flight Search MVP v3

## Purpose

This document defines the internal flight offer shape consumed by the UI.

Real provider responses must be converted into this shape before rendering.

---

# Contract

Each normalized flight offer must use this structure:

```text
{
  id,
  airline,
  price,
  route,
  segments,
  duration,
  availability
}
```

---

# Required Fields

## id

Stable identifier for the offer.

Expected type:

```text
string
```

---

## airline

Airline display data.

Expected shape:

```text
{
  name,
  code,
  flightNumbers
}
```

Required fields:

- `name`: string
- `code`: string
- `flightNumbers`: string[]

Safe defaults:

- `name`: `Unknown airline`
- `code`: empty string
- `flightNumbers`: empty array

---

## price

Price display and sorting data.

Expected shape:

```text
{
  amount,
  currency,
  display,
  passengerCount
}
```

Required fields:

- `amount`: number
- `currency`: string
- `display`: string
- `passengerCount`: number

Safe defaults:

- `amount`: `0`
- `currency`: `USD`
- `display`: formatted from amount and currency when possible
- `passengerCount`: query adult count when provider does not return it

---

## route

High-level route data.

Expected shape:

```text
{
  origin,
  stopover,
  destination,
  departureDate
}
```

Each route point should include:

```text
{
  city,
  airport,
  code
}
```

Required route points:

- `origin`
- `stopover`
- `destination`

Safe defaults:

- `city`: provider city name, airport city code, or user query value
- `airport`: provider airport name or empty string
- `code`: provider IATA code or empty string

---

## segments

Ordered itinerary segments.

Expected shape:

```text
[
  {
    from,
    to,
    departure,
    arrival,
    flightNumber
  }
]
```

Required fields:

- `from`: string
- `to`: string
- `departure`: string
- `arrival`: string
- `flightNumber`: string

MVP v3 supports the existing one mandatory stop route.

Expected minimum:

```text
2 segments
```

---

## duration

Travel duration and layover data.

Expected shape:

```text
{
  totalMinutes,
  display,
  layoverMinutes,
  layoverDisplay
}
```

Required fields:

- `totalMinutes`: number
- `display`: string
- `layoverMinutes`: number
- `layoverDisplay`: string

Safe defaults:

- calculate from segment departure and arrival times when possible;
- otherwise use `0` minutes and clear display text.

---

## availability

Seat and booking availability data.

Expected shape:

```text
{
  seats,
  canBookAdults
}
```

Required fields:

- `seats`: number
- `canBookAdults`: boolean

Safe defaults:

- `seats`: query adult count when provider availability is unknown;
- `canBookAdults`: true only when seats are known or safely inferred.

---

# Consumer Requirements

Current known consumers:

```text
src/components/resultCard.js
src/components/resultsList.js
src/utils/sortFlights.js
src/utils/searchFlights.js
```

The contract must preserve:

- price sorting through `price.amount`;
- duration sorting through `duration.totalMinutes`;
- route display through `route`;
- timing display through `segments`;
- layover display through `duration`;
- adult capacity checks through `availability`.

---

# Status

```text
NORMALIZED_FLIGHT_OFFER_CONTRACT_DEFINED
```
