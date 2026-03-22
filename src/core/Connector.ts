import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { ObjectAddFactory } from "./ObjectAddFactory";

export type ConnectorOptions = {
    hostnameOrIP?: string;
    securityMode?: number;
    connectionMode?: number;
    reconnectPeriod?: number;
    timeoutCommunication?: number;
    localPort?: number;
    datasourceBlacklist?: string;
    datasourceWhitelist?: string;
    datasourceDiscoverySuppression?: number;
    bypassDiscoveryRules?: boolean;
    skipMass?: boolean;
    overwrite?: boolean;
};

export class Connector extends IObject {
    type = "Connector";
    add: ObjectAddFactory;

    constructor(path: string | number | Path, opts?: ConnectorOptions) {
        super(path, syslib.model.classes.Connector);
        this.add = new ObjectAddFactory(() => this.path.absolutePath());

        if (!opts?.skipMass && (!syslib.getobject(this.path.absolutePath()) || opts?.overwrite)) {
            const codes = syslib.model.codes;
            syslib.mass([{
                class: syslib.model.classes.Connector,
                operation: codes.MassOp.UPSERT,
                path: this.path.absolutePath(),
                ObjectName: this.path.name(),
                ComponentVersionPolicy: codes.ComponentVersionPolicy.AUTOMATIC_RESTRICTIVE,
                ComponentUpdateVerification: codes.ComponentUpdateVerification.SIGNATURE,
                "CommunicationSettings.SecurityMode": opts?.securityMode ?? codes.ComponentSecurityMode.TLS_SRP,
                "CommunicationSettings.ComponentConnectionMode": opts?.connectionMode ?? codes.ComponentConnectionMode.ACTIVE,
                "CommunicationSettings.ReconnectPeriod": opts?.reconnectPeriod ?? 10,
                "CommunicationSettings.TimeoutCommunication": opts?.timeoutCommunication ?? 10,
                "CommunicationSettings.LocalPort": opts?.localPort ?? 0,
                "CommunicationSettings.HostnameOrIP": opts?.hostnameOrIP ?? "",
                "ConnectorOptions.DatasourceDiscoverySuppression": opts?.datasourceDiscoverySuppression ?? 2,
                "ConnectorOptions.DatasourceBlacklist": opts?.datasourceBlacklist ?? "inmation.OpcServer.1",
                "ConnectorOptions.DatasourceWhitelist": opts?.datasourceWhitelist ?? "",
                "ConnectorOptions.BypassDiscoveryRules": opts?.bypassDiscoveryRules ?? false,
                "OpcUaConnectorOptions.OpcUaCertificateSecurity.OpcUaOwnCertificateDetails.OpcUaCertificateDigestAlgorithm": codes.OpcUaCertificateDigestAlgorithm.CERTIFICATE_DIGEST_SHA256,
                "OpcUaConnectorOptions.OpcUaCertificateSecurity.OpcUaOwnCertificateDetails.OpcUaPasswordProtectPrivateKey": true,
                "OpcUaConnectorOptions.OpcUaCertificateSecurity.OpcUaOwnCertificateDetails.OpcUaCertificateLifetime": 360,
                "OpcUaConnectorOptions.OpcUaCertificateSecurity.OpcUaCreateCertificate": true,
                "OpcUaConnectorOptions.OpcUaCertificateSecurity.OpcUaAlwaysAcceptServerCertificate": false,
                "Location.LocationTracking": false,
                "Location.LocationStrategy": codes.LocationStrategy.LOC_STRAT_NONE,
                SafMainRetentionPolicy: codes.SelectorSafRetentionPolicyMain.SAF_POLICY_DISKSIZE,
                "SafOptions.SafInvalidStorePurging": true,
                "SafOptions.TransmissionLimitSafVqt": 512,
                "SafOptions.TransmissionLimitSafEvent": 512,
                "SafOptions.TransmissionLimitSafAuditTrail": 512,
                "SafOptions.TransmissionLimitSafLog": 32,
                "SafOptions.SaFFreeMessageRetentionPeriod": 10,
                "SafOptions.SafPurgeAction": codes.SafPurgeActionMode.NONE,
                "SafOptions.SafFallbackMode": codes.SafFallbackMode.MAIN_MEMORY,
                "SafOptions.SafKeepLostData": false,
                "SafOptions.SafDiskRepairMode": codes.SafDiskRepairMode.REPAIR,
                "SafRetentionPolicyDiskSize.SafMaxDiskSize": 20,
                "SafRetentionPolicyDiskSize.SafDiskThresholdWarn": 70,
                "SafRetentionPolicyDiskSize.SafRetainMode": codes.SafRetainMode.SAF_RETAIN_NEW,
                "SafRetentionPolicyDiskSize.SafMaxDiskOverflowPercentage": 50,
                "TransmissionLimits.TransmissionLimitVqt": 512,
                "TransmissionLimits.TransmissionLimitTotal": 1024,
                "AuxStateManagement.AuxStateChangeStrategy": codes.AuxStateChangeStrategy.INHERIT,
                "SQLCatalog.EnableIntegerTypeAffinity": true,
                "SQLCatalog.SQLCatalogOptions": codes.SQLCatalog.CREATE_INDEXED_CATALOG,
                LogConsoleOutput: true,
            }]);
        }
    }

    static appendable(parent: IObject, name: string, opts?: ConnectorOptions): Connector {
        return new Connector(parent.path.absolutePath() + "/" + name, opts);
    }
}
