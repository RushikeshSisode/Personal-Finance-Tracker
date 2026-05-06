import React from "react";
import "./style.css";
import { Row, Col, Card } from "antd";
import CustomButton from "../CustomButton";

const Cards = ({
  showExpenseModal,
  showIncomeModal,
  income,
  balance,
  expense,
  resetBalance,
}) => {
  return (
    <Row gutter={[24, 24]} justify="center" className="my-row">

      

      {/* Income */}
      <Col xs={24} sm={12} md={8}>
        <Card title="Total Income" className="my-card" bordered>
          <p>₹{income}</p>
          <CustomButton
            text="Add Income"
            blue={true}
            onClick={showIncomeModal}
          />
        </Card>
      </Col>

      {/* Expense */}
      <Col xs={24} sm={12} md={8}>
        <Card title="Total Expenses" className="my-card" bordered>
          <p>₹{expense}</p>
          <CustomButton
            text="Add Expenses"
            blue={true}
            onClick={showExpenseModal}
          />
        </Card>
      </Col>

      {/* Current Balance */}
      <Col xs={24} sm={12} md={8}>
        <Card title="Current Balance" className="my-card" bordered>
          <p>₹{balance}</p>
          <CustomButton
            text="Reset Balance"
            blue={true}
            onClick={resetBalance}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Cards;
