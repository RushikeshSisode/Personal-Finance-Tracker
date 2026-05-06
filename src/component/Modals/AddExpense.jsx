import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import React from "react";
import "./style.css";

const AddExpense = ({ isExpensModalVisible, cancelExpenseModal, onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Expense"
      open={isExpensModalVisible}
      onCancel={cancelExpenseModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "expense");
          form.resetFields();
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Enter expense name!" }]}
        >
          <Input className="custom-input" />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Enter expense amount!" }]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Select date!" }]}
        >
          <DatePicker
            className="custom-input"
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Select tag!" }]}
        >
          <Select style={{ width: "100%" }} className="custom-input">
            <Select.Option value="medical">Medical Expense</Select.Option>
            <Select.Option value="food">Food Expense</Select.Option>
            <Select.Option value="house">House Expense</Select.Option>
            <Select.Option value="business">Business Expense</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddExpense;
