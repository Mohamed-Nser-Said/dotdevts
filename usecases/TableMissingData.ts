import { GenericFolder } from "../src/objects/GenericFolder";
import { TableHolder } from "../src/objects/TableHolder";
import { DataFrame } from "../src/std/DataFrame";

// Type for one CSV row
export interface PimsTagMapping {
    pimsTagName: string;              // "PIMS Tag Name"
    sourceTagPropertyId?: number;     // "Source Tag Property ID" (optional if missing)
    sourceTagPath: string;            // "Source Tag Path"
}

// Example: parsed data from your CSV snippet
export const pimsTagMappings: PimsTagMapping[] = [
    {
        pimsTagName: "C550_H430113.PV",
        sourceTagPropertyId: 152840918703210530,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb100001f/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "C300_HV6177.PV",
        sourceTagPropertyId: 152840918855385120,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb1000025/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "C300_HV6149.PV",
        sourceTagPropertyId: 152840918783361060,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb1000029/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "C300_HV6178.PV",
        sourceTagPropertyId: 152840918856761380,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb100002d/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "C300_HV6151.PV",
        sourceTagPropertyId: 152840918661988380,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb100002f/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "C300_HV6175.PV",
        sourceTagPropertyId: 152840918819405860,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb1000030/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "C300_HV6176.PV",
        sourceTagPropertyId: 152840918899753000,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb1000031/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "C300_HV6079.PV",
        sourceTagPropertyId: 152840918780149800,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb1000034/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "C300_HV6179.PV",
        sourceTagPropertyId: 152840918604316700,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70B3D57BB1000040/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "C300_HV6080.PV",
        sourceTagPropertyId: 152840918749610020,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb1000041/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "C710_Demo01",
        sourceTagPropertyId: 152840918689579040,
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70B3D57BB100048E/ValvePosition/properties/status/logicalPosition/openPercentage",
    },

    // For the "broken" lines, the second column is missing and the values
    // are effectively swapped between PIMS Tag Name and Source Tag Path.
    // Assuming how you *want* to interpret them:

    {
        pimsTagName: "PIMS_TEST.STATE.PVFL",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70B3D57BB1000492/ValvePosition/properties/status/logicalPosition/open",
    },
    {
        pimsTagName: "PIMS_TEST.PERCENTAGE _OPEN.PV",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70B3D57BB1000492/ValvePosition/properties/status/logicalPosition/openPercentage",
    },
    {
        pimsTagName: "PIMS_TEST.POSITION_VALID.PVFL",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70B3D57BB1000492/ValvePosition/properties/status/valid",
    },
];


export const csvRowsFull = [
    {
        pimsTagName: "C550_H430113.PV",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb100001f/ValvePosition/properties/status/logicalPosition/openPercentage",
        sourceTagPropertyId: "152840918703210530",
    },
    {
        pimsTagName: "C300_HV6177.PV",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb1000025/ValvePosition/properties/status/logicalPosition/openPercentage",
        sourceTagPropertyId: "152840918855385120",
    },
    {
        pimsTagName: "C300_HV6149.PV",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb1000029/ValvePosition/properties/status/logicalPosition/openPercentage",
        sourceTagPropertyId: "152840918783361060",
    },
];

export const csvRowsMissingOneKey = [
    {
        pimsTagName: "C300_HV6178.PV",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb100002d/ValvePosition/properties/status/logicalPosition/openPercentage",
        sourceTagPropertyId: "152840918856761380",
    },
    {
        pimsTagName: "C300_HV6151.PV",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb100002f/ValvePosition/properties/status/logicalPosition/openPercentage",
        // sourceTagPropertyId missing
    },
    {
        pimsTagName: "C300_HV6175.PV",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb1000030/ValvePosition/properties/status/logicalPosition/openPercentage",
        sourceTagPropertyId: "152840918819405860",
    },
];

export const csvRowsMissingTwoKeys = [
    {
        pimsTagName: "C300_HV6176.PV",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70b3d57bb1000031/ValvePosition/properties/status/logicalPosition/openPercentage",
        sourceTagPropertyId: "152840918899753000",
    },
    {
        pimsTagName: "C300_HV6079.PV",
        // sourceTagPath missing
        // sourceTagPropertyId missing
    },
    {
        pimsTagName: "C300_HV6179.PV",
        sourceTagPath:
            "/System/Core/EA-02/MDI-P-EA-AVM-02/Aloxy-EA-02/data/basfbeant/70B3D57BB1000040/ValvePosition/properties/status/logicalPosition/openPercentage",
        sourceTagPropertyId: "152840918604316700",
    },
];

export function DataStudioLight() {

    const useCase = new GenericFolder("/System/Core/csv-issue", { cleanupExisting: true });
    const empty = useCase.add.TableHolder("missing-column");
    empty.setTable(pimsTagMappings);


    useCase.add.TableHolder("csvRowsFull").setTable(csvRowsFull);
    useCase.add.TableHolder("csvRowsMissingOneKey").setTable(csvRowsMissingOneKey);
    useCase.add.TableHolder("csvRowsMissingTwoKeys").setTable(csvRowsMissingTwoKeys);






}