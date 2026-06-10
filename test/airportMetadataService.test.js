import assert from 'node:assert/strict';
import test from 'node:test';

import { findAirportByIata, searchAirports } from '../src/services/airportMetadataService.js';

test('findAirportByIata returns airport metadata for an IATA code', () => {
  const airport = findAirportByIata('bos');

  assert.deepEqual(airport, {
    id: 'bos-general-edward-lawrence-logan-international-airport',
    iata: 'BOS',
    name: 'General Edward Lawrence Logan International Airport',
    city: 'Boston',
    country: 'United States',
    latitude: 42.3643,
    longitude: -71.0052,
    aliases: ['Boston Logan', 'Logan Airport'],
  });
});

test('findAirportByIata returns null for missing or unknown codes', () => {
  assert.equal(findAirportByIata(''), null);
  assert.equal(findAirportByIata('ZZZ'), null);
});

test('searchAirports matches city, airport name, IATA code, country, and aliases', () => {
  assert.equal(searchAirports('Boston')[0].iata, 'BOS');
  assert.equal(searchAirports('istanbul airport')[0].iata, 'IST');
  assert.equal(searchAirports('LED')[0].iata, 'LED');
  assert.equal(searchAirports('Russia')[0].iata, 'LED');
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
    ['BOS', 'IST'],
  );
});
