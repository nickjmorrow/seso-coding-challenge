"use strict";

// Print all entries, across all of the sources, in chronological order.

/**
 * Notes:
 *  - General pattern is the following:
 *    - Keep a list of objects that contain keys for a `logSource`
 *      and its last-popped value (`currentValue`).
 *    - Filter to entries that have a `currentValue` that is not `false`,
 *      and instead has a log worth comparing to other logs.
 *    - Choose the logSource with the log with the mininimum date.
 *    - Print out that logSource's `currentValue`.
 *    - `pop` that logSource to refresh it, then re-check again
 *      which logSource has the log with the minimum date.
 *  - Improvements:
 *    - I am familiar with https://leetcode.com/problems/merge-k-sorted-lists/,
 *      and there are some solutions with better time/space complexity,
 *      but if I were in an interview, I don't think I would be able to implement
 *      anything more complex (e.g. divide and conquer) than the solution below.
 *    - I think the easiest improvement we could make is using a priority queue / heap
 *      to keep track of the minimum `currentValue`. That brings us down from O(kn), where
 *      k is the number of logSources, to O(n*log(k)).
 *    - I would advocate for using something like https://www.npmjs.com/package/priorityqueuejs
 *      or an otherwise existing solution out there.
 */

module.exports = (logSources, printer) => {
  mergeKLists(logSources, printer);
  return console.log("Sync sort complete.");
};

const mergeKLists = (logSources, printer) => {
  const logSourceRecords = logSources.map((ls) => ({
    logSource: ls,
    currentValue: ls.pop(),
  }));

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
      logSourceRecordWithMinimumCurrentValue.logSource.pop();
  }
};
