import React from "react";

export const ChecksList = ({ checks }) => {
  if (!checks.length) {
    return <p className="center">You haven't done any check yet</p>;
  }

  const intervals = new Map([
    ["1m", "1 minute"],
    ["5m", "5 minutes"],
    ["15m", "15 minutes"],
    ["30m", "30 minutes"],
    ["1h", "1 hour"],
    ["4h", "4 hours"],
    ["12h", "12 hours"],
    ["1d", "1 day"],
    ["3d", "3 days"],
  ]);

  return (
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Pair</th>
          <th>Interval</th>
          <th>Price</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {checks.map((check, index) => {
          const date = new Date(check.date);
          let interval;
          return (
            <tr key={check._id}>
              <td>{index + 1}</td>
              <td>{check.pair}</td>
              <td>{intervals.get(check.interval)}</td>
              <td>{check.price}</td>
              <td>{date.toLocaleDateString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
