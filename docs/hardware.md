# Hardware

Proposed build, RAK WisBlock:

| Part | Module | Notes |
|---|---|---|
| Core | RAK4631 | nRF52840 (BLE built in) + SX1262 LoRa. Order the frequency band for your region. |
| Base board | RAK19007 (or similar) | Battery and solar connectors, USB-C |
| GNSS | **RAK12501** | Quectel L76K. Not the RAK12500: end-of-life since August 2026. |
| Accelerometer | RAK1904 | For motion-triggered fixes |
| Power | 3.7 V Li-Po, optional 5 V solar panel | |
| Enclosure | RAK10700 kit housing (IP64), or your own | |

The RAK10700 kit bundles most of this; swap its GNSS module for the RAK12501.

Alternatives:
- **Seeed SenseCAP T1000-A/B:** off-the-shelf card tracker (Semtech LR1110: GNSS, Wi-Fi and BLE positioning). No firmware to write. Avoid the C/D variants, which need LoRa Cloud.
- **LilyGO T-Beam:** ESP32 + SX1262 + GNSS. Keeps MicroPython via a community LoRaWAN build, but that's experimental.

Before ordering: pick the LoRaWAN region (EU868, AS923, US915, ...) and check TTN coverage where the tracker will be used.
