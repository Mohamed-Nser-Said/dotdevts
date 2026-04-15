import { TableStore } from "../../backend/src/components/TableStore";
import { GenericFolder } from "../../backend/src/objects/GenericFolder";

type Sensor = {
    id: string;
    tag: string;
    unit: string;
    minLimit: number;
    maxLimit: number;
    location: string;
};

type SensorReading = {
    sensorId: string;
    timestamp: number;
    value: number;
    quality: number;  // 0 = bad, 192 = good (OPC UA convention)
};

type Alarm = {
    sensorId: string;
    timestamp: number;
    severity: string;
    message: string;
    acknowledged: boolean;
};

export function main(): void {
    const basePath = "/System/Core/TableStoreExample";

    console.log("  [0] Setup parent folder");
    new GenericFolder(basePath, { cleanupExisting: true });

    // ─────────────────────────────────────────────────────────────────────
    // 1. Create a TableStore — acts as a mini plant historian DB
    // ─────────────────────────────────────────────────────────────────────
    console.log("  [1] Create TableStore");
    const store = new TableStore(basePath + "/PlantDB");
    console.log("      Path:", store.path.absolutePath());

    // ─────────────────────────────────────────────────────────────────────
    // 2. Write sensor registry, readings and alarms
    // ─────────────────────────────────────────────────────────────────────
    console.log("  [2] Write tables");

    store.set<Sensor>("Sensors", [
        { id: "PT-101", tag: "Pressure_Inlet", unit: "bar", minLimit: 0, maxLimit: 10, location: "Line A" },
        { id: "TT-201", tag: "Temperature_Vessel", unit: "°C", minLimit: -10, maxLimit: 150, location: "Reactor 1" },
        { id: "FT-301", tag: "Flow_Coolant", unit: "m³/h", minLimit: 0, maxLimit: 50, location: "Line B" },
        { id: "LT-401", tag: "Level_Tank", unit: "%", minLimit: 5, maxLimit: 95, location: "Tank Farm" },
    ]);

    const now = 1742000000000;
    store.set<SensorReading>("Readings", [
        { sensorId: "PT-101", timestamp: now - 60000, value: 6.3, quality: 192 },  // older, normal
        { sensorId: "TT-201", timestamp: now - 60000, value: 87.4, quality: 192 },  // older, normal
        { sensorId: "FT-301", timestamp: now, value: 23.1, quality: 192 },
        { sensorId: "LT-401", timestamp: now, value: 72.0, quality: 192 },
        { sensorId: "PT-101", timestamp: now, value: 10.5, quality: 192 },  // latest — OVER max (10 bar)
        { sensorId: "TT-201", timestamp: now, value: 152.1, quality: 192 },  // latest — OVER max (150°C)
    ]);

    store.set<Alarm>("Alarms", [
        { sensorId: "TT-201", timestamp: now - 60000, severity: "HIGH", message: "Temperature exceeded max limit (150°C)", acknowledged: false },
        { sensorId: "PT-101", timestamp: now - 60000, severity: "WARNING", message: "Pressure approaching max limit (10 bar)", acknowledged: true },
    ]);

    console.log("      Tables written:", store.tables().join(", "));

    // ─────────────────────────────────────────────────────────────────────
    // 3. Join readings → sensor registry to show tag + unit
    // ─────────────────────────────────────────────────────────────────────
    console.log("  [3] Latest readings with tag names");

    store.query<SensorReading>("Readings")
        .latestBy(r => r.sensorId, r => r.timestamp)
        .join(store.query<Sensor>("Sensors"), r => r.sensorId, s => s.id)
        .forEach(pair => {
            const qualityLabel = pair.left.quality === 192 ? "GOOD" : "BAD";
            console.log(`      ${pair.right.tag}: ${pair.left.value} ${pair.right.unit}  [${qualityLabel}]`);
        });

    // ─────────────────────────────────────────────────────────────────────
    // 4. Check for limit violations
    // ─────────────────────────────────────────────────────────────────────
    console.log("  [4] Limit violation check");

    store.query<SensorReading>("Readings")
        .latestBy(r => r.sensorId, r => r.timestamp)
        .join(store.query<Sensor>("Sensors"), r => r.sensorId, s => s.id)
        .where(pair => pair.left.value > pair.right.maxLimit || pair.left.value < pair.right.minLimit)
        .forEach(pair => {
            console.log(`      [VIOLATION] ${pair.left.sensorId}: ${pair.left.value} ${pair.right.unit}  (limit: ${pair.right.minLimit}–${pair.right.maxLimit})`);
        });

    // ─────────────────────────────────────────────────────────────────────
    // 5. List unacknowledged alarms
    // ─────────────────────────────────────────────────────────────────────
    console.log("  [5] Unacknowledged alarms");

    store.query<Alarm>("Alarms")
        .where(a => !a.acknowledged)
        .forEach(a => console.log(`      [${a.severity}] ${a.sensorId} — ${a.message}`));

    // ─────────────────────────────────────────────────────────────────────
    // 6. Store via children factory — separate config store per line
    // ─────────────────────────────────────────────────────────────────────
    console.log("  [6] Per-line config store via children factory");
    const lineFolder = new GenericFolder(basePath + "/LineA");
    const lineConfig = lineFolder.children.TableStore("Config");
    lineConfig.set("Thresholds", [
        { tag: "PT-101", warnAt: 8.0, tripAt: 9.5 },
        { tag: "TT-201", warnAt: 130.0, tripAt: 148.0 },
    ]);
    console.log("      LineA config tables:", lineConfig.tables().join(", "));

    console.log("  TableStoreExample done.");
}
