import React, { useState } from "react";
import { Button, Radio, Select, Table, Space } from "antd";
import searchImg from "../../assets/searchImg.svg";
import "./style.css";

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [typefilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Tag", dataIndex: "tag", key: "tag" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => onDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Filter
  const filteredTable = transactions.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) &&
      (typefilter === "" || item.type === typefilter)
  );

  // Sort
  const sortedTransactions = [...filteredTable];

  if (sortKey === "amount") {
    sortedTransactions.sort((a, b) => a.amount - b.amount);
  } else if (sortKey === "date") {
    sortedTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }

  return (
    <>
      {/* Filter bar */}
      <div className="filter-bar">
        <div className="input-flex">
          <img src={searchImg} width="16" alt="search" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search By Name"
            className="custom-input"
          />
        </div>

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typefilter}
          placeholder="Filter"
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      {/* Header Row */}
      <div className="table-div">
        <div>
          <h1><b>My transactions</b></h1>
        </div>

        <div>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort By Date</Radio.Button>
            <Radio.Button value="amount">Sort By Amount</Radio.Button>
          </Radio.Group>
        </div>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        dataSource={sortedTransactions}
        columns={columns}
      />
    </>
  );
};

export default TransactionTable;
