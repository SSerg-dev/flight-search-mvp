# Round-trip search design

## Goal

Add a one-way / round-trip choice to the flight search MVP. Round-trip searches should let the user choose a separate return date range and should search the reverse route automatically.

## User experience

- The search form includes a trip type control with `One-way` and `Round-trip`.
- `One-way` is the default mode.
- In `One-way` mode, only the existing departure date range is visible.
- In `Round-trip` mode, a second date range appears with `Return Date Start` and `Return Date End`.
- Search results for round trips are shown in two sections: `Outbound flights` and `Return flights`.

## Query model

The query adds:

- `tripType`: `oneWay` or `roundTrip`.
- `returnDateRange`: `{ start, end }`, used only for round-trip searches.

The existing `dateRange` remains the outbound departure range.

## Validation

- Route, outbound date range, adults, and layover fields keep their current validation.
- Return dates are required only when `tripType` is `roundTrip`.
- `Return Date Start` must be before or equal to `Return Date End`.
- `Return Date Start` must not be earlier than `Departure Date End`.

## Search behavior

- `oneWay`: run the existing one-way search for `From -> Via -> To`.
- `roundTrip`: run two independent searches:
  - Outbound: `From -> Via -> To` using `dateRange`.
  - Return: `To -> Via -> From` using `returnDateRange`.
- The return search preserves the same mandatory stopover city.
- Provider adapters continue to receive a one-way query shape. The round-trip orchestration happens above the provider adapter layer.

## Testing

- Form tests cover the trip type control, hidden return fields in one-way mode, visible return fields in round-trip mode, and submitted query shape.
- Validation tests cover required return dates, invalid return date ordering, and return dates earlier than outbound end.
- Search service tests cover one-way compatibility and round-trip orchestration into outbound and return result sections.
- Results rendering tests cover titled outbound and return sections.
