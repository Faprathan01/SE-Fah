import React, { useState } from 'react';
import { Layout, Button, Form, Input, Select, DatePicker, Card, Modal, notification } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../../../components/navbar';
import RideCard from '../../../../components/RideCard';
import { CreateBooking } from '../../../../services/https/ิbooking';
import { BookingInterface } from '../../../../interfaces/IBooking';

const { Option } = Select;

const generateTimeOptions = () => {
  const timeOptions = [];
  let start = 8 * 60;
  const end = 21 * 60;

  while (start + 45 <= end) {
    const startHour = Math.floor(start / 60);
    const startMinute = start % 60;
    const endHour = Math.floor((start + 45) / 60);
    const endMinute = (start + 45) % 60;

    const timeRange = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')} - ${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')} น.`;
    timeOptions.push(timeRange);
    start += 60;
  }

  return timeOptions;
};

const Booking: React.FC = () => {
  const { state } = useLocation();
  const ride = state?.ride;
  const [bookingDetails, setBookingDetails] = useState<BookingInterface | null>(null);
  const [modalVisible, setModalVisible] = useState(false);  // State to control modal visibility
  const navigate = useNavigate();  // Hook to navigate to another page

  if (!ride) {
    return <div>ไม่พบข้อมูลเครื่องเล่น</div>;
  }

  const onFinish = async (values: any) => {
    const bookingData: BookingInterface = {
      TicketID: Number(values.Ticket),
      Date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
      Time: values.time,
      RideID: ride.ID,
    };
    console.log("Booking Data:", bookingData);

    try {
      const result = await CreateBooking(bookingData);
      if (result) {
        setBookingDetails(bookingData); // Save booking details to state
        setModalVisible(true); // Show modal with booking details
        notification.success({
          message: 'การจองสำเร็จ',
          description: 'การจองของคุณถูกบันทึกเรียบร้อยแล้ว',
          placement: 'topRight',
        });
      } else {
        notification.error({
          message: 'เกิดข้อผิดพลาด',
          description: 'ไม่สามารถบันทึกการจองได้ กรุณาลองใหม่อีกครั้ง',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      notification.error({
        message: 'ข้อผิดพลาดในการเชื่อมต่อ',
        description: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่',
        placement: 'topRight',
      });
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);  // Close the modal and navigate to the Ride page
    navigate('/homerides');  // Redirect to the Ride page after closing the modal
  };

  return (
    <Layout
      className="layout"
      style={{
        background: 'linear-gradient(to bottom, #57DACC , #FFDAB9)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: '64px',
      }}
    >
      <Navbar />

      <div style={{ width: '50%', padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <RideCard ride={ride} />
      </div>

      <div
        style={{
          width: '45%',
          padding: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Form name="bookingForm" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Ticket"
              name="Ticket"
              rules={[{ required: true, message: 'กรุณากรอก Ticket' }, { pattern: /^\d+$/, message: 'กรุณากรอกตัวเลขเท่านั้น' }]}
            >
              <Input placeholder="กรอก Ticket ของคุณ" />
            </Form.Item>

            <Form.Item
              label="เลือกวันที่"
              name="date"
              rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="เลือกช่วงเวลา"
              name="time"
              rules={[{ required: true, message: 'กรุณาเลือกเวลา' }]}
            >
              <Select placeholder="เลือกช่วงเวลา" style={{ width: '100%' }}>
                {generateTimeOptions().map((time, index) => (
                  <Option key={index} value={time}>
                    {time}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: '100%',
                  fontSize: '16px',
                  backgroundColor: '#FF7F50',
                  borderColor: '#FF7F50',
                }}
              >
                ยืนยันการจอง
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* Modal to show booking details */}
      <Modal
        title="รายละเอียดการจอง"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}  // ปรับขนาดของ Modal ให้เหมาะสม
        style={{ top: 100 }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            padding: '5px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#FF7F50' }}>การจองของคุณ</h2>
            <h3 style={{ fontWeight: 'bold' }}>เครื่องเล่น: {ride.RideName}</h3>
            <p style={{fontSize: '16px'}}><strong>TicketID:</strong> {bookingDetails?.TicketID}</p>
            <p style={{ fontSize: '16px' }}><strong>วันที่:</strong> {bookingDetails?.Date}</p>
            <p style={{ fontSize: '16px' }}><strong>เวลา:</strong> {bookingDetails?.Time}</p>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: '#FF7F50', fontWeight: 'bold' }}>
                 กรุณาแคปหน้าจอเพื่อใช้แสดงต่อหน้าพนักงานตามเครื่องเล่น
            </p>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button
              type="primary"
              onClick={handleCloseModal}
              style={{
                backgroundColor: '#FF7F50',
                borderColor: '#FF7F50',
                fontSize: '16px',
                padding: '10px 20px',
              }}
            >
              ปิด
            </Button>
          </div>
        </Card>
      </Modal>
    </Layout>
  );
};

export default Booking;
