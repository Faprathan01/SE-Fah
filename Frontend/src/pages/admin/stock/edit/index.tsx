import React, { useEffect, useState } from "react";
import { Layout, Form, Input, Button, InputNumber, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../../components/sidebar";
import { GetStockById, UpdateStock } from "../../../../services/https/stock"; // Import your API functions
import { StockInterface } from "../../../../interfaces/IStock";

const { Content } = Layout;
const { Option } = Select;

const EditStockPage: React.FC = () => {
  const [form] = Form.useForm(); // Ant Design Form instance
  const { id } = useParams<{ id: string }>(); // Get stock ID from URL params
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const navigate = useNavigate(); // For navigation

  // Fetch old stock data when component mounts
  useEffect(() => {
    const fetchStockData = async () => {
      if (!id) return;
      setLoading(true);
      const stock = await GetStockById(Number(id)); // Fetch stock by ID
      setLoading(false);

      if (stock) {
        form.setFieldsValue({
          productName: stock.ProductName,
          quantity: stock.Quantity,
          price: stock.Price,
          type: stock.ProductType,
        });
      } else {
        message.error("Failed to fetch stock data!");
      }
    };

    fetchStockData();
  }, [id, form]);

  // Handle form submission
  const onFinish = async (values: any) => {
    if (!id) return;
    setLoading(true);
    const updatedStock: StockInterface = {
      ID: Number(id),
      ProductName: values.productName,
      Quantity: values.quantity,
      Price: values.price,
      ProductType: values.type,
    };

    const result = await UpdateStock(Number(id), updatedStock);
    setLoading(false);

    if (result) {
      message.success("Stock updated successfully!");
      navigate("/stocks"); // Navigate to the StockPage after successful update
    } else {
      message.error("Failed to update stock!");
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
              Edit Product
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
            onFinish={onFinish}
            style={{
              backgroundColor: "#FFFFFF",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {/* Product Name */}
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[{ required: true, message: "Please enter the product name!" }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            {/* Quantity */}
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

            {/* Price */}
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

            {/* Type */}
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

            {/* Update Stock Button */}
            <Form.Item style={{ textAlign: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  backgroundColor: "#219EBC",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px 20px",
                }}
                icon={<PlusOutlined />}
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

export default EditStockPage;
