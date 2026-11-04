# Coding Academy — complete workbook

Original educational curriculum. Checked November 2026.


# PYTHON — Values, expressions, and engineering units

Every future simulation begins with trustworthy arithmetic and explicit units.

A program is a sequence of instructions evaluated using values. Begin with arithmetic you can verify on paper, because an unfamiliar language and an unfamiliar physical model make errors difficult to separate. Write mass_kg = 2.4, rather than a mysterious x, and keep the unit in the name until you adopt a more formal units system. A name refers to the current value; it is not an equation that automatically updates when another name changes. Evaluate a calculation again after changing an input. This distinction becomes important in notebooks with cells that can run in any order.

Use integers for exact counts and floating-point values for approximate measurements. Division produces a floating-point result, while floor division answers a different question about whole groups. Exponentiation uses two asterisks, not the caret used in some mathematical notation. Parentheses make your intended grouping visible, but cannot repair an incorrect physical formula. A quantity such as power_w * duration_s has units of joules. Check that unit relationship before checking the printed digits. For a first exercise, predict both the approximate size of the result and its dimension; a believable number alone is not a sufficient check.

Your first workflow is deliberately small: write a script, save it, run it, inspect the output, change one input, and run it again. Record what you expected before the second run. Add output labels so a future reader knows what the number means. Avoid formatting away uncertainty or claiming a precision your inputs do not possess. This module needs only arithmetic and the idea of a unit conversion. It is useful immediately for rover component masses, experiment durations, energy estimates, and converting exported measurements, even before calculus or mechanics enter the curriculum.

## Example

```
power_w = 12.0
duration_s = 90.0
energy_j = power_w * duration_s
print(f"Energy: {energy_j:.1f} J")
```

The result is 1080.0 J. It assumes constant power over the entire interval.

## Start: Convert a short test duration

Convert a 2.5-minute bench test to seconds, then compute energy for a constant 8 W load. Print both quantities with units.

Input: duration_min = 2.5; power_w = 8

Expected: 150 s and 1200 J

Hints:
- Multiply minutes by 60.
- Energy is power multiplied by seconds.

Worked reasoning: duration_s = 2.5 * 60; energy_j = 8 * duration_s. The calculation yields 150 and 1200. Multiplying by minutes without converting would give watt-minutes, not joules.

Tests:
- Zero duration gives zero energy.
- Doubling power doubles energy.

Extension: Also report energy in Wh: one third of a Wh.

## Build: Rover mass ledger

Calculate the sum of three component masses and the remaining allowance under a 5 kg design target. Treat the target as an exercise budget, not a certified limit.

Input: frame 1.8 kg; electronics 0.65 kg; wheels 1.2 kg; target 5 kg

Expected: Total 3.65 kg; allowance 1.35 kg

Hints:
- Use one named value per component.
- Subtract total from target.

Worked reasoning: Add 1.8 + 0.65 + 1.2, then subtract from 5. Label a negative allowance as exceeding the target when you explore other values.

Tests:
- Removing electronics reduces total by 0.65 kg.
- A target equal to total gives zero allowance.

Extension: Express each component as a percentage of the total.

## Stretch: Sampling storage estimate

Estimate raw storage for an ideal log containing 50 samples per second, 3 channels, 4 bytes per channel, for 120 seconds. Ignore timestamps and file overhead, and state that assumption.

Input: 50 Hz; 3 channels; 4 bytes; 120 s

Expected: 6000 samples; 72000 bytes

Hints:
- Count time samples first.
- Each time sample contains all three channels.

Worked reasoning: 50 * 120 gives 6000 samples. Each has 3 * 4 = 12 bytes, so the raw payload is 72000 bytes. It is 72 kB using decimal units, or 70.3125 KiB.

Tests:
- One channel gives 24000 bytes.
- Zero duration gives zero bytes.

Extension: Add an 8-byte timestamp per time sample and recompute: 120000 bytes.

## Debug: Find the exponent mistake

A student writes area_m2 = 3.14159 * (radius_m ^ 2). Explain the operator problem and correct the calculation for radius_m = 2.0.

Input: radius_m = 2.0

Expected: Approximately 12.56636 m²

Hints:
- The caret is not Python exponentiation.
- Use ** for a power.

Worked reasoning: Use 3.14159 * radius_m ** 2. With a float, the original caret expression raises a type error; with integers it can silently perform an unrelated bitwise operation.

Tests:
- A zero radius gives zero area.
- Doubling radius multiplies area by four.

Extension: Use math.pi and explain why a better constant does not remove measurement uncertainty.

## Recall

Why put units in variable names?

They make the intended physical meaning visible and help expose incompatible inputs, but they do not automatically validate units.

Does energy_j update automatically after changing power_w?

No. Assignment evaluates the right-hand expression then. Re-execute the energy calculation to use the new power.

Sources:
- Python introduction: https://docs.python.org/3/tutorial/introduction.html

# PYTHON — Decisions and input contracts

Engineering programs must distinguish usable input, missing input, and values outside a model’s domain.

A condition asks a precise question and produces True or False. An if statement selects a block based on that result. Translate the requirement into ordinary language before typing the operator: “review values strictly greater than 30” means greater-than, while “30 or greater” includes equality. Boundaries matter because most accidental disagreements hide at the threshold itself. Write a small table containing below, equal, and above cases. An exercise threshold is a software requirement for the example; it should not be confused with an actual operating limit for hardware or a diagnosis of a fault.

Input contracts define what a function or script accepts. A temperature conversion may accept any finite number at or above absolute zero; a duration may need to be nonnegative; a sample count may need to be a positive integer. These are different rules, even if all values appear as numbers. Validate a value before using it in an operation that relies on the rule. Avoid silently replacing a bad value with zero unless zero is a documented and scientifically meaningful fallback. Missing data is often information about the experiment, so preserve a way to explain why a reading was excluded.

Work with literal values first, then add interactive text input after the logic behaves correctly. Text that looks numeric is still text until conversion succeeds. Separating parsing from domain validation gives clearer errors: “not a number” differs from “negative duration.” You will later use exceptions to express these failures more cleanly. For now, focus on mutually exclusive branches, explicit comparisons, and a clear result for every allowed case. This module requires arithmetic and an understanding of ordered numbers. The same habits will later govern data cleaning, state transitions, and deciding whether a numerical method is applicable.

## Example

```
temperature_c = 30.0
if temperature_c > 30.0:
    print("Review")
else:
    print("Within example threshold")
```

Equality belongs to the else branch because the specification says strictly greater.

## Start: Boundary table

Classify 29, 30, and 31 as review only when strictly greater than 30. Return one label per input.

Input: [29, 30, 31]

Expected: ["ok", "ok", "review"]

Hints:
- Write all three expected labels first.
- Use >, not >=.

Worked reasoning: The comparison value > 30 is false, false, true. Equality is intentionally permitted by this exercise specification.

Tests:
- Test 30 exactly.
- Test a decimal just above 30.

Extension: Change the written requirement to inclusive and update the table first.

## Build: A valid time interval

Accept a duration if it is zero or positive; otherwise report invalid duration. Keep validation separate from an energy calculation.

Input: -1, 0, 10 seconds

Expected: invalid; valid; valid

Hints:
- Zero duration has a meaningful zero-energy result.
- Validate before multiplication.

Worked reasoning: Use duration_s >= 0. Only compute energy inside the accepted branch. Do not convert -1 to +1; that conceals the bad input.

Tests:
- -0.1 is invalid.
- 0 is valid.

Extension: Add a maximum experiment duration as a configurable example limit.

## Stretch: Missing versus measured zero

Classify a value as missing when it is None, review when it exceeds 30, otherwise measured. Make zero a measured value.

Input: None, 0.0, 35.0

Expected: missing; measured; review

Hints:
- Check is None first.
- Do not use if not value to detect missing data.

Worked reasoning: Use if value is None, elif value > 30, else. Numeric zero is false in a truth test, so a broad falsiness check would incorrectly classify it.

Tests:
- None never reaches a numeric comparison.
- 0.0 remains measured.

Extension: Extend the contract later to reject NaN and infinities explicitly.

## Debug: Unreachable branch

Correct this classification: if x > 0: positive; elif x > 10: high; else: nonpositive. The desired high category is x > 10.

Input: x = 12

Expected: high

Hints:
- The first true branch wins.
- Check the narrower category first.

Worked reasoning: Test x > 10 before x > 0. Then 12 is high, 5 positive, and 0 nonpositive. No later elif runs after a prior branch succeeds.

Tests:
- 10 is positive under the strict high threshold.
- 11 is high.

Extension: Write a truth table for a three-band battery percentage display, including invalid percentages.

## Recall

What is the difference between > and >=?

The second includes the boundary itself. Choose from the written requirement and test equality.

Why is replacing missing data with zero risky?

It changes an absence of knowledge into a measured value and can bias statistics or conceal a failed acquisition.

Sources:
- Python control flow: https://docs.python.org/3/tutorial/controlflow.html

# PYTHON — Collections, loops, and accumulators

The same operation often needs to run over every sample, component, or experiment.

A list keeps several values in an order. A loop applies instructions to one item at a time, so you can explain its behavior by tracing a tiny example. Before processing a thousand measurements, use three. Write down the current item and any accumulated state after each iteration. A running total begins with an identity value, zero for addition, then changes as items are visited. Initialize it before the loop. Reinitializing inside the loop is a common error that produces only the last contribution. A final result should represent the entire collection, not whichever value happened to come last.

Choose a collection based on meaning rather than syntax convenience. A list of measurements preserves order, which may be essential for time-series reasoning. A list of component masses may not need ordering for its sum, but changing the order should still not change the answer materially beyond floating-point rounding. Indexing begins at zero, and a stop value in a range is excluded. Prefer direct iteration when you need values rather than indices. If you need both position and value, enumerate communicates the intent more clearly than maintaining a separate counter that can drift out of synchronization.

Aggregations need an empty-input policy. The sum of no contributions can reasonably be zero, while an average of no measurements cannot reasonably be a measured zero. For an average, decide whether to raise an error or return an explicit absence. The length of a list is a count, so division by that count must only happen when it is nonzero. This module needs arithmetic and the branching habits you already practiced. It supports repeated data checks, component ledgers, and experiment summaries; later, NumPy will accelerate some array operations, but understanding the loop remains useful for diagnosing the algorithm underneath.

## Example

```
values = [2.0, 4.0, 6.0]
total = 0.0
for value in values:
    total += value
print(total / len(values))
```

The nonempty list has total 12 and mean 4.0. Empty input needs an explicit policy.

## Start: Count review flags

Count measurements strictly above 30 without modifying the source list.

Input: [28, 31, 30, 35]

Expected: 2

Hints:
- Start a counter at zero.
- Only increment in the matching branch.

Worked reasoning: Visit all four values; 31 and 35 qualify. The original list stays intact so later calculations can use the same data.

Tests:
- An empty list gives count zero.
- [30, 30] gives zero.

Extension: Return the matching values as well as their count.

## Build: Weighted component position

Compute the center position sum(mass * position) / sum(mass) for two point masses along one axis. Check positive total mass.

Input: masses 2, 1 kg; positions 0, 3 m

Expected: 1 m

Hints:
- Accumulate mass and first moment separately.
- The numerator has units kg·m.

Worked reasoning: The first moment is 2*0 + 1*3 = 3 kg·m and total mass is 3 kg. Their ratio is 1 m. This is a one-axis point-mass model.

Tests:
- Equal masses at 0 and 3 yield 1.5 m.
- Zero total mass must be rejected.

Extension: Accept a list of (mass, position) pairs and validate each mass.

## Stretch: Consecutive gaps

Find gaps between consecutive timestamps and flag gaps larger than 1.5 seconds. Keep the original sequence order.

Input: [0, 1, 2, 5, 6]

Expected: Gaps [1, 1, 3, 1]; one flagged gap from 2 to 5

Hints:
- A gap needs a pair of neighboring entries.
- There are n-1 gaps for n timestamps.

Worked reasoning: Subtract each previous timestamp from the next. The 3-second gap is the only value greater than 1.5. Do not sort away unexpected time reversals without investigating.

Tests:
- One timestamp gives no gaps.
- A negative gap should be reported as a time-order problem.

Extension: Return gap records containing start, end, and duration.

## Debug: The reset total

Explain why this computes 6 instead of 12: for value in [2,4,6]: total = 0; total += value. Move the correct statement.

Input: [2,4,6]

Expected: 12

Hints:
- Inspect where total is initialized.
- Trace total after the first two loops.

Worked reasoning: Initialize total once before entering the loop. Resetting it each iteration discards the earlier additions.

Tests:
- A single item returns itself.
- The corrected empty-list sum is zero.

Extension: Compare your result with built-in sum and explain the identity value.

## Recall

Why test a loop with three items first?

You can trace every state change and detect errors that one-item examples cannot reveal.

What should an average of an empty list be?

Not a measured zero. Choose an explicit error or absence and document the policy.

Sources:
- Python data structures: https://docs.python.org/3/tutorial/datastructures.html

# PYTHON — Functions, contracts, and small tests

Small functions turn one-off scripts into reusable, explainable engineering tools.

A function packages one coherent operation behind a name. Its parameters describe what the operation needs, and its return value carries a result to the caller. Printing is different: it displays something for a human but usually does not give the next calculation a usable result. Start with functions whose outputs depend only on their explicit inputs. They are easier to test because they do not quietly read an old global variable or change a file. Write a short contract stating units, allowed inputs, output meaning, and failure behavior. That description is often more valuable than an extra line of clever code.

Test a function at several kinds of point. A simple example can verify basic arithmetic; a boundary checks the edge of the contract; an invalid input checks whether failure is deliberate. For floating-point results, exact equality is not always the right test because many decimal fractions are represented approximately. Compare using a tolerance that makes sense for the question, not an arbitrary number of printed decimals. Separate software test tolerance from physical measurement uncertainty. A test that passes only establishes the tested behavior; it does not establish that a scientific model is appropriate for every use.

Keep functions small enough that you can explain their state and decisions without reading a long file. A function that converts units should not also prompt for text, draw a chart, and save a report. Compose those activities in a script that coordinates them. Reuse your tested conversion in several contexts to see why returning a value matters. This module needs the earlier arithmetic and branching concepts, not advanced mathematics. It becomes the foundation for data cleaning, numerical model functions, command-line tools, and later callbacks in simulation frameworks. Aim for readable boundaries between tasks before adopting classes or complicated design patterns.

## Example

```
import math

def kelvin(celsius):
    if not math.isfinite(celsius) or celsius < -273.15:
        raise ValueError("Expected a finite temperature at or above absolute zero")
    return celsius + 273.15

assert math.isclose(kelvin(0.0), 273.15)
assert math.isclose(kelvin(-273.15), 0.0, abs_tol=1e-12)
```

A pure conversion rejects values outside its numerical and physical domain. Its numeric-input contract is explicit.

## Start: Return a conversion

Write minutes_to_seconds(value) that returns the conversion. Use its result in an energy calculation instead of only printing it.

Input: 2 minutes; 5 W

Expected: 120 seconds and 600 J

Hints:
- Return value * 60.
- Assign the returned value to a name.

Worked reasoning: The conversion returns 120, which the caller multiplies by 5. A print-only function would return None and break the multiplication.

Tests:
- 0 minutes returns 0.
- 0.5 minutes returns 30.

Extension: Add a documented nonnegative-input rule.

## Build: A checked average

Write a function returning the average of a nonempty list and raising ValueError for empty input. Do not modify the argument.

Input: [3, 6, 9] and []

Expected: 6.0; ValueError

Hints:
- Check length before dividing.
- A copy is unnecessary when only reading.

Worked reasoning: Reject empty input, then return sum(values)/len(values). The function has one result type for valid inputs and an explicit error for invalid input.

Tests:
- A one-element list returns that value.
- The original list stays unchanged.

Extension: Decide how non-finite values should be handled.

## Stretch: Test a linear calibration

Implement calibrated(raw, slope, offset) = slope*raw + offset. Write tests that would detect swapping slope and offset.

Input: raw=10, slope=0.5, offset=-2

Expected: 3.0

Hints:
- Use a case where slope and offset are unequal.
- Test raw=0 to isolate the offset.

Worked reasoning: The main result is 0.5*10-2=3. Tests at raw=0 should yield -2, and raw=2 should yield -1. These cases expose several plausible implementation mistakes.

Tests:
- raw=0 gives offset.
- Increasing raw by 2 increases output by 1.

Extension: State the calibration input and output units.

## Debug: Hidden global input

A function def energy(power): return power * duration uses a global duration. Refactor it so its inputs are explicit and independent calls can use different durations.

Input: power 4 W; durations 10 and 20 s

Expected: 40 J and 80 J

Hints:
- Add duration as a parameter.
- Do not rely on changing a global before each call.

Worked reasoning: Define energy(power_w, duration_s) and return their product. Each call now expresses the full numerical problem.

Tests:
- Calling one duration does not change later calls.
- Zero power returns zero for finite durations.

Extension: Add validation for nonnegative finite inputs.

## Recall

Why return a value rather than print it inside a calculation?

The caller can test, combine, save, or display a returned result without capturing console output.

What makes a good boundary test?

It targets the exact edge of the written contract, such as zero duration or absolute zero, and states the intended inclusion rule.

Sources:
- Python function definitions: https://docs.python.org/3/tutorial/controlflow.html#defining-functions
- Python math.isclose: https://docs.python.org/3/library/math.html#math.isclose

# PYTHON — Records, dictionaries, and data meaning

A bare number cannot tell you which sensor, time, unit, or quality flag produced it.

A dictionary associates keys with values. Use it to represent a small record such as a sensor reading containing time_s, sensor_id, temperature_c, and quality. This is more informative than a positional list whose third item must be remembered by convention. Choose a consistent schema: which keys are required, what each value means, and which values are allowed. A record is not valid merely because Python can store it. For example, a timestamp string where a numeric duration is expected can pass through several unrelated operations before causing a confusing error far from its source.

Distinguish an absent key from a key whose value is explicitly missing. The difference can indicate an old file format versus a measurement that was attempted but unavailable. Dictionary access with square brackets is useful when a required key must exist; get is useful when a documented default is appropriate. Avoid defaults that conceal a broken schema. Grouping records by sensor or experiment lets you compute separate summaries, but preserve enough identity to trace an unexpected result back to its origin. A cleaned value should still be connected to the original record or an explanation of how it changed.

Mutability adds a second responsibility. If two names refer to the same dictionary, changing it through one name affects what the other sees. A shallow copy separates the outer dictionary but does not recursively duplicate nested objects. Prefer simple records and transformations that create new outputs when that makes provenance clearer. This module needs no new mathematics; it extends your understanding of collections and functions. These habits prepare you for JSON configurations, CSV rows, structured logs, and messages exchanged between robot components. Start with a handful of explicit keys rather than designing a general database before you know the data.

## Example

```
reading = {"sensor_id": "bay_A", "time_s": 12.0, "temperature_c": 24.5}
summary = f"{reading['sensor_id']} at {reading['time_s']} s"
print(summary)
```

The dictionary preserves the identity and timestamp needed to interpret the temperature.

## Start: Read a named field

From each record, print the sensor ID and its temperature with units. Use key names, not dictionary position.

Input: [{sensor_id: "A", temperature_c: 20}, {sensor_id: "B", temperature_c: 22}]

Expected: A: 20 °C; B: 22 °C

Hints:
- Iterate through records.
- Access fields by their exact keys.

Worked reasoning: For each record, read sensor_id and temperature_c. Key-based access preserves meaning even if the fields were inserted in another order.

Tests:
- Reverse field insertion order.
- An absent required field must not silently become zero.

Extension: Add time_s to each output line.

## Build: Group independent sensors

Calculate a mean for each sensor from a list of records. Keep sensor A and B separate.

Input: A:20, B:30, A:24

Expected: A:22; B:30

Hints:
- Build a dictionary of lists or totals/counts.
- Divide each sensor total by its own count.

Worked reasoning: A has total 44 from two readings; B has total 30 from one. A global mean would answer a different question.

Tests:
- One sensor with one reading returns that reading.
- Record order should not change the grouping.

Extension: Return each count alongside the mean.

## Stretch: Detect schema disagreement

Validate that every record contains sensor_id, time_s, and temperature_c. Report missing field names with the record index.

Input: Record 0 has all fields; record 1 lacks time_s

Expected: One issue: record 1 missing time_s

Hints:
- Compare a set of required keys with record keys.
- Keep validation output separate from cleaned data.

Worked reasoning: Compute required - record.keys() for each record. Sort field names when formatting output so reports are deterministic. Do not invent a timestamp.

Tests:
- A complete record gives no issue.
- A record missing two fields reports both.

Extension: Add a schema_version field and document migration rules.

## Debug: Aliased configuration

Explain why original changes after working = original; working["offset"] = 5. Preserve the original flat configuration instead.

Input: original = {"offset": 0, "scale": 1}

Expected: Original offset remains 0; working offset becomes 5

Hints:
- Assignment does not clone the object.
- For this flat dictionary, copy() is enough.

Worked reasoning: Use working = original.copy(). The outer records are now distinct. If values were nested mutable objects, this would still be a shallow copy.

Tests:
- Check both dictionaries after modification.
- Add a nested list to demonstrate the shallow-copy limit.

Extension: Prefer immutable settings or deliberate deep copying only when the model needs it.

## Recall

What does a data schema provide?

A shared contract for required fields, types, units, allowed values, and missing-data behavior.

Why preserve sensor identity through cleaning?

An anomalous summary can then be traced back to the device, time, and transformation that produced it.

Sources:
- Python dictionaries: https://docs.python.org/3/tutorial/datastructures.html#dictionaries

# PYTHON — Files, CSV, and a repeatable data pipeline

CSV exports connect programming to instruments, CAD studies, spreadsheets, and simulators.

A file is a persistent boundary between programs. Treat reading, parsing, validating, computing, and writing as separate stages. The input bytes are not yet trustworthy measurements. A CSV reader handles quoting and delimiters better than splitting every line on a comma, especially when a field itself contains punctuation. Most parsed CSV values initially arrive as text, so convert numeric fields deliberately and report failures with row context. Preserve the source file and write a new output file rather than modifying your only copy while you are still learning what its contents mean.

Paths describe locations, and their interpretation depends on the working directory unless they are absolute. Use pathlib to join path components rather than manually inserting operating-system separators. Prefer a project folder with clearly separated input and generated output. A script that works only when launched from one undocumented directory is difficult to reproduce. Open text files with an explicit encoding when you control the format, and use a context manager so the file is closed consistently. For CSV files, the Python documentation specifies opening with newline="" so the CSV module can handle line endings correctly.

A useful pipeline reports how many rows were read, accepted, rejected, and written. Rejection should have a reason: missing field, unparsable number, non-finite value, or an invalid domain. These counts make it possible to notice when a clean-looking chart represents only a fraction of the experiment. Begin with a tiny invented file whose expected summary you know, then test malformed rows. This module combines earlier records, loops, and functions without new mathematics. The immediate result can be a temperature-log checker, but the same structure can later process parameter sweeps from OpenVSP, simulation histories, or hardware test exports.

## Example

```
import csv
from pathlib import Path

path = Path("data") / "readings.csv"
with path.open(encoding="utf-8", newline="") as handle:
    for row in csv.DictReader(handle):
        print(float(row["time_s"]), float(row["temperature_c"]))
```

Assumes a local CSV with those two headers and valid numeric fields. Add validation before using real exports.

## Start: Three-row file

Create and read a CSV with time_s and temperature_c columns. Compute its mean temperature.

Input: 0,20; 1,22; 2,24 with a header row

Expected: Three records; mean 22 °C

Hints:
- Use a CSV reader.
- Convert temperature strings to floats.

Worked reasoning: The parsed temperatures are 20, 22, 24. Their sum is 66 and count 3. Report both count and mean.

Tests:
- Add a quoted field in a separate notes column.
- An empty file needs a clear no-data result.

Extension: Print the first and last timestamp.

## Build: Rejected rows report

Read rows with temperatures 20, bad, 24. Accept parseable temperatures and report the rejected row without stopping the entire file.

Input: Header on line 1; bad appears on line 3

Expected: Accepted 2; rejected 1; accepted mean 22 °C

Hints:
- Catch conversion errors close to conversion.
- Record the physical line number used in your simple file.

Worked reasoning: The invalid numeric field is excluded with a reason. Average only 20 and 24, while reporting that the result uses two of three rows.

Tests:
- All invalid rows produce no numeric mean.
- A legitimate zero remains accepted.

Extension: Write rejected rows to a separate review CSV.

## Stretch: Portable result folder

Read an input path supplied to a function, write a summary into a separate output directory, and return the generated path. Do not overwrite the input.

Input: data/test.csv; reports/summary.csv

Expected: A new summary with accepted/rejected counts

Hints:
- Create the output directory if needed.
- Use Path composition and explicit text encoding.

Worked reasoning: The analysis function receives paths rather than assuming a user-specific folder. Write a deterministic summary whose contents can be compared with a hand-checked fixture.

Tests:
- Running from a different working directory works when absolute inputs are supplied.
- Input file bytes remain unchanged.

Extension: Add source filename and analysis version to the summary.

## Debug: Text arithmetic failure

A CSV row contains {"temperature_c": "20.5"}. Explain why adding 1.0 fails and where conversion belongs.

Input: "20.5" + 1.0

Expected: 21.5 after explicit numeric conversion

Hints:
- CSV generally yields text fields.
- Separate parsing from downstream calculations.

Worked reasoning: Convert with float at the input boundary, handling ValueError there. Then apply numeric operations to validated records. Repeating conversion throughout the program makes errors harder to explain.

Tests:
- "bad" is rejected with row context.
- "0" converts to 0.0.

Extension: Reject non-finite numeric strings such as "nan" as a separate validation rule.

## Recall

Why use the csv module instead of split(",")?

CSV permits quoting and embedded delimiters; the parser handles those format rules.

Why report accepted and rejected row counts?

They expose data loss and clarify which evidence supports the computed summary.

Sources:
- Python CSV: https://docs.python.org/3/library/csv.html
- Pathlib: https://docs.python.org/3/library/pathlib.html

# PYTHON — Exceptions, debugging, and evidence-based tests

A long-lived engineering tool must explain why it cannot produce a trustworthy result.

An exception is a signal that normal execution could not continue under the current assumptions. Read the final exception type and message, then follow the traceback to the relevant code. A type error, missing file, failed numeric conversion, and invalid physical input are different failures and deserve different responses. Catch a failure where you can add useful context or recover according to a documented policy. Catching every exception and continuing with a zero may produce a smooth report that hides the very event you needed to investigate. During development, unexpected failures should remain visible enough to diagnose.

Debugging is a sequence of experiments. First reproduce the problem with the smallest input you can find. State what should happen and what actually happens. Inspect one relevant value or step through one function, then change one hypothesis at a time. A debugger is useful because it exposes state at a chosen point without requiring many temporary print statements. Do not begin by rewriting the whole program; that destroys the evidence that distinguishes possible causes. Once the cause is understood, add a test that would have failed before the fix and now passes.

A good test checks a public promise rather than copying the implementation line for line. Use hand-computable values, edge cases, invalid input, and relationships such as doubling duration doubling constant-power energy. Keep test data small and clearly labeled. The standard unittest framework can organize tests without adding a dependency, while other frameworks can be learned when a project uses them. This module requires no additional mathematics. It adds a disciplined response to uncertainty: treat an error report as evidence, identify the violated assumption, and show that a targeted change restores the intended behavior.

## Example

```
import unittest

def average(values):
    if not values:
        raise ValueError("No measurements")
    return sum(values) / len(values)

class AverageTests(unittest.TestCase):
    def test_known_values(self):
        self.assertEqual(average([2, 4, 6]), 4)
    def test_empty(self):
        with self.assertRaises(ValueError):
            average([])

if __name__ == "__main__":
    unittest.main()
```

The two tests cover a known result and the function’s explicit empty-input policy.

## Start: Name the failure

Classify three failures: float("bad"), open of a nonexistent file, and 3 + "4". Explain what context a user-facing error should include.

Input: Three independent expressions

Expected: ValueError; FileNotFoundError; TypeError

Hints:
- Separate parsing from file access.
- Do not run a missing-file example on an important path.

Worked reasoning: The conversion has an invalid value, file opening cannot locate its input, and arithmetic combines incompatible types. Include the field or filename, not an unexplained fallback result.

Tests:
- Valid numeric text converts successfully.
- A known fixture file opens.

Extension: Create friendly error messages while preserving the underlying exception for debugging.

## Build: Regression for a missing last item

A sum function loops over values[:-1]. Create a test that reveals the bug, fix it, and add an empty-input test.

Input: [2, 3, 5]

Expected: Correct total 10; buggy total 5

Hints:
- Choose a nonzero final value.
- Test the contract: all supplied items contribute.

Worked reasoning: assertEqual(total([2,3,5]),10) exposes exclusion of the last item. Iterate over the full collection. Decide and test that an empty sum is zero.

Tests:
- [5] returns 5.
- [] returns 0.

Extension: Add a negative contribution and confirm it is not discarded.

## Stretch: Test a relationship

Test constant_power_energy(p,t) using both a hand result and a scaling relationship. Explain why one cannot replace the other.

Input: p=7 W, t=12 s

Expected: 84 J; doubling t doubles output

Hints:
- A relationship can hold for a consistently scaled wrong formula.
- Keep an independent numeric anchor.

Worked reasoning: Check energy(7,12)=84, energy(7,24)=2*energy(7,12), and energy(0,12)=0. A faulty result multiplied by 100 could satisfy the scaling relation but fail the anchor.

Tests:
- Use a fractional duration.
- Reject a negative duration if that is the contract.

Extension: Add a unit-conversion test around the calling pipeline.

## Debug: The silent exception

Repair a parser that catches every exception and returns 0.0. Distinguish legitimate zero from invalid numeric input.

Input: "0", "12.5", "bad"

Expected: 0.0; 12.5; explicit parsing error

Hints:
- Catch ValueError only around float conversion.
- Do not replace an invalid record with a plausible measurement.

Worked reasoning: Return a parsed float for valid strings and raise or record a contextual ValueError for "bad". Unexpected programming errors should not be converted into data.

Tests:
- "0" is accepted.
- "bad" cannot enter the numeric dataset.

Extension: Also reject infinities and NaN after conversion.

## Recall

When should you catch an exception?

When you can recover under a defined policy or add useful context; otherwise let an unexpected failure remain diagnosable.

What is a regression test?

A compact test preserving the expected behavior of a previously broken case so the bug is less likely to return unnoticed.

Sources:
- Python errors and exceptions: https://docs.python.org/3/tutorial/errors.html
- Python unittest: https://docs.python.org/3/library/unittest.html

# PYTHON — Environments, modules, and command-line tools

Future you should be able to rerun a result without remembering a special sequence of clicks.

A project environment records which interpreter and third-party packages a program uses. A virtual environment isolates Python packages for one project from unrelated projects; it is not a security sandbox and does not capture every operating-system dependency. Create one environment for a coherent project, install only the packages it needs, and record how to recreate it. Avoid solving an import error by installing packages into random interpreters until something works. First inspect which interpreter is running the program and which environment the editor has selected. The installation command and execution command should refer to the same environment.

Split reusable logic from the program entry point. A module can hold validated calculations, while a short script parses command-line arguments, calls those functions, and saves results. Use an if __name__ == "__main__" guard so importing a module does not unexpectedly run its command-line workflow. Argument parsing makes inputs visible: an input CSV path, output path, and review threshold should not require editing source code for every run. Help text should say what each argument means, including its units. A default is a policy choice and should be shown or documented rather than hidden.

Reproducibility includes code, inputs, configuration, environment, and interpretation. Saving package versions alone cannot tell you which source file was analyzed or why a threshold was chosen. Keep a small README with one complete command, a tiny test dataset, expected output, and limitations. Test the instructions from a clean terminal session. This module depends on ordinary functions, file handling, and reading terminal output, not new mathematics. It is an early bridge to Bash and Linux: Python performs the analysis while shell commands arrange repeatable runs. A clear interface also makes later automation and collaboration much easier.

## Example

```
import argparse

parser = argparse.ArgumentParser(description="Inspect an example temperature log")
parser.add_argument("input_csv")
parser.add_argument("--threshold-c", type=float, default=30.0)
args = parser.parse_args()
print(args.input_csv, args.threshold_c)
```

Save as inspect_log.py, then run it with a fixture path and an optional --threshold-c value. This example only parses arguments.

## Start: A useful help screen

Create a CLI with an input file argument and --threshold-c float option. Make the help description explain that the threshold flags records for review.

Input: inspect_log.py sample.csv --threshold-c 28

Expected: Input sample.csv; threshold 28.0

Hints:
- Use argparse type=float.
- State Celsius in the option name and help.

Worked reasoning: Parse the arguments in a main function. Printing the parsed values first lets you verify the interface before connecting the analysis.

Tests:
- --help exits with usage text.
- A nonnumeric threshold is rejected by the parser.

Extension: Add an output path argument.

## Build: Import without side effects

Move a mean function into analysis.py and a CLI into run_analysis.py. Importing analysis must not read files or print a report.

Input: A small two-file project

Expected: Import is quiet; CLI performs work

Hints:
- Keep top-level module code limited to definitions and necessary constants.
- Guard the script entry point.

Worked reasoning: The reusable module defines mean. The CLI imports it and calls main only when run as the entry script. Tests can import mean without invoking argument parsing.

Tests:
- Import from a test.
- Run the CLI explicitly.

Extension: Add a test proving that missing CLI arguments do not affect importing the calculation module.

## Stretch: Reproduction manifest

Design a JSON manifest for a data-analysis run containing source filename, code version label, threshold with unit, and interpreter/package information. Explain each field.

Input: One invented telemetry run

Expected: A manifest sufficient to identify the example run, without secrets

Hints:
- A filename alone is weaker than a content hash.
- Capture the actual arguments used, including defaults.

Worked reasoning: Save configuration beside results. Include an input hash when appropriate so a changed file with the same name can be detected. Keep private filesystem paths out of public reports.

Tests:
- Changing threshold changes the manifest.
- Changing input content changes its hash.

Extension: Add a command that writes the manifest automatically.

## Debug: Wrong interpreter investigation

A package imports in one terminal but fails in the editor. Write a diagnostic sequence before installing anything else.

Input: ModuleNotFoundError only in editor

Expected: Identify and align the two interpreter paths

Hints:
- Inspect sys.executable in each context.
- Check the editor interpreter selection.

Worked reasoning: Compare interpreter identities and installed package lists for the intended environment. Select the matching environment, then rerun the same small import test. Do not assume every python command resolves identically.

Tests:
- The terminal and editor report the intended interpreter.
- A clean process imports the dependency.

Extension: Document environment activation and interpreter selection in the README.

## Recall

What does a virtual environment isolate?

The Python environment and installed packages for a project; it does not sandbox arbitrary code or fully capture the operating system.

Why separate a CLI from calculation functions?

Functions stay easy to import and test, while the CLI handles user input, output locations, and execution policy.

Sources:
- Python virtual environments: https://docs.python.org/3/tutorial/venv.html
- Python argparse: https://docs.python.org/3/library/argparse.html

# PYTHON — NumPy arrays, shapes, and broadcasting

Scientific Python and many robotics libraries exchange arrays, so shape mistakes become engineering mistakes.

A NumPy array stores a regular collection of values with an explicit shape and data type. Shape tells you how many entries lie along each axis, but not what those axes mean. Write that meaning down: rows might be timestamps and columns might be sensor channels. An array shaped (100, 3) could represent many different things. Before vectorizing a calculation, solve one row with ordinary Python and confirm the intended result. Element-wise arithmetic, matrix multiplication, and aggregation are different operations. Short syntax is useful only when you can explain the mathematics it expresses.

Broadcasting allows compatible shapes to participate in element-wise operations without explicitly duplicating every value. Comparing dimensions from the trailing end is the useful rule: dimensions are compatible if equal or one. The resulting shape can be larger than you intended. Subtracting a shape-(n,) array from a shape-(n,1) array creates an (n,n) result, not a length-n vector. That may silently change a per-sample calculation into all pairwise combinations. Inspect shape at important boundaries and use assertions or validation when the program depends on a specific arrangement of axes.

Array views may share underlying storage. A basic slice can refer to the original data, so editing the slice can alter the original array. Use a deliberate copy when you need independent values. Data type also affects results: integer arrays cannot represent fractional measurements faithfully if values are stored back into them. This module needs basic algebra and familiarity with lists; matrix theory comes in a later module. It supports sensor calibration, parameter sweeps, image arrays, and simulation histories. Begin with small printed arrays, then scale up once dimensions, units, and ownership of the data are clear.

## Example

```
import numpy as np

raw = np.array([[20.0, 21.0], [22.0, 23.0]])
offset = np.array([0.5, -0.5])
corrected = raw + offset
print(corrected)
print(corrected.shape)
```

Offsets apply per column: [[20.5, 20.5], [22.5, 22.5]], shape (2, 2).

## Start: Calibrate two channels

Add one calibration offset per column to a two-row measurement array.

Input: [[10,20],[12,22]], offsets [1,-2]

Expected: [[11,18],[13,20]]

Hints:
- Rows are samples; columns are channels.
- Use a two-element offset vector.

Worked reasoning: The length-two vector broadcasts across the two rows. Confirm each of the four additions independently.

Tests:
- Zero offsets preserve the original values.
- Input and output both have shape (2,2).

Extension: Use three samples to avoid accidentally confusing row and column counts.

## Build: A mask with a purpose

Use a Boolean mask to select temperatures strictly greater than 25 and compute how many match.

Input: [20.,26.,25.,30.]

Expected: Selected [26.,30.]; count 2

Hints:
- Comparison returns a Boolean array.
- Equality at 25 is excluded.

Worked reasoning: mask = values > 25 produces [False,True,False,True]. Applying the mask selects only qualifying elements. Keep the mask if you need matching timestamps too.

Tests:
- Threshold 30 selects none.
- Apply the same mask to timestamps.

Extension: Return a two-column table of selected times and temperatures.

## Stretch: Axis-aware summaries

For a samples-by-channels array, compute a mean per channel and a mean per sample. Explain the resulting shapes.

Input: [[1.,10.],[3.,14.],[5.,18.]]

Expected: Channel means [3.,14.]; sample means [5.5,8.5,11.5]

Hints:
- Axis 0 collapses rows.
- Axis 1 collapses columns.

Worked reasoning: mean(axis=0) leaves two channel results; mean(axis=1) leaves three sample results. Confirm whether averaging unlike channel units is meaningful before interpreting the second result.

Tests:
- The channel output shape is (2,).
- The sample output shape is (3,).

Extension: Use channels with identical units, then explain why mixed units would invalidate the average.

## Debug: The accidental square matrix

Explain why shapes (3,1) and (3,) subtract to shape (3,3). Correct the inputs for per-sample subtraction.

Input: a=[[1],[2],[3]], b=[1,1,1]

Expected: Desired [0,1,2], not a 3×3 matrix

Hints:
- Broadcasting aligns trailing dimensions.
- Make both arrays shape (3,) or both (3,1).

Worked reasoning: Flatten the intentional column vector to a one-dimensional array or reshape the other operand consistently. The original operation compares every row with every vector element.

Tests:
- Assert the desired output shape.
- Check every value on a three-item fixture.

Extension: Create a test that rejects unintended rank changes.

## Recall

Why is shape alone not enough?

It gives dimensions but not the physical meaning or units of each axis.

When should you copy an array slice?

When the new calculation must be able to modify values independently of the source array.

Sources:
- NumPy broadcasting: https://numpy.org/doc/stable/user/basics.broadcasting.html
- NumPy copies and views: https://numpy.org/doc/stable/user/basics.copies.html

# PYTHON — Plots that expose evidence

A plot is an engineering argument only when its axes, provenance, and limitations are understandable.

A figure helps you see patterns that a table hides, but it can also hide a mistake behind a convincing shape. Start with the question the figure should answer. A time history shows evolution, a scatter plot compares paired quantities, and a residual plot exposes where a model disagrees with observations. Include axis labels and units, distinguish separate data series, and choose limits that make the intended comparison honest. If the horizontal axis is sample index rather than time, say so. Irregularly sampled data cannot be interpreted as uniformly spaced time merely because the rows are evenly spaced in a file.

Matplotlib separates the figure container from axes where data are drawn. The object-oriented pattern makes multi-panel figures easier to manage because each axis has an explicit identity. Keep data preparation outside plotting code so the same validated values can feed both a table and a figure. Save the figure from the script that generated it, and include the input and configuration in a nearby manifest. A beautiful screenshot without the underlying calculation is difficult to update, compare, or audit months later. Prefer readable typography and direct labels over decorative effects that obscure the evidence.

Use markers for measurements and clear lines for model predictions when that distinction matters. Connecting across missing intervals may suggest observations that never occurred, so show or annotate gaps. Do not call a shaded band a confidence interval unless you can explain how it was calculated and what it covers. This module needs basic graph reading and units, not advanced statistics. You will use it for habitat temperatures, rover battery experiments, solver comparisons, and propulsion-related data analysis. A good first figure is small enough that you can verify every plotted point against a printed table.

## Example

```
import matplotlib.pyplot as plt

time_s = [0, 1, 2]
temperature_c = [20, 22, 21]
fig, ax = plt.subplots()
ax.plot(time_s, temperature_c, marker="o", label="Example measurements")
ax.set(xlabel="Time (s)", ylabel="Temperature (°C)")
ax.legend()
fig.tight_layout()
fig.savefig("temperature.png", dpi=160)
```

The saved plot communicates paired time and temperature values, with explicit units and a descriptive legend.

## Start: Label a temperature history

Plot three time-temperature pairs with markers, a line, and units. Verify each point against a table.

Input: Times [0,2,5] s; temperatures [20,21,24] °C

Expected: Points at (0,20), (2,21), (5,24)

Hints:
- Use actual times as x values.
- The final interval is longer than the first.

Worked reasoning: Passing time_s explicitly preserves irregular spacing. Using only temperatures would plot sample positions 0,1,2 and misrepresent elapsed time.

Tests:
- The final x coordinate is 5.
- Both axis labels contain units.

Extension: Save the figure with a descriptive filename.

## Build: Measurement versus model

Plot measured and predicted temperature on the same axes, then plot measured-minus-predicted residuals below.

Input: Measured [20,22,24]; predicted [20,21,23]

Expected: Residuals [0,1,1] °C

Hints:
- Use matching timestamps.
- Subtract prediction from measurement consistently.

Worked reasoning: The comparison shows increasing disagreement after the initial point. Label the residual sign convention. Do not claim the model is valid from only three invented points.

Tests:
- A perfect model produces zero residuals.
- Swapping subtraction reverses signs.

Extension: Add a horizontal zero line in the residual panel.

## Stretch: Show a missing interval

Design a plot that makes a long acquisition gap visible instead of visually implying uninterrupted measurements.

Input: Times [0,1,2,20,21] with five temperatures

Expected: Gap between 2 and 20 s clearly shown or annotated

Hints:
- Markers show actual observation locations.
- Break a line or shade the absent interval.

Worked reasoning: Plot observed points at their actual times. Either avoid connecting across the gap or explicitly annotate the missing interval. Explain the plotting policy in the caption.

Tests:
- No fake samples are added.
- The full 21-second span is visible.

Extension: Make the gap threshold an analysis setting.

## Debug: Mismatched x and y

A chart has four timestamps and three temperatures. Diagnose the problem rather than truncating whichever list is longer.

Input: Times [0,1,2,3]; values [20,21,22]

Expected: An explicit pairing error until provenance is resolved

Hints:
- A point requires one x and one y.
- Silent truncation can hide a dropped sample.

Worked reasoning: Trace how the lists were created and determine which timestamp lacks a measurement. Preserve pairing in records or apply identical masks to both arrays.

Tests:
- Length mismatch is detected before plotting.
- A valid fixture plots all pairs.

Extension: Represent missing values deliberately and show them in the data-quality report.

## Recall

Why show residuals separately?

They reveal the pattern and scale of model disagreement that may be difficult to see on the main signal plot.

Why save a plotting script as well as an image?

It preserves a repeatable route from input data and settings to the figure.

Sources:
- Matplotlib quick start: https://matplotlib.org/stable/users/explain/quick_start.html

# PYTHON — Data quality, uncertainty, and honest summaries

The strongest computation cannot rescue measurements whose limitations are hidden.

Data quality is a set of questions, not a single cleanup button. Are timestamps ordered? Are units consistent? Are all required fields present? Are values finite? Are there duplicates, gaps, or known instrument states that affect interpretation? Write a report before deciding what to remove. An outlier can be a genuine event, a transcription error, or an instrument problem. Automatically deleting anything far from the mean risks removing the phenomenon you hoped to observe. Keep raw data intact and record each transformation so you can revisit an early decision when new evidence appears.

A summary should reveal its population. Report how many observations contributed, which interval they cover, and why others were excluded. A mean is sensitive to extreme values; a median answers a different question about the middle of the ordered sample. Standard deviation describes spread under a particular calculation convention, while uncertainty in a measurement or estimate requires additional assumptions. Do not label every spread statistic as sensor accuracy. Basic probability and statistics will deepen this topic; at this stage, compute simple examples by hand and explain exactly which numerical definition you used.

Missing and non-finite values require explicit policies. NaN has unusual comparison behavior, and infinity can dominate arithmetic even when a conversion to float succeeded. Validate finiteness at the appropriate boundary, then decide whether an invalid record stops the analysis or enters a rejected-records report. Interpolation can be useful for a defined model, but it creates an estimate, not a new observation. This module builds on arrays and file pipelines. It is directly useful for rover telemetry and habitat sensing, while its central habit transfers to every specialty: preserve the difference between what was measured, what was inferred, and what remains unknown.

## Example

```
import math

raw = [20.0, float("nan"), 22.0, float("inf")]
valid = [value for value in raw if math.isfinite(value)]
print({"accepted": len(valid), "rejected": len(raw)-len(valid), "mean_c": sum(valid)/len(valid)})
```

The example accepts two finite values and reports mean 21 °C, while explicitly reporting two rejected entries.

## Start: Finite is a separate condition

Classify each parsed value as finite or non-finite, preserving zero as valid.

Input: [0.0, 20.0, NaN, +Infinity, -Infinity]

Expected: Two finite; three non-finite

Hints:
- Use math.isfinite or the array equivalent.
- NaN is not handled like an ordinary threshold value.

Worked reasoning: Finiteness must be tested explicitly after conversion. The two finite values are 0 and 20; neither absence nor infinity should silently become zero.

Tests:
- Zero is accepted.
- Both infinity signs are rejected.

Extension: Produce rejection reasons with original row indices.

## Build: Mean and median disagree

Compute mean and median, then explain what each says about a dataset with one unusually large observation.

Input: [20,21,21,22,100]

Expected: Mean 36.8; median 21

Hints:
- Sort values for the median.
- Do not delete 100 merely because it is large.

Worked reasoning: The total 184 divided by five gives 36.8. The middle sorted value is 21. Investigate whether 100 is an event, error, or another operating regime before selecting a policy.

Tests:
- Without 100, mean is 21.
- The original data remain available.

Extension: Write two possible physical explanations and the evidence needed to distinguish them.

## Stretch: Duplicate timestamps

Detect duplicate timestamps and design a policy that preserves conflicting measurements for review.

Input: (0,20),(1,21),(1,25),(2,22)

Expected: Duplicate time 1 with conflicting values 21 and 25

Hints:
- Group before deciding which row to retain.
- Keeping the last row is a policy, not a universal truth.

Worked reasoning: Report the duplicate group with source rows. If the file represents retries, a documented later-value rule may apply; if it represents separate sensors, identity may be missing. Resolve semantics first.

Tests:
- Identical duplicate values still count as duplicates.
- Distinct sensor IDs can make equal timestamps legitimate.

Extension: Add sensor identity to the duplicate key.

## Debug: Averages diluted by placeholders

A script replaces a missing temperature with zero before averaging. Explain the bias using the fixture and correct the summary.

Input: [20, None, 22]

Expected: Mean of observed values 21; observed count 2; missing count 1

Hints:
- Zero would add a fictional observation.
- Report missingness separately.

Worked reasoning: The incorrect average is 14 because it divides 42 by three. The observed-data average is 42/2=21. This does not prove the missing reading would have matched the others.

Tests:
- A genuine measured 0 must still contribute.
- All-missing input returns no numeric average.

Extension: Analyze whether missingness occurs more often during a particular operating condition.

## Recall

Why is an outlier not automatically an error?

It may be a real event, a different regime, or an acquisition problem; its cause requires evidence.

What is the difference between an interpolated value and a measurement?

Interpolation is a model-based estimate between observations and should retain that label and its assumptions.

Sources:
- Python finite-value checks: https://docs.python.org/3/library/math.html#math.isfinite
- NumPy nanmean reference: https://numpy.org/doc/stable/reference/generated/numpy.nanmean.html

# PYTHON — Linear algebra and coordinate thinking

Vectors and matrices connect Python to mechanics, calibration, robotics, and thermal networks.

A vector groups related numbers, while a matrix describes a mapping or a collection of coefficients. Neither notation alone specifies units or coordinate frames. Before computing, state what each entry represents. For a two-axis position, are the components measured in the room frame, the robot frame, or the camera frame? A numerically correct transformation can be physically wrong if the frame convention is reversed. Begin with two-dimensional examples that you can sketch. This module assumes introductory vectors, matrix multiplication, and simultaneous linear equations; if those ideas are new, study them alongside the programming rather than memorizing array syntax.

For a square linear system A x = b, use a solver rather than explicitly computing an inverse just to multiply by b. Then inspect the residual A x - b. A small residual shows that the computed solution approximately satisfies the supplied equations; it does not establish that the equations are well conditioned or physically correct. Nearly dependent equations can make the solution sensitive to small changes in the inputs. Use deliberately simple systems first, then perturb one coefficient or measurement and observe the response. Sensitivity is part of the result, not an inconvenient detail to hide.

Matrix multiplication uses the @ operator for NumPy arrays, while * multiplies corresponding entries. Keep vectors consistently shaped and check expected output dimensions. For coordinate rotations, verify an identity rotation, a right-angle rotation, and preservation of vector length before using arbitrary angles. Trigonometric functions take radians, so make degree-to-radian conversion explicit. This work supports motion analysis, parameter estimation, and robot geometry, but the examples remain mathematical exercises rather than operational navigation software. The durable skill is being able to state the mathematical mapping, implement it, and test properties that should remain true.

## Example

```
import numpy as np

A = np.array([[2.0, 1.0], [1.0, 3.0]])
b = np.array([5.0, 5.0])
x = np.linalg.solve(A, b)
print(x)
print(A @ x - b)
```

The solution is [2,1] with a residual near zero, subject to floating-point arithmetic.

## Start: Solve two equations

Solve 2x+y=5 and x+3y=5 with a linear solver, then calculate the residual.

Input: A=[[2,1],[1,3]], b=[5,5]

Expected: x=2, y=1; residual approximately [0,0]

Hints:
- Arrange coefficients consistently with unknown order.
- Use A @ solution to reconstruct b.

Worked reasoning: Substitution confirms 2*2+1=5 and 2+3*1=5. The residual checks the implementation against the supplied system.

Tests:
- Reverse equation order consistently and retain the solution.
- A singular matrix should produce an explicit failure.

Extension: Perturb b slightly and compare the change in x.

## Build: A planar rotation

Rotate vector [1,0] counterclockwise by 90 degrees using the standard 2D rotation matrix.

Input: theta=pi/2; vector [1,0]

Expected: Approximately [0,1]

Hints:
- Rows are [cos,-sin] and [sin,cos].
- Use radians in trigonometric functions.

Worked reasoning: The result is [cos(pi/2),sin(pi/2)], numerically near [0,1]. Test with a tolerance because cosine may not be exactly zero.

Tests:
- Zero angle preserves the vector.
- Vector length remains one.

Extension: Rotate [2,1] and draw the original and transformed vectors.

## Stretch: Sensitivity experiment

Compare two almost dependent equations, then perturb the second right-hand side. Explain why the solution changes strongly.

Input: x+y=2; x+1.001y=2.001, then second RHS=2.002

Expected: First [1,1]; perturbed approximately [0,2]

Hints:
- Subtract the first equation from the second.
- A 0.001 coefficient isolates y.

Worked reasoning: Subtracting gives 0.001y=0.001 or 0.002. The small RHS change doubles y and shifts x. A small residual can occur in both cases despite high sensitivity.

Tests:
- Check residuals for both solutions.
- Compare with a clearly independent system.

Extension: Compute and interpret a matrix condition number after studying its definition.

## Debug: Element-wise product confusion

A program uses A * x where it intended A @ x. Explain the shape and meaning of each result.

Input: A=[[1,2],[3,4]], x=[10,20]

Expected: Matrix product [50,110]

Hints:
- Element-wise multiplication broadcasts across columns.
- Each matrix-product output is a row dot product.

Worked reasoning: A*x gives [[10,40],[30,80]], shape (2,2). A@x sums each row’s pairwise products to [50,110], shape (2,).

Tests:
- Assert the expected output shape.
- Check the first row by hand.

Extension: Write a contract stating the physical meaning of A and x.

## Recall

What does a linear-system residual tell you?

How closely the computed solution satisfies the supplied equations, not whether the model is accurate or insensitive to input errors.

Why track coordinate frames?

The same component values mean different physical directions in different frames; mixing conventions can create a plausible but incorrect result.

Sources:
- NumPy linear solve: https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html
- NumPy matrix multiplication: https://numpy.org/doc/stable/reference/generated/numpy.matmul.html

# PYTHON — Numerical integration and sampling

Power logs become energy estimates; flow-rate histories become totals only after time is handled correctly.

Integration accumulates a rate over an interval. For a constant rate, multiplication is enough; for varying sampled data, you need a rule connecting the samples. The trapezoidal rule assumes a straight line between neighboring values and sums the area under those line segments. Each interval uses its own width, so actual timestamps matter. Multiplying every sample by one nominal time step can be wrong when sampling is irregular or when the number of intervals is confused with the number of points. Draw three points and their two trapezoids before calling a library function.

Numerical error and measurement error are different. A finer grid can reduce approximation error for a smooth known function, but it does not repair a biased sensor or reveal dynamics that were never sampled. Interpolating more points between existing observations also does not create new information. When working with an analytic test function, compare results across progressively finer grids and against the exact integral. When working with measurements, discuss sampling gaps, possible unobserved variation, and how the interpolation assumption affects the estimate. A convergence table is often more informative than one impressive-looking number.

Check dimensions as part of every integral. Watts integrated over seconds yield joules; integrating a Celsius temperature trace does not directly yield energy. The formula must represent the physical quantity you want. This module assumes introductory calculus, especially area and the meaning of a rate. If calculus is still ahead, start with constant and piecewise-linear examples that can be checked geometrically. NumPy provides trapezoidal integration for sampled arrays, but the programming skill is choosing and validating the inputs. The technique supports battery experiments, thermal testing, and many propulsion-analysis datasets without requiring you to design any operational system.

## Example

```
import numpy as np

time_s = np.array([0.0, 2.0, 5.0])
power_w = np.array([10.0, 14.0, 14.0])
energy_j = np.trapezoid(power_w, x=time_s)
print(energy_j)
```

Two trapezoids contribute 24 J and 42 J, for 66 J under the piecewise-linear assumption.

## Start: Constant power rectangle

Integrate constant 8 W power from 0 to 10 seconds using three sample points. Verify against a rectangle.

Input: Times [0,5,10]; power [8,8,8]

Expected: 80 J

Hints:
- Two intervals each last five seconds.
- Trapezoids of equal height are rectangles.

Worked reasoning: Each interval contributes 8*5=40 J. Their sum is 80 J, identical to constant power multiplied by total duration.

Tests:
- Adding a midpoint does not change the answer.
- Zero power gives zero energy.

Extension: Convert the answer to Wh.

## Build: Irregular power samples

Integrate the example using actual interval widths, then compare with the incorrect assumption that both intervals last two seconds.

Input: Times [0,2,5]; power [10,14,14]

Expected: Correct 66 J; incorrect equal-width result 52 J

Hints:
- Average each interval’s endpoint powers.
- The second interval lasts three seconds.

Worked reasoning: First interval: (10+14)/2*2=24. Second: (14+14)/2*3=42. The equal-width assumption loses 14 J.

Tests:
- The reported total duration is five seconds.
- A strictly decreasing time sequence is rejected or explicitly interpreted.

Extension: Report gaps larger than a configurable threshold before integration.

## Stretch: A convergence table

Approximate the integral of t² from 0 to 1 using trapezoids with 1, 2, and 4 equal intervals. Compare with 1/3.

Input: f(t)=t², interval [0,1]

Expected: 0.5; 0.375; 0.34375

Hints:
- Generate n+1 points for n intervals.
- Compute absolute error against 1/3.

Worked reasoning: The errors shrink from 1/6 to 1/24 to 1/96. This smooth example demonstrates decreasing discretization error, not a universal guarantee for arbitrary measured data.

Tests:
- Four intervals use five sample points.
- Each approximation exceeds the exact integral here.

Extension: Plot error versus interval width on logarithmic axes and explain the observed slope.

## Debug: Wrong units, plausible number

A report integrates temperature in °C over seconds and labels the result joules. Explain what is missing.

Input: A temperature-time curve only

Expected: Integral units are °C·s, not J

Hints:
- Track units through the mathematical operation.
- Energy needs an appropriate physical model.

Worked reasoning: The computed area does not directly represent energy. A thermal model might require heat capacity, mass, heat flow, and reference states depending on the question. Change the label or formulate a justified energy calculation.

Tests:
- Every output label agrees with dimensional analysis.
- Model parameters have stated units.

Extension: Compare integrating power with estimating stored thermal-energy change under a constant heat-capacity model.

## Recall

Why pass timestamps to sampled-data integration?

Interval widths may be unequal; the integral must account for the actual spacing.

Does resampling a sparse log onto a fine grid improve the evidence?

No. It can change a numerical representation but does not supply measurements of unobserved behavior.

Sources:
- NumPy trapezoid: https://numpy.org/doc/stable/reference/generated/numpy.trapezoid.html

# PYTHON — Differential equations and model verification

Dynamic models connect programming with thermal systems, motion, and control courses.

An ordinary differential equation describes a rate of change from the current time and state. An initial-value problem also specifies where the system starts. For a simple cooling model, dT/dt = -(T - T_ambient)/tau, the state is temperature, tau is a positive time constant, and the surroundings are assumed constant. This is a lumped model with one temperature, not a complete thermal simulation of a spacecraft or habitat. Before coding, explain the assumptions and check units: dividing a temperature difference by seconds produces the required temperature rate.

A numerical solver repeatedly evaluates your rate function and approximates the evolving state. The times requested for output are not necessarily the internal steps selected by an adaptive solver. Solver tolerances control an estimate of numerical error, not physical model accuracy. Always inspect whether the solver reports success. Then compare with a hand-checkable special case or known exact solution. For this cooling model, T(t) = T_ambient + (T_initial - T_ambient) exp(-t/tau). The exact expression gives a valuable independent reference for the software implementation.

Begin with one state and avoid adding complexity until the model passes basic checks. If the initial temperature equals ambient, the solution should remain constant. If it starts above ambient with positive tau, it should approach ambient without crossing in this ideal model. At one time constant, the remaining difference is about 36.8% of the initial difference. This module assumes calculus and introductory differential equations; it can wait until coursework supports it. Its purpose is not to make every learner use a solver immediately, but to show how programming becomes a laboratory for mathematical understanding and careful model verification.

## Example

```
import numpy as np
from scipy.integrate import solve_ivp

ambient_c, tau_s = 20.0, 30.0
def rate(t, state):
    return [-(state[0] - ambient_c) / tau_s]

result = solve_ivp(rate, (0.0, 60.0), [40.0], t_eval=[0.0,30.0,60.0], rtol=1e-8, atol=1e-10)
if not result.success:
    raise RuntimeError(result.message)
print(result.y[0])
```

Expected approximately [40, 27.357589, 22.706706] °C for this ideal first-order model.

## Start: Equilibrium is a test

Predict and simulate the cooling model when initial and ambient temperatures are equal.

Input: Initial 20 °C; ambient 20 °C; tau 30 s

Expected: Constant 20 °C

Hints:
- The temperature difference is zero.
- The derivative should therefore be zero.

Worked reasoning: The exact solution is constant. A changing result suggests an incorrect rate equation, state index, or parameter handling.

Tests:
- Evaluate the derivative directly at equilibrium.
- Check all output temperatures against 20.

Extension: Test several positive time constants.

## Build: One time constant

Calculate and simulate temperature after one time constant for the example initial condition.

Input: Initial 40 °C; ambient 20 °C; tau 30 s; t=30 s

Expected: Approximately 27.357589 °C

Hints:
- The remaining difference is 20*exp(-1).
- Compare numerical and exact values.

Worked reasoning: 20 + 20/e gives the expected temperature. The removed difference is about 63.2%, not the fraction remaining.

Tests:
- At t=0 the answer is 40.
- Increasing time approaches 20.

Extension: Repeat with an initial temperature below ambient and explain the direction of change.

## Stretch: Euler step experiment

Implement forward Euler for the same equation with steps of 15, 5, and 1 second, comparing T(30) against the exact value.

Input: T0=40; ambient=20; tau=30

Expected: Euler gives 25 at dt=15; finer steps approach 27.357589

Hints:
- Update using the old state derivative.
- Use exactly 30/dt steps.

Worked reasoning: For dt=15 the difference is multiplied by 0.5 twice, leaving 5 °C and T=25. Smaller steps reduce error for this case. Record a table rather than assuming smaller is always sufficient.

Tests:
- The equilibrium test stays constant.
- Every run ends at exactly 30 seconds.

Extension: Investigate a deliberately too-large step and explain numerical overshoot without interpreting it as physical behavior.

## Debug: The warming cooling model

The implemented derivative is +(T-ambient)/tau. Explain the observed behavior for T above ambient and correct the sign.

Input: T=40; ambient=20; tau=30

Expected: Correct initial rate -2/3 °C/s

Hints:
- Cooling requires a negative derivative above ambient.
- Check the derivative before running the solver.

Worked reasoning: The positive sign amplifies the difference instead of reducing it. Use -(T-ambient)/tau. At the given state the rate is -20/30.

Tests:
- Above ambient gives a negative rate.
- Below ambient gives a positive rate.

Extension: Write sign-property tests for the rate function.

## Recall

What does an ODE solver’s tolerance describe?

Its numerical error-control target, not uncertainty in physical parameters or validity of the model.

Why is an exact solution useful?

It provides an independent reference for detecting implementation and numerical errors in a controlled test problem.

Sources:
- SciPy solve_ivp: https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html

# PYTHON — Model fitting, residuals, and prediction limits

Calibration and experiment analysis require more than drawing a curve through points.

Fitting chooses model parameters that make predictions agree with observations according to a stated objective. For a linear calibration y = a x + b, the parameters are slope and offset. Least squares minimizes the sum of squared residuals under the chosen setup. It does not establish that the model is physically correct, that the input values are exact, or that every observation deserves equal weight. Write down the residual sign convention and identify which quantity is treated as the predictor. A visually good fit can still be misleading if the model’s assumptions conflict with the experiment.

Separate fitting from evaluation. A model can reproduce the data used to estimate it while performing poorly on new observations. Hold back appropriate data or compare against an independently motivated test when possible. Time-series data require particular care because randomly shuffling adjacent observations can make evaluation unrealistically easy. Inspect residuals versus input and time: a pattern may indicate missing physics, changing calibration, or correlated error. More parameters almost always offer more flexibility, but flexibility alone is not improved scientific explanation. Prefer the simplest model that answers the question with acceptable, documented limitations.

Distinguish interpolation from extrapolation. A calibration observed between two input values has direct evidence inside that range; predictions far beyond it depend more heavily on assumptions. Record the fitted domain and reject or flag out-of-domain uses according to the application. This module assumes algebra and introductory statistics, with linear algebra helpful for understanding the solver. Begin with a line whose answer can be checked exactly, then add controlled noise and inspect how estimates change. The techniques apply to sensors, thermal experiments, and published engineering datasets, but fitted coefficients should not be promoted to operational settings without appropriate domain review and validation.

## Example

```
import numpy as np

x = np.array([0.0, 1.0, 2.0])
y = np.array([1.0, 3.0, 5.0])
A = np.column_stack([x, np.ones_like(x)])
parameters, *_ = np.linalg.lstsq(A, y, rcond=None)
slope, offset = parameters
print(slope, offset)
print(y - A @ parameters)
```

The exact line has slope 2 and offset 1; floating-point residuals should be near zero.

## Start: Recover a known line

Fit slope and offset for three exact points and check an unused point on the same constructed line.

Input: (0,1),(1,3),(2,5); test x=1.5

Expected: Slope 2; offset 1; prediction 4

Hints:
- Construct columns x and ones.
- Check the answer by substitution.

Worked reasoning: The line y=2x+1 exactly explains the fixture. The unused point tests implementation consistency, but because it is constructed from the same equation it is not independent physical validation.

Tests:
- At x=0 output equals offset.
- Residuals are near zero.

Extension: Add small controlled perturbations and compare parameter changes.

## Build: Residual pattern

Compare y=x² data with the candidate model y=x over x=0,1,2,3. Plot and interpret residuals.

Input: Observed [0,1,4,9]; predicted [0,1,2,3]

Expected: Residuals [0,0,2,6]

Hints:
- Use observed minus predicted.
- Look for structure rather than only total error.

Worked reasoning: Growing positive residuals show systematic underprediction at larger x. The pattern suggests the candidate relationship is missing curvature on this constructed dataset.

Tests:
- Use consistent residual sign.
- Show input values on the residual plot.

Extension: Compare with the exact quadratic and explain why that is expected for this fixture.

## Stretch: A calibration domain guard

Implement a predictor that records the calibration interval [0,2] and flags rather than silently accepts x=5.

Input: Model y=2x+1; domain [0,2]; queries 1 and 5

Expected: x=1 predicts 3 in-domain; x=5 is flagged out-of-domain

Hints:
- Check the query against the observed interval.
- A numeric answer can exist without evidence supporting it.

Worked reasoning: Return an explicit domain status with the prediction or raise a documented error. If showing 11 for x=5, label it an extrapolation rather than a validated calibration result.

Tests:
- Endpoints 0 and 2 are in-domain.
- Negative inputs are flagged.

Extension: Store the interval and fitting dataset ID with the coefficients.

## Debug: Evaluation leakage

A report estimates a model using every row and calls its error on those same rows a test error. Correct the claim and propose a stronger evaluation.

Input: One dataset reused for fitting and scoring

Expected: Reported value is fitting/training error

Hints:
- Ask which observations influenced the parameters.
- Keep evaluation appropriate to data dependence.

Worked reasoning: Rename the result accurately and reserve appropriate independent observations or a later experiment for evaluation. For time series, consider chronological separation and changing conditions.

Tests:
- Document which rows were used for fitting.
- Do not tune repeatedly on the final evaluation set.

Extension: Write a small evaluation plan before collecting more data.

## Recall

What is a residual?

A difference between an observation and a model prediction, with an explicitly stated sign convention.

Why record the calibration domain?

It distinguishes predictions supported by observed inputs from extrapolations that rely more strongly on assumptions.

Sources:
- NumPy least squares: https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html
- SciPy optimization tutorial: https://docs.scipy.org/doc/scipy/tutorial/optimize.html

# PYTHON — State machines, timestamps, and stale data

Autonomous systems are coordinated behaviors, not just calculations on fresh ideal data.

A state machine describes which situation a component is in and how events change that situation. For a simulated inspection process, states might include waiting, ready, inspecting, and review_required. Write allowed transitions as a table before implementing them. A transition should specify the current state, relevant event or condition, next state, and any output. This is easier to test than a collection of unrelated Boolean flags whose combinations may be contradictory. Keep this exercise entirely in software: the goal is to learn behavior modeling before connecting anything to real machinery.

Information has an age. A value can be numerically plausible while being too old for the task. Distinguish source timestamps from local arrival times and do not subtract unrelated clock domains. For measuring elapsed local time, a monotonic clock avoids problems caused by wall-clock adjustments. Inject the current time into your decision function during testing so you can simulate exact ages without waiting. The stale boundary must be explicit: if data become stale only after two seconds, age equal to two remains fresh under that definition. Include missing and future timestamps in the contract.

Python is useful for prototyping supervisory logic, replaying messages, and testing behavior, but a Python script on a general-purpose computer does not automatically provide hard real-time guarantees. A polling interval is not a promise about worst-case execution. Separate the decision logic from the message transport or simulator interface so the same function can be tested with recorded events. This module needs logic, functions, and basic elapsed-time arithmetic. It prepares you for ROS 2 concepts such as nodes and messages without requiring a full robotics installation just to learn how a component should react when its inputs are incomplete.

## Example

```
def freshness(now_s, stamp_s, max_age_s=2.0):
    if stamp_s is None:
        return "missing"
    age_s = now_s - stamp_s
    if age_s < 0:
        return "invalid_time"
    return "stale" if age_s > max_age_s else "fresh"

print(freshness(10.0, 8.0))
```

The result is fresh because the stated rule becomes stale only when age is greater than two seconds. Inputs must share a clock domain.

## Start: Age boundary

Classify timestamps using stale when age > 2 seconds, with now=10.

Input: Stamps 9, 8, 7, None

Expected: fresh; fresh; stale; missing

Hints:
- Compute age before comparing.
- Equality follows the written rule.

Worked reasoning: Ages 1 and 2 are fresh; age 3 is stale. Missing is a distinct state and should not be represented by an arbitrary timestamp.

Tests:
- Future stamp 11 is invalid_time.
- Stamp 10 has age zero.

Extension: Validate that now and threshold are finite and threshold is nonnegative.

## Build: Inspection transition table

Implement a software-only state transition: waiting + valid_input → ready; ready + start → inspecting; inspecting + missing_input → review_required. Other events preserve state and report ignored.

Input: Event sequence valid_input, start, missing_input

Expected: waiting → ready → inspecting → review_required

Hints:
- Represent transitions as explicit pairs.
- Do not allow start from waiting implicitly.

Worked reasoning: A dictionary keyed by (state,event) or clear conditional table can implement the transitions. Return both new state and whether a transition occurred.

Tests:
- start while waiting is ignored.
- missing_input during inspecting leads to review_required.

Extension: Define a deliberate reset event rather than automatically resuming.

## Stretch: Replay without sleeping

Test a stream monitor using invented arrival times. Inject now values rather than calling sleep so the test is fast and deterministic.

Input: A sample at t=0; checks at 1,2,3 s; limit 2 s

Expected: fresh, fresh, stale

Hints:
- Time is an input to the decision.
- The test should not wait three real seconds.

Worked reasoning: Call the same pure freshness function with the three now values. A separate runtime adapter can later provide actual monotonic time.

Tests:
- The test gives identical results on repeated runs.
- Exact-boundary coverage is present.

Extension: Replay a second arrival at 2.5 seconds and update the expected results.

## Debug: Mixed clock domains

A program subtracts a device’s seconds-since-boot timestamp from a computer’s Unix timestamp and obtains a huge age. Diagnose the modeling error.

Input: Device stamp 12 s; host wall time near billions of seconds

Expected: Age is not meaningful without clock alignment

Hints:
- The two numbers have different origins.
- Units matching is necessary but insufficient.

Worked reasoning: Use local receipt time for a local freshness policy, or implement and validate a proper clock-alignment method. Keep source time separately for ordering and analysis.

Tests:
- Document each timestamp’s origin.
- Tests reject or avoid mixed-domain subtraction.

Extension: Add clock-domain labels to message metadata.

## Recall

Why inject time into a testable function?

It allows exact, fast, repeatable boundary tests without depending on real waiting or scheduler behavior.

What is a state-machine transition?

A defined change from a current state to a next state in response to a specified event or condition.

Sources:
- Python monotonic clock: https://docs.python.org/3/library/time.html#time.monotonic
- Python enum: https://docs.python.org/3/library/enum.html

# PYTHON — Images as arrays and cautious perception

Perception starts with data representation, coordinate conventions, and tests—not an impressive model name.

An image is an array whose axes and values have conventions. A grayscale image often uses row and column positions; a color image adds a channel dimension. Row indices typically increase downward in displayed images, while a Cartesian sketch may use upward-positive y. Record the convention before reporting coordinates. Pixel values are not automatically physical brightness, temperature, distance, or confidence. Their meaning depends on the sensor and processing pipeline. Begin with a small synthetic array where you know exactly which pixels should be selected, rather than debugging file formats and image processing simultaneously.

A threshold detector labels pixels satisfying a simple rule. You can count selected pixels, calculate their centroid, or bound them with a rectangle. These operations teach useful array reasoning, but they do not establish object identity. Reflections, shadows, exposure changes, and unrelated bright objects can satisfy the same threshold. A detector should be able to report no detection and ambiguity, not always manufacture a position. If no pixels qualify, dividing coordinate sums by zero is both a programming error and a sign that absence was not included in the conceptual design.

Evaluate perception with separate fixtures for intended detections and plausible failures. Keep source images, configuration, and expected outcomes so changes can be compared. A centroid is the mean selected location, which may fall in empty space between two distinct bright regions. Add connected-component reasoning only when the simpler detector’s limitations are understood. This module requires arrays, masks, and averages; advanced computer vision can follow later. It provides an offline bridge toward OpenCV, simulator camera data, and rover inspection tasks while keeping the exercise independent from physical robot actuation or claims of operational reliability.

## Example

```
import numpy as np

image = np.array([[0,0,0], [0,9,9], [0,0,0]])
rows, cols = np.nonzero(image > 5)
if len(rows) == 0:
    print("No detection")
else:
    print({"row": float(rows.mean()), "column": float(cols.mean())})
```

The selected pixels are at (row 1, column 1) and (row 1, column 2); centroid is (1.0, 1.5).

## Start: A tiny mask

Select values strictly above five from a 3×3 image and list their row-column coordinates.

Input: [[0,0,0],[0,9,9],[0,0,0]]

Expected: (1,1) and (1,2)

Hints:
- Python indexing begins at zero.
- Keep row before column when reporting array coordinates.

Worked reasoning: The two values 9 qualify. np.nonzero returns a row-index array and a column-index array that must be paired.

Tests:
- A value equal to five is excluded.
- All-zero input gives no coordinates.

Extension: Draw the selected pixels on a labeled grid.

## Build: A detection record

Return count, centroid, and status from the mask. For no selected pixels, return status none and centroid None.

Input: Two-pixel fixture and all-zero fixture

Expected: count 2, centroid (1,1.5), status detected; count 0, centroid None

Hints:
- Test count before averaging.
- Use explicit absence instead of (0,0).

Worked reasoning: A valid detection at the top-left pixel could be (0,0), so that coordinate cannot double as a no-detection sentinel. Keep status separate from location.

Tests:
- A single selected pixel returns its exact position.
- No division occurs when count is zero.

Extension: Include the threshold and image dimensions in the record.

## Stretch: Ambiguous bright regions

Use bright pixels at columns 0 and 4 on the same row. Explain why their centroid does not locate either region.

Input: Selected coordinates (2,0) and (2,4)

Expected: Centroid (2,2), where no bright pixel exists

Hints:
- An average need not be an observed point.
- Detection count alone does not reveal connectivity.

Worked reasoning: The column mean is (0+4)/2=2. The single-centroid model merges two candidates. Report ambiguity or add a justified component-selection method, then test it independently.

Tests:
- The center pixel remains unselected.
- A one-region fixture still works.

Extension: Study connected components and define an explicit selection policy.

## Debug: Swapped coordinates

A detector finds row=1, column=4 but reports x=1,y=4 on an image overlay. Diagnose the axis confusion.

Input: Array coordinate (1,4)

Expected: Typical image x=4, y=1, with downward-positive y documented

Hints:
- Column usually maps to horizontal position.
- A Cartesian y-up convention needs another transform.

Worked reasoning: Map column to x and row to image y. If converting to another coordinate system, write the transform explicitly instead of silently renaming fields.

Tests:
- Test an asymmetric point, not one on the diagonal.
- Check both image corners.

Extension: Add a coordinate-frame field to the output record.

## Recall

Why is (0,0) a poor no-detection sentinel?

It can be a valid pixel coordinate. An explicit status or None distinguishes absence from a real location.

What can a threshold detector establish?

That pixels satisfy a numeric rule under a stated configuration; object identity and reliability need additional evidence.

Sources:
- NumPy nonzero: https://numpy.org/doc/stable/reference/generated/numpy.nonzero.html
- NumPy beginner arrays: https://numpy.org/doc/stable/user/absolute_beginners.html

# PYTHON — A maintainable engineering tool

A useful project should survive new datasets, a different computer, and your own absence for several months.

A maintainable tool separates the scientific or behavioral core from its surrounding interfaces. The core takes validated values and returns results. Adapters read CSV, receive messages, or write reports. Configuration captures choices such as a review threshold or model time constant. Keeping these boundaries visible means you can test a calculation without a simulator, replace a file reader without rewriting the mathematics, and replay recorded data without connecting hardware. This is a practical architecture principle, not a requirement to create many classes. Start with a few clearly named functions and modules.

Use structured records when they improve clarity. A dataclass can document related fields and generate useful initialization and representation behavior, but type annotations do not automatically validate runtime values. Validate at boundaries and retain units in names or documented schemas. Logging should explain important events: which input was processed, how many records were rejected, whether a solver failed, and where results were written. Avoid logging every numeric loop iteration by default; excessive output can obscure the event that matters. Do not include secrets or private data in public project artifacts merely to make a debugging report complete.

Your completion criterion is a repeatable story. Someone should be able to obtain the code, recreate the environment, run a small fixture, see the expected result, and understand limitations from the README. Include tests for the core and one complete fixture that crosses the read-validate-compute-write path. Record the model assumptions separately from software behavior. This module draws together earlier programming, numerical, and data-quality skills; advanced mathematics is only needed for whichever model you choose. A modest tool with clear evidence, thoughtful failure handling, and reproducible outputs is a stronger long-term portfolio artifact than a sprawling demo you cannot explain.

## Example

```
from dataclasses import dataclass

@dataclass(frozen=True)
class Reading:
    time_s: float
    temperature_c: float

def flagged(reading, threshold_c):
    return reading.temperature_c > threshold_c

sample = Reading(time_s=1.0, temperature_c=31.0)
print(flagged(sample, threshold_c=30.0))
```

The record makes field meaning explicit. Validation of finiteness and time semantics still belongs at the input boundary.

## Start: Draw the boundaries

Split a telemetry script into read_records, validate_records, summarize, and write_report responsibilities. Describe the input and output of each.

Input: A CSV-to-summary workflow

Expected: A clear four-stage interface contract

Hints:
- Keep file paths out of the pure summary function.
- Preserve rejected-record reasons.

Worked reasoning: Reading produces raw records, validation produces accepted/rejected records, summary consumes accepted numerical values, and writing serializes the result. This makes each boundary testable.

Tests:
- Summary works without a filesystem.
- Invalid input cannot bypass validation silently.

Extension: Add a diagram to the README.

## Build: End-to-end golden fixture

Create a three-row fixture with two valid temperatures and one invalid row, then test the full generated report.

Input: 20, bad, 24 °C

Expected: accepted 2; rejected 1; mean 22 °C

Hints:
- Use a temporary output location.
- Compare meaningful fields, not unstable timestamps.

Worked reasoning: Run the public program interface on the fixture, parse its output, and assert the counts and mean. Unit tests still cover boundary behavior inside each stage.

Tests:
- Input remains unchanged.
- Failure reports a nonzero process exit when no valid report can be produced.

Extension: Add one test for an unwritable output location.

## Stretch: A six-month handoff

Write a project handoff containing purpose, setup, one run command, expected fixture output, assumptions, limitations, and extension points.

Input: A completed small analysis project

Expected: Another learner can reproduce the fixture without guessing

Hints:
- Assume the reader has never seen your terminal history.
- Explain which results are simulated or invented.

Worked reasoning: The handoff connects code and evidence. Include a dependency record, input schema, tests, and a known limitation. Ask a peer or your future self to follow it from a clean environment.

Tests:
- The documented command succeeds.
- Every referenced file exists.

Extension: Create a release checklist and a short change log.

## Debug: Annotations mistaken for validation

A Reading dataclass annotates temperature_c: float, but Reading(0, "bad") still constructs an object. Explain why and add boundary validation.

Input: time_s=0; temperature_c="bad"

Expected: A deliberate validation error before numeric analysis

Hints:
- Annotations describe intended types.
- Runtime validation must be implemented or provided by a chosen library.

Worked reasoning: Validate incoming records before constructing the domain object, or implement a carefully defined post-initialization check. Do not assume annotations reject incorrect input at runtime.

Tests:
- A valid finite float is accepted.
- Text and non-finite values follow the documented rejection policy.

Extension: Document static type checking and runtime validation as complementary tools.

## Recall

What belongs in a pure analysis core?

Validated inputs, deterministic calculations, and returned results, with file, network, and UI operations kept at separate boundaries.

What makes a project reproducible months later?

Code, dependencies, input data or fixtures, configuration, commands, expected results, and an explanation of assumptions and limitations.

Sources:
- Python dataclasses: https://docs.python.org/3/library/dataclasses.html
- Python logging: https://docs.python.org/3/library/logging.html

# CPP — From source file to a trustworthy executable

A reproducible executable is the first building block of a robotics component. Being able to explain how it was built matters more than owning an elaborate editor.

A source file is a description of a program, not the running program itself. A compiler checks and translates it; a linker connects the translated pieces and required libraries. An editor may hide those steps behind a button. For this first session, make the path visible: save one file, compile it with an explicitly selected language standard, run the resulting executable, then change a number and rebuild.

Use a deliberately small engineering question: what is the total mass of three components? Write the units in variable names and in the result. Predict 1.2 + 0.8 + 0.5 = 2.5 kg on paper before compiling. The compiler can detect many language mistakes, but it cannot determine that you accidentally entered a value in grams. A successful build is evidence about the program's structure, not proof of its physical meaning.

Keep a short build note containing the compiler version, language standard, command, input, and observed output. For GCC or Clang, a starting command is g++ -std=c++17 -Wall -Wextra -Wpedantic main.cpp -o mass. Those options are compiler-specific; an MSVC workflow uses different commands. Rebuilding a saved file should be an intentional step, because accidentally running yesterday's executable can make a correct edit appear ineffective.

## Example

```
#include <iostream>
int main() {
    const double total_kg = 1.2 + 0.8 + 0.5;
    std::cout << total_kg << " kg\n";
}
```

The program prints 2.5 kg. This is a complete program; save it as main.cpp and compile with a C++ compiler.

## Start: A second mass estimate

Replace the masses with the supplied values and label the output.

Input: 2.4 kg, 0.75 kg, 0.35 kg

Expected: 3.5 kg

Hints:
- Add on paper first.
- Keep every input in kilograms.

Worked reasoning: The sum is 2.4 + 0.75 + 0.35 = 3.5. Store it as double and print the unit.

Tests:
- All zero inputs give zero.
- A single 2.4 kg item gives 2.4.

Extension: Add an item count to the output.

## Build: Separate three failure stages

Make one syntax error, one missing function definition, and one wrong arithmetic operator in separate saved versions.

Input: A declared total() function with no definition; a missing semicolon; subtraction instead of addition

Expected: A compile diagnostic, a link diagnostic, and a runnable wrong answer

Hints:
- Change one thing at a time.
- Save the first diagnostic rather than all cascaded errors.

Worked reasoning: The compiler rejects syntax; the linker cannot resolve total(); the wrong operator is a logic error found by the expected result.

Tests:
- Restore the correct source and rebuild.
- Confirm the new executable timestamp changes.

Extension: Write a two-sentence recovery note for each failure.

## Stretch: Rebuild from a clean folder

Copy only source and build notes into a new task folder and reproduce the result.

Input: main.cpp and the recorded build command

Expected: Same labeled 2.5 kg result

Hints:
- Do not copy the previous executable.
- Use the same compiler standard flag.

Worked reasoning: A successful rebuild demonstrates that the source and notes are sufficient for this tiny project, without relying on hidden editor state.

Tests:
- Compile with no existing binary.
- Change one mass and rebuild again.

Extension: Have a future version of yourself follow the notes after a week.

## Debug: The suspicious unchanged answer

The source says 0.7 kg but the executable still reports 2.5 kg. Diagnose without changing arithmetic again.

Input: Last build failed because a semicolon is missing

Expected: Fix the build and run the new binary; result becomes 2.7 kg

Hints:
- Check whether compilation succeeded.
- Check which executable path is running.

Worked reasoning: The old binary survived the failed build. Fix the first compiler error, rebuild successfully, and verify the executable location.

Tests:
- Run after a successful build.
- Run from the folder named in the notes.

Extension: Make your build command stop before run if compilation fails.

## Recall

Does compiling prove the mass is physically correct?

No. It checks language constraints, not units, assumptions, or source data.

Why record the compiler and standard?

They define the build environment and help reproduce differences later.

Sources:
- GCC warning options: https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — Types, units, and deliberate conversions

A rover can receive perfectly valid numbers with the wrong units. Preventing that mismatch begins with clear types and explicit conversion boundaries.

A type constrains what operations are meaningful and what values can be represented. An integer is appropriate for a count of received samples; a floating-point value is appropriate for a measured duration with fractional seconds. Neither automatically carries a physical unit. A variable named time_s is a useful first defense, while later a dedicated unit type can prevent some invalid combinations before the program runs.

Integer division discards the fractional part of its result when both operands are integers. Thus 3 / 2 yields 1, even if you subsequently store that result in a double. Write 3.0 / 2.0 or convert before the division when a fractional result is intended. Conversions should be placed where the meaning changes, such as milliseconds entering an analysis that consistently uses seconds, rather than scattered throughout the calculations.

Treat ranges and invalid values as part of the problem. A negative duration or a non-finite measurement may need rejection rather than silent correction. A cast makes a conversion explicit but does not make it sensible; narrowing a huge value into a small integer still needs a range check. During this module, stay with ordinary integer and double values, document units, and compare every formula against one hand-computable case.

## Example

```
#include <iostream>
int main() {
    const int elapsed_ms = 1500;
    const double elapsed_s = elapsed_ms / 1000.0;
    std::cout << elapsed_s << " s\n";
}
```

The decimal denominator makes this floating-point division, yielding 1.5 seconds.

## Start: Milliseconds at the boundary

Convert each duration to seconds without losing the fraction.

Input: 0, 1, 999, 1000, 1500 milliseconds

Expected: 0, 0.001, 0.999, 1, 1.5 seconds

Hints:
- Use 1000.0.
- Print enough digits to inspect 0.001.

Worked reasoning: Divide the millisecond value by a floating-point thousand at one documented boundary.

Tests:
- 1 ms must not become 0 s.
- 1000 ms must become 1 s.

Extension: Add a function name that states both units.

## Build: Rate from count and time

Compute a sample rate and reject nonpositive duration.

Input: 250 samples over 2.5 s; 250 over 0 s

Expected: 100 samples/s; explicit invalid-duration result

Hints:
- Count divided by seconds gives samples/s.
- Validate before dividing.

Worked reasoning: Use a floating-point duration and evaluate count/duration only if duration > 0.

Tests:
- 0 samples over 2 s gives 0.
- Negative duration is rejected.

Extension: Distinguish invalid data from a valid zero rate.

## Stretch: A tiny unit wrapper

Create Seconds and Milliseconds structs and a conversion function; do not allow implicit mixed arithmetic.

Input: Milliseconds{1250}

Expected: Seconds with value 1.25

Hints:
- Each struct may initially contain one double.
- Make conversion a named function.

Worked reasoning: Separate types force the call site to choose the conversion explicitly, making accidental mixing more visible.

Tests:
- 1000 ms converts to 1 s.
- Attempting an undefined mixed addition fails to compile.

Extension: Add a Meters type and a speed calculation.

## Debug: Why the rate is zero

A program calculates double dt = 20 / 1000; then divides by dt. Find the first error.

Input: 20 ms interval

Expected: dt must be 0.02 s

Hints:
- Inspect operands before assignment.
- Changing only the receiving type is insufficient.

Worked reasoning: 20 / 1000 is integer division and yields zero; use 20 / 1000.0 before any rate calculation.

Tests:
- 20 ms yields 0.02.
- 1000 ms yields 1.0.

Extension: Enable conversion warnings and explain which mistakes they do not catch.

## Recall

Where should unit conversion happen?

At a named, documented interface boundary, so internal calculations use a consistent convention.

Does double guarantee exact decimal arithmetic?

No. Many decimal fractions are approximated; use tolerances based on the calculation.

Sources:
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
- GCC warning options: https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html

# CPP — Functions, references, and clear contracts

Good functions let a test exercise one engineering decision without launching a whole robot.

A function turns a useful question into an interface. Instead of a large main function that reads files, converts units, and prints a report, isolate a conversion or classification that can be called with known values. A contract states what the function accepts, what it returns, and whether it changes anything provided by the caller. Start with functions that return a value and avoid hidden global state.

Passing a small scalar by value gives the function its own copy. Passing by reference allows it to refer to an existing object; a non-const reference can modify that object. A const reference is useful for reading a larger object without copying it, but it does not extend every possible object's lifetime. References are not ownership: the referenced object must still exist for the entire use.

Make boundary policies visible. A threshold comparison should say whether equality counts, a normalization routine should specify its zero-input behavior, and an averaging function should say what happens with no samples. Naming the policy is often more valuable than making the code shorter. Draw a tiny input-output table before implementation, then turn each row into a repeatable check and retain that table when you refactor.

## Example

```
bool needs_review(double temperature_c, double limit_c) {
    return temperature_c > limit_c;
}
```

This function fragment uses a strict threshold: equality does not request review. It does not diagnose hardware safety.

## Start: The exact threshold

Call needs_review with the supplied temperatures.

Input: 29.9, 30.0, 30.1 °C; limit 30.0 °C

Expected: false, false, true

Hints:
- Read > literally.
- Test equality separately.

Worked reasoning: Only 30.1 is greater than 30.0; equality remains an ordinary observation under this stated policy.

Tests:
- A negative temperature below the limit returns false.
- Changing the limit changes the decision.

Extension: Add a finite-input check.

## Build: Value or reference

Write scale_copy(double) returning twice its input and scale_in_place(double&) modifying it.

Input: x = 3.0

Expected: Copy call returns 6 while x stays 3; in-place call changes x to 6

Hints:
- Give the functions different names.
- Inspect x after each call.

Worked reasoning: Pass-by-value changes a local copy; a non-const reference refers to the caller variable.

Tests:
- Try zero.
- Try a negative scalar.

Extension: Explain which interface is easier to compose in an analysis.

## Stretch: Classify a valid measurement

Return an enum class with Invalid, Normal, and Review; reject non-finite input.

Input: NaN, 30.0, 31.0; limit 30.0

Expected: Invalid, Normal, Review

Hints:
- Use std::isfinite from cmath.
- Test invalidity before comparison.

Worked reasoning: A dedicated invalid result avoids pretending NaN is a normal low measurement when comparisons are false.

Tests:
- Positive infinity is invalid.
- Exactly the limit is Normal.

Extension: Include a reason string in a later result type.

## Debug: Reference to a vanished result

A function declares double result locally and returns const double& referring to it. Explain and fix.

Input: const double& twice(double x) { double result=2*x; return result; }

Expected: Return double by value

Hints:
- The local object ends at function return.
- Small numeric return values do not need references.

Worked reasoning: The reference dangles after return. Return the computed double value; the caller receives a valid result object.

Tests:
- Compile with warnings.
- Call twice(4) and verify 8.

Extension: Find a similar lifetime mistake involving a local string.

## Recall

Does const reference mean ownership?

No. It restricts mutation through that reference but does not own the object.

What makes a function testable?

Explicit inputs and outputs, a small contract, and minimal hidden dependencies.

Sources:
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — Vectors, arrays, strings, and valid indexes

Telemetry arrives in collections. Containers express ownership and size so you can focus on the meaning of the samples.

Use std::vector for an owned sequence whose size can change, std::array for a fixed-size owned collection, and std::string for ordinary owned text. These types manage their storage. This does not mean every access is automatically checked: vector operator[] assumes a valid index, while at() performs a bounds check and can throw an exception. A range-based loop avoids an index entirely when you only need each element.

Decide what an empty collection means before calculating a statistic. A sum over no values can reasonably be zero; an average requires a separate no-data result. The size of a container and its allocated capacity are different: reserving capacity does not create elements that can be indexed. This distinction becomes essential when collecting many observations efficiently without inventing data that was never received.

Pointers, iterators, and references into a vector can become invalid when it reallocates. Do not keep a reference to an element, grow the vector, and assume that reference is still usable. At this stage, finish collecting the data and then traverse it, or reacquire an element by a validated index after mutation. Clear ownership and simple traversal are better first tools than attempts to minimize every copy.

## Example

```
#include <iostream>
#include <vector>
int main() {
    const std::vector<double> masses_kg{1.2, 0.8, 0.5};
    double total_kg = 0;
    for (double mass : masses_kg) total_kg += mass;
    std::cout << total_kg << '\n';
}
```

Each element is visited once, with no manual index. The sum is 2.5.

## Start: Add a component

Append 0.25 to the supplied masses and sum them.

Input: [1.2, 0.8, 0.5] kg

Expected: 4 elements and 2.75 kg

Hints:
- push_back creates a new element.
- Recompute the sum after appending.

Worked reasoning: The new item changes both size and total; capacity is an implementation detail, not the count.

Tests:
- Empty vector sums to 0.
- One item equals its own sum.

Extension: Print the count beside the total.

## Build: No measurement is different from zero

Write an average function with an explicit empty-input result.

Input: []; [0,0]; [2,4,6]

Expected: No data; 0; 4

Hints:
- Check empty before division.
- std::optional<double> can express absence.

Worked reasoning: The empty vector yields nullopt; populated vectors yield sum/size. Zero is valid evidence when samples exist.

Tests:
- A single sample is its own mean.
- Mixed negative and positive samples can average zero.

Extension: Document treatment of non-finite samples.

## Stretch: Select only useful samples

Copy values strictly above 25 into a new vector while retaining their original order.

Input: [20,30,25,28]

Expected: [30,28]

Hints:
- Append matching values.
- Do not erase while traversing for the first version.

Worked reasoning: A simple range loop with if(value > 25) and push_back preserves order and avoids iterator invalidation.

Tests:
- All match.
- None match.

Extension: Implement the same behavior with a standard algorithm.

## Debug: Reserved but nonexistent

A vector reserves capacity 5 and then writes values[0]=2. Why is that invalid?

Input: std::vector<int> values; values.reserve(5); values[0]=2;

Expected: Use push_back(2) or resize(5) before valid indexing

Hints:
- Check size(), not capacity().
- Storage and live elements are distinct.

Worked reasoning: The vector still has size zero. reserve only prepares storage; push_back constructs an element and increases size.

Tests:
- After push_back, size is 1.
- at(1) throws for the one-element vector.

Extension: Explain why a lucky run does not legitimize the invalid access.

## Recall

When is std::array a good choice?

When the number of owned elements is fixed and part of the interface, such as a three-axis vector.

Why avoid keeping element references across vector growth?

Reallocation can move storage and invalidate them.

Sources:
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — Structs, enums, and meaningful measurement states

A stale value and a valid zero require different decisions. Your data model should preserve that distinction.

A bare number loses context. A temperature sample may need a timestamp, unit convention, source identifier, and validity state. Put related values into a small struct, then give mutually exclusive states an enum class. This creates names such as Missing and Stale instead of unexplained integers. It also reduces the temptation to use an impossible-looking numeric value, such as -999, as an undocumented signal.

Keep the model as small as the problem requires. A struct with public data is reasonable for a simple record. A class with private data becomes useful when construction or mutation must preserve an invariant, such as a positive calibration scale. You do not need inheritance to organize every sensor; begin with records and ordinary functions, and add stronger boundaries where they prevent real mistakes.

Separate two questions: what was observed, and what should the application do about it? A decoder may mark a measurement Missing, while a supervisor decides whether to wait, report, or request inspection. Avoid silently carrying the previous valid value forward without keeping its original time. That practice turns absence of new evidence into apparent continuity and makes later analysis misleading.

## Example

```
enum class Quality { Valid, Stale, Missing };
struct Sample {
    double value_c;
    double time_s;
    Quality quality;
};
bool usable(const Sample& s) {
    return s.quality == Quality::Valid;
}
```

The sample record groups value and context. usable does not yet check age or numeric finiteness; its contract is deliberately narrow.

## Start: Three observations

Create records for valid zero, stale 12, and missing data; count usable records.

Input: Quality values Valid, Stale, Missing

Expected: Exactly one usable record

Hints:
- Quality determines usability in this contract.
- Zero is not automatically missing.

Worked reasoning: Check the enum, not the numeric value. The valid zero remains a usable observation.

Tests:
- Valid negative temperature remains usable here.
- Missing with value 99 remains unusable.

Extension: Add explicit finiteness validation.

## Build: Age policy

Define stale as age > 2 seconds and invalid as a future timestamp.

Input: now=10; sample times 8, 7.9, 10.1

Expected: Fresh, stale, invalid

Hints:
- Equality belongs to fresh under this policy.
- Check future time separately.

Worked reasoning: Compute age=now-time, reject negative age, and compare strictly with 2.

Tests:
- time=10 is fresh.
- time=8 is the exact boundary.

Extension: Explain why both times need a common clock.

## Stretch: A calibration invariant

Design a Calibration class that cannot represent a nonpositive scale.

Input: scale 0.1 accepted; scale 0 rejected

Expected: Construction rejects zero under the stated model

Hints:
- Choose exception or factory-result behavior.
- Keep the validation in one place.

Worked reasoning: A validated constructor or factory checks finite scale > 0 before returning a usable calibration object.

Tests:
- Negative scale rejected by this chosen model.
- Offset may still be negative.

Extension: Discuss a different instrument for which negative scale could be valid.

## Debug: The disguised missing sample

A function checks value != -999 and ignores Quality::Missing. Repair the data contract.

Input: Sample{20,10,Quality::Missing}

Expected: Not usable

Hints:
- Read the status.
- Numeric plausibility does not establish presence.

Worked reasoning: Use the named quality state. Sentinel-only logic mistakes a copied or placeholder value for an actual observation.

Tests:
- Valid -999 follows the explicit domain policy.
- Missing 20 is rejected.

Extension: Remove sentinel assumptions from the calling code.

## Recall

Why use an enum class?

It makes named states explicit and avoids many accidental implicit integer conversions.

Should a decoder decide the whole robot response?

Usually no. Preserve evidence in the decoder and apply application policy in a separate layer.

Sources:
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — RAII, scope, and ownership without manual cleanup

Long-running tools need predictable cleanup even when parsing fails or a function returns early.

Ownership answers who is responsible for releasing a resource. In modern C++, an owning object can acquire a resource during construction and release it during destruction. The object lifetime becomes the cleanup plan. std::vector owns its elements and storage; std::string owns its text; std::ifstream owns a file handle. This approach is commonly called RAII, and it removes many paths where manual cleanup could be forgotten.

A scope is a useful reasoning boundary. When a local owning object leaves scope, its destructor runs during ordinary return and normal exception unwinding. Write the resource declaration close to where it becomes necessary so the lifetime is visible. You still need to check whether acquiring or using the resource succeeded; automatic closing does not make an unreadable file readable or make output writes infallible.

Prefer values until a concrete design needs dynamic ownership. If an object truly needs one dynamic owner, std::unique_ptr expresses that relationship. std::shared_ptr represents shared ownership, which adds lifetime complexity and can form cycles. It is not a default cure for unclear design. In this module, learn to draw owner-to-resource relationships and use existing library owners before attempting a custom low-level resource wrapper.

## Example

```
#include <fstream>
#include <string>
int main() {
    std::ifstream input("samples.txt");
    if (!input) return 1;
    std::string line;
    while (std::getline(input, line)) { /* process line */ }
    return input.bad() ? 2 : 0;
}
```

The stream owns the file handle and closes it when it leaves scope. The program still distinguishes opening failure from a serious read error.

## Start: Early return and cleanup

Explain what happens to an ifstream when the function returns after detecting a malformed first line.

Input: A local opened ifstream and return 3

Expected: The stream destructor closes its owned handle

Hints:
- Follow scope exit.
- No manual close is required for lifetime cleanup.

Worked reasoning: Returning leaves the local scope, destroying the stream and releasing its file resource.

Tests:
- Open failure returns without reading.
- Normal end of file also closes on scope exit.

Extension: List a resource other than memory that benefits from RAII.

## Build: Single dynamic owner

Create an integer with make_unique, read it, and move ownership into a second unique_ptr.

Input: Owned value 42

Expected: Second owner reads 42; first pointer is empty after move

Hints:
- Include memory and utility.
- Check the first pointer before any later use.

Worked reasoning: auto a=std::make_unique<int>(42); auto b=std::move(a); moves the owner. Dereference b, not a.

Tests:
- a evaluates false after the move.
- b evaluates true.

Extension: Explain why copying unique_ptr is prohibited.

## Stretch: Avoid a resource on every branch

Refactor a function with repeated manual file-close calls into a local stream object and early error returns.

Input: Three validation branches after opening a file

Expected: Every exit path releases the handle

Hints:
- Declare the stream before validation.
- Keep error reporting separate from cleanup.

Worked reasoning: One owning stream eliminates repeated cleanup code while each branch still returns its own failure reason.

Tests:
- Trigger every early return.
- Read a valid file fully.

Extension: Add a test that repeatedly opens and rejects files.

## Debug: A pointer that outlives its owner

A function returns input.c_str() where input is a local std::string. Repair the interface.

Input: const char* from local string storage

Expected: Return std::string by value

Hints:
- The string owns the characters.
- Its destruction invalidates the pointer.

Worked reasoning: Return the owned string. The caller then owns a valid result rather than a pointer into destroyed storage.

Tests:
- Use the returned string after other allocations.
- Verify an empty string remains valid.

Extension: Identify when a string_view would have the same lifetime problem.

## Recall

What does RAII connect?

Resource release to the lifetime of an owning object.

Why not use shared_ptr everywhere?

It complicates ownership and lifetime, adds overhead, and can create cycles.

Sources:
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — Errors as part of the interface

A robust component should explain why it cannot produce a result, rather than inventing a plausible value.

An error policy is a design choice that callers must understand. std::optional<T> can represent a value that is absent, but it cannot by itself explain the reason. A small result struct with a status enum and value can preserve that reason. Exceptions are another tool for propagating failures, especially where the existing library interface uses them. Avoid mixing several approaches without a clear boundary and translation policy.

Consider a mean-temperature calculation. An empty file, a malformed token, and a failed file read are different events. Returning 0 for all three destroys evidence because zero may be a valid mean. A result should let the user or calling component take the next meaningful action. This often requires a useful message with a file name or row number, without dumping irrelevant internal details.

Programmer contract violations are different from ordinary external input failures. An assertion may document an internal condition expected always to hold during development, but it is not an adequate parser for arbitrary files and may be disabled in release builds. Validate external input using normal control flow. Then test each expected failure path with as much attention as the happy path, including whether partial output has been left behind.

## Example

```
#include <optional>
#include <vector>
std::optional<double> mean(const std::vector<double>& values) {
    if (values.empty()) return std::nullopt;
    double total = 0;
    for (double x : values) total += x;
    return total / values.size();
}
```

Absence is represented separately from a valid zero mean. This fragment assumes all supplied values are finite.

## Start: Zero versus none

Evaluate mean for an empty vector and for two zeros.

Input: [] and [0,0]

Expected: nullopt and 0 respectively

Hints:
- A valid zero still has a value.
- Use has_value() or the optional boolean check.

Worked reasoning: An empty container has no defined arithmetic mean in this contract; two zero samples have a real mean of zero.

Tests:
- [2,4] gives 3.
- [-2,2] gives 0 with a value.

Extension: Add finite-sample validation.

## Build: Useful parser result

Define statuses Ok, Empty, Malformed with a value and row number where appropriate.

Input: Empty text; line 3 contains abc; valid numeric text

Expected: Three distinguishable outcomes

Hints:
- The row number matters for malformed input.
- Do not give the success value meaning on an error.

Worked reasoning: Use a struct or tagged variant whose status guides which fields a caller reads. Document the invariant explicitly.

Tests:
- A valid 0 is Ok.
- Malformed row 3 is reported as row 3.

Extension: Replace the always-present value with a variant.

## Stretch: A strong output policy

A report has ten input rows and row 8 is invalid. Design an all-or-nothing output policy.

Input: Seven accepted rows, then malformed input

Expected: No final report is presented as complete

Hints:
- Validate before publishing.
- A temporary output can be promoted after success.

Worked reasoning: Compute into temporary state; only replace the final result after the full input passes. Keep the failure reason visible.

Tests:
- Row 1 failure produces no report.
- All ten valid rows produce one complete report.

Extension: Compare with an explicitly labeled partial-report policy.

## Debug: The disappearing check

A release build no longer rejects a negative duration because the only check used assert(duration>0). Fix it.

Input: User supplies -2 seconds

Expected: Ordinary error result in every build

Hints:
- Assertions can be compiled out.
- Input validation belongs to program behavior.

Worked reasoning: Use an if branch that returns or reports InvalidDuration before division; keep an assertion only for separate internal invariants.

Tests:
- Test debug and release builds.
- Test zero and positive values.

Extension: Document which conditions are input errors and which indicate programmer defects.

## Recall

What does optional omit?

It represents absence but does not inherently explain the cause.

Should an external invalid value be handled only by assert?

No. Use validation that remains part of the program in every build.

Sources:
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — Text files, parsing, and repeatable telemetry imports

Most early engineering software connects to files before it connects to real hardware. Reliable import is a valuable project on its own.

Treat a file format as a contract rather than a suggestion. Specify its separator, header, columns, unit conventions, blank-line behavior, and allowed number syntax. A deliberately narrow format is easier to validate than a vague imitation of every possible CSV dialect. State that your first parser supports one numeric value per line, or exactly two whitespace-separated fields, and reject anything outside that definition.

Read a complete line and then parse that line. This lets you attach a useful row number to a malformed record and detect unexpected trailing text. Formatted extraction directly from the file can leave the stream in a failed state; repeatedly trying the same operation without repairing the state or discarding the bad input can trap the program. Separate acquisition from interpretation so the parser can be tested with in-memory text.

Preserve the original data and make transformation visible. If you skip blank lines, say so; if you reject a row, record why; if you convert milliseconds to seconds, label the output accordingly. A clean summary should report how many rows were accepted and rejected. Do not silently drop inconvenient values and later claim that the remaining statistics describe the entire experiment.

## Example

```
#include <sstream>
#include <string>
bool parse_pair(const std::string& line, double& t, double& x) {
    std::istringstream in(line);
    double a, b;
    std::string extra;
    if (!(in >> a >> b) || (in >> extra)) return false;
    t = a; x = b;
    return true;
}
```

This fragment accepts exactly two whitespace-separated numbers and assigns outputs only after that syntactic check. Add a separate finite-value and domain-validation policy.

## Start: Two-field record

Classify each supplied line with parse_pair.

Input: "1 20", "2", "3 21 extra"

Expected: Accept, reject, reject

Hints:
- Exactly two numbers are required.
- A third token is outside the contract.

Worked reasoning: The first extraction must produce both fields and no remaining token may be present.

Tests:
- Leading whitespace is accepted.
- Blank line is rejected.

Extension: Add an explicit blank-line skip policy in the caller.

## Build: Import accounting

Count accepted and rejected records without modifying the input file.

Input: "0 20", "bad", "1 21", "2 22 extra"

Expected: 2 accepted, 2 rejected with row numbers 2 and 4

Hints:
- Keep row count separate from accepted count.
- Parse each line independently.

Worked reasoning: Increment the physical row number for each line, store valid pairs, and report invalid rows with their line number.

Tests:
- All valid yields zero rejections.
- An empty file yields zero records.

Extension: Calculate a mean only from a clearly labeled accepted subset.

## Stretch: Monotonic times

Add a policy that timestamps must strictly increase after the first valid record.

Input: (0,20), (1,21), (1,22), (0.5,23)

Expected: The third and fourth records violate the stated ordering policy

Hints:
- Compare against last accepted timestamp.
- Decide how a rejected row affects state.

Worked reasoning: With last accepted time 1, both later times are <=1 and are rejected. Retain the original row evidence.

Tests:
- A first negative time may be accepted if relative time is allowed.
- Times 0,1,2 all pass.

Extension: Support separate runs explicitly rather than treating resets as one run.

## Debug: One stale value printed twice

A loop tests !input.eof(), reads into x, and prints x even after extraction fails. Repair it.

Input: File containing 1 then 2

Expected: Print two successful values only

Hints:
- The read operation tells you success.
- End-of-file is detected by an attempted read.

Worked reasoning: Use while(input >> x) for this narrow numeric stream, or getline followed by line validation for row-level diagnostics.

Tests:
- A trailing newline produces no duplicate.
- Malformed text stops or is reported according to policy.

Extension: Refactor to a line parser that continues with explicit rejection accounting.

## Recall

Why parse whole lines first?

It provides record boundaries, row-number diagnostics, and a way to reject trailing content.

What must a cleaned dataset retain?

The transformation policy and evidence of rejected or missing records.

Sources:
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — Tests, debugging, and evidence of correctness

Autonomous software needs understandable behavior under bad input, not just a convincing demonstration.

A test translates a claim into a repeatable observation. For a function that flags values strictly above a threshold, the three essential cases are below, equal, and above. For a parser, include empty, short, malformed, and valid records. Name each test after the behavior it promises, because a future failure should communicate which contract changed rather than only which line of test code ran.

A debugger lets you stop at a chosen point and inspect actual values, call history, and control flow. First predict what should be present; then compare the program state against that prediction. When the mismatch appears, reduce the input and isolate the smallest failing function. Randomly adding print statements until the output looks acceptable can hide the underlying model error.

Compiler diagnostics and runtime tools complement tests. On supported desktop toolchains, AddressSanitizer can expose memory-access errors and UndefinedBehaviorSanitizer can detect selected undefined operations on executed paths. Neither proves the whole program safe, and their availability varies by platform. Keep a normal build and a diagnostic build, document how to run both, and retain the smallest input that reproduces every bug you repair.

## Example

```
#include <cassert>
bool needs_review(double x, double limit) { return x > limit; }
int main() {
    assert(!needs_review(29.9, 30));
    assert(!needs_review(30, 30));
    assert(needs_review(30.1, 30));
}
```

A small assertion harness illustrates three boundary cases. Assertions may be disabled by build settings, so use an explicit test runner or failure checks for a durable test suite.

## Start: Catch equality drift

A developer changes x > limit to x >= limit. Identify the single most important regression case.

Input: x=30, limit=30

Expected: The equality test fails

Hints:
- Below and above still behave the same.
- Target the changed boundary.

Worked reasoning: The equal case distinguishes the two contracts; it must expect false for strict exceedance.

Tests:
- 29.9 remains false.
- 30.1 remains true.

Extension: Write test names that state strictness.

## Build: Test an average

Design a table for empty, singleton, mixed-sign, and repeated values.

Input: []; [7]; [-2,2]; [3,3,3]

Expected: No data; 7; 0; 3

Hints:
- Do not compare empty to zero.
- Use tolerance for non-exact arithmetic.

Worked reasoning: These cases check absence, the identity property for a singleton, cancellation, and a constant sequence.

Tests:
- Check the optional has a value before reading it.
- Add [0.1,0.2] with a documented tolerance.

Extension: Add a non-finite-input policy.

## Stretch: Minimize a failing log

A 1000-row file crashes a parser. Describe and perform a reduction process on a copied fixture.

Input: A failure caused by one truncated final row

Expected: A minimal fixture that still reproduces the same failure

Hints:
- Remove independent sections, preserving the failure.
- Do not edit the original evidence.

Worked reasoning: Repeatedly remove blocks and rerun until the cause is isolated, then verify the shortened file fails for the same reason.

Tests:
- The minimal case fails before the fix.
- It passes or is cleanly rejected after the fix.

Extension: Record the defect and the violated contract.

## Debug: The test suite that never tested

A release build reports success because every check was assert and NDEBUG was defined. Repair the harness.

Input: A deliberately wrong threshold implementation

Expected: The executable must exit nonzero on a failed check in all test configurations

Hints:
- Inspect preprocessing/build flags.
- An if check can return failure explicitly.

Worked reasoning: Use a test framework or ordinary runtime comparisons that record failures independent of assert configuration.

Tests:
- Run known-correct code.
- Temporarily inject an equality bug and confirm failure.

Extension: Add the test executable to CTest.

## Recall

Why keep the smallest failing input?

It makes diagnosis repeatable and becomes a focused regression test.

Can a sanitizer prove a program correct?

No. It detects specific defects on paths that execute under its instrumentation.

Sources:
- Clang AddressSanitizer: https://clang.llvm.org/docs/AddressSanitizer.html
- Clang UndefinedBehaviorSanitizer: https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html

# CPP — CMake, headers, libraries, and clean builds

A reusable component must build outside the one folder and editor where it was created.

Once one source file becomes inconvenient, separate the reusable logic from the executable entry point. A header declares the interface that other source files use; a source file defines non-inline functions. The compiler checks each translation unit, then the linker connects them. Keep dependencies explicit so a change in one file does not accidentally depend on an include that happened to arrive through another header.

CMake describes build targets and their relationships. A target might be a library holding telemetry calculations, an application reading files, or a test executable checking the library. Prefer target-specific configuration: language features, include directories, and linked dependencies should belong to the targets that need them. This makes the build easier to reason about than a long list of global flags.

Use an out-of-source build folder, which keeps generated build files separate from authored source. The precise compiler and generator differ across systems; the purpose is a reproducible recipe, not one universal shell command. Record configuration and build steps, then perform a clean build using only the repository contents and documented prerequisites. A successful incremental build can hide missing dependencies that a clean build reveals.

## Example

```
cmake_minimum_required(VERSION 3.20)
project(Telemetry LANGUAGES CXX)
add_library(telemetry telemetry.cpp)
target_compile_features(telemetry PUBLIC cxx_std_17)
add_executable(telemetry_tests tests.cpp)
target_link_libraries(telemetry_tests PRIVATE telemetry)
enable_testing()
add_test(NAME telemetry_contracts COMMAND telemetry_tests)
```

This CMakeLists.txt expects authored telemetry.cpp, its interface header, and tests.cpp. It builds a library and registers a test executable.

## Start: Know each file

Assign interface, implementation, application entry, and test responsibilities to four files.

Input: telemetry.hpp, telemetry.cpp, main.cpp, tests.cpp

Expected: Header declares; source implements; main drives; tests verify

Hints:
- Separate reusable logic from I/O.
- A library need not contain main.

Worked reasoning: The header is the shared contract. Both application and tests link to the same compiled implementation.

Tests:
- Test executable has its own main.
- Library has no competing main.

Extension: Draw the build-target dependency graph.

## Build: Missing implementation

A function is declared and called, but telemetry.cpp is not added to the target. Diagnose the failure.

Input: Undefined reference/unresolved external symbol for the function

Expected: Add the implementation to the library and link that library

Hints:
- Declaration permits compilation.
- Definition is needed at link time.

Worked reasoning: Confirm the signature matches, then include the source in the target and link the consuming executable against it.

Tests:
- Clean build succeeds.
- Removing the source recreates the failure.

Extension: Explain a signature mismatch that produces a similar diagnostic.

## Stretch: One library, two clients

Build a report executable and a test executable using the same telemetry library.

Input: One mean calculation implementation

Expected: Both clients use the same contract and implementation

Hints:
- Avoid copying the function into tests.
- Link each target to the library.

Worked reasoning: Create two executable targets with distinct entry points, each linked privately to telemetry. Test source is not the production implementation.

Tests:
- A library change affects both clients.
- Tests fail if the library result is intentionally wrong.

Extension: Add a second platform build when available.

## Debug: It only works in the old build folder

A clean build fails while a week-old build directory succeeds. Investigate before copying old outputs.

Input: Missing generated file or undeclared dependency

Expected: A documented dependency or generation step fixes clean builds

Hints:
- Treat cached outputs as clues.
- Check configuration inputs and generated artifacts.

Worked reasoning: Identify what the old folder supplied implicitly, then declare that dependency or build step rather than retaining accidental state.

Tests:
- Build from a new directory.
- Build after changing the relevant source.

Extension: Document external tool versions needed for generation.

## Recall

Why create a library for the calculation?

Both application and tests can use one implementation through an explicit interface.

What does a clean build reveal?

Missing or undeclared dependencies that cached outputs can conceal.

Sources:
- Official CMake tutorial: https://cmake.org/cmake/help/latest/guide/tutorial/index.html

# CPP — Algorithms, iterators, and measured efficiency

Telemetry analysis can grow from tens to millions of records, but readable correct code remains the baseline.

A standard algorithm communicates intent: count_if counts matching elements, sort orders them, and accumulate combines values. A hand-written loop is also appropriate when it is clearer. The goal is not to replace every loop, but to make operations recognizable and keep their boundary conditions understandable. Learn what range an algorithm receives and whether it reads, modifies, or reorders that range.

Complexity describes how work grows with input size; it is not a direct stopwatch reading. A linear scan visits each record once. Repeatedly scanning the entire history for each new record can turn a manageable task into quadratic work. Before optimizing, choose a representative dataset, record a correct reference result, and measure the operation that actually matters rather than the time to print thousands of lines.

Iteration has validity rules. Removing elements can invalidate iterators or change positions, and a comparator used for sorting must obey a consistent ordering. Avoid a comparator based on less-than-or-equal, because equality must not make both objects precede each other. For numerical data, decide how non-finite values are handled before sorting or aggregation; mysterious values should not silently enter a statistical summary.

## Example

```
#include <algorithm>
#include <vector>
int flagged_count(const std::vector<double>& x) {
    return static_cast<int>(std::count_if(x.begin(), x.end(),
        [](double value) { return value > 30.0; }));
}
```

The fragment counts strict threshold exceedances. Its int result assumes the count is representable; a general large-data API should retain the algorithm's count type or check conversion.

## Start: Count the events

Count samples strictly greater than 30 with a loop and count_if.

Input: [29,30,31,31,12]

Expected: 2

Hints:
- Duplicates still count as separate samples.
- Equality is excluded.

Worked reasoning: Both implementations should increment or count for the two 31 values only.

Tests:
- Empty gives 0.
- [30,30] gives 0.

Extension: Return the native count type rather than narrowing to int.

## Build: Median without losing the source

Compute a median on a copy of finite data; define an even-count rule.

Input: [7,1,4]; [8,2,6,4]

Expected: 4; 5 using the mean of the middle pair

Hints:
- Sort a copy.
- Empty input needs a separate result.

Worked reasoning: Sorted sequences are [1,4,7] and [2,4,6,8]; choose the center or mean of the two centers.

Tests:
- Source remains unchanged.
- Single value is its median.

Extension: Discuss overflow-resistant averaging of large middle values.

## Stretch: Avoid repeated full scans

Maintain a running count of above-threshold samples as a stream arrives.

Input: [10,35,40,20] with limit 30

Expected: Counts after arrivals: 0,1,2,2

Hints:
- Update from the new record only.
- Do not rescan all previous records.

Worked reasoning: An increment for each new matching record makes total counting work linear in the number of arrivals.

Tests:
- No matching sample keeps count 0.
- Every matching sample increments once.

Extension: Add a fixed-window count with a documented eviction rule.

## Debug: The broken comparator

A sort comparator returns a.value <= b.value. Explain the defect.

Input: Two equal values 5 and 5

Expected: Neither equal element should be ordered before the other by a strict less comparator

Hints:
- Evaluate comparator(a,a).
- Equality is not strict ordering.

Worked reasoning: Use < for ascending finite numeric values. Reject or explicitly order NaN values before relying on this simple comparator.

Tests:
- Compare an object with itself: false.
- Test duplicates and already sorted input.

Extension: Write a tie-breaker by sample ID.

## Recall

What does linear complexity mean?

Work grows proportionally to the number of input elements, abstracting constant factors.

Why preserve a reference implementation?

It provides a correctness comparison while changing algorithms or optimizing.

Sources:
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — Time, timestamps, and latency budgets

Robotics software can use the right value too late; time is part of the data contract.

A timestamp identifies a point on a particular clock, while a duration describes a difference. std::chrono types make units explicit and reduce accidental mixing of milliseconds with seconds. For measuring local elapsed intervals, a monotonic clock such as steady_clock avoids changes caused by wall-clock adjustments. A measurement timestamp from another device still requires a documented synchronization and conversion policy before its age is meaningful.

A latency budget distributes an allowed time interval across work such as acquisition, parsing, processing, and publication. Summing nominal durations is a first model, not proof that every update meets a deadline. Operating-system scheduling, I/O waits, contention, allocation, and rare slow paths can change the observed result. Measure a distribution, include worst observed values, and state the test conditions.

Keep a distinction between educational desktop timing and validated real-time behavior. A desktop test may show that a component usually finishes in two milliseconds; it does not establish a hard upper bound on every possible execution. Begin by recording timestamps at meaningful boundaries and testing stale-data policy using a fake clock. Deterministic clock inputs make boundary tests much more reliable than tests that sleep and hope.

## Example

```
#include <chrono>
using Milliseconds = std::chrono::milliseconds;
bool stale(Milliseconds age, Milliseconds limit) {
    return age > limit;
}
```

Typed durations preserve units at the interface. Negative age requires a separate clock/domain policy; this narrow function only implements the strict comparison.

## Start: Budget arithmetic

Sum acquisition, parsing, processing, and publication durations against a 20 ms interval.

Input: 3 + 2 + 9 + 1 ms

Expected: 15 ms used; 5 ms nominal remainder

Hints:
- Include every named stage.
- Do not label remainder as a guarantee.

Worked reasoning: The nominal sum is 15; 20-15=5 before unmodeled variation and interference.

Tests:
- A 20 ms sum has zero remainder.
- A 21 ms sum exceeds by 1.

Extension: Add measured variability for each stage.

## Build: Stale boundary

Apply stale(age,100ms) to three ages.

Input: 99,100,101 ms

Expected: false,false,true

Hints:
- The comparison is strict.
- Use chrono durations in the test.

Worked reasoning: Equality remains fresh under this contract. A different application can choose >=, but must update the contract and tests.

Tests:
- Zero age is fresh.
- Negative age triggers separate validation.

Extension: Add an enum result for future timestamps.

## Stretch: Fake-clock replay

Design a component that accepts now as an argument and replay an old measurement.

Input: measurement at 1000 ms; now 1050,1100,1101; limit 100 ms

Expected: Fresh,fresh,stale

Hints:
- Keep all times on one simulated clock.
- Avoid real sleeps.

Worked reasoning: Age is 50,100,101 ms. Injecting now makes the three outcomes deterministic and fast to test.

Tests:
- Repeated replay gives the same results.
- A now before measurement time is handled explicitly.

Extension: Replay a sequence containing a clock reset.

## Debug: The comforting average

A timing report lists runs [2,2,2,30] ms against a 10 ms budget and concludes the system always meets it. Correct the claim.

Input: Mean 9 ms; maximum observed 30 ms

Expected: One observed deadline miss; no hard-real-time guarantee

Hints:
- Inspect individual runs.
- Mean and bound answer different questions.

Worked reasoning: Although the mean is 9, the 30 ms run exceeds the interval by 20. Report miss count, maximum observed duration, and test conditions.

Tests:
- Count exactly one miss.
- Keep the raw timing observations.

Extension: Investigate where the slow run spent time.

## Recall

Why inject a clock in a test?

It makes time-boundary cases deterministic without sleeping.

Does measured maximum equal guaranteed worst-case time?

No. It is only the largest value observed under those test conditions.

Sources:
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — State machines and recoverable behavior

A robot must handle missing evidence and recovery as deliberately as normal operation.

A state machine makes the current operating mode explicit. An event, together with the current state and any documented guard condition, selects a transition and possibly an action. Start on paper with a transition table. For an inspection tool, useful states could be Idle, Collecting, Review, and Complete. A timeout is an event; it should not be buried as an unrelated boolean deep inside a processing loop.

Keep transition logic separate from side effects. A pure function can return the next state and a requested action, while another layer performs logging or I/O. This separation lets you replay event sequences and verify decisions without connecting hardware. It also avoids changing the state halfway through an operation that later fails. Define what happens when an event is irrelevant or arrives twice.

Recovery is part of the model, not an exception to having a model. If a sample is missing, does the workflow pause, request another sample, or require a human review? How is the accumulated data labeled? A reset should state which evidence is retained. Use conservative simulated examples while learning; the validity of a real machine's state model depends on hazard analysis and domain requirements beyond a programming exercise.

## Example

```
enum class State { Idle, Collecting, Review, Complete };
enum class Event { Start, GoodSample, MissingSample, Finish, Reset };
State next(State s, Event e) {
    if (e == Event::Reset) return State::Idle;
    if (s == State::Idle && e == Event::Start) return State::Collecting;
    if (s == State::Collecting && e == Event::MissingSample) return State::Review;
    if (s == State::Collecting && e == Event::Finish) return State::Complete;
    return s;
}
```

This small transition function is a desktop inspection model. Unlisted events retain the current state, a policy that should be documented and tested.

## Start: Normal inspection

Replay Start, GoodSample, Finish from Idle.

Input: Idle → Start → GoodSample → Finish

Expected: Collecting, Collecting, Complete

Hints:
- Follow one event at a time.
- GoodSample does not change the state in this model.

Worked reasoning: Start begins collection; a good sample retains it; Finish completes the workflow.

Tests:
- Finish in Idle retains Idle.
- Reset in Complete gives Idle.

Extension: Return a transition log alongside the final state.

## Build: Missing data path

Replay Start, MissingSample, Finish.

Input: Initial Idle

Expected: Collecting, Review, Review

Hints:
- Finish only completes from Collecting.
- Missing evidence prevents ordinary completion.

Worked reasoning: The Review state does not accept Finish under the given contract; a later explicit recovery event would need a new transition.

Tests:
- Reset from Review returns Idle.
- Repeated MissingSample remains Review.

Extension: Design a reviewed-and-approved event without hiding the review.

## Stretch: Transition coverage

Create a table-driven test of all four states and all five events.

Input: 4 states × 5 events

Expected: 20 defined test cases

Hints:
- Count the Cartesian product.
- Do not test only the happy path.

Worked reasoning: Each row states the expected next state. Coverage of the table makes ignored-event policy visible and checks Reset everywhere.

Tests:
- All Reset rows lead to Idle.
- Only the specified Start and Finish rows change modes.

Extension: Add a transition result indicating ignored versus accepted events.

## Debug: Impossible flags

A design has is_idle=true and is_complete=true simultaneously. Refactor its representation.

Input: Independent mutable boolean mode flags

Expected: One enum state represents exactly one mode

Hints:
- The flags permit combinations the model does not allow.
- Store one mutually exclusive state.

Worked reasoning: Replace independent mode booleans with State, deriving display booleans from that single source if needed.

Tests:
- State cannot be both Idle and Complete.
- Reset has one clear assignment.

Extension: Identify which other flags are independent facts and should remain separate.

## Recall

Why separate transitions from I/O?

You can test decisions deterministically and handle side-effect failure explicitly.

What should happen to an unlisted event?

Whatever the documented policy says: reject, log, ignore, or transition; it must be deliberate.

Sources:
- NASA JPL F Prime documentation: https://fprime.jpl.nasa.gov/latest/docs/
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — Queues, concurrency, and bounded work

A busy robot needs an explicit policy when input arrives faster than it can be processed.

Concurrency introduces multiple activities whose execution may overlap or interleave. Shared mutable data requires coordination; using two threads does not automatically make a task faster. Begin by separating producer and consumer responsibilities in a single-threaded simulation. Define who owns each message, when ownership transfers, and whether the consumer sees a complete immutable snapshot or a shared object that might change.

A queue absorbs temporary differences in production and consumption rates, but it cannot fix a permanent mismatch. If ten samples arrive per second and only eight are processed, backlog grows. Bound the queue and choose an explicit overload policy: reject new work, drop oldest data, keep only the latest measurement, or apply backpressure where supported. The correct choice depends on whether old samples retain value.

When threads are actually introduced, protect the whole invariant rather than only individual variables. A mutex can guard a queue plus its count; an atomic counter does not automatically make a separate container safe. Condition variables require a predicate checked under the synchronization policy. This module's exercises focus on deterministic queue behavior first, so scheduling surprises do not obscure a basic design error.

## Example

```
#include <deque>
#include <cstddef>
void push_latest(std::deque<int>& q, int value, std::size_t capacity) {
    if (capacity == 0) return;
    if (q.size() == capacity) q.pop_front();
    q.push_back(value);
}
```

This single-threaded queue retains the newest capacity values. It is not thread-safe and assumes q.size() never exceeds capacity.

## Start: Keep the latest three

Push 1,2,3,4,5 into an initially empty queue with capacity 3.

Input: 1,2,3,4,5

Expected: Final queue [3,4,5]; two oldest values discarded

Hints:
- Remove before adding when full.
- Track discards separately.

Worked reasoning: After the fourth push drop 1; after the fifth drop 2. The remaining order is oldest-to-newest 3,4,5.

Tests:
- Capacity 1 keeps only 5.
- Capacity 0 retains nothing.

Extension: Return a discard count from the queue wrapper.

## Build: Growing backlog

Compute backlog growth for a sustained producer and consumer mismatch.

Input: 10 arrivals/s, 8 processed/s, initially empty, 5 seconds

Expected: 10 unprocessed samples ignoring finite capacity

Hints:
- Net growth is two per second.
- A queue only delays overload.

Worked reasoning: The difference is 2/s, so five seconds adds 10 records unless the policy drops or blocks work.

Tests:
- Equal rates have no average growth.
- A slower producer allows draining.

Extension: Include a finite capacity of 6 and count drops.

## Stretch: Compare overload policies

Replay the same events using drop-oldest and reject-new policies.

Input: Queue [1,2,3], incoming 4, capacity 3

Expected: Drop-oldest keeps [2,3,4]; reject-new keeps [1,2,3]

Hints:
- Both are bounded.
- They preserve different information.

Worked reasoning: Latest telemetry often values freshness; archival records may instead require backpressure or explicit loss handling. Document why your chosen policy fits.

Tests:
- Both report the loss event.
- Neither silently exceeds capacity.

Extension: Add timestamps and compare final measurement ages.

## Debug: The atomic-count illusion

A queue is modified by two threads without a lock, but its size counter is atomic. Explain why the design is still unsafe.

Input: Shared std::deque plus atomic count

Expected: Container access and its invariant need synchronization

Hints:
- Atomicity belongs to that counter operation.
- The deque performs other mutable operations.

Worked reasoning: Guard queue operations with an appropriate mutex or use a correctly designed concurrent queue. Keep count consistent with the same invariant.

Tests:
- Use a race detector when supported.
- Retain deterministic policy tests separately.

Extension: Replace shared mutation with message ownership transfer.

## Recall

Can a larger queue solve permanent overload?

No. It increases buffering time while backlog continues to grow.

What is the first concurrency design question?

Who owns each piece of data and which operations may access or mutate it concurrently?

Sources:
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

# CPP — ROS 2 integration with explicit message contracts

ROS 2 becomes useful when it connects understood components rather than hiding unfamiliar code behind a launch command.

A ROS 2 node is a unit of computation that communicates through interfaces such as topics, services, and actions. For a first integration, keep the engineering calculation in an ordinary tested C++ library and use a node as the adapter that receives a message, checks its meaning, calls the library, and publishes a result. This keeps framework learning from replacing ordinary software reasoning.

A message contract includes more than field types. State units, coordinate frames when relevant, timestamp meaning, validity, expected rate, and what happens when messages disappear. Matching a topic name does not guarantee matching meaning. Quality-of-service settings affect delivery behavior, and endpoints need compatible settings to communicate. Use documentation for the installed ROS distribution instead of assuming examples from another release are interchangeable.

An executor schedules callbacks; callback groups and executor choices affect concurrency. Do not assume that a callback's code is automatically isolated from every other callback or that timers imply hard-real-time deadlines. Start with one simple topic and one deterministic fixture, inspect what is actually received, and then test missing, delayed, and duplicate messages. This lesson defines the integration task; use the official installed-distribution tutorial for exact package and build commands.

## Example

```
struct MeasurementContract {
    double temperature_c;
    double sample_time_s;
    bool valid;
};
bool should_process(const MeasurementContract& m, double now_s) {
    const double age_s = now_s - m.sample_time_s;
    return m.valid && age_s >= 0 && age_s <= 0.5;
}
```

This framework-independent adapter policy can be tested before binding it to a ROS message. It assumes timestamps share a meaningful clock and requires separate finite-value validation.

## Start: Contract age check

Apply should_process to valid measurements with three ages.

Input: 0.1,0.5,0.6 seconds

Expected: true,true,false

Hints:
- The upper bound is inclusive.
- A false validity flag overrides age.

Worked reasoning: The function accepts age from zero through 0.5; older messages do not enter the calculation.

Tests:
- Invalid but fresh returns false.
- A future timestamp returns false.

Extension: Add finiteness checks.

## Build: Document a topic

Write a contract for a simulated temperature topic with a timestamp and quality flag.

Input: One publisher and one consumer

Expected: Units, clock, expected rate, validity, and missing-data policy are explicit

Hints:
- Avoid a bare field named value.
- Choose a timeout policy that is a learning assumption.

Worked reasoning: A complete contract states Celsius, the simulated shared clock, nominal update rate, how quality is encoded, and how absence is reported.

Tests:
- Consumer rejects the wrong unit convention at its adapter boundary.
- Missing messages produce the documented state.

Extension: Version the interface when meaning changes.

## Stretch: Replay before hardware

Feed a node a saved sequence containing valid, stale, duplicate, and absent intervals.

Input: Sequence IDs 1,2,2,4 with a long gap before 4

Expected: Logged decisions explain every accepted or rejected record

Hints:
- A duplicate policy must be chosen.
- Preserve timestamps from the fixture.

Worked reasoning: Separate freshness and duplicate checks; report the long interval as missing-data evidence rather than inventing sample 3.

Tests:
- Replaying the fixture gives the same decisions.
- A fresh unique sequence passes.

Extension: Compare the node output with the pure library tests.

## Debug: Silent subscriber

A subscriber receives nothing despite matching topic names. Build a focused diagnosis.

Input: Publisher exists; types and QoS not yet checked

Expected: Verify discovery, type, QoS compatibility, and callback execution

Hints:
- Do not immediately rewrite the calculation.
- Inspect the communication boundary.

Worked reasoning: Confirm both endpoints are in the intended domain, have matching message types and compatible QoS, and that the subscriber executor is running.

Tests:
- A known tutorial pair communicates.
- The node logs a callback when a fixture arrives.

Extension: Document the actual installed distribution and chosen QoS.

## Recall

Where should reusable math live?

In a framework-independent library with tests; the node adapts messages and policy.

What else matters besides a topic name?

Message type, semantic contract, discovery context, QoS compatibility, and executing callbacks.

Sources:
- ROS 2 documentation source: QoS: https://github.com/ros2/ros2_documentation/blob/jazzy/source/Concepts/Intermediate/About-Quality-of-Service-Settings.rst

# CPP — From prototype to a reviewable engineering component

A portfolio becomes credible when another person can rebuild the result and see what it does under failure.

A useful engineering component has a bounded purpose. Write a short statement such as classify a simulated temperature record as fresh, stale, or invalid, and list what lies outside scope. Connect each requirement to at least one test or demonstration. This traceability is not bureaucracy for its own sake: it makes gaps visible when a feature changes or a new collaborator asks why the program behaves a certain way.

Preserve evidence, not only screenshots. Include source, build instructions, a small data fixture, expected outputs, tests, and a concise explanation of assumptions. Record the compiler and relevant library versions used for the demonstration. Separate measured observations from guarantees; a desktop timing plot and a successful replay are valuable, but neither certifies flight suitability or safe operation of a real mechanism.

Study mature systems after you can explain a small one. F Prime provides examples of component-oriented flight-software architecture, commands, telemetry, and testing. NASA cFS is a separate ecosystem centered on reusable flight-software services and applications. Reading them can reveal ideas to borrow, but copying a framework into a project does not transfer mission qualification. Your next step should answer one concrete learning question, not simply increase the stack.

## Example

```
struct Requirement {
    const char* id;
    const char* statement;
    const char* evidence;
};
const Requirement reqs[] = {
    {"R1", "Reject stale input", "age_boundary_test"},
    {"R2", "Report malformed records", "bad_row_fixture"}
};
```

This small trace table illustrates a documentation relationship. A real project may keep it in Markdown or a test-management format.

## Start: Requirement with a boundary

Rewrite reject old data as a testable requirement.

Input: A chosen learning threshold of 0.5 s

Expected: Reject age > 0.5 s; define equality and future timestamps

Hints:
- Give a unit and comparison.
- Describe invalid clock cases separately.

Worked reasoning: A precise requirement identifies the clock assumption, strictness, output status, and test at 0.5 versus 0.5001 seconds.

Tests:
- Equality test is mapped.
- Future-time test is mapped.

Extension: Record why the threshold was chosen for the simulation.

## Build: Evidence manifest

List the smallest files needed to reproduce a telemetry decision component.

Input: Source, build, tests, fixture, expected result

Expected: A new folder can reproduce the demonstration

Hints:
- Do not rely on an old binary.
- Include dependency versions and commands.

Worked reasoning: Package authored code, CMake recipe, test executable source, input fixture, expected output, and README with assumptions and limitations.

Tests:
- Clean build passes.
- Fixture output matches documented result.

Extension: Add a machine-readable result summary.

## Stretch: Framework reading expedition

Read one F Prime tutorial and identify the equivalents of input, state, output, and test.

Input: A documentation-only study; no hardware

Expected: A one-page map connecting a tutorial to your component

Hints:
- Read the smallest tutorial first.
- Use framework terms only when you can define them.

Worked reasoning: Map a command or port to input, component fields to state, telemetry/events to observations, and test harnesses to evidence.

Tests:
- Every mapped element cites a source section.
- Mark unknown concepts for later study.

Extension: Implement one tiny tutorial only after the map makes sense.

## Debug: Overstated portfolio claim

A README says flight-ready because it uses C++ and passes tests. Rewrite it accurately.

Input: Desktop simulation and selected tests only

Expected: A tested educational prototype with explicit coverage and limitations

Hints:
- Describe evidence actually collected.
- Separate language choice from assurance.

Worked reasoning: State the tested scenarios, platform, known gaps, and absence of operational qualification. The result can be impressive without unsupported guarantees.

Tests:
- README names the test data.
- Limitations include untested hardware and timing assumptions.

Extension: Add a risk-driven next-test list.

## Recall

What makes a requirement reviewable?

It is specific enough to connect to observable evidence and clear boundary behavior.

Why read mature frameworks later?

You can connect their abstractions to problems you already understand instead of collecting unfamiliar machinery.

Sources:
- NASA JPL F Prime documentation: https://fprime.jpl.nasa.gov/latest/docs/
- NASA core Flight System: https://github.com/nasa/cFS

# MATLAB — A calculation you can rerun

An engineering result is useful only when you can reconstruct where it came from. A small repeatable script is your first laboratory notebook.

Begin with a question small enough to solve on paper: how much electrical energy does a 12 W instrument use in 15 minutes? Name power and duration, convert minutes to seconds, multiply, and label the answer. A variable name such as duration_s records an assumption that a bare number cannot. MATLAB will happily multiply incompatible quantities; dimensional consistency is your responsibility until you deliberately introduce a units system.

A script records the sequence that produces your result. The Command Window is excellent for experiments, but commands that worked only because yesterday’s variables still existed are not a reproducible analysis. Put every required input in the script, run it from the beginning, and change just one input. A semicolon suppresses display; it does not skip computation. Comments should explain a physical assumption or choice, not repeat an obvious assignment.

Keep a small evidence trail beside the code: the question, input units, one hand calculation, and the expected behavior when an input doubles. Here doubling power should double energy. Do not let output formatting imply more measurement accuracy than you possess. The computer can print many digits even when your power estimate is approximate. This habit becomes valuable later when a long thermal model contains thousands of operations and only a few independent checks.

## Example

```
power_w = 12;
duration_s = 15*60;
energy_j = power_w*duration_s;
fprintf("Energy: %.0f J\n",energy_j);
```

The answer is 10800 J. Watts are joules per second, so the seconds cancel in the multiplication.

## Start: Instrument energy

Calculate the energy consumed by an 8 W sensor over 30 minutes. Print joules and watt-hours.

Input: power_w=8; duration_min=30

Expected: 14400 J and 4 Wh

Hints:
- Convert minutes once.
- One Wh is 3600 J.

Worked reasoning: duration_s=30*60; energy_j=8*duration_s; energy_wh=energy_j/3600. Multiplying 8 W by 0.5 h provides an independent check.

Tests:
- Zero duration returns zero.
- Doubling duration returns twice the energy.

Extension: Add a second instrument and compare separate versus combined energy.

## Build: Battery estimate with assumptions

Estimate ideal runtime from a 40 Wh battery powering a constant 10 W load. State one reason the real runtime might differ.

Input: energy_wh=40; power_w=10

Expected: 4 h; the estimate ignores conversion losses and changing load.

Hints:
- Divide energy by power.
- Do not mix Wh with seconds.

Worked reasoning: runtime_h=40/10. This is a simplified energy balance, not a battery performance guarantee.

Tests:
- 20 W gives 2 h.
- A zero load must be handled explicitly, not reported as ordinary finite runtime.

Extension: Represent an assumed 80% usable fraction as a named input.

## Stretch: A unit audit

A script computes energy_j=power_w*duration_min. Explain the error and make the input interface harder to misuse.

Input: power_w=5; duration_min=2

Expected: Correct energy is 600 J, not 10 J.

Hints:
- Write the units under each factor.
- Convert at the boundary of the calculation.

Worked reasoning: Convert duration_min to duration_s=60*duration_min, then multiply. Keep the conversion visible and label outputs.

Tests:
- 2 min agrees with 120 s.
- 1 W for 1 s gives 1 J.

Extension: Write a short input/output contract for the script.

## Debug: The stale variable

A script contains only energy_j=power_w*60 and works once, then fails in a fresh workspace. Diagnose and repair it.

Input: power_w happened to exist from an earlier session.

Expected: A self-contained script assigns or receives power_w before use.

Hints:
- Inspect the script, not only the workspace.
- Ask what an independent reader needs.

Worked reasoning: The script has an undeclared dependency. Put the intended power value in the input section and explain the one-minute duration.

Tests:
- Run with no preexisting variables.
- Change the input and rerun from the beginning.

Extension: Identify another analysis habit that can hide state.

## Recall

What does a semicolon change?

It suppresses ordinary display of that statement’s result; the calculation still occurs.

Why include units in a variable name?

It makes the intended representation visible and helps catch conversion mistakes; it does not enforce units automatically.

Sources:
- MathWorks: scripts: https://www.mathworks.com/help/matlab/learn_matlab/scripts.html

# MATLAB — Vectors, indexing, and sample identity

Sensor logs are sequences, not isolated scalars. Indexing mistakes can pair a correct measurement with the wrong time.

A vector lets you give one name to a sequence of samples. Decide what an element represents before performing an operation: a temperature, a time, a channel, or a trial. MATLAB indexing starts at one. The first reading in a three-element vector is reading(1), and the final one is reading(end). A row vector and a column vector contain similar-looking numbers but have different shapes, which matters when you combine them.

Treat the time and value arrays as a pair. If you remove the second temperature but keep the second timestamp, every later interpretation can become wrong. Build an index selection once and apply it consistently to both arrays. A logical mask names a property of the samples, such as readings above a review threshold. It is often easier to inspect that mask than a loop containing several nested conditions.

Before trusting a selection, write down the expected indices using a tiny dataset. Include a reading exactly equal to the threshold so that the distinction between greater-than and greater-than-or-equal is deliberate. Missing samples are not automatically zero, and an empty selection is a legitimate outcome. Your future rover may produce no readings meeting a condition; the analysis should report that clearly instead of inventing an average.

## Example

```
time_s = [0 2 4 6];
temperature_c = [20 23 30 31];
review = temperature_c > 30;
review_times_s = time_s(review);
```

Only the final sample exceeds 30 °C, so review_times_s is 6.

## Start: Choose the samples

Select the first and third readings, then select the last two.

Input: x=[12 15 18 21]

Expected: [12 18] and [18 21]

Hints:
- Use a vector of indices.
- end refers to the last index.

Worked reasoning: x([1 3]) selects [12 18]; x(end-1:end) selects [18 21].

Tests:
- Selecting 1 returns 12.
- The last-two result contains exactly two elements.

Extension: Repeat with a column vector and describe the output shape.

## Build: Find threshold times

Report the times where voltage is strictly below 11.5 V.

Input: t=[0 5 10 15]; v=[12 11.5 11.2 11.8]

Expected: Only 10 s

Hints:
- Build low=v<11.5.
- Use t(low).

Worked reasoning: The mask is [false false true false]. The equal-to-threshold reading is not selected.

Tests:
- All values above the threshold produces empty output.
- A reading exactly 11.5 is excluded.

Extension: Return the matching voltages alongside their times.

## Stretch: Keep paired data aligned

Remove invalid negative distances while preserving the matching trial identifiers.

Input: trial=[101 102 103 104]; distance_m=[2 -1 4 0]

Expected: trial [101 103 104], distance [2 4 0]

Hints:
- Zero distance is valid under this contract.
- Use the same mask for both vectors.

Worked reasoning: valid=distance_m>=0; trial=trial(valid); distance_m=distance_m(valid). State whether missing values require a different check.

Tests:
- The retained arrays have the same length.
- Trial 104 is retained.

Extension: Add an explicit NaN value and decide a finite-data policy.

## Debug: The shifted clock

A program deletes value(2) after a sensor fault but leaves time unchanged, then plots them. Explain both the obvious and the subtle failure.

Input: time=[0 1 2]; value=[10 -999 12]

Expected: Use one validity mask; retained pairs are (0,10),(2,12).

Hints:
- Lengths may no longer agree.
- Padding or trimming to match lengths does not restore identity.

Worked reasoning: Mask both arrays together. Merely truncating time to two samples would silently attach 12 to t=1.

Tests:
- Plot input lengths match.
- The second valid reading remains at t=2.

Extension: Store paired data in a table in a later module.

## Recall

What is the difference between numel and size?

numel counts all elements; size reports the dimensions that describe their arrangement.

Why reuse a logical mask?

It preserves sample alignment across all variables filtered by the same validity decision.

Sources:
- MathWorks: array indexing: https://www.mathworks.com/help/matlab/learn_matlab/array-indexing.html

# MATLAB — Array operations and matrix meaning

The same symbols can mean a per-sample calculation or a linear transformation. Aerospace calculations use both.

Suppose you have several measured speeds and want their squares. Each speed should be squared independently, so use .^2. If you instead have a matrix representing a transformation, multiplying that matrix by itself has a different mathematical meaning. The dot in an operator is a statement about the operation, not a cosmetic syntax fix. Write one small result by hand before applying an unfamiliar operator to a large array.

Shape is part of the contract. Two row vectors can be combined element by element. A row vector and a column vector can produce an entire grid through implicit expansion. That feature is useful for parameter sweeps, but it can also turn an intended four-sample result into a four-by-four matrix without an error. Inspect size before and after important operations and explain the meaning of each output dimension.

In this module you need multiplication, powers, and basic matrix multiplication; advanced linear algebra can come later. Think of a matrix-vector product as weighted combinations of inputs. For example, two simple sensor combinations can be represented by two rows. Do not memorize a blanket rule to put dots everywhere: that would break genuine matrix equations. Your goal is to recognize whether corresponding samples or coupled variables are being combined.

## Example

```
speed_mps = [1 2 3];
energy_j = 0.5*2.*speed_mps.^2;
A = [1 1; 1 -1];
y = A*[3; 1];
```

The energies are [1 4 9] J for a 2 kg mass. The independent matrix example returns [4;2].

## Start: Square each speed

Calculate one-half mass times speed squared for each sample.

Input: mass_kg=4; speed_mps=[0 2 3]

Expected: [0 8 18] J

Hints:
- Use speed_mps.^2.
- Check the scalar mass separately.

Worked reasoning: energy_j=0.5*mass_kg.*speed_mps.^2. Each output belongs to the corresponding speed sample.

Tests:
- At zero speed energy is zero.
- Doubling speed multiplies energy by four.

Extension: Plot energy against speed with units.

## Build: Read a transformation

Compute the two weighted sensor combinations represented by A*x.

Input: A=[2 0;1 3]; x=[4;2]

Expected: [8;10]

Hints:
- The first output uses the first row.
- The second output is 1*4+3*2.

Worked reasoning: Matrix multiplication combines rows with the input column. A.*x would express a different operation.

Tests:
- The output is 2-by-1.
- Replacing x with [0;0] gives zeros.

Extension: Describe each row as a plain-language formula.

## Stretch: Intentional parameter grid

Create energies for masses [1;2] kg and speeds [1 2 3] m/s using implicit expansion, then explain the axes.

Input: mass=[1;2]; speed=[1 2 3]

Expected: [0.5 2 4.5;1 4 9] J

Hints:
- Keep mass a column.
- Rows should identify masses.

Worked reasoning: 0.5*mass.*speed.^2 forms all mass-speed combinations. This is a grid, not two paired records.

Tests:
- Output size is 2-by-3.
- Second row is twice the first.

Extension: Add row and column labels before exporting the grid.

## Debug: The accidental grid

A calculation intended three paired products but returned a 3-by-3 array. Repair the representation.

Input: a=[1 2 3]; b=[10;20;30]; result=a.*b

Expected: Paired products [10 40 90], if a row output is chosen.

Hints:
- Inspect both shapes.
- Choose a consistent orientation deliberately.

Worked reasoning: Use a.*b.' or convert both to columns with a(:).*b(:). The original expanded every combination.

Tests:
- Exactly three outputs remain.
- The middle paired product is 40.

Extension: Add a shape assertion before multiplying.

## Recall

When is .* appropriate?

When the intended mathematics multiplies corresponding elements or deliberately expanded combinations.

Why can a shape error produce no exception?

Implicit expansion can make mismatched orientations mathematically compatible while still violating the intended data contract.

Sources:
- MathWorks: array versus matrix operations: https://www.mathworks.com/help/matlab/matlab_prog/array-vs-matrix-operations.html

# MATLAB — Plots that support a claim

A plot is often the first thing a project reviewer sees. It should make the evidence easier to evaluate.

A line plot joins your supplied points; it does not prove that the physical system followed a straight line between them. Markers reveal where data actually exists. Before plotting, ask what claim the figure should support: a temperature rose, two runs differ, or a model misses a transient. Choose axes and labels that let a reader test that claim. Use seconds, degrees Celsius, volts, or other explicit units rather than relying on a caption remembered from class.

Keep comparisons fair. Two runs shown on different scales can look deceptively similar. Plot them together when appropriate and distinguish them using markers or line styles as well as color. When time grids differ, do not silently treat sample index as time. Show each run on its actual timestamps, and label invented data as invented. Save the code that produced the figure so a corrected measurement can regenerate it.

Visual polish should follow data checks. Inspect vector lengths, order, missing values, and bounds before adjusting colors. A jagged line may expose a real problem worth investigating, while smoothing may hide it. For a small lesson dataset, calculate one plotted point independently. For a later report, include the data source, processing decisions, and limitations. This turns a picture into a reproducible piece of engineering evidence.

## Example

```
t_s = [0 10 20 30];
measured_c = [20 22 25 27];
plot(t_s,measured_c,"o-");
xlabel("Time (s)"); ylabel("Temperature (°C)");
grid on;
```

Markers expose the four sample times. The line is a visual connection, not an independently validated continuous model.

## Start: Label a warm-up

Plot the given temperatures against actual time and show sample markers.

Input: t_s=[0 5 15]; T_c=[20 24 26]

Expected: Points (0,20),(5,24),(15,26), axes labeled seconds and °C.

Hints:
- Pass both x and y.
- Use a marker style such as o-.

Worked reasoning: plot(t_s,T_c,"o-"); xlabel("Time (s)"); ylabel("Temperature (°C)"). The unequal spacing must remain visible.

Tests:
- The final timestamp is 15, not 3.
- All three sample markers appear.

Extension: Explain what is unknown between samples.

## Build: Compare two runs

Show both runs on common axes with a meaningful legend.

Input: t=[0 1 2]; runA=[20 22 24]; runB=[20 21 23]

Expected: At t=2, A is 1 °C warmer than B.

Hints:
- Plot two x/y pairs.
- Use different marker shapes.

Worked reasoning: plot(t,runA,"o-",t,runB,"s--"); legend("Run A","Run B"); add units. The claim concerns these samples only.

Tests:
- Both start at 20 °C.
- Legend identity matches line identity.

Extension: Add a difference plot on a separate axis.

## Stretch: Model residual figure

Plot measured-minus-predicted residuals and identify whether the model is consistently low.

Input: measured=[20 23 26]; predicted=[20 22 24]

Expected: Residuals [0 1 2] °C; prediction is low at the latter two samples.

Hints:
- Subtract in the stated order.
- Include a zero reference.

Worked reasoning: residual=measured-predicted. The increasing residual suggests an error pattern worth investigating, not proof of a particular cause.

Tests:
- The first residual is zero.
- Swapping subtraction reverses the sign and requires relabeling.

Extension: Describe two model assumptions that could be tested next.

## Debug: The wrong clock label

A chart uses plot(T) and xlabel("Time (s)") although samples were collected every ten seconds starting at zero. Repair it.

Input: T=[20 21 24 25]

Expected: Explicit times [0 10 20 30] s

Hints:
- The default x values are indices.
- Build the actual time vector.

Worked reasoning: t=(0:numel(T)-1)*10; plot(t,T,"o-"). Without this correction the plot misstates both origin and duration.

Tests:
- First point is at 0 s.
- Last point is at 30 s.

Extension: Handle an irregular time vector.

## Recall

What does a marker contribute?

It identifies actual supplied samples rather than letting a connecting line imply continuous observation.

Why save plotting code?

It records how data became a figure and lets corrected inputs regenerate the same analysis.

Sources:
- MathWorks: plot: https://www.mathworks.com/help/matlab/ref/plot.html

# MATLAB — Functions and input contracts

A thermal equation reused across several scripts should have one tested implementation, not five slightly different copies.

A function makes a boundary around a calculation. Inputs cross into it, outputs come back, and local intermediate values stay inside. That boundary gives you a place to state units, valid ranges, and array shapes. Start with a scalar conversion rather than a large simulation. Decide whether the function accepts one number, a vector, or both before writing the body.

Validation is not decoration. A cooling time constant must be positive, and a measured duration should not silently become complex or infinite. Reject inputs that do not belong to the intended model. Conversely, do not invent an unnecessary restriction just because the first example used a positive temperature: negative Celsius temperatures are physically ordinary. The contract should follow the quantity, not a convenient example.

Keep numerical work separate from presentation. A function returning energy can be tested without opening a figure or reading a file. Another script can gather inputs and plot the result. This separation makes homework easier to debug and later lets a batch of simulation runs call the same model. Use a function file matching the function name, include a short help comment, and test a known value before making the interface broader.

## Example

```
function kelvin = celsius_to_kelvin(celsius)
% Convert finite temperatures at or above absolute zero.
assert(isnumeric(celsius) && isreal(celsius));
assert(all(isfinite(celsius(:))) && all(celsius(:)>=-273.15));
kelvin = celsius + 273.15;
end
```

Save as celsius_to_kelvin.m. The validation permits negative Celsius values above absolute zero.

## Start: Conversion function

Write a function converting minutes to seconds for nonnegative finite numeric input.

Input: [0 1 2.5] minutes

Expected: [0 60 150] seconds

Hints:
- Multiplication by 60 works on an array.
- Validate the whole input, not only its first element.

Worked reasoning: Return minutes*60 after checking finite real nonnegative values. Use a name that includes the direction of conversion.

Tests:
- 0 returns 0.
- A negative value is rejected.

Extension: Document whether an empty input is accepted.

## Build: Energy interface

Write energy_j(power_w,duration_s) for scalar nonnegative finite inputs. Keep printing outside it.

Input: 12 W, 20 s

Expected: 240 J

Hints:
- Start with scalar inputs only.
- A return value is easier to test than a printed sentence.

Worked reasoning: The function checks scalar size and range, then returns power_w*duration_s. The caller labels the result.

Tests:
- Zero duration gives zero.
- A vector is rejected under this contract.

Extension: Extend deliberately to equal-sized arrays.

## Stretch: Cooling contract

Design the input checks for T=Ta+(T0-Ta)*exp(-t/tau), accepting vector t and scalar parameters.

Input: t=[0 10], tau=10, T0=30, Ta=20

Expected: [30, 23.6788...] °C

Hints:
- tau must be positive.
- t must be nonnegative; temperatures can be negative.

Worked reasoning: Validate real finite values, positive scalar tau, scalar temperatures, and nonnegative t. Return an array with t’s shape.

Tests:
- t=0 returns T0.
- tau=0 is rejected.

Extension: Add help text explaining the lumped-model assumption.

## Debug: Invisible dependency

A function accepts duration_s but refers to power_w without an input or local assignment. It worked as a script. Repair its design.

Input: function E=energy(duration_s); E=power_w*duration_s; end

Expected: power_w must become an explicit input.

Hints:
- Functions have their own workspace.
- Do not repair this with a global variable.

Worked reasoning: Use function E=energy(power_w,duration_s). Call energy(12,20), then test 240 J.

Tests:
- Calling with documented inputs works in a fresh session.
- Changing caller variable names does not change the function.

Extension: Find another hidden assumption and move it into the contract.

## Recall

Why keep plotting outside a small model function?

It makes the numerical result independently testable and reusable in other interfaces.

What belongs in an input contract?

Units, types, sizes, valid ranges, missing-data policy, and the meaning of each output.

Sources:
- MathWorks: functions: https://www.mathworks.com/help/matlab/ref/function.html

# MATLAB — Importing logs without trusting them blindly

Real experimental logs contain empty cells, inconsistent units, duplicate times, and malformed values. Import success does not mean scientific validity.

A table attaches names to columns and keeps related measurements together. That is useful for a log containing time, temperature, and operating mode. Read the file, then inspect the variable names, types, and a few rows before applying a formula. A column that looks numeric in a spreadsheet may arrive as text because one row contains a unit suffix or a status word.

Define the data contract before cleaning. Is time measured in seconds from the start or represented by calendar timestamps? Can two measurements have the same time? Does a blank mean missing, zero, or not applicable? Retain the original file and construct a separate validity mask or cleaned table. Record how many rows were excluded and why; the removal itself can affect your conclusion.

Use synthetic files to test the importer before relying on an expensive experiment. Include one normal row, one missing value, one duplicate time, and one out-of-order row. Decide whether to reject, retain with a flag, or sort each case. Sorting is not automatically harmless because it can hide a logging-order problem. An honest report distinguishes what the instrument measured from what the analysis inferred or repaired.

## Example

```
T = readtable("sensor_log.csv");
required = ["time_s","temperature_c"];
assert(all(ismember(required,string(T.Properties.VariableNames))));
valid = isfinite(T.time_s) & isfinite(T.temperature_c);
clean = T(valid,:);
excluded = sum(~valid);
```

The example checks expected column names and removes nonfinite numeric rows into a new table; inspect imported types before using it.

## Start: Read a tiny CSV

Create a three-row CSV in a scratch folder, import it, and report row count and column names.

Input: time_s,temperature_c followed by 0,20; 1,21; 2,22

Expected: 3 rows; time_s and temperature_c

Hints:
- Use header names carrying units.
- Inspect the table before calculation.

Worked reasoning: readtable reads the file; height(T) gives three. Confirm both columns are numeric and names match the contract.

Tests:
- First time is zero.
- Last temperature is 22.

Extension: Add an operating-mode text column.

## Build: Missing measurement audit

Keep finite temperatures and count missing rows without changing the original table.

Input: time=[0;1;2;3], temperature=[20;NaN;22;23]

Expected: 3 valid rows, 1 excluded; retained times [0;2;3]

Hints:
- Use isfinite.
- Select complete rows with the mask.

Worked reasoning: valid=isfinite(T.temperature_c); clean=T(valid,:); excluded=sum(~valid). This does not invent a temperature at t=1.

Tests:
- Raw table still has 4 rows.
- The gap at 1 s remains visible.

Extension: Plot the gap instead of joining across it automatically.

## Stretch: Timestamp policy

Specify and implement a check for strictly increasing time. Explain what you would do with a violation.

Input: time_s=[0;1;1;3]

Expected: The duplicate at the third row violates strict increase.

Hints:
- diff gives adjacent changes.
- A zero difference is not positive.

Worked reasoning: all(diff(time_s)>0) is false. Return a diagnostic with the offending row pair; do not silently average duplicate readings without a stated rule.

Tests:
- [0;1;2] passes.
- [0;2;1] fails for a different reason.

Extension: Separate duplicate and reverse-order diagnostics.

## Debug: A missing value becomes ice

A cleaning script replaces NaN temperature with 0 before averaging. Diagnose the scientific error.

Input: temperature_c=[20 NaN 22]

Expected: Known-data mean is 21 °C; zero substitution produces 14 °C.

Hints:
- Missing is not measured zero.
- State the denominator used in the average.

Worked reasoning: Retain missingness, report two valid observations and one missing, and compute the mean only under an explicit known-data policy.

Tests:
- The valid count is 2.
- An all-missing set reports no estimate.

Extension: Explain why interpolation also requires assumptions.

## Recall

Why retain the raw file?

It preserves evidence and allows cleaning choices to be audited or revised.

What should accompany a cleaned-data result?

The validity policy, number and reasons for excluded records, units, and any interpolation or sorting decisions.

Sources:
- MathWorks: readtable: https://www.mathworks.com/help/matlab/ref/readtable.html

# MATLAB — Tests, tolerances, and useful failures

A simulation may run without crashing while returning the wrong answer. Tests give correctness a visible definition.

Start with a case whose result you know independently. A zero-duration energy calculation should return zero. A cooling model at its initial time should return the initial temperature. These are stronger tests than merely repeating the implementation’s formula in a second place. Include one ordinary value, one boundary, and one invalid input so the interface is tested as well as the arithmetic.

Floating-point calculations often need tolerances. An absolute tolerance measures an acceptable error in the output’s units; a relative tolerance scales with the reference magnitude. Neither should be chosen only to make a failing test pass. Near zero, relative error alone is awkward. State the reason for a tolerance and keep measurement uncertainty distinct from numerical rounding: they are different questions.

A failing test is useful information. Reduce the input to the smallest example that still fails, inspect intermediate quantities, and identify which assumption broke. Assertions can document invariants while developing a script, and larger projects can grow into MATLAB’s testing framework. Keep tests runnable without clicking through figures or requiring private files. A future version of you should be able to reproduce a failure with one clear command.

## Example

```
expected_j = 240;
actual_j = 12*20;
assert(abs(actual_j-expected_j)<1e-10,"Energy check failed");
x = 0.1+0.2;
assert(abs(x-0.3)<1e-12);
```

The second comparison allows tiny representation error instead of demanding exact equality of decimal arithmetic.

## Start: Boundary test

Write tests for a minutes-to-seconds conversion at 0, 1, and 2.5 minutes.

Input: Expected seconds [0 60 150]

Expected: All three pass; a mistaken factor of 100 fails.

Hints:
- Select values with simple independent answers.
- Check every expected value.

Worked reasoning: Use assert on the known outputs. Integer and half-minute cases make the conversion mistake obvious.

Tests:
- Introduce factor 100 and observe failure.
- Restore 60 and rerun.

Extension: Test a negative input rejection.

## Build: Mixed tolerance

Write a comparison using abs(actual-reference)<=atol+rtol*abs(reference).

Input: actual=1000.001, reference=1000, atol=1e-6, rtol=1e-5

Expected: Pass, since 0.001 is less than about 0.010001.

Hints:
- Compute the allowed error separately.
- The reference supplies the scale.

Worked reasoning: allowed=atol+rtol*abs(reference); compare absolute error with allowed. Document why these tolerances fit the problem.

Tests:
- A 1-unit error fails.
- A zero reference is governed by atol.

Extension: Use a different tolerance for a quantity measured in millimeters.

## Stretch: Physical invariant

Design three model tests for passive cooling toward a constant ambient with positive time constant.

Input: T0=40, Ta=20, tau=30, t>=0

Expected: Initial value 40; values remain between 20 and 40; temperature decreases.

Hints:
- Use limits and monotonicity.
- Choose a finite time grid.

Worked reasoning: Check T(0)=40 within tolerance, all T>=20 and T<=40, and diff(T)<=small_tolerance. These verify model properties independently of a chosen output vector.

Tests:
- Equal initial and ambient temperatures stay constant.
- Negative tau is rejected.

Extension: Explain why these tests still do not validate real hardware.

## Debug: Tolerance hides a unit error

A result of 240000 is accepted against reference 240 using atol=1e6. Diagnose the test and model.

Input: Power was entered in milliwatts but treated as watts.

Expected: Correct output is 240 J; the error is 1000-fold.

Hints:
- Check input units before changing tolerances.
- A passing test is only as meaningful as its acceptance rule.

Worked reasoning: Convert milliwatts to watts and choose tolerance based on the intended numerical calculation. Keep a known unit-conversion test.

Tests:
- The 1000-fold error must fail.
- A rounding-scale difference may pass.

Extension: Add a test documenting the input unit.

## Recall

What is an invariant?

A property expected to remain true across a range of valid inputs, such as a conserved total or a bounded passive response.

Why is numerical tolerance different from measurement uncertainty?

Tolerance checks computation against a reference; uncertainty describes incomplete knowledge of the physical input or observation.

Sources:
- MathWorks: assert: https://www.mathworks.com/help/matlab/ref/assert.html

# MATLAB — Linear systems and residuals

Statics, circuits, numerical models, and estimation all lead to linear systems. Knowing how to question a solution matters as much as obtaining it.

A linear system A*x=b represents several coupled equations. Each row is an equation and each column corresponds to an unknown. Before typing matrices, write the unknown order explicitly and check coefficient units. A correct solver cannot repair a column that accidentally switched from one unknown to another halfway through the model. Begin with a two-equation system you can solve by substitution.

Use the backslash operator for a numerical solve rather than explicitly forming an inverse. Then calculate the residual A*x-b and inspect its size relative to the scale of the problem. A small residual means the computed answer satisfies the entered equations closely. It does not prove the equations represent reality, nor guarantee that the solution is insensitive to tiny changes in data.

Nearly dependent equations deserve attention. If two measurements provide almost the same information, small measurement differences can cause large changes in inferred unknowns. This is conditioning, not simply a MATLAB bug. Perturb one right-hand-side value slightly and observe the result. Later linear algebra courses explain norms, rank, and condition numbers; this module gives you concrete questions to carry into that mathematics.

## Example

```
A = [2 1;1 -1];
b = [5;1];
x = A\b;
residual = A*x-b;
disp(x); disp(norm(residual));
```

The solution is [2;1], and the residual is zero up to numerical rounding.

## Start: Two equations

Solve 2x+y=5 and x-y=1, then substitute the result manually.

Input: A=[2 1;1 -1], b=[5;1]

Expected: x=2, y=1

Hints:
- Subtract or substitute on paper first.
- The right-hand side is a column.

Worked reasoning: A\b gives [2;1]; 2*2+1=5 and 2-1=1 verify both equations.

Tests:
- Residual norm is near zero.
- Output has two entries.

Extension: Change the second right-hand side to zero and predict the result.

## Build: Residual audit

Check the proposed solution [1;1] against the same system.

Input: A=[2 1;1 -1], b=[5;1], candidate=[1;1]

Expected: Residual [-2;-1], norm sqrt(5).

Hints:
- Calculate A*candidate first.
- Subtract b in the stated direction.

Worked reasoning: A*candidate=[3;0], so the residual is [-2;-1]. The candidate does not solve the entered equations.

Tests:
- The true [2;1] produces near-zero residual.
- Reversing subtraction changes signs, not norm.

Extension: Report per-equation residuals with the relevant units.

## Stretch: Sensitivity experiment

Compare solutions before and after changing the second entry of b by 0.0001.

Input: A=[1 1;1 1.0001], b=[2;2.0001]

Expected: Initial [1;1]; changed b=[2;2.0002] gives approximately [0;2].

Hints:
- Subtract the two equations by hand.
- The equations are nearly redundant.

Worked reasoning: The difference equation has coefficient 0.0001 on the second unknown. A tiny data change therefore creates a large solution change.

Tests:
- Both solutions can have small residuals.
- A better-separated A should be less sensitive.

Extension: Explain why more output digits would not fix uncertain inputs.

## Debug: Unknown order mismatch

A model defines x=[forceA;forceB], but the second row’s coefficients were entered in reverse order. Can a small residual reveal the mistake?

Input: Entered A differs from the intended equation.

Expected: No: a solver can exactly solve the wrong system.

Hints:
- Separate implementation verification from model validation.
- Reconstruct each row in words.

Worked reasoning: Audit the mapping from equations to columns and correct A. Recheck against an independently derived case, not only the residual.

Tests:
- Every column keeps one unknown meaning.
- A hand-solved case agrees.

Extension: Add a diagram or variable-order table to the report.

## Recall

What does the residual measure?

How closely the computed values satisfy the equations that were actually entered.

Can a small residual coexist with a sensitive solution?

Yes. An ill-conditioned system can be solved with a small residual while small input perturbations strongly change the answer.

Sources:
- MathWorks: numerical linear solve: https://www.mathworks.com/help/matlab/ref/double.mldivide.html

# MATLAB — Integrating sampled power

A rover or habitat consumes changing power. Multiplying one reading by total duration may miss the actual energy history.

An integral accumulates a rate over an interval. For power measured in watts and time in seconds, the area under the power curve is energy in joules. Sampled data does not reveal the complete curve, so numerical integration introduces an approximation. The trapezoidal rule assumes straight segments between neighboring samples and adds the resulting areas.

Pass actual timestamps to trapz. Calling trapz(power) alone assumes unit spacing, which is wrong when readings are ten seconds apart or irregularly spaced. Verify that time increases and that each power value belongs to the corresponding timestamp. Missing intervals deserve a stated policy; joining across a long gap makes a strong assumption about unobserved behavior.

Use a function with a known integral to evaluate your method before using real data. Constant and linearly changing power are especially useful because trapezoidal integration is exact apart from rounding. For a curved function, reduce the step size and compare results. This convergence experiment separates a coding error from an approximation that improves with better sampling. Calculus gives the interpretation; the program gives a reproducible numerical experiment.

## Example

```
t_s = [0 2 5];
power_w = [10 14 20];
energy_j = trapz(t_s,power_w);
```

The two trapezoids contribute 24 J and 51 J, totaling 75 J.

## Start: Constant power

Integrate 5 W over four seconds from three samples.

Input: t=[0 2 4], P=[5 5 5]

Expected: 20 J

Hints:
- Area is a rectangle.
- Pass t explicitly.

Worked reasoning: trapz(t,P)=20; independently 5 W*4 s=20 J.

Tests:
- Doubling power doubles energy.
- Doubling time span doubles energy.

Extension: Try irregular times [0 1 4] with the same constant power.

## Build: Irregular trapezoids

Compute energy and each interval contribution.

Input: t=[0 2 5], P=[10 14 20]

Expected: 24 J + 51 J = 75 J

Hints:
- Average adjacent powers.
- Multiply by each interval length.

Worked reasoning: (10+14)/2*2=24; (14+20)/2*3=51. Their sum agrees with trapz.

Tests:
- There are two intervals, not three.
- All contributions are nonnegative here.

Extension: Plot cumulative energy at the sample times.

## Stretch: Convergence on a curve

Compare trapezoidal estimates of the integral of t^2 from 0 to 1 using steps 0.5 and 0.25.

Input: Analytic answer 1/3

Expected: 0.375 and 0.34375, approaching 0.333333...

Hints:
- Generate the grid including both endpoints.
- Report absolute error.

Worked reasoning: The first error is 1/24; the second is 1/96. Here halving step divides the error by four. Do not generalize this ratio to arbitrary missing or noisy data.

Tests:
- Both estimates exceed 1/3.
- A constant function remains exact.

Extension: Try 0.125 and explain the pattern.

## Debug: The missing time scale

A log sampled every 10 s is integrated using trapz(P). Explain the factor error.

Input: P=[2 2 2], actual t=[0 10 20]

Expected: Correct 40 J; unit-spacing call returns 4.

Hints:
- Inspect the assumed x spacing.
- Units expose the error.

Worked reasoning: Use trapz(t,P) or trapz(P)*10 only when constant spacing is established.

Tests:
- The corrected duration is 20 s.
- An irregular log must use its timestamp vector.

Extension: Write a check rejecting nonincreasing time.

## Recall

Why pass timestamps to trapz?

They define the width and units of each interval, including irregular spacing.

What does convergence testing show?

How a numerical result changes as resolution improves; it does not establish that the physical model is correct.

Sources:
- MathWorks: trapz: https://www.mathworks.com/help/matlab/ref/trapz.html

# MATLAB — Interpolation is an assumption

Sensors and simulations often report at different times. Comparing them requires an explicit rule for values between samples.

Interpolation estimates a value inside the range of supplied data. Linear interpolation connects adjacent observations by a straight segment. It is easy to explain and a useful starting point when no stronger model is justified. It is not a new measurement, and a denser interpolated curve does not contain more experimental information than the original samples.

Extrapolation asks for values outside the observed range and is a different risk. A sensor that warmed steadily for ten seconds need not continue at the same rate for an hour. Choose an explicit out-of-range policy: reject the query, retain a missing value, or use a separately justified model. Do not enable extrapolation simply to eliminate NaNs from a plot.

When comparing two logs, choose the comparison timestamps first and preserve the originals. Check time order, duplicate times, units, and gaps before interpolating. For a status flag or operating mode, a continuous interpolation may be meaningless; a previous-value rule could be appropriate only if the state is understood to persist. The engineering meaning of the quantity determines the mathematical operation.

## Example

```
t_s = [0 10 20];
T_c = [20 30 34];
query_s = [5 15];
estimate_c = interp1(t_s,T_c,query_s,"linear");
```

The estimates are [25 32] °C. They lie halfway between adjacent samples.

## Start: Midpoint estimate

Estimate temperature at 5 s with linear interpolation.

Input: t=[0 10], T=[20 30]

Expected: 25 °C

Hints:
- Five seconds is halfway.
- Weight both endpoints equally.

Worked reasoning: interp1(t,T,5,"linear") gives 25. This follows the straight-line assumption.

Tests:
- Query at 0 gives 20.
- Query at 10 gives 30.

Extension: Estimate at 2 s and explain the weight.

## Build: Unequal interval

Estimate a value at 3 s using endpoints 1 s and 7 s.

Input: t=[1 7], y=[10 22]

Expected: 14

Hints:
- The fraction is (3-1)/(7-1).
- Apply that fraction to the value difference.

Worked reasoning: 10+(2/6)*(22-10)=14. The timestamps are not array indices.

Tests:
- The result lies between endpoint values.
- Query 4 gives 16.

Extension: Implement the formula once and compare to interp1.

## Stretch: Overlap-only comparison

Find valid comparison times for two logs before interpolating.

Input: A spans [0,20] s; B spans [5,25] s; query=[0 5 10 15 20 25]

Expected: Use [5 10 15 20] s only.

Hints:
- Find the interval intersection.
- Avoid extrapolating either log.

Worked reasoning: The shared interval is [max(0,5),min(20,25)]=[5,20]. Mask query times to this interval before computing differences.

Tests:
- Both endpoints are allowed.
- Disjoint intervals produce no comparison.

Extension: Report how much of each run is excluded.

## Debug: A fractional operating mode

A mode log uses 0=idle and 1=active. Linear interpolation gives mode 0.5 between transitions. Diagnose it.

Input: t=[0 10], mode=[0 1], query=5

Expected: 0.5 is not a defined mode.

Hints:
- These values are labels.
- Ask when the transition is known to occur.

Worked reasoning: Do not apply continuous interpolation blindly. If a logged state persists until its next update, document and use previous-value behavior; otherwise mark the transition interval uncertain.

Tests:
- Outputs must be defined states.
- The transition convention is documented.

Extension: Keep an uncertainty interval around unknown transition timing.

## Recall

Does interpolation create new evidence?

No. It creates estimates between supplied observations under a chosen rule.

What distinguishes extrapolation?

The query lies outside the observed range, where the interpolation assumptions have no bracketing data support.

Sources:
- MathWorks: interp1: https://www.mathworks.com/help/matlab/ref/double.interp1.html

# MATLAB — Fit a model and question its residuals

Calibration and experiment analysis often need a model, but a high-order curve can hide problems rather than explain them.

Curve fitting chooses parameters that make a model agree with data according to an objective. For a first calibration exercise, fit a straight line and interpret its slope and intercept with units. A polynomial degree is a modeling choice, not a quality setting. More coefficients can reduce training residuals while making predictions unstable or physically implausible.

Residuals are measured values minus model predictions at the same inputs. Plot them against the input and against collection order. A trend may suggest missing physics, an offset may suggest calibration bias, and isolated outliers may suggest data problems. None of these patterns proves a cause by itself. Use them to decide which assumption or measurement deserves another experiment.

Keep some evidence separate from fitting when possible. A held-out observation tests prediction more honestly than a point used to select parameters. Also report the range over which data supports the fit; extrapolating a calibration line far beyond its observations can be unjustified. You need basic algebra for the line, while later statistics provides deeper tools for uncertainty and model comparison.

## Example

```
x = [0 1 2 3];
y = [1 3 5 7];
p = polyfit(x,y,1);
predicted = polyval(p,x);
residual = y-predicted;
```

The fitted coefficients are approximately [2 1]. Residuals are zero up to rounding for this invented exact line.

## Start: An exact line

Fit a first-degree polynomial to four exact points and predict y at x=4.

Input: x=[0 1 2 3], y=[1 3 5 7]

Expected: p=[2 1], prediction 9

Hints:
- A line has slope and intercept.
- MATLAB stores the highest-power coefficient first.

Worked reasoning: polyfit(x,y,1) yields [2 1] within rounding; polyval(p,4)=9. This last point is extrapolated.

Tests:
- At x=0 output is 1.
- All training residuals are near zero.

Extension: Label the x=4 prediction as extrapolation.

## Build: Residual sign

Calculate residuals and identify whether predictions are high or low.

Input: measured=[10 12 15], predicted=[11 12 13]

Expected: [-1 0 2]; first prediction high, last low.

Hints:
- Use measured minus predicted.
- Interpret signs explicitly.

Worked reasoning: Subtract corresponding values. A positive residual means the measured quantity exceeded the prediction under this convention.

Tests:
- Middle residual is zero.
- Signs reverse if convention reverses.

Extension: Make a labeled residual chart.

## Stretch: Hold out an observation

Fit the first three exact points, then evaluate a fourth observation without refitting.

Input: train x=[0 1 2], y=[1 3 5]; test x=3, y=7.4

Expected: Prediction 7, test residual 0.4

Hints:
- Do not include the test observation in polyfit.
- Keep a separate variable for validation.

Worked reasoning: The trained line is y=2x+1. At x=3 it predicts 7; the held-out observation differs by 0.4. Investigate whether that error is acceptable in context.

Tests:
- Training residuals remain near zero.
- Test error is reported separately.

Extension: Repeat with several held-out points.

## Debug: Perfect but unhelpful

A student raises polynomial degree until every noisy calibration point is matched, then calls it validated. Explain the failure.

Input: Six noisy samples and a degree-five polynomial.

Expected: Interpolation of training samples does not establish predictive or physical validity.

Hints:
- Count model freedom.
- Ask what independent evidence remains.

Worked reasoning: Use a justified simple model, inspect residuals, and evaluate separate data. Degree should reflect the question and data support, not a goal of zero training error.

Tests:
- Report held-out error.
- Check behavior between and outside observations.

Extension: Compare line and quadratic using the same withheld data.

## Recall

What does polyfit degree 1 represent?

A straight-line least-squares model with slope and intercept.

Why inspect residuals?

Their magnitude and structure expose disagreements hidden by an attractive overlaid curve and guide further validation.

Sources:
- MathWorks: polyfit: https://www.mathworks.com/help/matlab/ref/polyfit.html

# MATLAB — Solve an equation, then verify the root

Engineering equilibrium and threshold questions often reduce to finding where a model equals a target.

A root is an input at which a function is zero. If you want a cooling model to reach 25 °C, subtract 25 from the model and solve the resulting equation. This reformulation is more useful than searching a plot by eye. Define the physical domain and units before calling a solver, and inspect the function near the proposed interval.

A bracket with opposite endpoint signs is useful for a continuous function because it identifies a crossing. It does not guarantee that every function is appropriate for the method: discontinuities, invalid model regions, and roots that only touch zero require care. fzero returns a numerical answer together with diagnostics that should be read rather than ignored.

After solving, evaluate the original model at the returned input and check the residual in meaningful units. Ask whether the root lies within the model’s supported domain and whether multiple roots could answer different questions. For a simple exercise, compare against algebra. This creates a habit of treating numerical solvers as tools for a specified problem instead of mysterious buttons that confer correctness.

## Example

```
f = @(x) x.^2-9;
[root,residual,flag] = fzero(f,[0 5]);
assert(flag>0 && abs(residual)<1e-8);
```

The positive root is 3. The bracket selects the positive crossing rather than the negative root.

## Start: A known root

Find the positive root of x^2-9 using [0,5].

Input: f(0)=-9, f(5)=16

Expected: 3

Hints:
- Endpoint signs differ.
- Check by squaring.

Worked reasoning: fzero(@(x)x.^2-9,[0 5]) returns approximately 3; 3^2-9=0.

Tests:
- The result is within the bracket.
- The residual is small.

Extension: Find the negative root with a different bracket.

## Build: A threshold time

Solve when T(t)=20+20*exp(-t/30) reaches 25 °C.

Input: Bracket [0,100] s

Expected: 30*log(4) ≈ 41.5888 s

Hints:
- Subtract 25 from T.
- Use algebra as a second method.

Worked reasoning: 20*exp(-t/30)=5 gives t=30*log(4). The numeric solver should agree within tolerance.

Tests:
- T(0)=40 is above target.
- T(100) is below target.

Extension: Change target to 30 °C and compare times.

## Stretch: No finite crossing

Explain why the same model never reaches exactly 20 °C at a finite nonnegative time.

Input: T(t)=20+20*exp(-t/30)

Expected: 20 °C is an asymptote.

Hints:
- The exponential remains positive for finite t.
- Separate a tolerance threshold from exact equality.

Worked reasoning: Do not force a finite root by extending the interval. Define a practical condition such as T-20<=0.1 if that is scientifically justified.

Tests:
- T(t)>20 for finite t in exact arithmetic.
- A tolerance target above 20 has a finite crossing.

Extension: Solve the 0.1 °C difference threshold analytically.

## Debug: A sign change at a jump

A piecewise function is -1 below x=0 and +1 at or above x=0. Does a sign-changing bracket prove it has a root?

Input: Bracket [-1,1]

Expected: No; the function never equals zero.

Hints:
- Continuity matters.
- Evaluate the function at the proposed answer.

Worked reasoning: The intermediate-value argument does not apply across a jump. A solver’s location near zero is not a valid zero-residual solution.

Tests:
- Residual magnitude remains 1.
- The discontinuity is documented.

Extension: Construct a continuous comparison function.

## Recall

Why evaluate the residual after solving?

It verifies that the returned input actually satisfies the intended numerical condition.

Why does a bracket need context?

Sign changes can come from discontinuities or invalid model regions, and the physical domain may exclude some mathematical roots.

Sources:
- MathWorks: fzero: https://www.mathworks.com/help/matlab/ref/fzero.html

# MATLAB — Differential equations and a cooling model

Dynamics and thermal engineering describe rates of change. Coding makes those equations testable, provided the physical assumptions stay visible.

This lesson belongs after introductory calculus and differential equations. The model dT/dt=-(T-Ta)/tau says the temperature changes in proportion to its difference from a fixed ambient temperature. A positive time constant creates passive relaxation. This is a lumped model: the entire object has one temperature, with constant parameters and no spatial gradients.

An ODE solver needs the rate function, a time interval, and an initial condition. It returns a numerical trajectory, not the physical truth. Begin with this equation because its analytic solution is available. Compare numerical and analytic values at the same returned times; comparing mismatched grids can create an artificial error. Tightening solver tolerances is a numerical experiment, not a way to repair a wrong physical equation.

Before adding another state, verify initial value, direction, units, and limiting behavior. If the object starts warmer than ambient, it should cool toward ambient without overshooting in this model. If it starts at ambient, it should remain there. Real systems can violate these predictions because of internal heat generation, varying airflow, radiation, multiple thermal masses, or sensor lag. Those are reasons to revise the model after evidence, not to hide the disagreement.

## Example

```
Ta = 20; tau = 30; T0 = 40;
rate = @(t,T) -(T-Ta)/tau;
[t,T] = ode45(rate,[0 120],T0);
exact = Ta+(T0-Ta)*exp(-t/tau);
max_error = max(abs(T-exact));
```

The analytic comparison uses the solver’s returned time vector. The rate has units °C/s when tau is in seconds.

## Start: Initial derivative

Calculate the initial cooling rate before running a solver.

Input: T0=40 °C, Ta=20 °C, tau=30 s

Expected: -2/3 °C/s

Hints:
- Subtract ambient first.
- Positive temperature difference should produce cooling.

Worked reasoning: -(40-20)/30=-0.666666... °C/s. A positive result would reveal a sign mistake.

Tests:
- At T=Ta the derivative is zero.
- At T below Ta the derivative is positive.

Extension: Explain why a temperature difference can be expressed in K or °C.

## Build: One time constant

Compare numerical and analytic temperature at t=30 s.

Input: T0=40, Ta=20, tau=30

Expected: 20+20/e ≈ 27.3576 °C

Hints:
- The remaining temperature difference is multiplied by exp(-1).
- Request or evaluate the solution at the same time.

Worked reasoning: Use the analytic expression as the reference. The system has removed about 63.2% of its initial difference after one time constant.

Tests:
- Initial value is 40.
- The result is between 20 and 40.

Extension: Repeat at two time constants.

## Stretch: Tolerance study

Run the model with two solver tolerance settings and compare maximum analytic error on each returned grid.

Input: Use RelTol 1e-3 then 1e-6 with a suitable AbsTol.

Expected: Both should approximate the analytic curve; report measured errors rather than inventing fixed values.

Hints:
- Use odeset and read its documentation.
- Compare at each run’s own t values.

Worked reasoning: Calculate max(abs(T-exact(t))) separately. Numerical errors depend on solver settings and implementation; record actual results and function evaluations if investigated.

Tests:
- Both preserve the initial condition.
- Neither result is called experimentally validated.

Extension: Repeat for a longer time interval.

## Debug: Heating by mistake

The implemented derivative is +(T-Ta)/tau for a warmer-than-ambient object. Diagnose the growing trajectory.

Input: T0=40, Ta=20, tau=30

Expected: The sign is wrong for passive cooling.

Hints:
- Inspect the initial derivative.
- A solver faithfully integrates the supplied equation.

Worked reasoning: Use the negative sign derived from heat flowing toward ambient. Changing plotting limits or tolerances does not fix the physics.

Tests:
- Initial slope becomes negative.
- T0=Ta stays constant.

Extension: Write a monotonicity test that catches the sign error.

## Recall

What information does an ODE solver require?

A derivative function, initial condition, time interval, and optional numerical controls such as tolerances.

What is a lumped thermal assumption?

The modeled object is represented by one uniform temperature instead of a spatial temperature field.

Sources:
- MathWorks: ode45: https://www.mathworks.com/help/matlab/ref/ode45.html

# MATLAB — Sampling, spectra, and honest frequency claims

Vibration and rotating machinery produce time series. Sampling choices limit what those series can reveal.

Begin after learning basic trigonometry and the idea of frequency. A sampled signal records values at discrete times. Its sampling rate determines which frequencies can be distinguished without ambiguity under the sampling assumptions. A fast oscillation can masquerade as a slower one when undersampled; no colorful spectrum can recover information that was never recorded.

The FFT efficiently computes a discrete Fourier transform. To interpret its output, you must know the sample spacing, sample count, scaling convention, and whether you are looking at a one-sided or two-sided spectrum. Start with a noise-free sinusoid whose frequency falls exactly on a DFT bin. That removes several complications and gives you a known reference for the frequency axis.

Real logs introduce trends, finite-record effects, noise, nonuniform timestamps, and multiple components. Windowing and detrending are useful later topics, but they should not be applied as unexplained rituals. Do not pass irregularly timed samples to a uniform-sampling FFT and label the result in hertz without addressing the timing. Base MATLAB provides fft; other signal-processing functions may require a licensed toolbox, so check each function’s product requirements.

## Example

```
Fs = 100; N = 100;
t = (0:N-1)/Fs;
x = sin(2*pi*5*t);
Y = fft(x);
f = (0:N-1)*Fs/N;
plot(f,abs(Y)/N);
xlabel("Frequency (Hz)");
```

This is a two-sided magnitude display with peaks at 5 Hz and its mirrored bin at 95 Hz. It is not yet a one-sided amplitude plot.

## Start: Sample times

Create 100 samples at 100 Hz beginning at zero. State the final timestamp.

Input: Fs=100, N=100

Expected: t=0:0.01:0.99; final time 0.99 s

Hints:
- Use indices 0 through N-1.
- A sample count is not a final index.

Worked reasoning: t=(0:N-1)/Fs. There are 100 samples, separated by 0.01 s.

Tests:
- numel(t)=100.
- diff(t) is 0.01 within rounding.

Extension: Contrast sample span with a one-second periodic record convention.

## Build: Frequency bins

Compute the DFT bin spacing and identify bins for a 5 Hz sinusoid.

Input: Fs=100 Hz, N=100

Expected: Spacing 1 Hz; zero-based bins 5 and 95. MATLAB indices 6 and 96.

Hints:
- Frequency is bin*Fs/N.
- MATLAB indices start at one.

Worked reasoning: The positive component is at f=5; the conjugate mirror is at f=95 in the full DFT array.

Tests:
- A DC signal peaks at MATLAB index 1.
- The frequency vector has N elements.

Extension: Create a correctly scaled one-sided plot after reading the fft example.

## Stretch: Aliasing thought experiment

At a 100 Hz sample rate, compare sampled cosines at 10 Hz and 90 Hz at integer sample times.

Input: x1=cos(2*pi*10*n/100); x2=cos(2*pi*90*n/100)

Expected: They produce the same ideal samples.

Hints:
- 90/100 equals 1-10/100.
- Cosine is even and periodic.

Worked reasoning: At integer n, cos(2*pi*n-2*pi*10*n/100)=cos(2*pi*10*n/100). The samples alone cannot distinguish these cases.

Tests:
- Maximum difference is near rounding error.
- Changing the sampling rate can break the ambiguity.

Extension: Describe why an analog antialias filter may be needed.

## Debug: Index masquerading as frequency

A spectrum is plotted with plot(abs(fft(x))) and its x-axis labeled Hz. Diagnose what is missing.

Input: Fs=200 Hz, N=100

Expected: Bin spacing is 2 Hz, not 1 Hz.

Hints:
- Default x-axis is MATLAB index.
- Build the frequency coordinates explicitly.

Worked reasoning: Use f=(0:N-1)*Fs/N and specify the scaling convention. Otherwise peak labels are numerically wrong and shifted by the indexing origin.

Tests:
- DC belongs at 0 Hz.
- Bin 5 corresponds to 10 Hz.

Extension: Add a caption naming the spectrum convention.

## Recall

What fixes the DFT bin spacing?

The ratio Fs/N for uniformly sampled data.

Does a longer FFT created by zero padding add measured information?

No. It samples the transform representation more densely without adding new observations.

Sources:
- MathWorks: fft: https://www.mathworks.com/help/matlab/ref/fft.html

# MATLAB — Parameter sweeps and uncertainty experiments

A single simulation run can conceal sensitivity. Exploring plausible inputs helps you see which assumptions deserve better measurements.

A parameter sweep evaluates the same model over a deliberate set of inputs. Change one parameter first so the resulting pattern is easy to understand. Store both input and output for every run; a plot of unlabeled results is not a reproducible experiment. Choose ranges from the question and available evidence, not from what produces the most dramatic figure.

Uncertainty experiments go a step further by sampling from stated distributions. A random number generator makes computational samples, but it does not justify the distribution. Uniform, normal, independent, and correlated assumptions have different meanings. Begin with a simple repeatable random sequence and record the algorithm and seed. Reproducibility lets you compare code changes without confusing them with a changed random draw.

Distinguish sensitivity from probability. A worst-case parameter grid is not automatically a confidence interval, and a Monte Carlo percentile is conditional on the assumed input model. Report what was varied, what was held fixed, and what was not modeled. Base MATLAB supports simple random sampling; specialized statistics features can have separate product requirements. For early work, a transparent range study is often more valuable than an elaborate unjustified probability claim.

## Example

```
rng(7,"twister");
tau_s = [20 30 40];
T_at_60 = 20+20*exp(-60./tau_s);
results = table(tau_s(:),T_at_60(:), ...
    "VariableNames",["tau_s","temperature_c"]);
```

The deterministic sweep gives about [20.9957,22.7067,24.4626] °C. The seed is relevant when random sampling is added.

## Start: Three time constants

Calculate temperature at 60 s for three time constants.

Input: tau=[20 30 40], T=20+20*exp(-60./tau)

Expected: Approximately [20.9957 22.7067 24.4626] °C

Hints:
- Use element-wise division.
- Larger tau means slower cooling.

Worked reasoning: The remaining difference is 20*exp(-60/tau). The sequence increases because larger tau retains more of the initial warmth.

Tests:
- All results exceed 20.
- Ordering agrees with physical reasoning.

Extension: Plot output against tau with units.

## Build: Repeatable random draws

Generate five uniform random numbers twice by resetting the same named generator and seed.

Input: rng(7,"twister"); rand(1,5)

Expected: The two generated vectors agree exactly in the same environment.

Hints:
- Reset before each draw.
- Do not reset between individual values in one vector.

Worked reasoning: Save first=rand(1,5), reset the generator and seed, then second=rand(1,5). Compare with isequal.

Tests:
- Same setup reproduces the sequence.
- An additional draw advances the sequence.

Extension: Record MATLAB release alongside generator metadata.

## Stretch: A bounded input model

Sample a time constant uniformly between 20 and 40 s and propagate it through the cooling formula. Explain the limitation.

Input: tau=20+20*rand(1000,1)

Expected: All sampled tau lie in [20,40); temperatures lie within the corresponding deterministic bounds.

Hints:
- Transform the unit uniform sample.
- The distribution is an assumption, not a measurement.

Worked reasoning: Compute each output and summarize sample statistics. Interpret any percentile only under the uniform time-constant assumption.

Tests:
- No output leaves deterministic bounds.
- The seed permits reproduction.

Extension: Compare the result with a different justified distribution.

## Debug: A seed inside the loop

A simulation resets rng(7) before every iteration, then draws one random input. Why are all trials identical?

Input: Reset and draw repeated 100 times.

Expected: Each iteration restarts the same sequence.

Hints:
- Initialization belongs before the loop.
- Distinct draws require advancing generator state.

Worked reasoning: Set the seed once before sampling. The repeated experiment is then reproducible while individual trials can differ.

Tests:
- At least two draws differ under normal operation.
- Rerunning the entire experiment reproduces all draws.

Extension: Explain why identical trials invalidate an intended Monte Carlo sample.

## Recall

What does a random seed establish?

A reproducible computational sequence under the specified generator and environment, not the truth of an uncertainty model.

How does sensitivity differ from uncertainty?

Sensitivity asks how outputs respond to changed inputs; uncertainty analysis also models what is known or assumed about those inputs.

Sources:
- MathWorks: rng: https://www.mathworks.com/help/matlab/ref/rng.html

# MATLAB — A reproducible engineering report

A portfolio project earns credibility through traceable evidence, not only a polished figure.

A useful report connects a question to data, a model, a result, and a limitation. Separate raw inputs, analysis functions, tests, and generated outputs. Use explicit filenames and relative project paths rather than a private absolute path tied to one computer. Store units and variable definitions beside the data so someone opening the project later can interpret it without asking you.

Exporting a table is an interface decision. Specify column names, numeric meaning, missing-data representation, and whether a repeated run replaces or creates a new output. For a learning project, write into a dedicated output directory and preserve the original observations. Reimport one exported result and compare its row count and key values; this catches formatting and schema mistakes at the boundary.

End with an honest statement of scope. A cooling notebook can demonstrate numerical modeling without proving a habitat thermal design. A frequency plot can reveal a component without identifying its mechanical cause. Include one failed hypothesis or limitation you investigated. As your classes deepen the physics, return to the same project and improve one assumption at a time. This makes the report a growing body of evidence instead of a finished screenshot.

## Example

```
results = table([0;10;20],[20;23;25], ...
    "VariableNames",["time_s","temperature_c"]);
writetable(results,"learning_results.csv");
check = readtable("learning_results.csv");
assert(height(check)==height(results));
```

Run in a dedicated scratch/output folder. The file is a generated result, not the original measurement record.

## Start: Labeled result table

Create and export a three-row table with units in column names.

Input: time_s=[0;5;10], voltage_v=[12;11.9;11.8]

Expected: A CSV with named columns and three data rows.

Hints:
- Use column vectors.
- Write to a scratch output folder.

Worked reasoning: table(time_s,voltage_v) retains meaningful variable names. Reimport the exported CSV and inspect its columns.

Tests:
- Row count remains three.
- First voltage remains 12.

Extension: Add a run identifier column.

## Build: One-command rerun

Design a run_all.m script that validates inputs, calls a model, runs checks, and exports results in a documented order.

Input: A small existing cooling model.

Expected: A fresh session recreates the same report outputs.

Hints:
- Avoid hidden workspace dependencies.
- Fail before exporting if validation fails.

Worked reasoning: The driver owns workflow; functions own calculations. Include explicit input paths and a final output summary.

Tests:
- A missing input produces a clear diagnostic.
- Two runs with the same inputs agree.

Extension: Record runtime and MATLAB release in metadata.

## Stretch: Cross-language handoff

Specify a CSV contract for Python to read a MATLAB-generated thermal trajectory.

Input: Columns time_s,temperature_c; one row per sample.

Expected: Both languages agree on row count, units, order, and missing-value policy.

Hints:
- CSV alone does not explain units.
- Write a short schema beside it.

Worked reasoning: Document UTF-8 text, comma delimiter, header names, seconds from start, °C values, increasing times, and how missing values are represented.

Tests:
- First/last times agree after import.
- Compare a known value within an explicit tolerance.

Extension: Build a Python verification script in a later project.

## Debug: A report that cannot be rerun

A report contains only a final plot and a script referring to an unnamed variable loaded manually. Identify the minimum repair.

Input: No input file or run instructions included.

Expected: Provide input or a reproducible synthetic substitute, explicit loading, units, and run order.

Hints:
- Ask what a fresh computer lacks.
- Distinguish private data from shareable sample data.

Worked reasoning: Make the dependency explicit and include a small public fixture that exercises the same analysis path. State any omitted data limitation.

Tests:
- The fixture runs without manual workspace setup.
- The plot can be regenerated.

Extension: Add a verification checklist to the README.

## Recall

What is the smallest credible analysis package?

A clear question, interpretable input or fixture, runnable code, a known check, reproducible outputs, and stated limitations.

Why round-trip an exported table?

It tests the file interface that another tool or future user will actually consume.

Sources:
- MathWorks: writetable: https://www.mathworks.com/help/matlab/ref/writetable.html

# C — Build C deliberately, not accidentally as C++

C helps you understand firmware interfaces and machine constraints. Learning it as a separate language avoids misleading assumptions from C++.

C and C++ share much syntax but are distinct languages with different rules and idioms. Start with a .c file, a C compiler driver, and an explicitly selected language standard. For GCC or Clang, a useful desktop learning command is cc -std=c17 -Wall -Wextra -Wpedantic main.c -o sample. Other toolchains use different flags, so record the actual tool and command you used.

A hosted C program usually begins at main and can use the standard library available in that environment. A microcontroller project may be freestanding, with startup code, linking rules, and libraries supplied by its toolchain and board support package. Do not treat a desktop program and a board binary as interchangeable simply because both contain C source. Begin on the desktop where tests and diagnostics are easy to inspect.

Use one tiny calculation to make every build step observable. Write source, compile it, inspect diagnostics, run the exact executable you built, and compare with a predicted output. Distinguish a language error from a link failure and a wrong calculation. The first lasting habit is preserving enough evidence that you can reproduce the same result after your tools or directory layout change.

## Example

```
#include <stdio.h>
int main(void) {
    const double elapsed_s = 1500 / 1000.0;
    printf("%.3f s\n", elapsed_s);
    return 0;
}
```

The program prints 1.500 s. Floating-point division is paired with a matching printf format.

## Start: First reproducible result

Change the duration to 2750 ms and rebuild.

Input: 2750 milliseconds

Expected: 2.750 s

Hints:
- Use 1000.0.
- Keep %.3f.

Worked reasoning: Divide before printing and verify three digits after the decimal point.

Tests:
- 0 ms prints 0.000 s.
- 1 ms prints 0.001 s.

Extension: Write a one-command build instruction.

## Build: Identify the failure stage

Create separate examples of a missing semicolon and a declared but undefined function.

Input: Two saved source variants

Expected: Compilation failure; linking failure

Hints:
- A declaration describes a function.
- A definition supplies its body.

Worked reasoning: The compiler needs valid syntax; the linker needs an implementation for each called function.

Tests:
- Restore valid source and build.
- Confirm no old executable is mistaken for the new version.

Extension: Repeat from your editor and command line.

## Stretch: Desktop versus board

Compare startup and output assumptions in this sample with a board project.

Input: Desktop standard output; board UART unconfigured

Expected: A table of assumptions rather than a claimed drop-in port

Hints:
- Who calls main?
- Where does printf output go?

Worked reasoning: Desktop runtime and output are provided by the environment; embedded startup and I/O redirection depend on the selected platform.

Tests:
- List required board documentation.
- Keep desktop tests buildable.

Extension: Plan a fake I/O interface.

## Debug: Wrong language mode

A C file is compiled with g++ and gives confusing diagnostics. Fix the build first.

Input: Intended C17 source

Expected: Use a C compiler mode and C17 selection

Hints:
- Check driver and flags.
- Extension alone may not override the driver.

Worked reasoning: Use cc, gcc, or clang in C mode with -std=c17 where supported, or document an equivalent toolchain setting.

Tests:
- Compile correct C source.
- Confirm the build log shows the intended command.

Extension: Explain why Arduino sketches are typically C++.

## Recall

Why select a language standard?

It makes the accepted language contract explicit instead of relying on changing defaults.

What does hosted mean?

An environment providing normal C startup and library facilities, unlike many bare-metal projects.

Sources:
- GCC warning options: https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html

# C — Integer ranges, units, and conversion order

Embedded measurements often begin as integer counts; scaling needs both a sensor model and correct arithmetic.

A number has a representation before it has a physical meaning. An ADC count may be stored in an unsigned integer, while the voltage estimate is a floating-point calculation based on a documented reference and range. A learning model might map integer counts 0 through 4095 onto 0 through 3.3 volts. That is a model to test, not a substitute for a particular converter's datasheet.

Integer arithmetic happens before assignment to a floating-point destination when both operands are integers. Multiplication can overflow before a later conversion appears to fix it. Decide where to convert and what intermediate range is required. Unsigned arithmetic follows modular rules; signed overflow is undefined behavior. Neither should be used accidentally to handle an out-of-range physical measurement.

limits.h describes properties of ordinary integer types, and stdint.h provides fixed-width types when supported. uint16_t does not promise that every arithmetic expression uses sixteen bits: integer promotions still apply. Begin with explicit input-range checks and simple double scaling. Study fixed-point arithmetic when the project gives you a reason, and preserve an independently calculated reference result for comparison.

## Example

```
#include <stdbool.h>
#include <stdint.h>
bool adc_volts(uint16_t counts, double *out_v) {
    if (out_v == 0 || counts > 4095u) return false;
    *out_v = (double)counts * 3.3 / 4095.0;
    return true;
}
```

A simulated 12-bit endpoint model with a 3.3 V reference; invalid counts or a null output pointer are rejected.

## Start: Endpoint scaling

Evaluate the conversion at both endpoints.

Input: 0 and 4095 counts

Expected: 0 V and 3.3 V

Hints:
- Substitute in the formula.
- Compare floats with a justified tolerance.

Worked reasoning: Zero produces zero; maximum count produces a ratio of one.

Tests:
- 4096 is rejected.
- Null output is rejected.

Extension: Calculate 2048 counts and explain its relation to 1.65 V.

## Build: Reject without mutation

Initialize output to 9 and call with invalid counts.

Input: counts=5000; output=9

Expected: false; output remains 9

Hints:
- Validate before assignment.
- Failure needs an output policy.

Worked reasoning: The guard returns before writing the caller-owned result.

Tests:
- Valid zero changes output to zero.
- Null pointer is never dereferenced.

Extension: Document every error path.

## Stretch: Fixed-point range analysis

Analyze multiplication before converting counts to integer millivolts.

Input: 4095 maximum count; numerator 3300

Expected: Maximum product 13,513,500

Hints:
- Multiply maxima on paper.
- State rounding policy.

Worked reasoning: A uint32_t intermediate can represent the product where available; divide by 4095 and explicitly choose truncation or rounding.

Tests:
- 0 maps to 0.
- 4095 maps to 3300.

Extension: Compare integer and double models for every raw count.

## Debug: Nearly every result is zero

Repair double ratio = counts / 4095 before scaling.

Input: counts=2048

Expected: Approximately 1.6504 V after scaling

Hints:
- Inspect operand types.
- Convert before division.

Worked reasoning: Use counts / 4095.0. Assigning an integer-division result to double cannot recover its fractional part.

Tests:
- Interior count is nonzero.
- Endpoints remain correct.

Extension: Retain a midpoint regression test.

## Recall

Does signed overflow wrap predictably?

No. It is undefined behavior; use checked arithmetic.

Why test endpoints?

They provide easy independent checks of range, units, and arithmetic order.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html
- Clang UndefinedBehaviorSanitizer: https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html

# C — Functions and output-pointer contracts

C interfaces often communicate through pointers; meaning, validity, and lifetime must be clear.

C passes function arguments by value. Passing a pointer copies an address value, allowing the function to access an object owned by the caller. This often returns a calculation result while the function's return value reports success or failure. The interface should say whether the pointer may be null, which object is modified, and what happens to that object when the operation fails.

A pointer is not a length, ownership record, or proof of validity. A non-null pointer can refer to an object whose lifetime ended or to inappropriate storage. A scalar output parameter requires a pointer to a live object of the correct type. Arrays also require a count. The caller and function share responsibility for honoring this contract; checking only null cannot establish arbitrary pointer safety.

Keep the implementation auditable: validate what you can before modifying caller-visible output. Compute into local variables and assign on success. This gives a simple failure guarantee and makes tests clearer. Avoid global variables as hidden outputs; their values and ordering dependencies complicate isolated tests and later concurrency. Draw the caller object and the copied pointer to understand which object each assignment affects.

## Example

```
#include <stdbool.h>
bool mean_pair(double a, double b, double *out) {
    if (out == 0) return false;
    *out = a / 2.0 + b / 2.0;
    return true;
}
```

The output must point to a live double. This avoids forming a+b first, though rounding and non-finite policy still matter.

## Start: Caller-owned result

Call mean_pair with the address of a local result.

Input: 2 and 6

Expected: true; result 4

Hints:
- Use &result.
- Keep the object alive.

Worked reasoning: The copied pointer permits writing into the caller's live double.

Tests:
- 2 and 2 give 2.
- -2 and 2 give 0.

Extension: Reject non-finite input.

## Build: No mutation on failure

Design a conversion that rejects negative duration and preserves output.

Input: duration=-1; output=7

Expected: false; output remains 7

Hints:
- Validate first.
- Assign only on success.

Worked reasoning: Return failure for negative duration before writing; keep computation local until all validation succeeds.

Tests:
- Zero follows the stated policy.
- Null output rejects.

Extension: Use distinct status codes for different errors.

## Stretch: Two results without globals

Return minimum and maximum for two finite inputs using a small result struct.

Input: 3 and -1

Expected: minimum -1; maximum 3

Hints:
- Group related outputs.
- Define invalid-number policy.

Worked reasoning: A struct keeps results coherent; a status field or checked output pointer communicates validity.

Tests:
- Swapped inputs give the same result.
- Equal inputs give equal min and max.

Extension: Extend to an array and count.

## Debug: Address of a dead local

Repair a function returning the address of its automatic local result.

Input: double *bad(void) { double result=4; return &result; }

Expected: Return double by value or write through a caller output pointer

Hints:
- Local lifetime ends at return.
- Copying an address does not extend lifetime.

Worked reasoning: Returning the scalar is simplest; if status is needed, accept an output pointer supplied by the caller.

Tests:
- Compile with warnings.
- Use the result after return.

Extension: Draw lifetimes for both repaired interfaces.

## Recall

Are pointer arguments passed by reference in C?

No. The pointer value is copied; dereferencing it may access a caller-owned object.

What is a useful failure guarantee?

Caller-visible output remains unchanged unless the operation succeeds.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html

# C — Arrays, sizes, and bounds-aware interfaces

Parser and sensor code becomes easier to reason about when each access is tied to a known bound.

An array is a contiguous sequence of elements, but a pointer to its first element does not carry its count. In most expressions an array converts to such a pointer. A function parameter written double values[] is adjusted to a pointer parameter; sizeof(values) there measures the pointer, not the original array. Pass the element count explicitly and distinguish it from a byte count.

If n is the number of accessible elements, valid indexes run from zero through n-1. Stop loops before n and define empty-input behavior. Do not read the first element before checking that one exists. A pointer-plus-count contract must also say whether null with zero count is allowed. Choose a consistent rule, then test all combinations of empty and nonempty inputs.

Bounds checks work only when the caller supplies an honest count for live storage. C cannot recover the true allocation size from an arbitrary pointer. Keep ownership local, derive counts from real arrays when possible, and pass sizes through layers without inventing them. For external packets, verify length before reading fields even when every normal example happens to be long enough.

## Example

```
#include <stdbool.h>
#include <stddef.h>
bool sum_values(const double *values, size_t n, double *out) {
    if (out == NULL || (n > 0 && values == NULL)) return false;
    double sum = 0;
    for (size_t i = 0; i < n; ++i) sum += values[i];
    *out = sum;
    return true;
}
```

The caller promises n accessible doubles. Empty input is accepted with sum zero, including NULL when n is zero.

## Start: Sum a bounded array

Call sum_values on the supplied sequence.

Input: [1,2,3], count 3

Expected: true; sum 6

Hints:
- Use real element count.
- Stop before n.

Worked reasoning: Visit indexes 0,1,2 only.

Tests:
- Count 0 gives 0.
- Count 1 gives 1.

Extension: Write a mean that rejects empty input.

## Build: Null-and-empty policy

Test buffer and count combinations with a valid output pointer.

Input: NULL/0; NULL/1; valid/0; valid/1

Expected: Accept; reject; accept; accept

Hints:
- No access is needed for zero count.
- The policy is explicit.

Worked reasoning: NULL is rejected only when n>0; zero-count input yields an empty sum.

Tests:
- Failed call preserves output.
- NULL output always rejects.

Extension: Compare with a stricter always-non-null contract.

## Stretch: Bounded maximum

Implement maximum without an empty-input sentinel.

Input: [-5,-2,-9]; empty

Expected: -2; explicit failure

Hints:
- Initialize from element 0 only after n>0.
- Zero is wrong for all-negative data.

Worked reasoning: Check nonempty, initialize from the first element, and scan the rest with i<n.

Tests:
- One negative item returns itself.
- Equal values return that value.

Extension: Define non-finite behavior.

## Debug: One-past-end loop

Repair a loop with condition i<=n.

Input: n=3

Expected: Read indexes 0,1,2 only

Hints:
- Count is not last index.
- Empty input must not read.

Worked reasoning: Use i<n and preserve a zero-length regression test.

Tests:
- Run empty input.
- Use AddressSanitizer when supported.

Extension: Explain why an apparently harmless adjacent read is still invalid.

## Recall

What information does a pointer omit?

Accessible length, ownership, and lifetime guarantees.

Why use size_t for counts?

It is the standard unsigned type for object sizes and sizeof results, though arithmetic still needs care.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html
- Clang AddressSanitizer: https://clang.llvm.org/docs/AddressSanitizer.html

# C — Strings are buffers with an ending convention

Readable telemetry labels still occupy finite memory; a copied name must not overwrite the next object.

A C string is a sequence of character values terminated by a null character. Its logical length excludes that terminator, but storage must include space for it. A char array is not automatically a valid string: without a terminator inside accessible storage, string operations may keep reading beyond the object. Know whether an interface accepts a string or an arbitrary sequence of bytes.

Capacity describes available storage; length describes text currently present. Before copying, establish whether text plus terminator fits. Define the overflow policy: reject, truncate with a visible status, or allocate more storage. Silently truncating a sensor identifier can merge two sources into one displayed name, creating a data-integrity bug even when memory writes remain inside the destination.

Prefer interfaces receiving destination capacity and returning a result you check. snprintf supports bounded formatting, but its result is the number of characters that would have been written, excluding the terminator. A nonnegative result at least as large as capacity indicates truncation. Check before treating the output as complete. Practice exact-fit and one-too-small cases before embedding formatted text in a larger parser.

## Example

```
#include <stdio.h>
#include <stdbool.h>
#include <stddef.h>
bool label_sensor(char *dst, size_t cap, unsigned id) {
    if (dst == NULL || cap == 0) return false;
    int n = snprintf(dst, cap, "S%u", id);
    return n >= 0 && (size_t)n < cap;
}
```

Reports whether the complete label fits. On truncation the destination can contain a shortened string; this is not an unchanged-on-failure interface.

## Start: Exact label capacity

Find minimum storage for two labels.

Input: S42 and S1000

Expected: 4 and 6 bytes

Hints:
- Count visible characters.
- Add the null terminator.

Worked reasoning: Three characters need four bytes; five need six.

Tests:
- Capacity 3 cannot hold all of S42.
- Capacity 4 exactly holds S42.

Extension: Recalculate after adding a prefix.

## Build: Detect truncation

Format id 1234 into capacity 4.

Input: Requested S1234

Expected: false; shortened output is not a complete identifier

Hints:
- Required visible length is 5.
- Compare result with capacity.

Worked reasoning: The label needs six bytes. The return check detects truncation despite bounded writing.

Tests:
- Capacity 6 succeeds.
- Capacity 0 rejects.

Extension: Return a distinct Truncated status.

## Stretch: Unchanged on failure

Design a copy function that rejects insufficient space without modifying output.

Input: Source ROVER; capacities 5 and 6

Expected: Reject at 5; accept at 6

Hints:
- Know the valid source length.
- Check terminator space before writing.

Worked reasoning: Validate length against capacity before copying. An explicit source length avoids relying on an unbounded scan.

Tests:
- Empty string needs one byte.
- Exact fit includes a terminator.

Extension: Use source pointer plus length.

## Debug: Unterminated name

A three-byte array contains R,O,V and is printed with %s. Repair it.

Input: Three characters without a null terminator

Expected: Use a four-byte terminated string or length-aware output

Hints:
- %s expects a string.
- No ending character exists.

Worked reasoning: Declare char name[]="ROV" to include the terminator, or use an explicitly bounded byte-output operation.

Tests:
- String array size is 4.
- Empty string contains a terminator.

Extension: Explain text versus binary packet bytes.

## Recall

Is every char array a string?

No. A terminator must exist within accessible storage.

What does snprintf result >= capacity mean?

The full formatted output did not fit.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html

# C — Structs, enums, and explicit validity

Valid zero, stale data, and missing observations deserve different representations.

A struct groups related fields into one record. An enum names a finite set of states. Together they represent value, time, and quality without hiding missing data in a magic number. Function interfaces become easier to read and tests can construct the condition they intend to exercise. Initialize every field that later code may read, including status fields that seem obvious.

Struct assignment copies member values, but a pointer member still refers to the same external object after copying. It does not clone the pointed-to buffer or transfer ownership automatically. Prefer scalar fields and small fixed arrays for early sensor records. Introduce pointer fields when their ownership, lifetime, and access permissions are explicit, especially if records outlive the function that built them.

An in-memory struct is not automatically a portable wire format. A compiler may add padding; alignment, integer sizes, and byte order can vary. Writing sizeof(struct sample) bytes directly to a file therefore does not establish a reliable interchange format. Keep the logical record separate from the byte encoding, define field widths and order, and test encoding against fixed known fixtures.

## Example

```
enum quality { SAMPLE_VALID, SAMPLE_STALE, SAMPLE_MISSING };
struct sample {
    double temperature_c;
    unsigned long time_ms;
    enum quality quality;
};
int usable(const struct sample *s) {
    return s != 0 && s->quality == SAMPLE_VALID;
}
```

The time type is illustrative; its range and clock meaning must be defined by the real interface.

## Start: Zero can be real

Classify records by quality.

Input: Valid 0; Stale 0; Missing 20

Expected: Usable; unusable; unusable

Hints:
- Read quality.
- Plausibility does not prove presence.

Worked reasoning: Quality preserves the distinction independently of the number.

Tests:
- NULL is unusable.
- Valid negative temperature remains usable in this narrow contract.

Extension: Add domain validation separately.

## Build: Copy semantics

Copy a record with one scalar and one buffer pointer; describe what changes.

Input: Two structs point to one buffer

Expected: Scalar values copy; buffer remains shared

Hints:
- Draw two records and one buffer.
- The pointer value is copied.

Worked reasoning: Editing one scalar does not change the other record; editing the common buffer is visible through both pointers.

Tests:
- Change one scalar.
- Change one buffer byte.

Extension: Compare with a fixed array embedded in the struct.

## Stretch: Encode the contract

Write a separate byte-format table for a centidegree reading and a quality byte.

Input: Logical sample record

Expected: Offsets, widths, signedness, and order stated

Hints:
- Do not use sizeof(struct) as format.
- State valid ranges.

Worked reasoning: A decoder can validate a known packet length and reconstruct logical fields without assuming compiler layout.

Tests:
- Known fixture decodes correctly.
- Short input rejects.

Extension: Add a format-version field.

## Debug: Padding surprise

Raw struct files differ across compilers. Repair the design.

Input: fwrite of sizeof(struct sample) bytes

Expected: Explicit field-by-field encoding

Hints:
- Padding is not a field.
- Byte order may differ.

Worked reasoning: Define external bytes deliberately and decode them independently of in-memory layout.

Tests:
- Two encoders emit the same fixture.
- Unknown version rejects.

Extension: Explain why packing alone is not a full portability solution.

## Recall

Does struct copy clone a pointed-to buffer?

No. It copies the pointer value.

Why separate record and encoding?

Logical meaning should not depend on compiler layout or host byte order.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html

# C — Bit masks and byte order without guesswork

Telemetry decoders should explain every bit and every byte they read.

A mask selects positions in an integer. If bit zero means stale, (status & 1u) != 0 tests that bit independently of other flags. Use unsigned types and named masks. Logical && asks whether whole expressions are true, while bitwise & combines corresponding bits. Confusing them can pass a simple test and fail as soon as a different flag is set.

Byte order describes a multi-byte representation. For a big-endian two-byte unsigned field, the first byte is the high part: first*256 + second. Decode explicitly instead of casting a byte pointer to a wider integer pointer. A cast can introduce alignment, aliasing, and host-byte-order assumptions while concealing the format's actual meaning. The external contract chooses the byte order.

Bounds still come first. Correct arithmetic cannot rescue reading a second byte from a one-byte input. Validate pointer and length, construct the result in an unsigned type wide enough for intermediate operations, then assign. The examples assume fixed-width types are available. Real interfaces should verify these platform assumptions and distinguish unknown reserved bits from currently recognized flags.

## Example

```
#include <stdbool.h>
#include <stdint.h>
#include <stddef.h>
bool read_be16(const uint8_t *p, size_t n, uint16_t *out) {
    if (p == NULL || out == NULL || n < 2) return false;
    *out = (uint16_t)(((uint32_t)p[0] << 8) | (uint32_t)p[1]);
    return true;
}
```

Reads an unsigned big-endian value without assuming host byte order or alignment.

## Start: Independent flags

Decode stale at bit 0 and fault at bit 2.

Input: 0,1,4,5

Expected: Neither; stale; fault; both

Hints:
- Masks are 1 and 4.
- Test each mask separately.

Worked reasoning: Status 5 is binary 0101 and contains both named flags.

Tests:
- 2 sets neither.
- 255 sets both.

Extension: Report unknown reserved bits.

## Build: Endian fixture

Decode two bytes in both orders.

Input: [0x01,0x02]

Expected: Big-endian 258; little-endian 513

Hints:
- High byte multiplies 256.
- Order changes meaning.

Worked reasoning: 1*256+2=258 and 2*256+1=513.

Tests:
- Zero bytes yield zero.
- FF FF yields 65535.

Extension: Write an inverse encoder.

## Stretch: Reserved bit policy

Only bits 0 and 2 are allowed. Reject others.

Input: 0x05 and 0x07

Expected: Accept 0x05; reject 0x07

Hints:
- Allowed mask is 0x05.
- Check bits outside it.

Worked reasoning: For an eight-bit status, status & 0xFAu identifies reserved bits.

Tests:
- 0 is accepted.
- 0x80 is rejected.

Extension: Version the policy for future flags.

## Debug: Logical-AND decoder

Code uses status && 4u for bit 2. Find a failing case.

Input: status=1

Expected: Fault must be false

Hints:
- Both whole operands are nonzero.
- Use a bit mask.

Worked reasoning: Replace with (status & 4u) != 0u; && ignores bit positions.

Tests:
- 1 has no fault bit.
- 4 and 5 have fault.

Extension: Exhaustively test all 256 statuses.

## Recall

Why widen before shifting?

It makes intermediate signedness and range explicit.

Who decides byte order?

The external format contract, not the host machine.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html
- Clang UndefinedBehaviorSanitizer: https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html

# C — Parse numbers while retaining error information

Weak configuration parsing can turn a typo into a plausible parameter.

Text conversion must answer more than what number appeared first. Determine whether any digits were consumed, whether the whole expected token was consumed, and whether the value fits the accepted range. strtol provides an end pointer and range-error reporting that support those checks. A wrapper should preserve their information instead of treating every failure as numeric zero.

Choose a grammar. A strict field may permit decimal digits only, while a more permissive field permits leading whitespace and an optional sign. strtol accepts syntax your application might forbid, so library success is not automatically grammar success. Select base ten when decimal is the contract, then validate any additional restrictions explicitly and explain them in the error message.

Reset errno immediately before conversion, inspect conversion progress and the end pointer, check ERANGE, and then enforce application limits before narrowing. Validate before changing caller-visible output. Test zero, empty text, a number followed by junk, a huge number, and exact boundaries. A bad-then-good two-call test catches dependence on error state left behind by an earlier operation.

## Example

```
#include <stdlib.h>
#include <errno.h>
#include <stdbool.h>
bool parse_count(const char *s, long *out) {
    if (s == NULL || out == NULL || *s == '\0') return false;
    char *end;
    errno = 0;
    long value = strtol(s, &end, 10);
    if (s == end || *end != '\0' || errno == ERANGE || value < 0 || value > 1000) return false;
    *out = value;
    return true;
}
```

Accepts strtol leading whitespace and optional sign, requires full consumption, and limits the result to 0..1000. Stricter grammar needs additional checks.

## Start: Successful zero

Test zero, empty text, and letters.

Input: 0; empty; abc

Expected: Success 0; reject; reject

Hints:
- Check conversion progress.
- Zero is a valid value.

Worked reasoning: Only the zero token produces an in-range completed conversion.

Tests:
- 1000 succeeds.
- 1001 rejects.

Extension: Decide whether +0 is allowed.

## Build: Numeric prefix

Test full-token consumption.

Input: 12; 12ms; 12 followed by a space

Expected: Success; reject; reject

Hints:
- End pointer must reach terminator.
- This wrapper rejects trailing space.

Worked reasoning: The library can parse a prefix, but the wrapper requires no remaining character.

Tests:
- 0012 succeeds.
- -1 rejects by range.

Extension: Create a separate unit-suffix parser.

## Stretch: Strict decimal grammar

Allow digits only, no signs or whitespace.

Input: +3; space then 3; 003; 3

Expected: Reject; reject; accept 3; accept 3

Hints:
- Validate characters first.
- Range checks still apply.

Worked reasoning: Reject empty text or any nondigit, then perform checked conversion and apply 0..1000 limits.

Tests:
- Huge digit string rejects.
- 0 is valid.

Extension: Return separate syntax and range statuses.

## Debug: Stale errno

A valid conversion fails because errno still contains ERANGE.

Input: Valid 10 after a failed prior call

Expected: Reset errno before conversion

Hints:
- Tie error state to one call.
- Success need not clear errno.

Worked reasoning: Set errno=0 immediately before strtol and retain end-pointer and range checks.

Tests:
- Bad then good succeeds on second call.
- Huge number still fails.

Extension: Add a two-call regression test.

## Recall

What does end tell you?

Where conversion stopped and whether no characters were consumed.

Why check before narrowing?

A long result may exceed the application or destination range.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html

# C — Storage duration, lifetime, and borrowed pointers

A pointer value can survive long after its object is gone; explicit lifetime reasoning prevents subtle defects.

Storage duration determines how long an object is available. An ordinary local variable usually has automatic storage duration and ceases to exist when execution leaves its block. A static object lasts for the program's execution. Dynamically allocated storage lasts until it is released. Scope, which controls where a name can be used, is related but not identical to lifetime.

A pointer can borrow access without owning the object. If a function receives a pointer to caller data, the caller normally remains responsible for keeping that data alive and eventually releasing it if appropriate. Document whether the function retains the pointer after returning. A function that stores a borrowed address for later use has a stronger lifetime requirement than one that reads it immediately.

Draw a timeline for each object and every pointer that refers to it. A non-null pointer is not proof that its target still exists, and setting one pointer to null does not invalidate other aliases automatically. Static storage can avoid one dangling-pointer bug while introducing hidden shared state and reentrancy problems. Choose lifetime based on the interface, not as a shortcut around understanding ownership.

## Example

```
#include <stddef.h>
struct view { const double *data; size_t count; };
double first_or_zero(struct view v) {
    return v.count > 0 && v.data != NULL ? v.data[0] : 0.0;
}
```

The view borrows storage and does not extend its lifetime. The zero fallback is an explicit demonstration policy, not an appropriate missing-data policy for every application.

## Start: Borrowed view

Pass a view of a live three-element array and inspect its first value.

Input: [4,5,6], count 3

Expected: 4

Hints:
- The caller retains ownership.
- The view copies pointer and count.

Worked reasoning: The function reads element zero while the caller's array is alive.

Tests:
- Empty view follows zero fallback.
- A null zero-count view performs no read.

Extension: Replace fallback with explicit status.

## Build: Retention contract

Compare a function that immediately sums a buffer with one that stores its pointer for tomorrow's callback.

Input: Same pointer argument

Expected: The retaining function requires a longer lifetime

Hints:
- Ask when the last read occurs.
- Returning does not necessarily end access.

Worked reasoning: Document the retention interval or copy the data into owned storage. Immediate use only requires validity during the call.

Tests:
- Caller cannot destroy retained data early.
- A copied buffer has a separate lifetime.

Extension: Design an API that makes retention obvious.

## Stretch: Remove static scratch state

A parser returns a pointer to a static result reused on every call. Redesign it for two independent results.

Input: Two parsed sensor records

Expected: Caller-owned result structs remain independent

Hints:
- Static avoids local expiration but is shared.
- Accept output pointers or return structs.

Worked reasoning: Store each parsed result in a distinct caller object and stop sharing hidden scratch output.

Tests:
- Second parse does not alter first result.
- Nested calls preserve both outputs.

Extension: Explain reentrancy separately from thread safety.

## Debug: Two aliases, one release

After free(a), code sets a=NULL but still reads alias b that pointed to the same allocation. Diagnose it.

Input: a and b referred to one allocation

Expected: b is dangling and must not be read

Hints:
- Pointer variables are separate objects.
- Nulling a does not update b.

Worked reasoning: Release invalidates access through all aliases; redesign ownership so borrowers end before release.

Tests:
- No access follows free.
- The ownership diagram names one releaser.

Extension: Use a sanitizer to detect an isolated test defect where supported.

## Recall

Is scope the same as lifetime?

No. Scope governs name visibility; lifetime governs whether the object exists.

Does a borrowed pointer extend lifetime?

No. The owner must keep the object alive for every permitted use.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html
- Clang AddressSanitizer: https://clang.llvm.org/docs/AddressSanitizer.html

# C — Allocation, capacity, and one clear owner

Dynamic memory can be useful, but its failure and ownership paths are part of the design.

malloc requests a number of bytes and can fail. Before multiplying an element count by an element size, prove that the multiplication fits size_t. Otherwise an overflow can request a much smaller allocation than intended while later code still assumes the original large count. Keep requested count and actual capacity together, and reject unreasonable application sizes before allocating even when arithmetic would fit.

C does not automatically release allocations when a pointer leaves scope. Name the one owner responsible for free and document whether a function transfers ownership or merely borrows access. Every successful allocation should have a visible release path, including errors after allocation. Prefer a bounded fixed array when the maximum size is small and truly known; dynamic allocation is not a requirement for sophisticated software.

realloc has special failure behavior: on failure, the original allocation remains valid. Assigning its return value directly to the only owning pointer can therefore lose the original address. Use a temporary pointer and replace the owner only after success. Define a zero-size policy explicitly rather than relying on implementation-sensitive expectations. This module is for desktop experiments; embedded projects may impose stricter allocation rules.

## Example

```
#include <stdlib.h>
#include <stdint.h>
#include <stddef.h>
double *allocate_samples(size_t n) {
    if (n == 0 || n > SIZE_MAX / sizeof(double)) return NULL;
    return malloc(n * sizeof(double));
}
```

Returns either an owned allocation for n doubles or NULL. The caller must initialize elements before reading and release the allocation exactly once.

## Start: Byte requirement

Compute storage for 100 doubles using the actual implementation size.

Input: n=100; sizeof(double) reported by compiler

Expected: 100 * sizeof(double) bytes

Hints:
- Do not assume a size without checking.
- The count is elements, not bytes.

Worked reasoning: Use sizeof *pointer or sizeof(double) and check multiplication before requesting bytes.

Tests:
- n=0 follows rejection policy.
- n=1 requests one element.

Extension: Print both count and byte capacity.

## Build: Failure injection

Wrap allocation so a test can force failure and verify the caller.

Input: Allocator returns NULL

Expected: No write or read through NULL; explicit failure result

Hints:
- Failure must be testable.
- Do not wait for real memory exhaustion.

Worked reasoning: Inject a controlled allocator result and ensure no output claims a successfully created buffer.

Tests:
- Successful path initializes and frees.
- Failure path frees nothing it never acquired.

Extension: Count live allocations in the test wrapper.

## Stretch: Resize without losing ownership

Write the control flow for growing an allocation using a temporary realloc result.

Input: Existing owned buffer; simulated failed growth

Expected: Original owner remains valid on failure

Hints:
- Do not overwrite the owner yet.
- Check new byte arithmetic first.

Worked reasoning: tmp=realloc(owner,new_bytes); if tmp is non-null update owner and capacity, otherwise keep both old values.

Tests:
- Failed growth preserves old contents.
- Successful growth updates capacity.

Extension: Document that newly added bytes need initialization.

## Debug: Overflow before malloc

A function requests n*sizeof(double) without checking and then loops n times. Repair the size path.

Input: n exceeds SIZE_MAX/sizeof(double)

Expected: Reject before multiplication

Hints:
- Check using division.
- Allocation success cannot validate an overflowed request.

Worked reasoning: Test n > SIZE_MAX/sizeof(double) before multiplying, and also apply a practical maximum count.

Tests:
- Boundary count arithmetic is checked.
- Oversized n never reaches malloc.

Extension: Test with a fake allocator to avoid huge real allocations.

## Recall

Who frees an owned result?

The caller if the API transfers ownership, as stated explicitly in the contract.

Why use a temporary realloc result?

Failure leaves the original allocation valid; overwriting its only address would lose it.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html
- Clang AddressSanitizer: https://clang.llvm.org/docs/AddressSanitizer.html

# C — Files, exact byte counts, and portable records

Sensor logs and telemetry packets need explicit lengths and representation rules.

A file operation can return fewer elements than requested. A short read may mean end-of-file or an error, so the caller must examine both the count and the stream state before deciding what happened. For a fixed-size record, receiving only part of the record is not successful decoding. Keep I/O separate from the decoder so the same byte fixture can test parsing without touching a file.

Define the external record byte by byte: a version, flags, and a two-byte reading can make a useful four-byte educational format. State byte order and units, and reject unknown versions or forbidden flags. This discipline is more important than a fancy checksum. A checksum can detect certain accidental changes but does not fix an ambiguous format or establish authenticity.

Opening, reading, writing, and closing all have outcomes worth checking. Close streams on every owned path, preserve the original input, and avoid presenting a partial output as a completed report. A beginner-friendly workflow writes to a new file and validates it by reading it back with an independent fixture expectation. Never assume raw struct bytes form a portable external format.

## Example

```
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>
bool read_four(FILE *stream, uint8_t out[4]) {
    if (stream == NULL || out == NULL) return false;
    return fread(out, 1, 4, stream) == 4;
}
```

The caller provides four writable bytes. A false result can leave partial bytes written; inspect feof/ferror in the I/O layer if that distinction is needed.

## Start: Four-byte fixture

Define version=1, flags=0, reading=258 in big-endian form.

Input: One four-byte record

Expected: [0x01,0x00,0x01,0x02]

Hints:
- Use the earlier endian decoder.
- Document reading units.

Worked reasoning: Version and flags occupy the first two bytes; 258 is 0x0102 in the final pair.

Tests:
- All four bytes round-trip.
- Unknown version rejects.

Extension: Create a second fixture with maximum reading.

## Build: Truncated record

Attempt to read a fixed four-byte record from files of length 0,1,3,4.

Input: Four fixture lengths

Expected: Only length 4 is a complete record

Hints:
- Inspect returned byte count.
- Do not decode partial bytes.

Worked reasoning: Gate decoding on an exact four-byte read. Report an incomplete record or I/O error through the surrounding interface.

Tests:
- Three bytes never decode.
- Four valid bytes do.

Extension: Distinguish clean empty file from partial final record.

## Stretch: Multiple-record importer

Read three four-byte records and detect an incomplete tail.

Input: 12 valid bytes then 2 extra bytes

Expected: 3 complete records and one truncated-tail error

Hints:
- Maintain record count separately.
- Retain the byte offset.

Worked reasoning: Process exact groups of four; when the final read returns two, report an incomplete record at offset 12.

Tests:
- Exactly 12 bytes has no tail error.
- Malformed version in record 2 is reported.

Extension: Write a text summary without altering input.

## Debug: The success count mistake

Code treats any nonzero fread return as one complete four-byte record. Fix it.

Input: fread(out,1,4,stream) returns 2

Expected: Reject as incomplete

Hints:
- Return count is elements read.
- Element size here is one byte.

Worked reasoning: Require a count of four before decoding. Preserve the distinction between partial read and valid record.

Tests:
- Return 0 is not complete.
- Return 4 permits validation.

Extension: Explain how changing size/count arguments changes the return-count unit.

## Recall

Can a failed fixed-record read modify output?

Yes. Partial bytes may already have been written.

Why separate I/O and decoding?

The decoder can be tested with deterministic byte arrays, and I/O errors remain distinguishable.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html

# C — Warnings, sanitizers, and boundary-driven testing

C demands deliberate checks around memory and arithmetic; a clean happy-path run is weak evidence.

Start from the interface contract and make a boundary table. A two-byte decoder needs tests for lengths zero, one, two, and extra bytes under its policy. A range-limited number parser needs below-minimum, minimum, maximum, above-maximum, and malformed input. Give each case a name explaining the promised behavior. A failed test should tell you what assumption was violated, not only that something went wrong.

Compiler warnings expose many suspicious constructs before execution, but their coverage depends on the toolchain and settings. A debugger reveals actual values and control flow. On supported platforms, AddressSanitizer detects categories of memory misuse and UndefinedBehaviorSanitizer detects selected undefined operations on executed paths. They complement careful reasoning and tests; none is a certificate that every possible input is safe.

Make the harness itself trustworthy. assert may disappear when NDEBUG is defined, so durable test verdicts should use explicit checks or a test framework. Have at least one deliberate known-failing case during harness development to confirm it exits nonzero. Keep failing inputs as regression fixtures, and use a fake allocator or fake clock for failures that should not depend on exhausting memory or waiting real time.

## Example

```
#include <stdio.h>
int main(void) {
    int failures = 0;
    if (2 + 2 != 4) { fputs("arithmetic case failed\n", stderr); ++failures; }
    return failures ? 1 : 0;
}
```

This minimal harness reports failure independently of assert settings. Replace the trivial arithmetic check with real interface cases.

## Start: Decoder length table

List outcomes for a decoder requiring at least two bytes.

Input: Lengths 0,1,2,3

Expected: Reject,reject,accept,accept under at-least-two policy

Hints:
- Write the length contract first.
- Extra bytes need a deliberate rule.

Worked reasoning: The guard n<2 rejects the first two cases; successful parsing reads only the first pair.

Tests:
- Known pair decodes correctly.
- Output unchanged on short input.

Extension: Compare an exact-length policy.

## Build: Validate the test runner

Temporarily change a correct expected value to a wrong one.

Input: One known failing case

Expected: Nonzero process exit and named diagnostic

Hints:
- Test the test harness.
- Restore the intended expectation afterward.

Worked reasoning: Explicit failure accounting should make automation detect the failed case regardless of release assertions.

Tests:
- Correct cases exit zero.
- Wrong case exits nonzero.

Extension: Register the harness with CTest.

## Stretch: Exhaust a small input space

Test an eight-bit flag decoder for every possible status.

Input: 0 through 255

Expected: 256 checked cases

Hints:
- Expected bit0 is status modulo 2.
- Expected bit2 follows integer division by 4 modulo 2.

Worked reasoning: Compare each decoder result to an independently expressed arithmetic oracle, not a copied implementation.

Tests:
- Zero has no flags.
- 255 has all bits set.

Extension: Check reserved-bit rejection exhaustively.

## Debug: The silent release tests

A release build compiles away all assert checks. Repair evidence collection.

Input: NDEBUG defined

Expected: Explicit runtime checks still detect wrong output

Hints:
- Inspect build flags.
- Do not equate zero exit with executed assertions.

Worked reasoning: Use a real test runner or explicit comparisons and failure counts; retain a harness self-check during development.

Tests:
- Run debug and release test builds.
- Inject then remove a known defect.

Extension: Record test case counts.

## Recall

What is a regression fixture?

An input preserving a previously observed defect so the fix stays checked.

Can warnings and sanitizers replace contracts?

No. They detect selected implementation issues, not intended behavior or physical validity.

Sources:
- Clang AddressSanitizer: https://clang.llvm.org/docs/AddressSanitizer.html
- Clang UndefinedBehaviorSanitizer: https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html

# C — Finite-state machines as plain C data and functions

C can express reliable state logic without a large object hierarchy or hidden mutable flags.

A finite-state machine represents a small set of modes and the events that change them. Use an enum for states, another enum for events, and a function that computes the next state. Begin with a transition table on paper. It should cover normal progress, irrelevant events, reset, and the loss of expected data. Two independent booleans often accidentally represent impossible combinations that one state enum excludes.

Keep transition decisions separate from physical actions. A pure transition function can be tested on the desktop and replayed from a fixture. Another layer carries out a requested action, records its outcome, and supplies a later event if needed. This separation prevents a half-completed I/O operation from being mistaken for a successful state change and makes unexpected failures easier to represent.

Every default behavior is still a policy. Ignoring an event, reporting an error, or moving to Review can each be sensible under different requirements. State the choice and test it. The educational example models environmental logging only; real embedded equipment needs domain-specific analysis, recovery design, and hardware validation beyond the correctness of one transition function.

## Example

```
enum state { IDLE, SAMPLING, REVIEW, DONE };
enum event { START, SAMPLE_OK, SAMPLE_BAD, FINISH, RESET };
enum state next_state(enum state s, enum event e) {
    if (e == RESET) return IDLE;
    if (s == IDLE && e == START) return SAMPLING;
    if (s == SAMPLING && e == SAMPLE_BAD) return REVIEW;
    if (s == SAMPLING && e == FINISH) return DONE;
    return s;
}
```

Unlisted state/event combinations retain the current state. Invalid numeric enum values still require an external-input validation policy.

## Start: Normal logging sequence

Replay START,SAMPLE_OK,FINISH from IDLE.

Input: Three events

Expected: SAMPLING,SAMPLING,DONE

Hints:
- Apply one event at a time.
- SAMPLE_OK retains state.

Worked reasoning: Only START and FINISH cause transitions in this sequence.

Tests:
- FINISH at IDLE does nothing.
- RESET at DONE returns IDLE.

Extension: Record an event-by-event trace.

## Build: Bad sample sequence

Replay START,SAMPLE_BAD,FINISH.

Input: Initial IDLE

Expected: SAMPLING,REVIEW,REVIEW

Hints:
- FINISH is only accepted in SAMPLING.
- Review cannot be bypassed.

Worked reasoning: After SAMPLE_BAD the machine remains in REVIEW until a defined recovery event, currently RESET.

Tests:
- Repeated SAMPLE_BAD remains REVIEW.
- RESET returns IDLE.

Extension: Add a documented review-completed event.

## Stretch: Full transition tests

Create table-driven tests for every valid state and event.

Input: 4 states and 5 events

Expected: 20 checked combinations

Hints:
- Use the Cartesian product.
- Include ignored events.

Worked reasoning: Each table entry specifies expected next state; reset should lead to IDLE from all four states.

Tests:
- Exactly 20 valid combinations execute.
- No state/event pair is left implicit in the test table.

Extension: Return a separate accepted/ignored event result.

## Debug: Illegal numeric event

A byte from a file is cast to enum event without range validation. Repair the boundary.

Input: Incoming byte 250

Expected: Reject before transition dispatch

Hints:
- Enum storage does not prove semantic validity.
- Validate the external representation.

Worked reasoning: Map only defined byte codes to known enum values, returning an explicit unknown-event error for others.

Tests:
- All documented codes map correctly.
- 250 is rejected.

Extension: Keep the raw byte in a diagnostic record.

## Recall

Why use a pure transition function?

It enables deterministic replay and complete table tests without hardware.

Does enum type eliminate all invalid values?

No. Values from casts or external representations still need semantic validation.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html
- NASA core Flight System: https://github.com/nasa/cFS

# C — Ring buffers, bounded capacity, and timer rollover

Embedded software often needs bounded storage and predictable overload behavior.

A ring buffer reuses a fixed array by moving indexes around its capacity. The data does not need to shift every time an item leaves. A simple beginner design keeps a head index and an explicit count. The next write position is (head+count) modulo capacity, while removal advances head and decreases count. State the invariants: head is inside the array and count never exceeds capacity.

Full and empty are different states even when some indexes coincide. A count makes that distinction explicit, at the cost of maintaining one more value consistently. Choose what a full buffer does: reject a new item, overwrite the oldest, or ask a producer to wait. The example rejects new items and reports failure. It is single-threaded; sharing it between threads or interrupts requires additional platform-appropriate synchronization.

Timer counters can also wrap. Unsigned subtraction can represent elapsed ticks across one wrap when the true interval remains within the counter's modulus and the surrounding assumptions are satisfied. Do not generalize this into comparing arbitrary absolute timestamps with ordinary less-than. For this module, test wraparound with a deliberately tiny simulated counter so the cases are visible without waiting for real hardware.

## Example

```
#include <stdbool.h>
#include <stddef.h>
struct ring { int data[4]; size_t head; size_t count; };
bool ring_push(struct ring *q, int value) {
    if (q == NULL || q->head >= 4 || q->count >= 4) return false;
    q->data[(q->head + q->count) % 4] = value;
    ++q->count;
    return true;
}
```

Initialize as struct ring q={0}. This bounded single-threaded push rejects a full or invalid queue; a matching pop must preserve the same invariants.

## Start: Fill and reject

Push five values into an empty capacity-four ring.

Input: 10,20,30,40,50

Expected: First four succeed; fifth fails; count stays 4

Hints:
- Full count equals capacity.
- Failed push must not mutate the queue.

Worked reasoning: The fifth value is rejected under this policy, preserving the four earlier values.

Tests:
- Empty count starts at 0.
- Rejected push does not change head.

Extension: Return a distinct Full result.

## Build: Wrap while preserving order

Fill with 1,2,3,4; pop two; push 5,6; then pop all.

Input: Capacity four

Expected: Remaining output 3,4,5,6

Hints:
- Advance head modulo four.
- Use head+count for insertion.

Worked reasoning: The reused slots hold newer values while head still identifies the oldest retained item.

Tests:
- Count never exceeds four.
- Final count is zero.

Extension: Log internal indexes after every operation.

## Stretch: Tiny timer rollover

Compute elapsed ticks with an eight-bit modulo model.

Input: Previous 250; current 5; fewer than 256 true elapsed ticks

Expected: 11 ticks

Hints:
- The counter passes 255 then 0.
- Apply modulo 256 to the difference.

Worked reasoning: There are six increments from 250 to 0 and five more to 5. The answer is only unambiguous under the stated interval bound.

Tests:
- 250 to 250 gives zero under no-full-wrap assumption.
- 0 to 5 gives five.

Extension: Explain why two full wraps cannot be detected from endpoints alone.

## Debug: Shared queue illusion

An interrupt and main loop modify head and count without synchronization. Can volatile fix the queue invariant?

Input: Two contexts sharing the ring

Expected: No; use a platform-appropriate concurrency design

Hints:
- Volatile is not a lock.
- Several updates must remain consistent.

Worked reasoning: Design interrupt-safe ownership or critical sections using the actual platform contract; retain the single-threaded version as a reference model.

Tests:
- Document which context writes each field.
- Test policy independently of hardware timing.

Extension: Study an appropriate single-producer/single-consumer design later.

## Recall

Why keep count in a beginner ring buffer?

It makes full and empty explicit while providing an invariant to test.

Does volatile make compound queue updates atomic?

No. Synchronization and atomicity require separate reasoning and platform facilities.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html

# C — Hardware boundaries, volatile, and fake devices

A clean boundary lets you test the program before a disconnected wire or board setup hides a logic error.

A hardware adapter translates device-specific operations into an interface your program can reason about. It might provide a read operation returning status plus a raw value, while portable code validates and scales the result. Keep register addresses, bus calls, and board initialization inside that adapter. A desktop fake can implement the same interface with a planned sequence of successful and failed reads.

volatile tells the compiler that certain accesses have special observable meaning; it does not make a compound operation atomic, establish inter-thread synchronization, or validate a register sequence. Real hardware requires the device datasheet, processor memory model, toolchain guidance, and board support APIs. Do not copy a register address from an unrelated board and expect the language to make it correct.

Use dependency injection in its simplest C form: pass a function pointer and an opaque context pointer to the component that needs input. The fake context can hold sample data and an index. Test ordinary readings, disconnection, stale values, and recovery without physical hardware. Once portable behavior is clear, integrate one real operation at a time and compare its observed contract with the fake assumptions.

## Example

```
#include <stdbool.h>
#include <stdint.h>
typedef bool (*read_counts_fn)(void *context, uint16_t *out);
bool take_sample(read_counts_fn read_fn, void *context, uint16_t *out) {
    if (read_fn == 0 || out == 0) return false;
    return read_fn(context, out);
}
```

The adapter owns the meaning of context and output-on-failure. This fragment performs no hardware access and can be tested with a fake reader.

## Start: Constant fake device

Implement a fake reader that always returns 1234 successfully.

Input: Valid output pointer

Expected: true; output 1234

Hints:
- The fake need not use context.
- Honor pointer validity.

Worked reasoning: Assign the predetermined count and return success, making the calling logic testable on the desktop.

Tests:
- Repeated calls agree.
- Null function pointer is rejected by take_sample.

Extension: Convert the fake count using the validated ADC model.

## Build: Disconnect sequence

Create a fake returning success, failure, success.

Input: 100; disconnected; 120

Expected: Two valid samples and one explicit missing observation

Hints:
- Failure is not a zero reading.
- Do not silently reuse the previous value as fresh.

Worked reasoning: Advance the fake sequence and preserve status. The consumer records missing data for the middle call.

Tests:
- Middle failure follows output policy.
- Recovery produces 120.

Extension: Add timestamps to distinguish stale from missing.

## Stretch: Context-backed replay

Store a fixture array and index in a fake context; reject reads beyond its end.

Input: Three fixture samples

Expected: Three ordered successes then failure

Hints:
- Cast context only inside its documented adapter.
- Check index before access.

Worked reasoning: The context owns replay position. Each successful read advances once; exhaustion returns failure without out-of-bounds access.

Tests:
- Empty fixture immediately fails.
- Repeated exhausted reads remain failures.

Extension: Add injected errors at selected indexes.

## Debug: Volatile as a lock

A comment says volatile unsigned count makes ++count safe across interrupts and threads. Correct it.

Input: Shared compound increment

Expected: Volatile does not guarantee atomic read-modify-write or synchronization

Hints:
- An increment involves multiple logical steps.
- Check platform atomic facilities.

Worked reasoning: Use the platform's documented atomic or critical-section mechanism and define the concurrency model rather than relying on volatile.

Tests:
- Portable logic has no unnecessary shared state.
- Hardware access contract is documented.

Extension: Explain the separate role volatile can have for memory-mapped I/O.

## Recall

Why use a fake device?

It makes data and failure sequences deterministic so portable behavior can be tested first.

What does a function pointer plus context provide?

A small interface for substituting different implementations while carrying implementation-specific state.

Sources:
- GNU C language introduction and reference (includes GNU extensions): https://www.gnu.org/software/c-intro-and-ref/manual/html_node/index.html
- NASA core Flight System: https://github.com/nasa/cFS

# C — A reusable C component and a reviewable portfolio

Understanding a small trustworthy component is a better foundation than importing a flight framework you cannot explain.

A component needs a clear public interface and a small set of responsibilities. Place declarations, documented types, and caller obligations in a header. Keep private helper functions and state inside the implementation where possible. A header should be usable from a clean source file without depending on accidental include order. Build a small test executable against the same implementation used by the demonstration.

Write a compact trace from each requirement to evidence. A packet decoder might require rejection of short data, recognition of a version byte, and preservation of output on failure. Map those to named tests and fixed byte fixtures. Include compiler settings and the intended C standard. This record helps future you understand whether a change preserved the original contract or intentionally replaced it.

Mature flight-software ecosystems such as NASA cFS demonstrate how reusable services, applications, and platform abstractions fit together. Read them for architecture after you can explain your own component. Framework use, C language choice, and passing tests do not confer flight qualification. A credible project report distinguishes tested behavior, assumptions, portability limits, and future verification work without diminishing what the prototype actually achieved.

## Example

```
#ifndef SENSOR_DECODE_H
#define SENSOR_DECODE_H
#include <stddef.h>
#include <stdint.h>
enum decode_status { DECODE_OK, DECODE_SHORT, DECODE_VERSION };
struct reading { uint16_t counts; uint8_t flags; };
enum decode_status decode_reading(const uint8_t *data, size_t n, struct reading *out);
#endif
```

A public interface sketch. The implementation must document null-pointer policy, expected length, allowed flags, and output behavior before it can be considered complete.

## Start: Requirement trace

Turn reject invalid packets into three specific testable requirements.

Input: Length, version, output policy

Expected: Three named requirements and corresponding tests

Hints:
- State exact boundaries.
- Use observable outcomes.

Worked reasoning: Require minimum length, recognized version, and unchanged output on rejection; give each one a fixed fixture.

Tests:
- Short input rejects.
- Unknown version rejects.

Extension: Add reserved-flag behavior.

## Build: Standalone header check

Compile a source file that includes only the public header before its main function.

Input: No accidental prior includes

Expected: Header compiles using its own declared dependencies

Hints:
- The header must include size_t and integer declarations.
- Avoid hidden include order.

Worked reasoning: Include stddef.h and stdint.h in the header because its public types require them.

Tests:
- Include the header twice safely.
- Build implementation and test separately.

Extension: Add C++ linkage guards only if interoperability is required.

## Stretch: cFS architecture reading

Read the official cFS repository overview and map application, platform abstraction, and tests to your own component.

Input: Documentation-only study

Expected: A sourced one-page comparison with explicit unknowns

Hints:
- Start with architecture purpose.
- Do not claim equivalent assurance.

Worked reasoning: Describe the shared separation-of-concerns idea while clearly identifying the much smaller scope and unverified aspects of the learning component.

Tests:
- Every framework claim links to its source.
- Unknown details remain marked unknown.

Extension: Follow one official sample application later.

## Debug: Overclaimed reliability

A README calls a desktop parser flight-safe because it uses C and passes 20 tests. Rewrite it.

Input: Desktop fixture tests only

Expected: Accurate educational-prototype description

Hints:
- Describe actual evidence.
- Separate coverage from certification.

Worked reasoning: State tested inputs, compiler, diagnostic tools, and known limits; list hardware, timing, and domain assurance as unperformed work.

Tests:
- README includes reproducible commands.
- Limitations identify untested conditions.

Extension: Prioritize the next test by a realistic failure mode.

## Recall

What belongs in a public header?

Types, declarations, dependencies, and clear caller obligations needed to use the interface.

What makes a prototype report credible?

Reproducible evidence, explicit assumptions, and honest limits alongside its demonstrated capabilities.

Sources:
- NASA core Flight System: https://github.com/nasa/cFS
- GCC warning options: https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html

# BASH — Know which shell you are using

Robotics instructions often assume Linux and Bash. Recognizing the environment prevents confusing a shell problem with a programming problem.

Bash is a command interpreter and scripting language. Linux is an operating-system kernel used in many complete environments. A terminal is the window or interface through which you interact with a shell. PowerShell is a different shell with different syntax and object-based behavior. A command copied from one environment may not mean the same thing in another, even if a familiar command name exists.

On Windows, an installed WSL distribution is one possible place to use Linux tools; Git Bash is another environment with different capabilities. Neither should be assumed to contain every robotics dependency. Identify the shell, current directory, and available command before following a tutorial. Read-only checks such as pwd, printf, and command -v help establish where you are without changing system settings.

Practice in a fresh scratch directory, not among irreplaceable project files. The example creates a unique temporary directory and enters it, so repeated lessons do not overwrite earlier work. Write down the path it prints. This is not a cleanup lesson: leave deletion to a deliberate later action after inspecting the contents. Your first success is knowing exactly where a command runs and which files it can affect.

## Example

```
printf "Bash version: %s\n" "$BASH_VERSION"
pwd
lab_dir=$(mktemp -d) || exit 1
cd "$lab_dir" || exit 1
printf "Practice directory: %s\n" "$PWD"
```

Run these commands in Bash. mktemp creates a unique directory, and quoted cd preserves its path as one argument.

## Start: Environment inventory

In Bash, print its version and current directory. Explain what each tells you.

Input: No files required.

Expected: A Bash version string and an absolute current-directory path.

Hints:
- Use BASH_VERSION.
- pwd reports location, not shell identity.

Worked reasoning: printf "%s\n" "$BASH_VERSION"; pwd. The version identifies Bash behavior; the path identifies the base for relative filenames.

Tests:
- Version is not empty in Bash.
- pwd agrees with the directory you intended.

Extension: Record the operating environment separately.

## Build: Command discovery

Determine whether python3 and git are available without executing a project.

Input: command -v python3; command -v git

Expected: Paths or a nonzero status if a command is absent.

Hints:
- command -v asks how a command resolves.
- Absence is information, not permission to install blindly.

Worked reasoning: Inspect each command separately and record which environment supplied it. An installed Windows program and a Linux command may differ.

Tests:
- A known shell builtin resolves.
- A deliberately invented command does not.

Extension: Compare with your project’s documented prerequisites.

## Stretch: Workspace map

Create a new temporary directory and draw a plan for raw, work, and results subdirectories.

Input: A scratch Bash session.

Expected: All proposed paths stay under the printed practice directory.

Hints:
- Use mkdir with relative names after entering the directory.
- Record the parent path first.

Worked reasoning: Create the three subdirectories with mkdir raw work results. Use pwd and a listing to confirm location before adding sample files.

Tests:
- No system directory is modified.
- The three names are siblings.

Extension: Describe which category should contain unmodified observations.

## Debug: Wrong-shell diagnosis

A tutorial says sample_count=3, but the current console interprets it as a command. Identify the likely cause before changing syntax.

Input: A PowerShell console running Bash tutorial text.

Expected: The user must choose Bash or translate intentionally to PowerShell.

Hints:
- Check the actual shell.
- A terminal window can host different shells.

Worked reasoning: The assignment syntax belongs to Bash. Follow the tutorial in a supported Bash environment or use equivalent PowerShell instructions consistently.

Tests:
- BASH_VERSION is available in the intended Bash session.
- The chosen tutorial matches the environment.

Extension: Explain why Linux installation is separate from learning one assignment.

## Recall

What is the difference between a terminal and a shell?

The terminal provides the interaction surface; the shell interprets commands and implements a language.

Why start in a scratch directory?

It bounds file effects and makes the lesson’s inputs and outputs easy to inspect.

Sources:
- Microsoft: WSL command context: https://learn.microsoft.com/en-us/windows/wsl/basic-commands

# BASH — Paths and arguments with spaces

Engineering folders often contain spaces, run names, and long descriptive filenames. Quoting is a daily reliability skill.

A command receives a list of arguments, not the exact sentence you see on screen. Bash first interprets quoting and expansions, then constructs that list. Unquoted spaces separate words. Quotes let a path such as run one remain one argument rather than becoming two unrelated names. This is why quoting is more than a style preference.

Single quotes preserve literal text. Double quotes allow selected expansions, such as a variable’s value, while keeping that result together. Use double quotes around a path variable in ordinary commands. The quote characters are instructions to the shell and are not normally part of the filename received by the command. To understand a command, ask how many arguments it will receive and what each contains.

Relative paths are resolved from the current working directory. A leading ./ makes that relationship explicit, and it also helps distinguish a filename beginning with a dash from an option. Many tools support -- to end option parsing, but verify the tool’s interface rather than assuming every program does. Practice with printf before copying or processing files so you can see the intended argument boundaries.

## Example

```
run_name="run one"
mkdir -- "$run_name"
printf "<%s>\n" "$run_name" "./$run_name"
```

The two printf arguments remain intact. This example assumes a fresh practice directory where run one does not already exist.

## Start: One name, one argument

Print the name rover log between angle brackets without splitting it.

Input: name="rover log"

Expected: <rover log> on one line

Hints:
- Quote the expansion.
- Use a fixed printf format.

Worked reasoning: printf "<%s>\n" "$name" preserves the value as one argument.

Tests:
- A value containing two spaces remains intact.
- An empty value prints <>.

Extension: Try a value containing an asterisk without expanding filenames.

## Build: Literal versus expanded

Predict the difference between printing a literal variable reference and its value.

Input: name="sensor A"

Expected: Single quotes around $name print $name; double quotes print sensor A.

Hints:
- Single quotes suppress expansion.
- Double quotes preserve boundaries while allowing variables.

Worked reasoning: Use printf "%s\n" followed by each quoted form and compare. The quotes themselves are not printed.

Tests:
- The literal form starts with a dollar sign.
- The expanded form remains one argument.

Extension: Explain which form suits a fixed template.

## Stretch: A filename beginning with dash

Design a read-only command to inspect a file named -notes.txt in the current scratch directory.

Input: The file is already present.

Expected: The name is interpreted as a file, not an option.

Hints:
- Use an explicit relative path.
- Many tools also accept --.

Worked reasoning: cat -- "./-notes.txt" makes both the option boundary and relative location explicit. Check cat’s help if using a nonstandard implementation.

Tests:
- The path stays in the current directory.
- No unexpected option is parsed.

Extension: Explain how a variable containing that name should be quoted.

## Debug: Quotes stored in a string

A variable contains the characters double-quote, run one, double-quote. A command still splits it when expanded unquoted. Why?

Input: path contains literal quote characters.

Expected: Quote the expansion; do not store shell syntax as data.

Hints:
- Expansion results are not reparsed as fresh quoting syntax.
- Keep the variable’s value equal to the actual path.

Worked reasoning: Set path="run one", then use "$path". Do not use eval to force reparsing.

Tests:
- The variable contains no extra quote characters.
- printf with delimiters shows one intact argument.

Extension: Describe why reparsing strings as commands is fragile.

## Recall

Why quote a path variable?

To preserve its value as one argument and avoid unintended word splitting or filename expansion.

Do quotation marks inside a variable become shell quoting?

No. They are data after expansion, not a second pass of shell syntax.

Sources:
- GNU Bash: quoting: https://www.gnu.org/software/bash/manual/html_node/Quoting.html

# BASH — Variables, defaults, and integer arithmetic

A run script needs filenames, counters, and modes. Scientific arrays and floating-point calculations usually belong in Python or MATLAB.

Bash assignments have no spaces around the equals sign. A variable can hold a string, including text that looks numeric. Expansion retrieves that string, and quoting preserves it. Use descriptive names such as run_label or sample_count. Avoid overwriting environment variables whose established meaning controls how tools behave.

Default values can make a script convenient, but a default should not conceal a missing essential input. For an optional label, a documented fallback is reasonable. For an input dataset, an absent path should usually produce a clear error. Distinguish an unset value from an empty one when that difference matters, and keep the behavior in the script’s usage text.

Bash arithmetic is integer arithmetic. Division truncates toward an integer result, so it is inappropriate for a scientific average such as 5/2 when you expect 2.5. Use the shell to coordinate a numerical program instead of recreating its data model. Be cautious with numbers containing leading zeros, which can have base-related interpretation. For a beginner script, accept and validate simple decimal counters rather than arbitrary arithmetic expressions.

## Example

```
sample_count=5
extra_count=2
total_count=$((sample_count+extra_count))
printf "Total samples: %s\n" "$total_count"
```

The result is 7. Arithmetic expansion is useful for counters, not a replacement for floating-point engineering calculations.

## Start: Counter arithmetic

Compute the number of rows after adding two sample batches.

Input: first=12, second=8

Expected: 20

Hints:
- Use arithmetic expansion.
- Print with a fixed format.

Worked reasoning: total=$((first+second)); printf "%s\n" "$total". This models a count, so integer arithmetic is appropriate.

Tests:
- Adding zero preserves the count.
- Order of addition does not change the result.

Extension: Add a third batch.

## Build: Document a default

Design behavior for an optional run label and a required input path.

Input: No label supplied; input path supplied.

Expected: Use a documented label fallback while retaining the explicit input path.

Hints:
- Not every missing value should become empty text.
- Treat required and optional inputs differently.

Worked reasoning: Choose a fallback such as trial for the label; reject an absent input path with usage guidance before reading files.

Tests:
- An explicit label is preserved.
- A missing required path fails clearly.

Extension: Specify whether an empty label should trigger the default.

## Stretch: Choose the right tool

A script must average 5 and 2 to produce 3.5. Explain why a Bash-only arithmetic expression is a poor default.

Input: Values 5 and 2.

Expected: Delegate floating-point calculation to a suitable numerical tool.

Hints:
- Integer division loses the fractional part.
- Keep orchestration separate from analysis.

Worked reasoning: Bash can validate filenames and call a Python or MATLAB analysis. The numerical program should define parsing, precision, and error behavior.

Tests:
- The expected mean is independently known.
- The analysis output is checked before use.

Extension: Define a simple input/output interface for the numerical program.

## Debug: Assignment becomes a command

Diagnose sample_count = 5 in Bash.

Input: Spaces surround the equals sign.

Expected: Bash attempts to execute a command named sample_count.

Hints:
- Whitespace separates words.
- Assignment syntax is one token.

Worked reasoning: Use sample_count=5. For arithmetic later use $((sample_count+1)); do not add spaces around the assignment operator.

Tests:
- The variable prints 5.
- No command-not-found message remains.

Extension: Contrast this with spaces inside a quoted string value.

## Recall

What kind of arithmetic does Bash provide directly?

Integer arithmetic, useful for counters and control flow.

When is a default dangerous?

When it hides a missing required input and lets a script operate on an unintended file or assumption.

Sources:
- GNU Bash: shell parameters: https://www.gnu.org/software/bash/manual/html_node/Shell-Parameters.html

# BASH — Streams, redirection, and preserving raw data

A simulation run may produce both results and warnings. Mixing them can corrupt the next stage’s input.

A process normally has standard input, standard output, and standard error. Standard output is the ordinary result stream; standard error is where diagnostics often go. These are conventions that let programs cooperate. A numerical tool can print a machine-readable result on standard output while explaining a missing file on standard error.

Redirection changes where a stream goes. The > operator opens an output file and truncates an existing one before the command runs. Appending with >> preserves old content but can accumulate stale or duplicated results. Neither is automatically the correct choice. Decide whether a file is an immutable input, a per-run result, or an append-only journal before selecting the operator.

Never use the same file as both a pipeline’s input and its redirected output. The shell may truncate it before the first command reads anything. In these lessons, create tiny files only inside your scratch directory and write transformations to a different filename. Inspect the new file before any later replacement decision. Learning the timing of redirection prevents mistakes that otherwise look like mysterious data loss.

## Example

```
printf "time_s,temperature_c\n0,20\n1,21\n" > raw.csv
printf "Created a tiny practice fixture\n" >&2
cat raw.csv > copied.csv
```

This creates raw.csv in the scratch directory and copies its content to a distinct generated file. Repeating the first line replaces this lesson fixture.

## Start: Create a fixture

Write two lines into a new scratch file, then inspect them.

Input: Lines alpha and beta.

Expected: A two-line file in the practice directory.

Hints:
- Use printf with newline escapes.
- Choose a new lesson filename.

Worked reasoning: printf "alpha\nbeta\n" > fixture.txt; cat fixture.txt. This intentionally creates or replaces only the named fixture.

Tests:
- There are two newline-terminated lines.
- The content is not a single literal backslash-n string.

Extension: Add a third line using a deliberate append.

## Build: Separate diagnostics

Design a script that emits 42 as its result and a progress message as a diagnostic.

Input: One result and one status message.

Expected: Redirecting stdout captures only 42.

Hints:
- Use >&2 for the diagnostic.
- Keep the result format predictable.

Worked reasoning: printf "42\n"; printf "Analysis complete\n" >&2. Run with stdout redirected to a scratch result file and inspect it.

Tests:
- The result file contains no status sentence.
- The diagnostic is still visible unless separately redirected.

Extension: Capture stdout and stderr into separate files.

## Stretch: Choose overwrite or append

Specify file behavior for raw observations, a regenerated summary, and a study journal.

Input: Three different file roles.

Expected: Raw is preserved; summary gets a new per-run file or deliberate replacement; journal appends.

Hints:
- Choose policy by meaning.
- Repeated runs must not silently duplicate summary rows.

Worked reasoning: Document each policy before coding. Keep generated output paths separate from raw data and add run identifiers where needed.

Tests:
- Re-running does not change raw data.
- The journal retains prior entries.

Extension: Add an output-exists check to the summary workflow.

## Debug: The empty input file

Explain why cat raw.csv > raw.csv can leave raw.csv empty.

Input: The same path is input and redirected output.

Expected: Redirection truncates the file before cat reads it.

Hints:
- The shell sets up streams first.
- Use a separate output path.

Worked reasoning: Write to a new file such as copied.csv instead and inspect it. Do not repeat the faulty command on real data to investigate.

Tests:
- Input and output resolve to distinct paths.
- Raw content remains unchanged.

Extension: Draw the order: redirection, process start, file read.

## Recall

What is stderr for?

Diagnostics or other non-result output by convention, keeping stdout usable by another program.

When does > truncate a file?

During shell redirection setup, before the command consumes its input.

Sources:
- GNU Bash: redirections: https://www.gnu.org/s/bash/manual/html_node/Redirections.html

# BASH — Pipelines and small text tools

A few composable tools can summarize simulation logs without creating a large custom application.

A pipeline connects one command’s standard output to another command’s standard input. The useful mental model is a sequence of transformations with an explicit data format at every boundary. Start by reading a tiny log, then filter lines, then count them. Inspect each intermediate result before compressing the work into one line.

Text tools have specific meanings. grep selects matching lines; wc -l counts newline characters, which corresponds to line count for the newline-terminated fixtures used here. sort orders text according to its options and locale. A numerical value represented as text is not automatically sorted numerically. These details matter when a report’s ranking or count influences what you investigate next.

Choose text tools for formats they actually understand. A simple line-oriented log is appropriate for grep. General CSV can contain quoted commas and embedded newlines, so splitting it with a basic delimiter command can corrupt records. Use a CSV-aware library for that case. Bash coordinates tools; it does not need to become a fragile replacement for a parser.

## Example

```
printf "INFO start\nWARN gap\nINFO end\nWARN stale\n" | grep "^WARN" | wc -l
```

The result is 2. The fixture is deliberately line-oriented and newline-terminated.

## Start: Filter warnings

Print only lines beginning with WARN.

Input: INFO start; WARN gap; INFO text says WARN; WARN stale, each on its own line.

Expected: WARN gap and WARN stale only.

Hints:
- Anchor the pattern at the line start.
- Quote the pattern.

Worked reasoning: grep "^WARN" selects severity-prefixed lines. An unanchored WARN would also match the INFO sentence.

Tests:
- The INFO sentence is excluded.
- Both real warning lines remain.

Extension: Require a following space to avoid matching WARNING if the format demands it.

## Build: Count selected lines

Count ERROR severity lines in a newline-terminated fixture without including INFO mentions of ERROR.

Input: ERROR read; INFO ERROR example; ERROR parse

Expected: 2

Hints:
- Verify the filter first.
- Then count its output lines.

Worked reasoning: Use grep "^ERROR " followed by wc -l. Keep the fixture small enough to verify by inspection.

Tests:
- No matching lines gives count zero.
- A line containing the word later is excluded.

Extension: Use grep -c and compare behavior and exit status.

## Stretch: Numeric ranking

Sort textual run durations from smallest to largest and explain the option choice.

Input: 2, 10, 1 on separate lines.

Expected: 1, 2, 10

Hints:
- Default text ordering is not numeric ordering.
- Read sort help for -n.

Worked reasoning: sort -n interprets the leading numeric value for ordering. Define how malformed or missing durations will be handled before using real logs.

Tests:
- 10 follows 2.
- Duplicate durations remain unless deliberately deduplicated.

Extension: Add run identifiers and define a stable numeric sort key.

## Debug: A CSV parser made from cut

A script uses cut -d, on a CSV whose quoted notes contain commas. Explain why the selected field is wrong.

Input: time,note,value with note such as "sensor, left".

Expected: A simple comma split does not respect CSV quoting.

Hints:
- The delimiter can occur inside a quoted field.
- Use a format-aware parser.

Worked reasoning: Pass CSV processing to Python’s csv module or another documented CSV parser, while Bash handles filenames and orchestration.

Tests:
- A quoted comma remains inside one field.
- A newline inside a quoted field is handled if allowed by the data contract.

Extension: Create a two-row regression fixture with quoted punctuation.

## Recall

Why inspect intermediate pipeline output?

It localizes mistakes and confirms the format passed between tools before another transformation hides it.

When should text processing move out of Bash?

When structured parsing, complex validation, numerical arrays, or intricate data relationships exceed simple line-oriented transformations.

Sources:
- GNU Bash: pipelines: https://www.gnu.org/software/bash/manual/html_node/Pipelines.html

# BASH — Exit status and visible failure

A long simulation pipeline should not produce a convincing report after an earlier stage failed.

Every completed command returns an exit status. Zero conventionally means success, while nonzero values distinguish failure or other outcomes. Some tools use nonzero for an ordinary negative result, such as grep finding no match. Therefore you need the command’s documented contract rather than a blanket assumption that every nonzero result is a crash.

The special parameter $? holds the last command’s status, but another command replaces it. Capture it immediately or use the command directly in an if statement. A pipeline has its own status rules: by default its final command determines the pipeline status. Bash pipefail changes that rule so an earlier nonzero status can make the pipeline nonzero. It does not make every pipeline’s semantics automatically correct.

Do not add set -e and assume failure handling is solved. Context affects its behavior, and expected negative results can need explicit branches. For small learning scripts, clear if/else handling around important commands is easier to reason about. Decide what failure means, which outputs remain trustworthy, and what diagnostic should help the next person repair the input.

## Example

```
if grep -q "^WARN " run.log; then
  printf "Warnings present\n"
else
  status=$?
  printf "grep status: %s\n" "$status" >&2
fi
```

For grep, status 1 means no selected lines; larger error statuses need different treatment. A production script should distinguish these cases explicitly.

## Start: Status immediately

Run true and false and record each status immediately.

Input: Bash builtins true and false.

Expected: 0 after true; 1 after false.

Hints:
- Read $? before another command.
- The words true and false here are commands.

Worked reasoning: true; status=$?; printf "%s\n" "$status"; then repeat with false. The saved variable survives the print.

Tests:
- Statuses differ as expected.
- The second test does not reuse the first saved value.

Extension: Explain how an if statement avoids manual status capture.

## Build: No match is meaningful

Design three outcomes for grep: match, no match, and input error.

Input: A readable log with a match, a readable log without one, and a missing path.

Expected: Distinct result messages and failure handling.

Hints:
- Consult grep’s status contract.
- Do not collapse no data into bad data.

Worked reasoning: Branch on 0 for match, 1 for no match, and other statuses for an error. Capture the status directly after grep.

Tests:
- No-match is reported as an ordinary outcome.
- Missing input prevents a success report.

Extension: Have the script itself return a documented status.

## Stretch: Pipeline status experiment

Compare false | true with pipefail disabled and enabled in a scratch Bash session.

Input: Two builtins, no files.

Expected: Default pipeline status 0; with pipefail status nonzero.

Hints:
- The last command succeeds.
- pipefail considers earlier nonzero statuses.

Worked reasoning: Observe the status in each mode and restore the session setting afterward if needed. Explain why this is a behavior experiment rather than an error policy.

Tests:
- No files change.
- The result is captured immediately.

Extension: Repeat with true | false and explain why both modes fail.

## Debug: The status was overwritten

A script runs an analyzer, prints "done", then tests $?. Diagnose why it reports success even when the analyzer failed.

Input: The diagnostic printf succeeds.

Expected: The script checked printf’s status.

Hints:
- Every command updates $?.
- Save or branch immediately.

Worked reasoning: Use if analyzer; then ... else ... fi, or status=$? immediately after the analyzer. Do not print a success sentence before checking.

Tests:
- A failing analyzer enters the failure branch.
- A passing analyzer enters the success branch.

Extension: Test the branch using a stub command.

## Recall

What does exit status zero mean?

It conventionally indicates success according to that command’s interface.

What is the default status of a pipeline?

The status of its last command, unless options such as Bash pipefail change the rule.

Sources:
- GNU Bash: exit status: https://www.gnu.org/s/bash/manual/html_node/Exit-Status.html

# BASH — Script arguments and a clear usage contract

A daily analysis should accept the file you intend rather than silently depend on the current folder or yesterday’s filename.

A script receives positional arguments. The first argument is $1, the count is $#, and the script name is available as $0. Before reading a positional parameter, check whether the required number of arguments was supplied. A short usage message is part of the interface: it should explain what input is required and what output the script produces.

Quoted argument forwarding preserves the original argument boundaries. A path containing spaces must remain one path through every wrapper layer. Do not concatenate arguments into a command string and then execute that string. Keeping program name and arguments separate is both simpler and more reliable. If the interface grows complicated, use a documented option parser rather than a pile of accidental conventions.

Validation should happen before work with side effects. Check argument count, file readability, and allowed mode values before starting a long analysis or creating a result. For this lesson the script only inspects a file, which keeps failures easy to test. Build a tiny fixture and deliberately omit the argument, provide a missing path, and provide a filename containing a space.

## Example

```
#!/usr/bin/env bash
if [[ $# -ne 1 ]]; then
  printf "Usage: inspect-log FILE\n" >&2
  exit 2
fi
if [[ ! -r "$1" ]]; then
  printf "Input is not readable\n" >&2
  exit 1
fi
wc -l < "$1"
```

Save as inspect-log.sh and run with bash inspect-log.sh "run one.log". It prints a line count for a readable newline-terminated file.

## Start: Argument count

Write a script that requires exactly one argument and prints usage otherwise.

Input: Zero, one, or two arguments.

Expected: Only the one-argument case continues.

Hints:
- Use $#.
- Return a nonzero status for bad usage.

Worked reasoning: Test [[ $# -ne 1 ]] and exit 2 with usage on stderr. Keep the expected interface visible.

Tests:
- Zero arguments fails.
- Two arguments fails.

Extension: Include the script name in the usage text.

## Build: A path with spaces

Pass a file named run one.log to the line-count script.

Input: A two-line fixture in the scratch directory.

Expected: The script prints 2.

Hints:
- Quote the path at invocation.
- Quote $1 inside the script too.

Worked reasoning: bash inspect-log.sh "run one.log" passes one argument; wc -l < "$1" reads the intended file.

Tests:
- The argument count is one.
- Neither run nor one.log is accessed separately.

Extension: Try a path in a subdirectory with spaces.

## Stretch: Allowed modes

Design a script accepting MODE FILE, where MODE is either count or warnings. Validate before reading.

Input: count fixture.log; warnings fixture.log; unknown fixture.log

Expected: The first two operate; unknown is rejected with usage.

Hints:
- Check the count first.
- Use a case statement for allowed modes.

Worked reasoning: Reject unsupported mode text rather than treating it as a command name. Each supported branch invokes a fixed known operation.

Tests:
- No mode text is executed as code.
- Bad usage produces nonzero status.

Extension: Add help as a documented third mode.

## Debug: Argument forwarding splits names

A wrapper calls bash inspect-log.sh $1. Why can it fail for a valid path?

Input: First argument is run one.log.

Expected: Unquoted expansion can become multiple arguments.

Hints:
- Preserve the argument boundary at every layer.
- The called script’s validation reveals the split.

Worked reasoning: Use bash inspect-log.sh "$1". For forwarding all original arguments, use quoted "$@" after validating the wrapper’s own interface.

Tests:
- The path reaches the child unchanged.
- An empty argument is not silently dropped.

Extension: Explain why "$*" is not interchangeable with "$@".

## Recall

Why validate argument count first?

It prevents missing values from being mistaken for legitimate input and provides a clear usage failure.

What does quoted "$@" preserve?

Each original positional argument as its own argument, including spaces and empty values.

Sources:
- GNU Bash: shell parameters: https://www.gnu.org/software/bash/manual/html_node/Shell-Parameters.html

# BASH — Conditionals that express the workflow

A robust run script needs to know whether an input exists, a mode is supported, and a prerequisite succeeded.

A conditional is a choice based on a command’s success or an expression’s truth. In Bash, [[ ... ]] provides a useful expression form for many checks. A readable-file test answers a different question from a nonempty-string test, and neither proves that a CSV’s contents are valid. Match the test to the decision rather than treating any nonempty value as evidence of correctness.

Use case for a small set of named modes. It makes the allowed vocabulary visible and avoids evaluating user-supplied text as a command. For numeric comparisons, validate the expected numeric representation before arithmetic. Bash arithmetic is not an appropriate parser for arbitrary untrusted expressions, and lexical string ordering is different from numeric ordering.

Keep branches short and meaningful. A branch should explain what happens when a condition is false, not only the happy path. Avoid compact chains that look like if/else but behave differently when the middle command fails. Readability matters because a future failed simulation may require you to diagnose the workflow quickly, under less convenient conditions than a tutorial.

## Example

```
mode="count"
case "$mode" in
  count) printf "Count mode selected\n" ;;
  warnings) printf "Warning mode selected\n" ;;
  *) printf "Unsupported mode\n" >&2; exit 2 ;;
esac
```

The accepted modes are explicit. The mode string is compared as data, never executed as a command.

## Start: Readable input

Check whether a supplied path is readable and print an appropriate message.

Input: A readable fixture and a missing path.

Expected: Different branches for readable and unavailable input.

Hints:
- Use -r with a quoted path.
- This checks access, not schema.

Worked reasoning: if [[ -r "$path" ]]; then ... else ... fi. Keep a later content validator separate.

Tests:
- A missing path enters failure.
- A malformed but readable file still passes this access check.

Extension: Add a regular-file test if directories are not allowed.

## Build: Named operation

Implement count and inspect modes with a default rejection branch.

Input: mode values count, inspect, nonsense.

Expected: Only the two documented values are accepted.

Hints:
- case makes the vocabulary clear.
- Use ;; between branches.

Worked reasoning: case "$mode" in count) ... ;; inspect) ... ;; *) ... ;; esac. Fixed operations are selected by the data value.

Tests:
- Each supported mode reaches its own branch.
- Unknown text is not executed.

Extension: Add a mode that prints help without reading files.

## Stretch: Validate a positive count

Specify a decimal positive-integer contract for a sample count before using it in a loop.

Input: Inputs 3, 0, -2, 2.5, abc.

Expected: Only 3 passes under this contract.

Hints:
- Representation and range are separate checks.
- Do not feed arbitrary expressions into arithmetic.

Worked reasoning: First require digits in the intended format, then enforce a positive range. Document a reasonable maximum to avoid accidental enormous work.

Tests:
- Decimal fractions are rejected.
- The maximum boundary is tested.

Extension: Decide whether leading zeros are accepted and normalize them explicitly.

## Debug: The misleading compact chain

A script uses validate && analyze || report_invalid. Why might report_invalid run even after validation succeeds?

Input: analyze returns nonzero.

Expected: The final branch responds to the failed analyze command.

Hints:
- && and || form command lists.
- This is not a complete if/else substitute.

Worked reasoning: Use if validate; then if analyze; then ... else report_analysis_failure; fi; else report_invalid; fi. Distinguish the two failures.

Tests:
- Validation failure has its own message.
- Analysis failure is not mislabeled as invalid input.

Extension: Refactor the nested branch into small functions.

## Recall

Does -r validate the contents of a file?

No. It checks readability; the data format and scientific validity need separate checks.

Why use case for modes?

It exposes a finite set of accepted values and keeps input as data instead of executable text.

Sources:
- GNU Bash: conditional constructs: https://www.gnu.org/software/bash/manual/html_node/Conditional-Constructs.html

# BASH — Loops over records, not accidental words

Batch processing is one of Bash’s best uses, provided each item remains intact.

A loop repeats an operation for a sequence of items. The crucial question is what counts as an item. A list of filenames is not safely represented by arbitrary whitespace-separated text, because a filename can itself contain spaces. Similarly, a line of a log may contain several words that must remain one record.

For a fixed list, quote each item and quote the loop variable when passing it to commands. For lines from a simple text file, IFS= read -r preserves leading and trailing whitespace and backslashes. A redirected while loop can keep its state in the current shell, unlike common pipeline-loop forms that may execute in a subshell. Learn this difference with a counter before relying on it in a report.

Start by printing the work you intend to perform. Once the item boundaries and count are correct, replace the print with a known read-only transformation. Record a per-item result and decide what should happen if one item fails. A batch that processes nine files and silently skips the tenth is not a complete successful analysis.

## Example

```
count=0
while IFS= read -r line; do
  printf "<%s>\n" "$line"
  count=$((count+1))
done < records.txt
printf "Records: %s\n" "$count"
```

This assumes a newline-terminated records.txt fixture. The redirection avoids placing the loop in a pipeline subshell.

## Start: Fixed list

Loop over two names, one containing a space, and print one bracketed name per line.

Input: Names alpha and rover run.

Expected: [alpha] then [rover run]

Hints:
- Quote the space-containing item.
- Quote the expansion inside the loop.

Worked reasoning: for name in "alpha" "rover run"; do printf "[%s]\n" "$name"; done.

Tests:
- Exactly two iterations occur.
- The space remains inside the second name.

Extension: Add an empty-string item and observe that it remains an item.

## Build: Preserve text lines

Read a three-line fixture without splitting words or interpreting backslashes.

Input: alpha beta; path\segment; final, each newline-terminated.

Expected: Three intact printed records.

Hints:
- Use IFS= before read.
- Use the -r option.

Worked reasoning: while IFS= read -r line; do printf "%s\n" "$line"; done < records.txt. This contract expects newline-terminated records.

Tests:
- alpha beta is one record.
- The backslash survives.

Extension: Support a final unterminated record explicitly.

## Stretch: Batch outcome summary

Design a loop that reports how many files succeeded and failed without hiding individual failures.

Input: Three fixtures, one deliberately unreadable or absent.

Expected: Two successes and one failure under the defined test.

Hints:
- Check each operation immediately.
- Store success and failure counters separately.

Worked reasoning: Use an if around each file operation, increment the appropriate count, and print a final summary. Return a failure status when the batch contract requires all files.

Tests:
- Every item has an outcome.
- A failed item cannot be counted as successful.

Extension: Add a separate list of failed paths for retry.

## Debug: Counter disappears

A counter incremented inside cat records.txt | while read ... remains zero afterward. Explain a likely cause.

Input: A Bash pipeline loop.

Expected: The loop may run in a subshell whose variables do not update the parent.

Hints:
- Investigate execution scope.
- Feed the loop with input redirection instead.

Worked reasoning: Use while ...; done < records.txt for this simple file case. Then the counter is available in the surrounding shell.

Tests:
- The final count equals the number of records.
- Input boundaries are still preserved with IFS= read -r.

Extension: Explain why a subshell can be useful when intentional.

## Recall

Why avoid for line in $(cat file)?

Command substitution and word splitting do not preserve arbitrary line boundaries or filename characters.

What does read -r prevent?

It prevents read from treating backslashes as escape characters.

Sources:
- GNU Bash: looping constructs: https://www.gnu.org/software/bash/manual/html_node/Looping-Constructs.html

# BASH — Arrays and file discovery

A reproducible batch needs an exact list of inputs, including paths containing spaces.

An array stores separate elements without forcing you to encode them into one space-separated string. This makes it suitable for a command’s arguments or a small list of files. Quoted expansion of all array elements preserves those boundaries. It is a better design than building a string with embedded quote marks and hoping Bash will parse it again.

File discovery introduces another boundary problem. A newline-separated listing is convenient for human inspection but cannot represent every possible filename unambiguously. A NUL-delimited stream is suitable for machine handling because filenames cannot contain that delimiter. GNU find supports -print0, and compatible consumers can preserve each complete path. Use a read-only listing first to verify the selection criteria.

Keep the discovery scope narrow. Start from the project’s input directory, filter regular files and the intended suffix, and record which files were selected. An empty match set deserves an explicit outcome, especially when the absence of logs could otherwise look like a successful zero-error run. The exercises here only list and inspect files; they do not bulk rename or delete anything.

## Example

```
files=("run one.log" "run two.log")
for file in "${files[@]}"; do
  printf "Input: <%s>\n" "$file"
done
```

Each array element remains one argument, including its space. The quoted @ expansion is the important boundary-preserving step.

## Start: Array boundaries

Store three input names in an indexed Bash array and print them individually.

Input: a.log, run one.log, z.log

Expected: Exactly three intact names.

Hints:
- Use parentheses for the array assignment.
- Quote the @ expansion.

Worked reasoning: files=("a.log" "run one.log" "z.log"); for file in "${files[@]}"; do printf "%s\n" "$file"; done.

Tests:
- The middle name is not split.
- The iteration count is three.

Extension: Add an empty element and inspect its behavior.

## Build: Discover only logs

List regular .log files below a scratch inputs directory.

Input: Mixed .log and .csv files plus a subdirectory.

Expected: Only regular files whose names end in .log.

Hints:
- Quote the pattern.
- Use -type f.

Worked reasoning: find ./inputs -type f -name "*.log" -print. The quoted glob belongs to find rather than the parent shell.

Tests:
- A directory named archive.log is excluded.
- A file named notes.csv is excluded.

Extension: Repeat with -print0 for a machine consumer.

## Stretch: Machine-safe discovery

Design a NUL-delimited loop that prints discovered paths with boundaries intact.

Input: Files include spaces and tabs.

Expected: Every selected file is processed exactly once.

Hints:
- Use find -print0.
- Use a consumer that reads NUL delimiters.

Worked reasoning: In Bash, use while IFS= read -r -d "" file; do printf "<%s>\n" "$file"; done < <(find ./inputs -type f -name "*.log" -print0). This is Bash-specific process substitution.

Tests:
- Space-containing paths remain whole.
- An empty folder produces zero iterations.

Extension: Add an explicit empty-selection report.

## Debug: A glob expanded too early

Why can find ./inputs -name *.log behave differently depending on files in the current directory?

Input: Unquoted *.log in the parent shell.

Expected: The shell may expand the pattern before find sees it.

Hints:
- There are two different pattern interpreters involved.
- Choose which one owns the glob.

Worked reasoning: Use -name "*.log" so find receives the literal pattern. The discovery should not depend on unrelated matching files in the caller’s current directory.

Tests:
- Behavior is stable when the caller has matching files.
- Only the intended search root is traversed.

Extension: Describe the same problem with an unquoted grep pattern.

## Recall

Why use an array for command arguments?

It preserves separate values directly, including spaces and empty elements, without reparsing a string as code.

Why is NUL useful for filename lists?

It separates filenames unambiguously because a filename cannot contain a NUL character.

Sources:
- GNU Findutils: safe filename handling: https://www.gnu.org/software/findutils/manual/html_node/find_html/Safe-File-Name-Handling.html

# BASH — Functions with small responsibilities

A script becomes easier to test when discovery, validation, analysis, and reporting are separate steps.

A shell function is a named group of commands that runs in the shell context. It receives positional arguments and returns an exit status. It does not return an arbitrary string through return; use standard output for a data result and the status for success or failure. This distinction helps functions compose with ordinary command-line tools.

Use local variables inside functions to avoid accidentally changing unrelated script state. Validate the function’s inputs and preserve quoted argument boundaries exactly as in a script. Keep diagnostics on standard error if standard output is intended to be captured. A function named count_records should not also rename files or change the caller’s working directory without an explicit contract.

Choose functions around responsibilities rather than line counts. A five-line validator can be worth naming because it describes a meaningful decision. Avoid introducing layers that only obscure a simple command. Your goal is a script that reads like a sequence of clear steps and whose failures point to a specific boundary. Start by testing functions against tiny fixtures before running them across a large folder.

## Example

```
count_lines() {
  local file="$1"
  [[ -r "$file" ]] || return 1
  wc -l < "$file"
}
count_lines "run one.log"
```

The function emits a line count on stdout and returns nonzero if the input is not readable. Callers should supply exactly one argument or add count validation.

## Start: A validation function

Write a function that succeeds only when its one argument is a readable regular file.

Input: One existing fixture and one missing path.

Expected: Status 0 for the valid file, nonzero otherwise.

Hints:
- Check argument count.
- Combine -f and -r deliberately.

Worked reasoning: Use [[ $# -eq 1 ]] before inspecting $1, then [[ -f "$1" && -r "$1" ]]. The final test supplies the status.

Tests:
- A directory is rejected.
- No argument is rejected cleanly.

Extension: Add a diagnostic without changing the status contract.

## Build: Data through stdout

Write a function that prints a supplied label in a stable format while leaving status for success.

Input: label "trial one"

Expected: label=trial one on stdout.

Hints:
- Use a fixed printf format.
- Quote the argument.

Worked reasoning: A function can printf "label=%s\n" "$1". Do not use return "$1"; return is for numeric status.

Tests:
- Spaces survive.
- A successful print returns success.

Extension: Capture the output into a variable and inspect it.

## Stretch: No hidden directory changes

Refactor a function that changes into an input directory and forgets to change back.

Input: Caller expects its current directory unchanged.

Expected: The function’s effect is isolated or removed.

Hints:
- Prefer explicit paths when possible.
- A subshell can intentionally contain cd.

Worked reasoning: Use explicit file paths, or perform the directory-specific work in a subshell. Document any unavoidable state changes.

Tests:
- pwd before and after agrees.
- The intended file is still accessed.

Extension: Add a test for failure during the internal operation.

## Debug: Debug text corrupts a number

A caller captures count=$(count_lines file), but the function prints "starting" and then the number. Diagnose the broken interface.

Input: Captured text contains two lines.

Expected: Send diagnostics to stderr or remove them from the data function.

Hints:
- Command substitution captures stdout.
- Keep stdout machine-readable.

Worked reasoning: Use printf "starting\n" >&2 for a diagnostic, and only the count on stdout. Also check the function’s exit status before using the data.

Tests:
- Captured output contains only the number.
- Failure does not produce a misleading valid count.

Extension: Document whether leading whitespace from wc is normalized.

## Recall

What does return communicate in a shell function?

An exit status, conventionally zero for success and nonzero for failure, not an arbitrary data value.

Why declare local variables?

To limit accidental changes to the surrounding script’s state and make the function’s dependencies clearer.

Sources:
- GNU Bash: shell functions: https://www.gnu.org/software/bash/manual/html_node/Shell-Functions.html

# BASH — Test scripts with awkward fixtures

The most useful shell tests often expose problems that an ordinary filename and perfect input would never reveal.

A script test should check more than whether a command ran. Inspect its exit status, standard output, standard error, and file effects. A program that reports success but writes the wrong file has failed its contract. Build small fixtures where the correct answer is obvious and include one missing file, one empty file, and one path containing a space.

Static analysis catches another class of mistakes. ShellCheck can identify many suspicious expansions, quoting errors, and portability issues without running the script. Read its explanation rather than silencing warnings mechanically. A static warning is evidence to investigate, and a clean report is not a proof of correctness. Runtime behavior, data meaning, and intended side effects still require tests.

Keep test data inside a fresh temporary directory and avoid destructive cleanup logic in beginner exercises. A test harness can report its scratch location for inspection. Introduce one deliberate defect, confirm a test fails, repair it, and rerun. This demonstrates that the test is capable of detecting the behavior you care about instead of merely echoing a reassuring message.

## Example

```
if bash inspect-log.sh "missing-fixture.log" > actual.out 2> actual.err; then
  printf "FAIL: missing input was accepted\n"
else
  printf "PASS: missing input was rejected\n"
fi
```

Run in a scratch directory. The harness checks the failure path and saves both streams for inspection.

## Start: Known-count fixture

Test the line-count script with exactly three newline-terminated records.

Input: A scratch file containing a, b, c.

Expected: Status 0 and count 3.

Hints:
- Make the answer obvious.
- Capture status and output separately.

Worked reasoning: Run the script, save stdout, check the exit status, and compare the normalized count with 3.

Tests:
- Three records pass.
- Adding a fourth changes the expected count.

Extension: Add an empty-file test expecting zero.

## Build: Expected rejection

Test that a missing input produces a nonzero status and a helpful diagnostic.

Input: A path guaranteed absent in the new scratch directory.

Expected: No success result; nonzero status; nonempty stderr.

Hints:
- The test passes when the script rejects the input.
- Do not confuse the test status with the script status.

Worked reasoning: Wrap the script in an if and invert the test expectation. Inspect actual.err for the diagnostic.

Tests:
- No result file is mistaken for valid analysis.
- The error explains which condition failed.

Extension: Distinguish bad usage from missing-file status codes.

## Stretch: Quoting regression

Create a fixture path with spaces and confirm the script handles it exactly like an ordinary path.

Input: run one.log with two records.

Expected: Count 2 with status 0.

Hints:
- Quote the path in the harness too.
- A broken harness can mimic a broken script.

Worked reasoning: Compare ordinary and awkward names containing identical data. Their outputs and statuses should agree.

Tests:
- Exactly one path argument reaches the script.
- No extra files are created.

Extension: Add a leading-dash basename with an explicit ./ path.

## Debug: A test that cannot fail

A harness prints PASS after running the script but never checks its result. Explain why it provides no evidence.

Input: The script may return any status.

Expected: PASS must depend on an asserted outcome.

Hints:
- Find the condition controlling the message.
- Introduce a deliberate failing input.

Worked reasoning: Check the expected status and output before printing PASS. A deliberate defect should change the harness result.

Tests:
- The known defect is detected.
- The repaired implementation passes.

Extension: Give the harness its own nonzero exit status when any assertion fails.

## Recall

What should a shell test observe?

Status, stdout, stderr, and intended file effects, according to the script’s contract.

What does ShellCheck add?

Static detection and explanation of many suspicious shell patterns; it complements rather than replaces behavioral tests.

Sources:
- ShellCheck: diagnostic reference: https://www.shellcheck.net/wiki/

# BASH — Git as an experiment notebook

A future result is easier to explain when you can identify the exact code version that produced it.

Git records snapshots of selected files. The working tree is what you are editing, the staging area is what the next commit will contain, and a commit is a saved snapshot with a message and parent history. These are distinct states. Editing a file after staging it does not automatically update the staged content.

Use read-only inspection habitually: status shows what changed, diff shows unstaged changes, and diff --cached shows the staged changes. Review before committing so generated outputs, accidental large files, or private configuration do not enter the history unintentionally. A useful commit message describes a coherent change and its purpose, such as adding a missing-input check.

A local repository does not require publishing anything. Practice with a tiny scratch project before using a remote. Git history is not a complete backup plan, and ignoring a file does not remove it from earlier commits. For engineering work, record code revision, input identity, and environment together; a commit alone does not identify a measurement file stored somewhere else.

## Example

```
git status --short
git diff
git diff --cached
git log -5 --oneline
```

Run inside a repository. These commands inspect state and history without changing it.

## Start: Three states

Explain where an edit lives before staging, after staging, and after committing.

Input: A modified analysis script.

Expected: Working tree; staging area snapshot; commit history.

Hints:
- These are separate representations.
- A later edit can coexist with an earlier staged version.

Worked reasoning: Use git status and the two diff forms to inspect each boundary. Describe what the next commit would contain.

Tests:
- Unstaged changes appear in git diff.
- Staged changes appear in git diff --cached.

Extension: Stage, edit again, and explain both diffs.

## Build: A focused commit

In a practice repository, add one clear input-validation change and commit only the intended file.

Input: A small script and unrelated notes edit.

Expected: The commit contains the script change, not unrelated notes.

Hints:
- Name the file when staging.
- Review the staged diff.

Worked reasoning: Use git add with the specific file, inspect git diff --cached, then commit a message explaining the validation behavior.

Tests:
- Unrelated notes remain outside the commit.
- The commit diff matches the intended change.

Extension: Include the relevant test in the same coherent commit.

## Stretch: Run provenance

Design a small metadata record linking a result to code and input identity.

Input: A code revision, input filename/checksum, tool versions.

Expected: A future reader can identify the producing code and data.

Hints:
- A commit does not identify untracked data.
- Record the environment separately.

Worked reasoning: Store the commit identifier, whether local edits existed, input checksum, run arguments, and relevant versions with the result.

Tests:
- Two changed inputs have distinguishable records.
- Uncommitted code is not represented as a clean revision.

Extension: Add a short interpretation of the result.

## Debug: Changed after staging

A file was staged, then corrected, then committed without staging again. Why is the correction absent from the commit?

Input: The staging area retained an earlier snapshot.

Expected: Stage the intended corrected content after inspection.

Hints:
- Git commits the index.
- Working-tree edits do not automatically alter it.

Worked reasoning: Inspect both diffs, stage the corrected file, and review the staged diff again before committing.

Tests:
- The final staged diff includes the correction.
- No unrelated edits are included.

Extension: Explain this behavior with a three-column diagram.

## Recall

What does git diff --cached show?

The staged changes that would enter the next commit relative to the current commit.

Is a commit enough to reproduce a scientific result?

No. Inputs, environment, run arguments, and any uncommitted changes also matter.

Sources:
- Git: tutorial: https://git-scm.com/docs/gittutorial

# BASH — Environment and reproducible configuration

The same script can behave differently when it finds another interpreter, locale, or dependency version.

A process inherits an environment containing named string values. Some variables affect command lookup, locale, or library behavior. A script should document the settings it relies on rather than assuming every terminal starts identically. Use command -v to inspect which executable will run and the tool’s documented version option to record its identity.

Keep run configuration separate from secrets. A sample configuration can show expected names and harmless defaults without containing credentials. Do not print the whole environment into a public report, because it may include private values. For a learning pipeline, record only a small allowlist of relevant non-sensitive settings such as tool versions and explicitly chosen locale behavior.

Reproducibility also includes platform assumptions. GNU and BSD tools may offer different flags, Bash versions may differ, and PowerShell is not Bash. State the environment you tested and prefer simple interfaces where practical. If a task requires sophisticated environment management, learn it when the project earns that complexity rather than collecting tools without a use case.

## Example

```
command -v bash
command -v python3
bash --version
LC_ALL=C sort durations.txt
```

The locale assignment applies to this sort invocation. It is useful when a workflow requires predictable byte-oriented ordering, but must match the data’s intended interpretation.

## Start: Executable identity

Find which python3 executable the shell will invoke.

Input: A Bash environment with or without python3.

Expected: A resolved path or a documented missing-command outcome.

Hints:
- Use command -v.
- Do not infer from an application icon.

Worked reasoning: Record command -v python3 and, if present, its version using the documented option. This identifies the executable in this environment.

Tests:
- A missing command is handled.
- The recorded path matches the intended environment.

Extension: Compare an interactive shell and a project launcher.

## Build: Local configuration

Define a harmless run label and output folder as explicit script inputs rather than hidden global assumptions.

Input: run label trialA; output folder results/trialA.

Expected: The selected values are visible in the run summary.

Hints:
- Use descriptive names.
- Keep required inputs explicit.

Worked reasoning: Validate the configuration at startup and print only non-sensitive values useful for reproducing the run.

Tests:
- A missing required value fails clearly.
- Space-containing output paths remain quoted.

Extension: Provide an example config containing no private values.

## Stretch: Portability note

Write a compatibility section for a script using Bash arrays and GNU find -print0.

Input: The script is intended for a tested Linux Bash environment.

Expected: The note names tested tools and avoids claiming POSIX-sh portability.

Hints:
- Language and tool interfaces are separate dependencies.
- List flags that need verification elsewhere.

Worked reasoning: Document the Bash version family, GNU utility assumptions, and a small smoke-test command. Test another platform before claiming support.

Tests:
- Running under sh is not recommended accidentally.
- A missing dependency is detected early.

Extension: Replace one platform-specific operation with a verified portable alternative.

## Debug: The wrong interpreter

An interactive command uses the desired Python environment, but a scheduled or fresh-shell run finds a different interpreter. Diagnose the likely boundary.

Input: Different command lookup environments.

Expected: Make interpreter selection explicit and verify it at startup.

Hints:
- Inspect command -v in both contexts.
- Do not assume shell startup files ran.

Worked reasoning: Document and invoke the intended environment through its supported mechanism. Record version identity with each run and avoid hard-coded private machine paths in shared examples.

Tests:
- The two contexts identify the same intended interpreter.
- A missing environment fails clearly.

Extension: Add a startup dependency check.

## Recall

Why avoid printing the entire environment?

It can contain private or irrelevant values; an allowlist records useful provenance without unnecessary disclosure.

Why is command -v useful?

It shows how the current shell resolves a command, helping identify environment-dependent tool selection.

Sources:
- GNU Bash: environment: https://www.gnu.org/software/bash/manual/html_node/Environment.html

# BASH — Processes, waiting, and truthful completion

Simulation orchestration can fail when a report begins while the solver is still running.

A foreground command normally completes before the shell continues to the next command. Appending & starts work asynchronously, allowing the shell to continue sooner. This can be useful, but it introduces a dependency problem: the output file may not be complete when another step tries to read it.

Capture the process identifier of a background job you started and use wait to observe its completion and status. Do not infer completion from a file merely existing, because a process may create the file before finishing or fail after writing part of it. For a first workflow, sequential execution is often easier to verify than parallel execution.

Interactive job control, process identifiers, and long-lived services are related but distinct topics. This lesson uses a harmless short process that you own. Do not experiment by stopping unrelated system processes. For later simulations, define cancellation, timeout, logging, and partial-output policies explicitly. Faster orchestration is only useful when the dependencies and outcomes remain understandable.

## Example

```
sleep 1 &
job_pid=$!
if wait "$job_pid"; then
  printf "Owned job completed successfully\n"
else
  printf "Owned job failed\n" >&2
fi
```

This starts and waits for a harmless short process. The completion message follows wait, not merely process launch.

## Start: Foreground order

Predict output order for a print, a short foreground sleep, and another print.

Input: before; sleep 1; after.

Expected: before appears first, after appears only after the sleep completes.

Hints:
- Foreground commands are sequential here.
- Do not equate delay with a hang.

Worked reasoning: The shell waits for the foreground process before executing the next command. Observe once using harmless prints.

Tests:
- The second print is delayed.
- No files change.

Extension: Contrast with background execution.

## Build: Wait for owned work

Start sleep 1 in the background, capture its PID, and print completion after wait succeeds.

Input: One owned background process.

Expected: Completion is reported after the process exits.

Hints:
- $! identifies the most recent asynchronous job.
- wait returns its status.

Worked reasoning: Use job_pid=$! immediately after launching, then if wait "$job_pid"; then ... fi.

Tests:
- The stored PID is not overwritten by another launch.
- Completion follows wait.

Extension: Add a second owned job and wait for both separately.

## Stretch: Dependency plan

Design a three-step pipeline: generate samples, analyze samples, render report. Identify which steps may overlap.

Input: Analysis depends on complete samples; report depends on analysis.

Expected: The core chain is sequential unless a dependency is removed deliberately.

Hints:
- Draw producer-consumer arrows.
- File existence is not sufficient readiness.

Worked reasoning: Require successful producer completion before each consumer. Independent metadata collection might overlap, but must not change the data dependency.

Tests:
- A failed generator prevents analysis.
- A failed analysis prevents a success report.

Extension: Add an explicit partial-output policy.

## Debug: Premature success

A script launches analyzer & and immediately prints "analysis complete". Explain the false claim.

Input: The analyzer is still running.

Expected: The message proves launch only, not completion.

Hints:
- Asynchronous execution returns control early.
- Use wait and inspect status.

Worked reasoning: Capture the job PID, wait for it, and print success only after a successful exit. Keep failures visible and do not consume incomplete output.

Tests:
- A failing analyzer produces no success message.
- A slow analyzer delays the completion message.

Extension: Test with a stub that exits nonzero.

## Recall

What does & change?

It starts a command asynchronously so the shell can continue before the command finishes.

Why is file existence a weak completion signal?

The file may be incomplete, stale, or left by a failed producer.

Sources:
- GNU Bash: job control basics: https://www.gnu.org/s/bash/manual/html_node/Job-Control-Basics.html

# BASH — Build a rerunnable experiment pipeline

The lasting value of shell scripting is making a useful experiment repeatable after weeks or years away.

A rerunnable pipeline has a defined input set, known tools, an explicit order, and a clear output contract. Begin with one file and one analysis command. Add validation and a small test fixture before scaling to a folder. The top-level script should read like a short explanation of the workflow rather than a puzzle of nested one-liners.

Choose what happens on rerun. A unique per-run output directory avoids confusing old results with new ones. A deliberate overwrite policy can also work for generated artifacts, but it must never target the raw observations. Record arguments, code revision, relevant versions, and input identity. A checksum helps distinguish changed bytes; it is not a statement about scientific quality.

At the end, verify the expected outputs rather than merely reaching the final line. Did every selected input get an outcome? Is the result parseable, nonempty when required, and associated with the current run? Write a short limitations note. Your first pipeline might summarize invented rover logs; later the same structure can coordinate MATLAB models, Python analysis, and simulator outputs without hiding their assumptions.

## Example

```
#!/usr/bin/env bash
if [[ $# -ne 1 || ! -r "$1" ]]; then
  printf "Usage: summarize READABLE_LOG\n" >&2
  exit 2
fi
printf "Input: %s\n" "$1"
if wc -l < "$1"; then
  printf "Line-count step completed\n" >&2
else
  printf "Line-count step failed\n" >&2
  exit 1
fi
```

This is a deliberately small starting pipeline. Expand it only after defining and testing each additional boundary.

## Start: Workflow contract

Write the input, output, success, and failure contract for a log-summary script.

Input: One newline-terminated text log.

Expected: A reader knows what counts are produced and what invalid input does.

Hints:
- Specify the format, not just the filename.
- Name the expected error outcomes.

Worked reasoning: Document required file readability, severity-line format, count outputs, status codes, and preservation of the source log.

Tests:
- An empty input has a defined meaning.
- A missing input has a different outcome.

Extension: Add an example fixture and expected summary.

## Build: Fresh outputs

Design a per-run output directory policy that prevents old results from masquerading as current results.

Input: Two executions with different input logs.

Expected: Each run has a distinct identifiable result set.

Hints:
- Use a run identifier.
- Validate the target before creating results.

Worked reasoning: Require a new run directory or reject an existing one under the chosen policy. Store a manifest alongside generated artifacts.

Tests:
- The second run cannot silently read the first summary.
- Raw inputs remain outside the generated output folder.

Extension: Add a human-readable summary of the run.

## Stretch: Cross-language orchestration

Plan Bash validation followed by Python analysis and MATLAB comparison, using CSV as an explicit interface.

Input: Shared columns time_s and temperature_c.

Expected: Each stage has a documented format, status check, and evidence artifact.

Hints:
- Bash coordinates; numerical code analyzes.
- Check the producer before invoking its consumer.

Worked reasoning: Validate filenames and tool availability, run the producer, inspect its status, validate the output schema, then run the comparison. Record versions and assumptions.

Tests:
- Failed analysis prevents comparison.
- A schema mismatch is reported explicitly.

Extension: Add a small end-to-end fixture with a known answer.

## Debug: Stale success artifact

A script reads summary.csv after analysis fails; the file was left by yesterday’s run. Why is existence checking insufficient?

Input: An old valid-looking summary remains.

Expected: Associate outputs with the current successful run.

Hints:
- Status and provenance both matter.
- Use fresh output locations.

Worked reasoning: Stop on analysis failure and use a new run directory or a verified current-run marker. A stale file should never satisfy the new run’s success contract.

Tests:
- A failing run cannot publish yesterday’s result.
- The manifest identifies the current inputs.

Extension: Test this case deliberately in a scratch directory.

## Recall

What makes a pipeline rerunnable?

Explicit inputs and environment, controlled output policy, checked dependencies, and enough provenance to reproduce the result.

When should a shell pipeline call another language?

When structured parsing, numerical analysis, complex data models, or detailed testing is clearer in a dedicated programming language.

Sources:
- GNU Bash: manual: https://www.gnu.org/s/bash/manual/bash.html
