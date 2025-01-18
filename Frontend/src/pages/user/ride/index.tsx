import React, { useEffect, useState } from 'react';
import { Layout, Spin, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar';
import { GetRides } from '../../../services/https/ride';
import RideCard from '../../../components/RideCard';

interface Ride {
  RideID: number;
  RideName: string;
  Description: string;
  Image?: string;
}

const Ride: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const data = await GetRides();
        setRides(data || []);
      } catch (error) {
        console.error('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  const handleBooking = (ride: Ride) => {
    navigate('/booking', { state: { ride } });
  };

  return (
    <Layout
      className="layout"
      style={{
        background: 'linear-gradient(to bottom, #8ECAE6, #FFDAB9)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      {loading ? (
        <Spin
          size="large"
          style={{
            marginTop: '20px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      ) : (
        <Row
          gutter={[16, 24]}
          style={{
            width: '90%',
            marginTop: '100px', // เพิ่มระยะห่างจาก Navbar
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {rides.map((ride) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={ride.RideID}>
              <RideCard ride={ride} />
              <Button
                type="primary"
                style={{
                  marginTop: '10px',
                  width: '100%',
                  backgroundColor: '#FF7F50',
                  borderColor: '#FF7F50',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                }}
                onClick={() => handleBooking(ride)}
              >
                จอง
              </Button>
            </Col>
          ))}
        </Row>
      )}
    </Layout>
  );
};

export default Ride;
