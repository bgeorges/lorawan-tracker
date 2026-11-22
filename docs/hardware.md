# Hardware

Proposed build, RAK WisBlock:

| Part | Module | Notes |
|---|---|---|
| Core | RAK4631 | nRF52840 (BLE built in) + SX1262 LoRa. Order the frequency band for your region. |
| Base board | RAK19007 (or similar) | Battery and solar connectors, USB-C |
| GNSS | **RAK12500** | u-blox ZOE-M8Q, I2C. End-of-life (notice August 2026): buy spares while stock lasts. See [Using the RAK12501 instead](#using-the-rak12501-instead). |
| Accelerometer | RAK1904 | For motion-triggered fixes |
| Power | 3.7 V Li-Po, optional 5 V solar panel | |
| Enclosure | RAK10700 kit housing (IP64), or your own | |

The RAK10700 kit bundles most of this, including the RAK12500.

## Using the RAK12501 instead

The RAK12501 (Quectel L76K) is RAKwireless's official replacement for the RAK12500,
since u-blox discontinued the ZOE-M8Q. It fits the same WisBlock sensor slot, but it is not a drop-in swap for the firmware.

| | RAK12500 (u-blox ZOE-M8Q) | RAK12501 (Quectel L76K) |
|---|---|---|
| Status | End-of-life (notice August 2026) | Current |
| Connection | I2C and UART | **UART only** |
| Protocol / library | UBX binary over I2C, e.g. SparkFun u-blox GNSS library | NMEA text sentences, e.g. TinyGPSPlus |
| Cold start | ~29 s typical, up to 45 s | under 15 s |
| Hot start | ~1 s | ~1 s |
| Tracking current | ~21 mA | ~18 mA |
| Backup current | 15 µA | 7 µA |
| Tracking sensitivity | −167 dBm | −165 dBm |
| Max update rate | 10 Hz | 1 Hz |

What changes if you switch:
- **Firmware:** the GNSS code has to read NMEA from a serial port instead of talking UBX over I2C. Keep GNSS access behind one small interface (power on, wait for fix, read position, power off), so only that part changes.
- **Slot:** check RAK's docs for which WisBlock slot provides the UART the RAK12501 needs.
- **Battery:** a faster cold start means less time at ~20 mA for every fix, which matters when the GNSS is powered down between fixes.
- **Unchanged:** the payload format and the TTN decoder. The 1 Hz rate and the slightly lower sensitivity don't matter for a tracker sending every few minutes.

Sources: [RAK12501 store page and comparison](https://store.rakwireless.com/products/wisblock-rak12501-gnss-module),
[RAK12501 datasheet](https://docs.rakwireless.com/product-categories/wisblock/rak12501/datasheet/),
[RAK12500 datasheet](https://docs.rakwireless.com/product-categories/wisblock/rak12500/datasheet/),
[RAK12500 EOL notice](https://downloads.rakwireless.com/PCN/WisBlock/EOL/RAK12500%20WisBlock%20GNSS%20Module/EOL20260821001_WisBlock%20GNSS%20Module%20RAK12501%20EOL%20Notice.pdf).

## Alternatives
- **Seeed SenseCAP T1000-A/B:** off-the-shelf card tracker (Semtech LR1110: GNSS, Wi-Fi and BLE positioning). No firmware to write. Avoid the C/D variants, which need LoRa Cloud.
- **LilyGO T-Beam:** ESP32 + SX1262 + GNSS. Keeps MicroPython via a community LoRaWAN build, but that's experimental.

Before ordering: pick the LoRaWAN region (EU868, AS923, US915, ...) and check TTN coverage where the tracker will be used.
