# Uplink payload, format v1

Position uplinks are sent on **FPort 1**, 10 bytes, big-endian.

| Bytes | Field | Type | Encoding |
|---|---|---|---|
| 0–2 | latitude | int24 | `round(lat / 90 * 8388607)`, about 1.2 m resolution |
| 3–5 | longitude | int24 | `round(lon / 180 * 8388607)`, about 2.4 m resolution at the equator |
| 6–7 | altitude | int16 | metres above sea level |
| 8 | battery | uint8 | millivolts / 20 (0–5100 mV) |
| 9 | fix | uint8 | bits 0–4: satellites in use (0–31), bits 5–6: fix type (0 none, 1 2D, 2 3D), bit 7: reserved (0) |

When there is no fix, the device should not send a position uplink.

## Why this size
TTN's fair use allows about 30 s of uplink airtime per device per day.
With the 13-byte LoRaWAN header, a 10-byte payload takes (125 kHz, CR 4/5):

| Spreading factor | Airtime | Messages/day within fair use |
|---|---|---|
| SF7 (gateway close) | 62 ms | ~480 |
| SF9 | 206 ms | ~145 |
| SF12 (edge of coverage) | 1.5 s | ~20 |

## Decoder
[`decoder/decoder.js`](../decoder/decoder.js) is the TTN payload formatter.
Paste it in the TTN console under *Applications → Payload formatters → Uplink → Custom Javascript formatter*.
It returns:

```json
{ "latitude": 1.290270, "longitude": 103.851959, "altitude": 15,
  "battery_mv": 3900, "satellites": 9, "fix": "3D" }
```
