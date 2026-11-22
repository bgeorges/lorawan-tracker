# lorawan-tracker

Low-power GPS tracker that reports its position over LoRaWAN to [The Things Network](https://www.thethingsnetwork.org/) (TTN).

This is v2 of the tracker that started in [`tinkering/tracker`](https://github.com/bgeorges/tinkering/tree/master/tracker)
(Pycom FiPy + SigFox, 2018). That version is unsupported: Pycom has been in administration since 2022 and
SigFox's future is uncertain, so v2 starts over on open LoRaWAN with current hardware.

**Status:** early. The payload format and TTN decoder are done and tested; firmware and hardware are next.

## Layout

| Path | What |
|---|---|
| [`firmware/`](firmware/) | Device firmware for the RAK4631 WisBlock core (not written yet) |
| [`decoder/`](decoder/) | TTN uplink payload formatter, with tests |
| [`docs/payload.md`](docs/payload.md) | Uplink payload format (10 bytes on FPort 1) |
| [`docs/hardware.md`](docs/hardware.md) | Proposed parts list and alternatives |

## Decoder tests

```bash
node --test decoder/*.test.js
```

## Roadmap
See the [issues](https://github.com/bgeorges/lorawan-tracker/issues): hardware and firmware port, sending positions, forwarding to MQTT / Adafruit IO, and BLE.

## License
[MIT](LICENSE)
