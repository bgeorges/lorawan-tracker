// TTN (The Things Stack) uplink payload formatter for lorawan-tracker.
// Format: see docs/payload.md. Paste this whole file into the TTN console.

var POSITION_PORT = 1;
var FIX_TYPES = ['none', '2D', '3D', 'reserved'];

function int24(bytes, i) {
  var v = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
  return v & 0x800000 ? v - 0x1000000 : v;
}

function int16(bytes, i) {
  var v = (bytes[i] << 8) | bytes[i + 1];
  return v & 0x8000 ? v - 0x10000 : v;
}

function round6(x) {
  return Math.round(x * 1e6) / 1e6;
}

function decodeUplink(input) {
  var bytes = input.bytes;
  if (input.fPort !== POSITION_PORT) {
    return { errors: ['unknown FPort ' + input.fPort] };
  }
  if (bytes.length !== 10) {
    return { errors: ['expected 10 bytes, got ' + bytes.length] };
  }

  var fix = bytes[9];
  var data = {
    latitude: round6(int24(bytes, 0) / 8388607 * 90),
    longitude: round6(int24(bytes, 3) / 8388607 * 180),
    altitude: int16(bytes, 6),
    battery_mv: bytes[8] * 20,
    satellites: fix & 0x1f,
    fix: FIX_TYPES[(fix >> 5) & 0x03]
  };

  var warnings = [];
  if (data.fix === 'none') {
    warnings.push('position sent without a fix');
  }
  if (fix & 0x80) {
    warnings.push('reserved bit set in fix byte');
  }
  return { data: data, warnings: warnings };
}

// Lets the tests require() this file; TTN ignores it.
if (typeof module !== 'undefined') {
  module.exports = { decodeUplink: decodeUplink };
}
