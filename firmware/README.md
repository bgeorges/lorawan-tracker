# Firmware

Firmware for the RAK4631 WisBlock core. Not written yet: see the hardware and port issue.

Planned behaviour:
1. Join TTN with OTAA.
2. Sleep until the accelerometer detects movement, or a configurable interval passes.
3. Power the GNSS module, wait for a fix (with a timeout), then power it down.
   The RAK12500 is read over I2C (UBX, e.g. SparkFun u-blox GNSS library). Keep this behind one small
   GNSS interface so a RAK12501 (UART + NMEA) can be swapped in later: see [docs/hardware.md](../docs/hardware.md#using-the-rak12501-instead).
4. Send the position as described in [docs/payload.md](../docs/payload.md), unconfirmed, with ADR on.

Toolchain options to settle first:
- **RUI3** (RAK's own framework, Arduino IDE or CLI): simplest LoRaWAN and low-power API.
- **Arduino BSP + SX126x-Arduino** (or PlatformIO with RAK's board files): more control, more setup.

Keep the device credentials (DevEUI, JoinEUI, AppKey) in a git-ignored header, with a committed example.
