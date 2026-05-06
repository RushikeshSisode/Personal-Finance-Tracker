import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import React from "react";
import "./style.css";

const AddIncome = ({ isIncomeModalVisible, cancelIncomeModal, onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Income"
      open={isIncomeModalVisible}
      onCancel={cancelIncomeModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "income");
          form.resetFields();
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the income name!" }]}
        >
          <Input className="custom-input" />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the income date!" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            className="custom-input"
          />
        </Form.Item>

        <Form.Item
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select style={{ width: "100%" }} className="custom-input">
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            <Select.Option value="business">Business</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddIncome;
