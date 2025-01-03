import React from "react";
import { Layout, Button, Table, Tooltip, Divider } from "antd";
import Sidebar from "../../../components/sidebar";
import { Content } from "antd/es/layout/layout";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const StockPage: React.FC = () => {
  // Sample data
  const stockData = [
    {
      key: "1",
      productID: "P001",
      productName: "Teddy Bear",
      quantity: 50,
      price: 250,
      type: "Souvenir",
    },
    {
      key: "2",
      productID: "P002",
      productName: "Soda Can",
      quantity: 120,
      price: 20,
      type: "Drink",
    },
    {
      key: "3",
      productID: "P003",
      productName: "Popcorn",
      quantity: 80,
      price: 50,
      type: "Food",
    },
  ];

  // Columns for the table
  const columns = [
    {
      title: "Product ID",
      dataIndex: "productID",
      key: "productID",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price (THB)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString(), // Format price
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      render: (_text: string, record: any) => (
        <div>
          <Tooltip title="Edit Stock">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => console.log(`Edit ${record.productID}`)}
              style={{
                color: "#FFB703",
                marginRight: 12,
                padding: "8px 12px",
                fontWeight: "bold",
                borderRadius: "6px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = "#FFB703";
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = "transparent";
              }}
            />
          </Tooltip>
          <Tooltip title="Delete Stock">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => console.log(`Delete ${record.productID}`)}
              style={{
                color: "#D32F2F",
                padding: "8px 12px",
                fontWeight: "bold",
                borderRadius: "6px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = "#D32F2F";
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = "transparent";
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#F1FAEE" }}>
      <Sidebar />
      <Layout>
        <Content
          style={{
            margin: "16px",
            backgroundColor: "#8ECAE6",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                color: "#005F73",
                fontSize: "26px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              📦 Stock Management
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                backgroundColor: "#FFB703",
                border: "none",
                color: "white",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: "bold",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = "#FFB703"}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = "#FFB703"}
              onClick={() => console.log("Add stock button clicked")}
            >
              Add Stock
            </Button>
          </div>

          <Divider style={{ borderColor: "#FFFFFF", margin: "20px 0" }} />

          {/* Stock Table */}
          <Table
            dataSource={stockData}
            columns={columns}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
            pagination={{ pageSize: 5 }}
            rowClassName="table-row"
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StockPage;
