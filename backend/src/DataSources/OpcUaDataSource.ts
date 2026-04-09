import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { VariableChildren } from "../children/VariableChildren";

export type OpcUaIdentityOptions = {
    type?: number;
    userName?: string;
    password?: string;
    rejectUnencryptedToken?: boolean;
};

export type OpcUaDataSourceOptions = {
    serverUrl?: string;
    securityMode?: number;
    securityPolicy?: number;
    identity?: OpcUaIdentityOptions;
    publishingInterval?: number;
    activityMonitoringEnabled?: boolean;
    readOnly?: boolean;
    skipMass?: boolean;
    overwrite?: boolean;
};

export class OpcUaDataSource extends IObject {
    public readonly type: string = "OpcUaDataSource";
    public readonly children: VariableChildren;

    constructor(path: string | number | Path, opts?: OpcUaDataSourceOptions) {
        super(path, syslib.model.classes.Datasource);
        this.children = new VariableChildren(() => this.path.absolutePath());

        if (!opts?.skipMass && (!syslib.getobject(this.path.absolutePath()) || opts?.overwrite)) {
            const codes = syslib.model.codes;
            syslib.mass([{
                class: syslib.model.classes.Datasource,
                operation: codes.MassOp.UPSERT,
                path: this.path.absolutePath(),
                ObjectName: this.path.name(),
                ServerType: codes.SelectorEndpointType.EP_OPC_UA,

                // Activity monitoring
                "ActivityMonitoring.EnableActivityMonitoring": opts?.activityMonitoringEnabled ?? true,
                "ActivityMonitoring.LaunchReconnect": true,
                "ActivityMonitoring.WarningOnly": true,
                "ActivityMonitoring.FrequencyDrop": 100,
                "ActivityMonitoring.MonitoringPeriod": 60,

                // Location
                "Location.LocationTracking": false,
                "Location.LocationStrategy": codes.LocationStrategy.LOC_STRAT_NONE,

                // Aux state
                "AuxStateManagement.AuxStateChangeStrategy": codes.AuxStateChangeStrategy.INHERIT,

                // OPC UA connection
                "UaConnection.OpcUaServerUrl": opts?.serverUrl ?? "",
                "UaConnection.OpcUaSecurityMode": opts?.securityMode ?? codes.UaSecurityMode.SECURITY_MODE_NONE,
                "UaConnection.OpcUaSecurityPolicy": opts?.securityPolicy ?? codes.UaSecurityPolicy.SECURITY_POLICY_NONE,
                "UaConnection.OpcUaOverwriteEndpointHostName": false,
                "UaConnection.OpcUaDiscoverEndpoints": false,

                // Identity
                "UaConnection.OpcUaUserIdentity.OpcUaUserIdentityType": opts?.identity?.type ?? codes.UaUserTokenType.ANONYMOUS_TOKEN,
                "UaConnection.OpcUaUserIdentity.OpcUaClientUserName": opts?.identity?.userName ?? "",
                "UaConnection.OpcUaUserIdentity.OpcUaClientUserPassword": opts?.identity?.password ?? "",
                "UaConnection.OpcUaUserIdentity.OpcUaRejectUnencryptedUserNameToken": opts?.identity?.rejectUnencryptedToken ?? false,

                // Session
                "UaConnection.OpcUaCClientOptions.OpcUaSessionOptions.OpcUaSessionLocale": codes.LanguageCodes.EN,

                // Write options
                "UaConnection.OpcUaCClientOptions.OpcUaWriteOptions.OpcUaWriteIgnoreTimestamp": true,
                "UaConnection.OpcUaCClientOptions.OpcUaWriteOptions.OpcUaWriteIgnoreQuality": true,

                // Publishing
                "UaConnection.OpcUaCClientOptions.OpcUaPublishingOptions.OpcUaPublishingInterval": opts?.publishingInterval ?? 1000,
                "UaConnection.OpcUaCClientOptions.OpcUaPublishingOptions.OpcUaPublishingInterval.ArchiveSelector": 1,
                "UaConnection.OpcUaCClientOptions.OpcUaPublishingOptions.OpcUaPublishingInterval.ArchiveMode": codes.ArchiveMode.LAST_VALUE,
                "UaConnection.OpcUaCClientOptions.OpcUaPublishingOptions.OpcUaSubscriptionPriority": 200,
                "UaConnection.OpcUaCClientOptions.OpcUaPublishingOptions.OpcUaMaxNotificationsPerPublish": 1000,
                "UaConnection.OpcUaCClientOptions.OpcUaPublishingOptions.OpcUaMaxKeepAliveCount": 10,
                "UaConnection.OpcUaCClientOptions.OpcUaPublishingOptions.OpcUaLifeTimeCount": 100,
                "UaConnection.OpcUaCClientOptions.OpcUaPublishingOptions.OpcUaInitialPublishRequests": 2,

                // Service calls
                "UaConnection.OpcUaCClientOptions.OpcUaServiceCallOptions.OpcUaServiceCallTimeoutHint": 30000,
                "UaConnection.OpcUaCClientOptions.OpcUaServiceCallOptions.OpcUaServiceCallReturnDiagnosticsInfo": false,

                // Subscriptions
                "UaConnection.OpcUaCClientOptions.OpcUaSubscriptionOptions.OpcUaCreateSubscriptions": true,
                "UaConnection.OpcUaCClientOptions.OpcUaSubscriptionOptions.OpcUaAllowEventSubscriptions": true,
                "UaConnection.OpcUaCClientOptions.OpcUaSubscriptionOptions.OpcUaUseSourceTimestamp": true,
                "UaConnection.OpcUaCClientOptions.OpcUaSubscriptionOptions.OpcUaMaxItemsPerSubscription": 1000,
                "UaConnection.OpcUaCClientOptions.OpcUaSubscriptionOptions.OpcUaMaxSubscriptionNumber": 0,
                "UaConnection.OpcUaCClientOptions.OpcUaSubscriptionOptions.OpcUaPauseBeforeSubscription": 0,
                "UaConnection.OpcUaCClientOptions.OpcUaSubscriptionOptions.OpcUaSubscriptionMaxRetryInterval": 30,

                // Browse
                "UaConnection.OpcUaCClientOptions.OpcUaBrowseControlDataSource.BrowseOptions": codes.BrowseOptionCodes.BROWSE_PERIODICALLY,
                "UaConnection.OpcUaCClientOptions.OpcUaBrowseControlDataSource.BrowsePeriod": 2,
                "UaConnection.OpcUaCClientOptions.OpcUaBrowseControlDataSource.BrowseLimits.TotalItems": 10000,
                "UaConnection.OpcUaCClientOptions.OpcUaBrowseControlDataSource.BrowseLimits.TotalNodes": 5000,
                "UaConnection.OpcUaCClientOptions.OpcUaBrowseControlDataSource.BrowseLimits.BrowseDepth": 5,
                "UaConnection.OpcUaCClientOptions.OpcUaBrowseControlDataSource.BrowseLimits.ItemsPerNode": 50,
                "UaConnection.OpcUaCClientOptions.OpcUaBrowseControlDataSource.BrowseFilterLeaves": "",
                "UaConnection.OpcUaCClientOptions.OpcUaBrowseControlDataSource.BrowseFilterBranches": "",

                // Operation limits
                "UaConnection.OpcUaCClientOptions.OpcUaOperationLimits.OpcUaMaxMonitoredItemsPerCall": 1000,
                "UaConnection.OpcUaCClientOptions.OpcUaOperationLimits.OpcUaMaxNodesPerBrowse": 1000,
                "UaConnection.OpcUaCClientOptions.OpcUaOperationLimits.OpcUaMaxNodesPerRead": 1000,
                "UaConnection.OpcUaCClientOptions.OpcUaOperationLimits.OpcUaMaxReferencesPerBrowseNode": 1000,

                // Misc
                "UaConnection.OpcUaCClientOptions.OpcUaPropertyManagement.OpcUaPropertyStrategy": 15,
                "UaConnection.OpcUaCClientOptions.OpcUaDebugOptions": 1,
                "UaConnection.OpcUaCClientOptions.ReadOnlyDatasource": opts?.readOnly ?? false,

                // Operational limits
                "UaConnection.DatasourceOperationalLimits.DatasourceMaxPendingWrites": 0,
            }]);
        }
    }

    static appendable(parent: IObject, name: string, opts?: OpcUaDataSourceOptions): OpcUaDataSource {
        return new OpcUaDataSource(parent.path.absolutePath() + "/" + name, opts);
    }
}
