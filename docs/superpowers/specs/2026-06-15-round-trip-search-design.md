# Round-trip search design

## Goal

Add a one-way / round-trip choice to the flight search MVP. Round-trip searches should let the user choose a separate return date range and should search the reverse route automatically.

## User experience

- The search form includes a trip type control with `One-way` and `Round-trip`.
- `One-way` is the default mode.
- In `One-way` mode, only the existing departure date range is visible.
- In `Round-trip` mode, a second date range appears with `Return Date Start` and `Return Date End`.
- Search results for round trips are shown as paired trip rows. Each row contains one outbound flight card and one return flight card side by side on desktop, stacked inside the same row on mobile.
- Each paired row shows a total estimated price for the outbound + return flights.

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
- Round-trip display pairs results by index after sorting each side with the selected sort mode: `outbound[0] + return[0]`, `outbound[1] + return[1]`, and so on.
- If one side has more results than the other, extra unpaired flights are not displayed in the MVP.
- Pair sorting uses the combined pair value: total price for `price`, total duration for `duration`.

## Testing

- Form tests cover the trip type control, hidden return fields in one-way mode, visible return fields in round-trip mode, and submitted query shape.
- Validation tests cover required return dates, invalid return date ordering, and return dates earlier than outbound end.
- Search service tests cover one-way compatibility and round-trip orchestration into outbound and return result arrays.
- Results rendering tests cover paired round-trip rows, combined price, mobile-safe stacked layout, and empty paired results.
