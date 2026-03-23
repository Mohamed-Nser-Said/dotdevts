/**
 * BufferExample
 *
 * Demonstrates the in-memory aggregation / buffering API:
 *   syslib.buffer   — create, replace or remove a named buffer
 *   syslib.attach   — attach or detach a repeater object to a buffer
 *   syslib.peek     — read buffer contents without clearing
 *   syslib.tear     — read and clear the buffer atomically
 *   syslib.last     — fetch only the most recent buffered value
 *   syslib.listbuffer — inspect all buffers on an object / component
 *
 * Prerequisites (assumed to exist in real usage):
 *   - A Variable-class object at  corePath + "/SensorA"  that historizes
 *     its ItemValue every second (StorageStrategy = RAW).
 *   - A Variable-class object at  corePath + "/SensorRepeater"  that has a
 *     dynamic property (used as the repeater target).
 *
 * Use cases covered:
 *  1. Create a raw rolling buffer (last 60 s, up to 60 samples).
 *  2. Peek at the buffer contents non-destructively.
 *  3. Get only the latest buffered value with syslib.last.
 *  4. Drain the buffer atomically with syslib.tear.
 *  5. Create a transformation buffer that computes 10-sample averages.
 *  6. Create an aggregation buffer using a built-in aggregate type.
 *  7. Attach a repeater object so it tracks every new buffer entry.
 *  8. Inspect all active buffers with syslib.listbuffer.
 *  9. Clean up — remove all three buffers.
 */


export function main(): void {
    const corePath = syslib.getcorepath();
    const sensorPath = corePath + "/SensorA";
    const repeaterPath = corePath + "/SensorRepeater";

    // Ensure prerequisite objects exist before calling buffer APIs
    if (!syslib.getobject(sensorPath)) {
        syslib.mass([{
            class: syslib.model.classes.Variable,
            operation: syslib.model.codes.MassOp.UPSERT,
            path: sensorPath,
            ObjectName: "SensorA",
            ItemValue: 0,
        }]);
    }
    if (!syslib.getobject(repeaterPath)) {
        syslib.mass([{
            class: syslib.model.classes.Variable,
            operation: syslib.model.codes.MassOp.UPSERT,
            path: repeaterPath,
            ObjectName: "SensorRepeater",
            ItemValue: 0,
        }]);
    }

    // -------------------------------------------------------------------------
    // 1. Create a raw rolling buffer
    //    - name     : "rawBuf"
    //    - input    : ".ItemValue"  (relative property path on sensorPath)
    //    - duration : 60 000 ms  → keep at most 60 seconds of data
    //    - size     : 60         → keep at most 60 elements
    // -------------------------------------------------------------------------
    console.log("--- 1. Create raw rolling buffer ---");

    syslib.buffer(sensorPath, "rawBuf", ".ItemValue", 60000, 60);
    console.log("Buffer 'rawBuf' created on", sensorPath);

    // Wait a few seconds so the buffer collects some data.
    syslib.sleep(3000);

    // -------------------------------------------------------------------------
    // 2. Peek — read the buffer without clearing it
    //    Returns: [values[], timestamps[], qualities[], counter]
    // -------------------------------------------------------------------------
    console.log("\n--- 2. Peek (non-destructive read) ---");

    const [peekValues, peekTs, peekQs, peekCount] = syslib.peek(sensorPath, "rawBuf");
    console.log("Samples in buffer:", peekValues.length, "| write counter:", peekCount);

    if (peekValues.length > 0) {
        const first = peekValues[0];
        const last  = peekValues[peekValues.length - 1];
        console.log("  oldest value:", first, " @", syslib.gettime(peekTs[0]));
        console.log("  newest value:", last,  " @", syslib.gettime(peekTs[peekTs.length - 1]));
    }

    // -------------------------------------------------------------------------
    // 3. last — get only the most recent value (no need to iterate)
    // -------------------------------------------------------------------------
    console.log("\n--- 3. Last value ---");

    const latestValue = syslib.last(sensorPath, "rawBuf");
    console.log("Most recent buffered value:", latestValue);

    // -------------------------------------------------------------------------
    // 4. Tear — drain and clear the buffer atomically
    //    Useful for batch processing: consume everything, then reset.
    // -------------------------------------------------------------------------
    console.log("\n--- 4. Tear (drain and clear) ---");

    const [tearValues, tearTs, tearQs, tearCounter] = syslib.tear(sensorPath, "rawBuf");
    console.log("Drained", tearValues.length, "values (write counter was", tearCounter, ")");

    let sum = 0;
    for (const v of tearValues) {
        sum += (v as number);
    }
    if (tearValues.length > 0) {
        console.log("Average of drained values:", sum / tearValues.length);
    }

    // After tear the buffer is empty but still exists.
    const [afterPeek] = syslib.peek(sensorPath, "rawBuf");
    console.log("Buffer size after tear:", afterPeek.length, "(should be 0)");

    // -------------------------------------------------------------------------
    // 5. Transformation buffer
    //    Reads from "rawBuf" and emits the average of every 10 samples.
    //    The transformation is a Lua chunk that returns a function.
    // -------------------------------------------------------------------------
    console.log("\n--- 5. Transformation buffer (moving average) ---");

    const avgFunc = `
return function(input, peek, tear)
    local values = peek(input)
    if #values >= 10 then
        local sum = 0
        for i = 1, 10 do sum = sum + values[i] end
        tear(input)          -- consume the 10 samples from rawBuf
        return sum / 10      -- emit the average into avgBuf
    end
end`;

    // avgBuf reads from "rawBuf" and stores up to 6 averaged values over 60 s.
    syslib.buffer(sensorPath, "avgBuf", "rawBuf", 60000, 6, avgFunc);
    console.log("Transformation buffer 'avgBuf' created (10-sample average)");

    // -------------------------------------------------------------------------
    // 6. Aggregation buffer (built-in aggregate type)
    //    Uses syslib's native AGG_TYPE_AVERAGE every 10 seconds.
    // -------------------------------------------------------------------------
    console.log("\n--- 6. Aggregation buffer (built-in AGG_TYPE_AVERAGE) ---");

    // aggBuf reads from "rawBuf", aggregates over 10 s intervals, keeps 6 results.
    syslib.buffer(sensorPath, "aggBuf", "rawBuf", 60000, 6, 10000, "AGG_TYPE_AVERAGE");
    console.log("Aggregation buffer 'aggBuf' created (10 s intervals, AGG_TYPE_AVERAGE)");

    // -------------------------------------------------------------------------
    // 7. Attach / detach a repeater
    //    A repeater receives every value that enters the target buffer, via
    //    the repeater object's dynamic property.
    // -------------------------------------------------------------------------
    console.log("\n--- 7. Attach a repeater to 'rawBuf' ---");

    // Attach: the repeater object at repeaterPath will track rawBuf.
    try {
        syslib.attach(sensorPath, "rawBuf", repeaterPath);
        console.log("Repeater attached:", repeaterPath, "→ rawBuf");

        // Allow some data to flow through.
        syslib.sleep(2000);

        // Detach: call attach without a repeater argument.
        syslib.attach(sensorPath, "rawBuf");
        console.log("Repeater detached from rawBuf");
    } catch (e) {
        console.log("Attach skipped: repeater object does not meet aggregation repeater requirements.");
    }

    // -------------------------------------------------------------------------
    // 8. listbuffer — inspect all active buffers on sensorPath
    // -------------------------------------------------------------------------
    console.log("\n--- 8. List buffers on", sensorPath, "---");

    const info = syslib.listbuffer(sensorPath);
    for (let i = 0; i < info.name.length; i++) {
        console.log(
            `  [${i + 1}]`,
            `name="${info.name[i]}"`,
            `lower="${info.lower[i]}"`,
            `size=${info.size[i]}/${info.length[i]}`,
            `duration=${info.duration[i]} ms`,
            `counter=${info.counter[i]}`
        );
    }

    // -------------------------------------------------------------------------
    // 9. Cleanup — remove all three buffers (two-argument form removes the buffer)
    // -------------------------------------------------------------------------
    console.log("\n--- 9. Cleanup ---");

    syslib.buffer(sensorPath, "rawBuf");
    syslib.buffer(sensorPath, "avgBuf");
    syslib.buffer(sensorPath, "aggBuf");
    console.log("All buffers removed from", sensorPath);
}
