"use strict";

/**
 * Notes
 *  - I'm sure I'm missing something, because I don't think I made many improvements
 *    to handle the async modifier thrown in. I'm parallelizing the initial "popAsync on all logSources"
 *    logic, but there's not many time-saving measures after that. Part of me wants to
 *    do something similar by running `popAsync` multiple times on the same logSource and paralellizing
 *    waiting on those promises to return, but I know the README suggested these logSources could be giant /
 *    I probably don't want to try popping off more than I need at a time.
 *
 *    I think if I were to spend a lot of time on this problem, I might do something similar to divide-and-conquer,
 *    because that would lend itself towards "waiting on all sub-problems to finish" which *could* be parallelized.
 */

module.exports = (logSources, printer) => {
  return new Promise((resolve, _) => {
    mergeKListsAsync(logSources, printer).then(() =>
      resolve(console.log("Async sort complete."))
    );
  });
};

const mergeKListsAsync = async (logSources, printer) => {
  // We'll need to `popAsync` every logSource initially,
  // so here I'm parallelizing that action with `Promise.all`.
  const logSourceRecords = await Promise.all(
    logSources.map((ls) =>
      ls.popAsync().then((val) => ({ logSource: ls, currentValue: val }))
    )
  );

  while (
    logSourceRecords.filter((lsr) => lsr.currentValue !== false).length > 0
  ) {
    const populatedLogSourceRecords = logSourceRecords.filter(
      (lsr) => lsr.currentValue !== false
    );

    const logSourceRecordWithMinimumCurrentValue =
      populatedLogSourceRecords.reduce((agg, cur) => {
        if (cur.currentValue.date < agg.currentValue.date) {
          agg = cur;
        }
        return agg;
      });

    printer.print(logSourceRecordWithMinimumCurrentValue.currentValue);

    // Refresh it.
    logSourceRecordWithMinimumCurrentValue.currentValue =
      await logSourceRecordWithMinimumCurrentValue.logSource.popAsync();
  }
};
