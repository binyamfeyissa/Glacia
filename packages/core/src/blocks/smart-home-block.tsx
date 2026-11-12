"use client";

import * as React from "react";

import { Glass } from "../glass";
import { Badge } from "../badge";

export type DeviceKind = "light" | "climate" | "lock" | "blind" | "speaker" | "camera";

export interface SmartHomeDevice {
  id: string;
  name: string;
  room: string;
  kind: DeviceKind;
  /** On/off state for controllable devices. */
  on?: boolean;
  /** A short state line, e.g. "21°" or "Locked". */
  status?: string;
  /** Devices that cannot be switched (sensors) omit `on`. */
  controllable?: boolean;
}

export interface SmartHomeRoom {
  name: string;
  /** Icon-free count of devices currently active. */
  active?: number;
}

export interface SmartHomeBlockProps {
  devices: SmartHomeDevice[];
  rooms?: SmartHomeRoom[];
  /** Controlled active room; defaults to the first room. */
  activeRoom?: string;
  onActiveRoomChange?: (room: string) => void;
  /** Fires when a device is toggled. */
  onToggleDevice?: (id: string, next: boolean) => void;
  /** Current temperature shown in the header, already formatted. */
  temperature?: string;
  className?: string;
}

const DEVICE_GLYPH: Record<DeviceKind, string> = {
  light: "◐",
  climate: "≋",
  lock: "▣",
  blind: "≡",
  speaker: "◉",
  camera: "◍",
};

/**
 * Rooms and the devices in them, with inline control.
 *
 * Toggling is real: state is owned here unless the caller passes
 * `onToggleDevice`, in which case they control it. Rooms filter the device
 * grid, which is the fastest way to find one device among many.
 */
export function SmartHomeBlock({
  devices,
  rooms,
  activeRoom,
  onActiveRoomChange,
  onToggleDevice,
  temperature,
  className,
}: SmartHomeBlockProps) {
  const roomList = React.useMemo(() => {
    if (rooms && rooms.length > 0) return rooms;
    const unique = [...new Set(devices.map((d) => d.room))];
    return unique.map((name) => ({
      name,
      active: devices.filter((d) => d.room === name && d.on).length,
    }));
  }, [rooms, devices]);

  const [internalRoom, setInternalRoom] = React.useState(roomList[0]?.name ?? "");
  const currentRoom = activeRoom ?? internalRoom;

  const selectRoom = (room: string) => {
    if (onActiveRoomChange) onActiveRoomChange(room);
    else setInternalRoom(room);
  };

  const [internalState, setInternalState] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(devices.map((d) => [d.id, Boolean(d.on)])),
  );

  const isOn = (device: SmartHomeDevice) =>
    device.id in internalState ? internalState[device.id]! : Boolean(device.on);

  const toggle = (device: SmartHomeDevice) => {
    const next = !isOn(device);
    if (onToggleDevice) onToggleDevice(device.id, next);
    else setInternalState((prev) => ({ ...prev, [device.id]: next }));
  };

  const visible = devices.filter((d) => !currentRoom || d.room === currentRoom);
  const activeCount = devices.filter((d) => isOn(d)).length;

  return (
    <Glass className={["gl-smarthome", className].filter(Boolean).join(" ")}>
      <header className="gl-smarthome-head">
        <div>
          <h3 className="gl-smarthome-title">Home</h3>
          <p className="gl-smarthome-sub">
            {activeCount} of {devices.length} devices active
          </p>
        </div>
        {temperature && <span className="gl-smarthome-temp">{temperature}</span>}
      </header>

      <div className="gl-smarthome-rooms" role="tablist" aria-label="Rooms">
        {roomList.map((room) => {
          const selected = room.name === currentRoom;
          return (
            <button
              key={room.name}
              type="button"
              role="tab"
              aria-selected={selected}
              className="gl-smarthome-room"
              data-selected={selected ? "" : undefined}
              onClick={() => selectRoom(room.name)}
            >
              {room.name}
              {typeof room.active === "number" && room.active > 0 && (
                <span className="gl-smarthome-room-count">{room.active}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="gl-smarthome-grid" role="tabpanel">
        {visible.length === 0 ? (
          <p className="gl-smarthome-empty">No devices in this room.</p>
        ) : (
          visible.map((device) => {
            const controllable = device.controllable !== false && device.kind !== "camera";
            const on = isOn(device);
            return (
              <div
                key={device.id}
                className="gl-smarthome-device"
                data-on={on && controllable ? "" : undefined}
              >
                <span className="gl-smarthome-device-glyph" aria-hidden>
                  {DEVICE_GLYPH[device.kind]}
                </span>
                <span className="gl-smarthome-device-copy">
                  <span className="gl-smarthome-device-name">{device.name}</span>
                  <span className="gl-smarthome-device-status">
                    {device.status ?? (controllable ? (on ? "On" : "Off") : "—")}
                  </span>
                </span>

                {controllable ? (
                  <button
                    type="button"
                    className="gl-smarthome-toggle"
                    role="switch"
                    aria-checked={on}
                    aria-label={`${device.name} ${on ? "on" : "off"}`}
                    onClick={() => toggle(device)}
                  >
                    <span />
                  </button>
                ) : (
                  <Badge variant="default">Sensor</Badge>
                )}
              </div>
            );
          })
        )}
      </div>
    </Glass>
  );
}
