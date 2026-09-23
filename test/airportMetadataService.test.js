import assert from 'node:assert/strict';
import test from 'node:test';

import {
  findAirportById,
  findAirportByIata,
  findRouteLocationById,
  formatAirportOptionValue,
  formatRouteLocationOptionValue,
  getRouteLocationIata,
  resolveAirport,
  resolveRouteLocation,
  searchAirports,
  searchRouteLocations,
} from '../src/services/airportMetadataService.js';

test('findAirportByIata returns airport metadata for an IATA code', () => {
  const airport = findAirportByIata('bos');

  assert.equal(airport.id, 'oa:3422');
  assert.equal(airport.iata, 'BOS');
  assert.equal(airport.icao, 'KBOS');
  assert.equal(airport.city, 'Boston');
  assert.equal(airport.country, 'United States');
  assert.equal(findAirportById(airport.id), airport);
});

test('route locations offer a city-wide choice before individual airports', () => {
  const results = searchRouteLocations('Moscow', { limit: 5 });
  const city = results[0];

  assert.equal(city.id, 'city:ru:moscow');
  assert.equal(city.kind, 'city');
  assert.deepEqual(city.iataCodes, ['DME', 'SVO', 'VKO', 'ZIA']);
  assert.equal(findRouteLocationById(city.id), city);
  assert.equal(resolveRouteLocation('Moscow'), city);
  assert.equal(getRouteLocationIata(city), 'DME,SVO,VKO,ZIA');
  assert.equal(
    formatRouteLocationOptionValue(city),
    'Moscow — All airports (DME, SVO, VKO, ZIA), Russia',
  );
  assert.equal(results[1].iata, 'DME');
});

test('findAirportByIata returns null for missing or unknown codes', () => {
  assert.equal(findAirportByIata(''), null);
  assert.equal(findAirportByIata('ZZZ'), null);
});

test('searchAirports matches city, airport name, IATA code, country, and aliases', () => {
  assert.equal(searchAirports('Boston')[0].iata, 'BOS');
  assert.equal(searchAirports('istanbul airport')[0].iata, 'IST');
  assert.equal(searchAirports('LED')[0].iata, 'LED');
  assert.ok(searchAirports('Russia').some((airport) => airport.country === 'Russia'));
  assert.equal(searchAirports('Санкт-Петербург')[0].iata, 'LED');
  assert.equal(searchAirports('Pulkovo')[0].iata, 'LED');
});

test('searchAirports returns an empty list for blank or unknown queries', () => {
  assert.deepEqual(searchAirports(''), []);
  assert.deepEqual(searchAirports('   '), []);
  assert.deepEqual(searchAirports('No Such Airport'), []);
});

test('searchAirports supports deterministic result limits', () => {
  const results = searchAirports('airport', { limit: 2 });

  assert.equal(results.length, 2);
  assert.deepEqual(
    results.map((airport) => airport.iata),
    ['AAL', 'ABZ'],
  );
});

test('formatAirportOptionValue creates an IATA-aware selection label', () => {
  const airport = findAirportByIata('BOS');

  assert.equal(
    formatAirportOptionValue(airport),
    'BOS — Logan International Airport, Boston, United States',
  );
});

test('resolveAirport recognizes city names, IATA codes, and formatted selection labels', () => {
  assert.equal(resolveAirport('Boston').iata, 'BOS');
  assert.equal(resolveAirport('ist').iata, 'IST');
  assert.equal(resolveAirport('Saint Petersburg - LED - Pulkovo Airport').iata, 'LED');
  assert.equal(resolveAirport('Unknown Airport'), null);
});
