import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import "./style.css";

const { Option } = Select;

const EditTransaction = ({ isEditModalVisible, cancelEditModal, transaction, onUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (transaction) {
      form.setFieldsValue({
        name: transaction.name,
        amount: transaction.amount,
        tag: transaction.tag,
        date: dayjs(transaction.date, "YYYY-MM-DD"),
      });
    }
  }, [transaction, form]);

  if (!transaction) return null;

  const isIncome = transaction.type === "income";

  const handleFinish = (values) => {
    const updatedTransaction = {
      ...transaction,
      name: values.name,
      amount: parseFloat(values.amount),
      tag: values.tag,
      date: values.date.format("YYYY-MM-DD"),
    };

    onUpdate(updatedTransaction);
    form.resetFields();
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title={isIncome ? "Edit Income" : "Edit Expense"}
      open={isEditModalVisible}
      onCancel={cancelEditModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
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
          rules={[{ required: true, message: "Please select the date!" }]}
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
            {isIncome ? (
              <>
                <Option value="salary">Salary</Option>
                <Option value="freelance">Freelance</Option>
                <Option value="investment">Investment</Option>
                <Option value="business">Business</Option>
              </>
            ) : (
              <>
                <Option value="medical">Medical Expense</Option>
                <Option value="food">Food Expense</Option>
                <Option value="house">House Expense</Option>
                <Option value="business">Business Expense</Option>
              </>
            )}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTransaction;
