import React from "react";
import { Layout, Form, Input, Button, InputNumber, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../../../../components/sidebar";
import { CreateStock } from "../../../../services/https/stock";

const { Content } = Layout;
const { Option } = Select;

const CreateStockPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        
        ProductName: values.productName,
        Quantity: values.quantity,
        Price: values.price,
        ProductType: values.type,
      };

      const response = await CreateStock(data);
      if (response) {
        message.success("Stock created successfully!");
        form.resetFields(); // Reset form fields
        navigate("/stocks"); // Redirect to stocks page
      } else {
        message.error("Failed to create stock.");
      }
    } catch (error) {
      message.error("An error occurred while creating stock.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout>
        <Content
          style={{
            margin: "16px",
            backgroundColor: "#8ECAE6",
            color: "#2671BC",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <h2 style={{ color: "#2671BC", fontSize: "36px", fontWeight: "bold" }}>
              Create Product
            </h2>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "5px solid #2671BC",
              margin: "5px 0 20px 0",
            }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{
              backgroundColor: "#FFFFFF",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[{ required: true, message: "Please enter the product name!" }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please enter the quantity!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                max={10000}
                placeholder="Enter quantity"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter the price!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={0.01}
                placeholder="Enter price"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please select the stock type!" }]}
            >
              <Select placeholder="Select stock type">
                <Option value="Souvenir">Souvenir</Option>
                <Option value="Food">Food</Option>
                <Option value="Beverage">Beverage</Option>
              </Select>
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#219EBC",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px 20px",
                }}
                icon={<PlusOutlined />}
                htmlType="submit"
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateStockPage;
