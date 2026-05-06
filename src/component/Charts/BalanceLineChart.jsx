import React from "react";
import { Line } from "@ant-design/charts";

const BalanceLineChart = ({ transactions }) => {
  let balance = 0;

  // Sort transactions by date
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Generate balance history points
  const data = sorted.map((t) => {
    if (t.type === "income") balance += t.amount;
    else balance -= t.amount;

    return {
      date: t.date,
      balance: balance,
    };
  });

  const config = {
    data,
    xField: "date",
    yField: "balance",
    smooth: true,
    height: 300,
    color: "#1677ff",
    point: {
      size: 5,
      shape: "circle",
    },
    tooltip: {
      showMarkers: true,
    },
  };

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ marginBottom: "20px", color: "#1677ff", fontWeight: "600" }}>
        Balance Analysis
      </h2>

      <Line {...config} />
    </div>
  );
};

export default BalanceLineChart;
