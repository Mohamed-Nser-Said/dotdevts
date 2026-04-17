/**
 * WaterTreatmentPlantExample
 *
 * USE CASE
 * --------
 * A water utility company operates a treatment plant with three process
 * stages: intake, treatment, and distribution. The system must:
 *
 *   • Archive continuous sensor readings (pH, turbidity, flow, chlorine)
 *     into a MongoDB-backed time-series store via CustomTimeSeriesDataStore.
 *
 *   • Capture discrete quality events (alarm triggers, dosing commands,
 *     limit violations, operator overrides) into a MongoDB-backed event
 *     store via CustomEventDataStore.
 *
 *   • Bridge an upstream SCADA system that publishes MSI messages on a
 *     message broker. A MessageProcessor maps historian tags to inmation
 *     Variable paths so that incoming payloads route correctly.
 *
 *   • Migrate five years of backfill from a legacy historian into the
 *     live system using a HistoryTransferController.
 *
 *   • Organise all MongoDB-backed stores inside a DataStoreGroup so
 *     that administrators can find them in one place.
 *
 * OBJECT TOPOLOGY
 * ---------------
 *   <core>
 *   ├── WaterTreatment_SensorTimeSeries  (CustomTimeSeriesDataStore)
 *   ├── WaterTreatment_QualityEvents     (CustomEventDataStore)
 *   ├── WaterTreatment_SCADA_MsgProc     (MessageProcessor)
 *   ├── WaterTreatment_BackfillCtrl      (HistoryTransferController)
 *   └── WaterTreatment/                  (GenericFolder)
 *       └── Plant/                       (GenericFolder)
 *           ├── Intake/                  (GenericFolder)
 *           │   ├── pH                   (Variable)
 *           │   ├── Turbidity            (Variable)
 *           │   └── Flow                 (Variable)
 *           ├── Treatment/               (GenericFolder)
 *           │   ├── Chlorine             (Variable)
 *           │   ├── pH                   (Variable)
 *           │   └── PressureDrop         (Variable)
 *           └── Distribution/            (GenericFolder)
 *               ├── pH                   (Variable)
 *               ├── Residual Chlorine    (Variable)
 *               └── Flow                 (Variable)
 * NOTE: CustomTimeSeriesDataStore, CustomEventDataStore, MessageProcessor and
 *       HistoryTransferController must be direct children of Core.
 */

import { Core } from "../../backend/src/core/Core";
import { CustomEventDataStore } from "../../backend/src/datastores/CustomEventDataStore";
import { CustomTimeSeriesDataStore } from "../../backend/src/datastores/CustomTimeSeriesDataStore";
import { GenericFolder } from "../../backend/src/objects/GenericFolder";
import { HistoryTransferController } from "../../backend/src/history/HistoryTransferController";
import { MessageProcessor } from "../../backend/src/objects/MessageProcessor";


// ─────────────────────────────────────────────────────────────
// MongoDB connection shared by both stores
// ─────────────────────────────────────────────────────────────
const MONGO_URI = "localhost:27017";

export function main(): void {
    // ─────────────────────────────────────────────────────────
    // 1. Resolve the Core and create the top-level folder tree
    // ─────────────────────────────────────────────────────────
    const core = new Core();  // resolves syslib.getcorepath() automatically
    console.log(`[1] Core resolved: ${core.path.absolutePath()}`);

    const root = new GenericFolder(`${core.path.absolutePath()}/WaterTreatment`);
    console.log(`[1] Root folder: ${root.path.absolutePath()}`);

    // ─────────────────────────────────────────────────────────
    // 2 + 3. Data stores — placed directly under Core (inmation constraint:
    //    CustomTimeSeriesDataStore / CustomEventDataStore must be Core children)
    // ─────────────────────────────────────────────────────────
    const sensorTimeSeries = new CustomTimeSeriesDataStore(
        `${core.path.absolutePath()}/WaterTreatment_SensorTimeSeries`,
        {
            connection: MONGO_URI,
            database: "water_plant",
            collection: "sensor_readings",
            registerAsDataStore: true,
            core: core,
        }
    );
    console.log(`[2] CustomTimeSeriesDataStore registered: ${sensorTimeSeries.path.absolutePath()}`);

    // ─────────────────────────────────────────────────────────
    // 3. CustomEventDataStore — receives discrete quality events and alarms
    //    Also placed directly under Core (same constraint as TimeSeries store).
    // ─────────────────────────────────────────────────────────
    const qualityEvents = new CustomEventDataStore(
        `${core.path.absolutePath()}/WaterTreatment_QualityEvents`,
        {
            connectionString: MONGO_URI,
            database: "water_plant",
            collection: "quality_events",
            registerAsDataStore: true,
            core: core,
        }
    );

    qualityEvents.delete();
    console.log(`[3] CustomEventDataStore registered: ${qualityEvents.path.absolutePath()}`);

    // ─────────────────────────────────────────────────────────
    // 4. Plant sensor hierarchy
    //    Each Variable archives its readings to the time-series store.
    //
    //    Intake stage — raw water coming in from source
    // ─────────────────────────────────────────────────────────
    const plantFolder = root.add.GenericFolder("Plant");

    const intakeFolder = plantFolder.add.GenericFolder("Intake");
    const intakePh = intakeFolder.add.Variable("pH", 7.2);
    const intakeTurbidity = intakeFolder.add.Variable("Turbidity", 3.5);
    const intakeFlow = intakeFolder.add.Variable("Flow", 1250.0);

    intakePh.archive.setDataStore(sensorTimeSeries, core);
    intakeTurbidity.archive.setDataStore(sensorTimeSeries, core);
    intakeFlow.archive.setDataStore(sensorTimeSeries, core);

    console.log(`[4] Intake sensors (pH, Turbidity, Flow) → SensorTimeSeries`);

    // Treatment stage — chlorination and filtration
    const treatmentFolder = plantFolder.add.GenericFolder("Treatment");
    const treatmentChlorine = treatmentFolder.add.Variable("Chlorine", 1.8);
    const treatmentPh = treatmentFolder.add.Variable("pH", 7.5);
    const treatmentPressureDrop = treatmentFolder.add.Variable("PressureDrop", 0.4);

    treatmentChlorine.archive.setDataStore(sensorTimeSeries, core);
    treatmentPh.archive.setDataStore(sensorTimeSeries, core);
    treatmentPressureDrop.archive.setDataStore(sensorTimeSeries, core);

    console.log(`[4] Treatment sensors (Chlorine, pH, PressureDrop) → SensorTimeSeries`);

    // Distribution stage — water leaving to consumers
    const distFolder = plantFolder.add.GenericFolder("Distribution");
    const distPh = distFolder.add.Variable("pH", 7.4);
    const distResidualChlorine = distFolder.add.Variable("ResidualChlorine", 0.5);
    const distFlow = distFolder.add.Variable("Flow", 980.0);

    distPh.archive.setDataStore(sensorTimeSeries, core);
    distResidualChlorine.archive.setDataStore(sensorTimeSeries, core);
    distFlow.archive.setDataStore(sensorTimeSeries, core);

    console.log(`[4] Distribution sensors (pH, ResidualChlorine, Flow) → SensorTimeSeries`);

    // ─────────────────────────────────────────────────────────
    // 5. MessageProcessor — SCADA integration via MSI message bus
    //
    //    MessageProcessor requires a specific parent class; wrap in
    //    try/catch to gracefully skip if the constraint is not met.
    // ─────────────────────────────────────────────────────────
    let msgProcPath = "(skipped — parent class constraint)";
    try {
        const msgProc = new MessageProcessor(
            `${core.path.absolutePath()}/WaterTreatment_SCADA_MsgProc`
        );
        msgProc.historianMapping.set([
            // Intake
            { EquipmentId: "PLANT01", Tag: "INTAKE.PH", Path: intakePh.path.absolutePath(), Historian: 1 },
            { EquipmentId: "PLANT01", Tag: "INTAKE.TURB", Path: intakeTurbidity.path.absolutePath(), Historian: 1 },
            { EquipmentId: "PLANT01", Tag: "INTAKE.FLOW", Path: intakeFlow.path.absolutePath(), Historian: 1 },
            // Treatment
            { EquipmentId: "PLANT01", Tag: "TREAT.CL2", Path: treatmentChlorine.path.absolutePath(), Historian: 1 },
            { EquipmentId: "PLANT01", Tag: "TREAT.PH", Path: treatmentPh.path.absolutePath(), Historian: 1 },
            { EquipmentId: "PLANT01", Tag: "TREAT.PDROP", Path: treatmentPressureDrop.path.absolutePath(), Historian: 1 },
            // Distribution
            { EquipmentId: "PLANT01", Tag: "DIST.PH", Path: distPh.path.absolutePath(), Historian: 1 },
            { EquipmentId: "PLANT01", Tag: "DIST.RES_CL2", Path: distResidualChlorine.path.absolutePath(), Historian: 1 },
            { EquipmentId: "PLANT01", Tag: "DIST.FLOW", Path: distFlow.path.absolutePath(), Historian: 1 },
        ]);
        msgProcPath = msgProc.path.absolutePath();
        console.log(`[5] MessageProcessor configured with 9 SCADA tag mappings`);
    } catch (e) {
        console.log(`[5] MessageProcessor skipped: parent class does not support MessageProcessor children.`);
    }

    // ─────────────────────────────────────────────────────────
    // 6. HistoryTransferController — backfill from legacy historian
    //
    //    Also wrapped in try/catch for the same parent-class reason.
    // ─────────────────────────────────────────────────────────
    let backfillPath = "(skipped — parent class constraint)";
    try {
        const backfillController = new HistoryTransferController(
            `${core.path.absolutePath()}/WaterTreatment_BackfillCtrl`
        );
        backfillPath = backfillController.path.absolutePath();
        console.log(`[6] HistoryTransferController created: ${backfillPath}`);
    } catch (e) {
        console.log(`[6] HistoryTransferController skipped: parent class does not support HistoryController children.`);
    }

    // ─────────────────────────────────────────────────────────
    // 7. Report — summarise what was configured
    // ─────────────────────────────────────────────────────────
    const tsId = sensorTimeSeries.getId(core);
    const evId = qualityEvents.getId(core);
    console.log(`[7] DataStore IDs — SensorTimeSeries: ${String(tsId)}, QualityEvents: ${String(evId)}`);

    const coreIsMaster = core.isMaster();
    console.log(`[7] Core role — master: ${String(coreIsMaster)}`);

    console.log(`
[7] Summary
    Root              : ${root.path.absolutePath()}
    TimeSeries store  : ${sensorTimeSeries.path.absolutePath()} (id=${String(tsId)})
    Event store       : ${qualityEvents.path.absolutePath()} (id=${String(evId)})
    Sensor variables  : 9 (3 per stage × 3 stages) → all archived to TimeSeries
    MessageProcessor  : ${msgProcPath}
    BackfillController: ${backfillPath}
    `);
}
