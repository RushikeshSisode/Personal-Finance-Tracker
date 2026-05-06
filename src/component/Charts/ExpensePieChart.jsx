import React from "react";
import { Pie } from "@ant-design/charts";

const ExpensePieChart = ({ transactions }) => {
  const expenseOnly = transactions.filter(t => t.type === "expense");

  if (expenseOnly.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>No expenses found</h3>
      </div>
    );
  }

  const tagTotals = {};

  expenseOnly.forEach(t => {
    if (!tagTotals[t.tag]) tagTotals[t.tag] = 0;
    tagTotals[t.tag] += Number(t.amount);
  });

  const data = Object.keys(tagTotals).map(tag => ({
    tag,
    value: tagTotals[tag],
  }));

  const config = {
    data,
    angleField: "value",
    colorField: "tag",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "outer",
      content: "{percentage}",  // FIXED HERE
    },
    interactions: [{ type: "element-active" }],
    height: 300,
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        minHeight: "350px"
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#1677ff", fontWeight: "600" }}>
        Expense Breakdown by Category
      </h2>

      <Pie {...config} />
    </div>
  );
};

export default ExpensePieChart;
