/**
 * Workspace — provides access to the inmation workspace context.
 *
 * The workspace is the inmation Script Object whose script is currently
 * executing. `Host.workspace.info()` returns metadata about it, including
 * the full object path in the inmation model.
 *
 * Mirrors: .dev/src/modules/util/workspace.lua
 */

export class Workspace {
    /**
     * Returns the absolute inmation path of the workspace Script Object
     * that is currently executing this script.
     *
     * Example: "/System/Core/MyFolder/MyScript"
     */
    static path(): string {
        return Host.workspace.info().path;
    }

    /**
     * Returns the name segment of the workspace's inmation path.
     *
     * Example: "/System/Core/MyFolder/MyScript" → "MyScript"
     */
    static scriptName(): string {
        const p = Workspace.path();
        let lastSlash = -1;
        for (let i = p.length - 1; i >= 0; i--) {
            const ch = p.substring(i, i + 1);
            if (ch === "/" || ch === "\\") {
                lastSlash = i;
                break;
            }
        }
        return lastSlash >= 0 ? p.substring(lastSlash + 1) : p;
    }

    /**
     * Returns the parent path of the workspace Script Object.
     *
     * Example: "/System/Core/MyFolder/MyScript" → "/System/Core/MyFolder"
     */
    static parentPath(): string {
        const p = Workspace.path();
        let lastSlash = -1;
        for (let i = p.length - 1; i >= 0; i--) {
            const ch = p.substring(i, i + 1);
            if (ch === "/" || ch === "\\") {
                lastSlash = i;
                break;
            }
        }
        return lastSlash > 0 ? p.substring(0, lastSlash) : p;
    }

    /**
     * Returns the full WorkspaceInfo object from the runtime.
     */
    static info(): { path: string; name: string } {
        return Host.workspace.info();
    }
}
