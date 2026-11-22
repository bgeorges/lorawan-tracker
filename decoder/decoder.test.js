// Run with: node --test decoder/*.test.js
const test = require('node:test');
const assert = require('node:assert');
const { decodeUplink } = require('./decoder');

// Reference encoder, mirroring docs/payload.md. The firmware must produce the same bytes.
function encode({ lat, lon, alt, batteryMv, sats, fixType }) {
  const b = Buffer.alloc(10);
  b.writeIntBE(Math.round(lat / 90 * 8388607), 0, 3);
  b.writeIntBE(Math.round(lon / 180 * 8388607), 3, 3);
  b.writeInt16BE(alt, 6);
  b.writeUInt8(Math.round(batteryMv / 20), 8);
  b.writeUInt8((fixType << 5) | sats, 9);
  return [...b];
}

function decode(bytes, fPort = 1) {
  return decodeUplink({ bytes, fPort });
}

test('round-trips a position within resolution', () => {
  const cases = [
    { lat: 1.290270, lon: 103.851959, alt: 15 },     // Singapore
    { lat: 46.948090, lon: 7.447440, alt: 540 },     // Bern
    { lat: -33.868820, lon: 151.209290, alt: -3 },   // Sydney, below sea level
    { lat: -90, lon: -180, alt: -32768 },            // extremes
    { lat: 90, lon: 180, alt: 32767 }
  ];
  for (const c of cases) {
    const { data, errors } = decode(encode({ ...c, batteryMv: 3900, sats: 9, fixType: 2 }));
    assert.equal(errors, undefined);
    assert.ok(Math.abs(data.latitude - c.lat) < 1.2e-5, `lat ${data.latitude} vs ${c.lat}`);
    assert.ok(Math.abs(data.longitude - c.lon) < 2.2e-5, `lon ${data.longitude} vs ${c.lon}`);
    assert.equal(data.altitude, c.alt);
  }
});

test('decodes battery, satellites and fix type', () => {
  const { data, warnings } = decode(encode({ lat: 0, lon: 0, alt: 0, batteryMv: 4200, sats: 31, fixType: 1 }));
  assert.equal(data.battery_mv, 4200);
  assert.equal(data.satellites, 31);
  assert.equal(data.fix, '2D');
  assert.deepEqual(warnings, []);
});

test('warns when there is no fix or the reserved bit is set', () => {
  const bytes = encode({ lat: 0, lon: 0, alt: 0, batteryMv: 3700, sats: 0, fixType: 0 });
  assert.deepEqual(decode(bytes).warnings, ['position sent without a fix']);
  bytes[9] |= 0x80;
  assert.equal(decode(bytes).warnings.length, 2);
});

test('rejects wrong port and wrong length', () => {
  const bytes = encode({ lat: 0, lon: 0, alt: 0, batteryMv: 3700, sats: 5, fixType: 2 });
  assert.deepEqual(decode(bytes, 2).errors, ['unknown FPort 2']);
  assert.deepEqual(decode(bytes.slice(0, 9)).errors, ['expected 10 bytes, got 9']);
});
