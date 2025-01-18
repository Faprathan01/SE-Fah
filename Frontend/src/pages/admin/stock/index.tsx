import React, { useState, useEffect } from "react";
import { Layout, Button, Table, Tooltip, Divider, Modal, message } from "antd";
import Sidebar from "../../../components/sidebar";
import { Content } from "antd/es/layout/layout";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GetStocks } from "../../../services/https/stock"; // นำเข้า function ที่ดึงข้อมูลจาก API
import { DeleteStockByID } from "../../../services/https/stock"; // นำเข้า function สำหรับลบสินค้า
import { StockInterface } from "../../../interfaces/IStock";

const StockPage: React.FC = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<StockInterface[]>([]); // ระบุประเภทเป็น StockInterface[]


  // ดึงข้อมูลสินค้าจาก API
  useEffect(() => {
    const fetchStocks = async () => {
      const data = await GetStocks();
      if (data) {
        setStocks(data); // เก็บข้อมูลลงใน state
      }
    };

    fetchStocks();
  }, []); // ทำงานแค่ครั้งเดียวตอนที่ component โหลดเสร็จ

  // Handle editing a stock item
  const editStock = (stock: any) => {
    navigate(`/editstock/${stock.ID}`, { state: { stock } });
  };

  // Handle deleting a stock item
  const deleteStock = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this stock?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          const success = await DeleteStockByID(id); // เรียกฟังก์ชันลบสินค้าจาก API
          if (success) {
            message.success("Stock deleted successfully!"); // ถ้าลบสำเร็จ
            setStocks(stocks.filter((stock) => stock.ID !== id)); // ลบสินค้าออกจาก state
          } else {
            message.error("Failed to delete stock. Please try again."); // ถ้าลบไม่สำเร็จ
          }
        } catch (error) {
          message.error("An error occurred while deleting the stock."); // หากเกิดข้อผิดพลาด
        }
      },
    });
  };

  // Modify the columns definition
  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      render: (_: any, record: any, _index: number) => record.ID, // ใช้ `record.ID` เพื่อแสดงลำดับตาม ID
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "ProductName",
      key: "ProductName",
    },
    {
      title: "จำนวน",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "ราคา",
      dataIndex: "Price",
      key: "Price",
    },
    {
      title: "ประเภทสินค้า",
      dataIndex: "ProductType",
      key: "ProductType",
    },
    {
      render: (_text: string, record: any) => (
        <div>
          <Tooltip title="Edit Stock">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => editStock(record)} // Call editStock function
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
              onClick={() => deleteStock(record.ID)} // Call deleteStock function
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
              onClick={() => navigate("/createstock")}
            >
              Add Stock
            </Button>
          </div>

          <Divider style={{ borderColor: "#FFFFFF", margin: "20px 0" }} />

          {/* Stock Table */}
          <Table
            dataSource={stocks} // ใช้ข้อมูลที่ดึงมาแสดงในตาราง
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
