#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const webstudioDir = path.join(repoRoot, "examples", "webstudio");

function parseArgs(argv) {
    const options = {
        connection: "win1000",
        dryRun: false,
        noBuild: false,
        example: null,
        run: false,
        bundle: false,
        help: false,
    };

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];

        if (arg === "--dry-run") {
            options.dryRun = true;
        } else if (arg === "--no-build") {
            options.noBuild = true;
        } else if (arg === "--run") {
            options.run = true;
        } else if (arg === "--bundle" || arg === "-b") {
            options.bundle = true;
        } else if (arg === "--help" || arg === "-h") {
            options.help = true;
        } else if ((arg === "--connection" || arg === "-n") && argv[i + 1]) {
            options.connection = argv[i + 1];
            i += 1;
        } else if ((arg === "--example" || arg === "-e") && argv[i + 1]) {
            options.example = argv[i + 1];
            i += 1;
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    return options;
}

function printHelp() {
    console.log(`Usage: node scripts/push-webstudio-examples.js [options]

Options:
  -c, --connection <name>   inmation connection profile (default: win1000)
  -e, --example <name>      target a single example by file name, e.g. ContainersDemo
      --run                 run the compiled Lua with 'cts run' instead of pushing to WebStudio
  -b, --bundle              pass --bundle to 'cts run' (only applies with --run)
      --no-build            skip npm run build
      --dry-run             print commands without executing cts
  -h, --help                show this help message
`);
}

function quoteArg(value) {
    if (/^[a-zA-Z0-9_./:-]+$/.test(value)) {
        return value;
    }

    return JSON.stringify(value);
}

function runCommand(command, args, dryRun) {
    const fullCommand = [command, ...args.map(quoteArg)].join(" ");
    console.log(`\n$ ${fullCommand}`);

    if (dryRun) {
        return;
    }

    execSync(fullCommand, {
        cwd: repoRoot,
        stdio: "inherit",
    });
}

function discoverExamples(selectedExample) {
    const entries = fs.readdirSync(webstudioDir, { withFileTypes: true });
    const examples = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
        .map((entry) => {
            const tsPath = path.join(webstudioDir, entry.name);
            const source = fs.readFileSync(tsPath, "utf8");
            const match = source.match(/export function\s+([A-Za-z][A-Za-z0-9_]*)/);

            if (!match) {
                return null;
            }

            return {
                fileName: entry.name,
                baseName: entry.name.replace(/\.ts$/, ""),
                functionName: match[1],
                luaPath: `./build/examples/webstudio/${entry.name.replace(/\.ts$/, ".lua")}`,
            };
        })
        .filter(Boolean);

    if (!selectedExample) {
        return examples;
    }

    return examples.filter((example) => example.baseName === selectedExample || example.fileName === selectedExample);
}

function main() {
    const options = parseArgs(process.argv.slice(2));

    if (options.help) {
        printHelp();
        return;
    }

    const examples = discoverExamples(options.example);

    if (examples.length === 0) {
        throw new Error("No matching WebStudio examples were found.");
    }

    console.log(`Found ${examples.length} WebStudio example(s):`);
    examples.forEach((example) => {
        console.log(`- ${example.fileName} -> ${example.functionName}`);
    });

    if (!options.noBuild) {
        runCommand("npm", ["run", "build"], options.dryRun);
    }

    examples.forEach((example) => {
        const compiledLuaPath = path.join(repoRoot, example.luaPath.replace(/^\.\//, ""));

        if (!options.dryRun && !fs.existsSync(compiledLuaPath)) {
            throw new Error(`Compiled Lua file not found: ${example.luaPath}`);
        }

        if (options.run) {
            const runArgs = ["run", example.luaPath, "-n", options.connection];
            if (options.bundle) runArgs.push("--bundle");
            runCommand("cts", runArgs, options.dryRun);
        } else {
            runCommand(
                "cts",
                ["ws", "--push", example.luaPath, "-n", options.connection, "--func", example.functionName, "-b"],
                options.dryRun,
            );
        }
    });

    const verb = options.run ? "run" : "push";
    console.log(`\nCompleted ${verb} workflow for ${examples.length} WebStudio example(s).`);
}

try {
    main();
} catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
}
