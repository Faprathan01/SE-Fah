import React, { useState, useEffect } from "react";
import { Layout, Form, Input, Button, Row, Col, Spin, message, InputNumber } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Sidebar from "../../../../components/sidebar";
import { UpdateRide } from "../../../../services/https/ride";

const { Content } = Layout;

const EditRidePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const rideFromState = state?.ride;
    const [ride, setRide] = useState(rideFromState || null);
    const [form] = Form.useForm();
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRide = async () => {
            if (!id) {
                message.error("Ride ID is missing. Redirecting to the rides page.");
                navigate("/rides");
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/rides/${id}`);
                if (!response.ok) throw new Error("Failed to fetch ride details.");
                const data = await response.json();
                setRide(data);
                form.setFieldsValue({
                    RideName: data.RideName,
                    Description: data.Description,
                    Capacity: data.capacity,
                });
                setImage(data.Image || null);
            } catch (error) {
                console.error("Failed to fetch ride details:", error);
                message.error("Failed to load ride details.");
                navigate("/rides");
            } finally {
                setLoading(false);
            }
        };

        if (!rideFromState) {
            fetchRide();
        } else {
            form.setFieldsValue({
                RideName: rideFromState.RideName,
                Description: rideFromState.Description,
                Capacity: rideFromState.capacity,
            });
            setImage(rideFromState.Image || null);
            setLoading(false);
        }
    }, [id, rideFromState, form, navigate]);

    const onFinish = async (values: any) => {
        try {
            if (!image) {
                message.error("Please upload an image!");
                return;
            }

            const rideId = id ? parseInt(id) : ride?.RideID;
            if (!rideId) {
                message.error("Ride ID is missing. Unable to update the ride.");
                return;
            }

            const updatedRide = { RideID: rideId, ...values, Image: image };
            const success = await UpdateRide(rideId, updatedRide);

            if (success) {
                message.success("Ride updated successfully!");
                form.resetFields();
                navigate("/rides");
            } else {
                message.error("Failed to update ride. Please try again.");
            }
        } catch (error) {
            console.error("Update error:", error);
            message.error("An error occurred while updating the ride.");
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
        },
        multiple: false,
    });

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Spin size="large" tip="Loading ride details..." />
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar />
            <Layout>
                <Content style={{ margin: "16px", backgroundColor: "#8ECAE6", padding: "20px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                        <h2 style={{ color: "#2671BC", fontSize: "36px", fontWeight: "bold" }}>Edit Ride</h2>
                    </div>
                    <hr style={{ border: "none", borderTop: "5px solid #2671BC", margin: "5px 0 20px 0" }} />
                    <Form
                        form={form}
                        layout="vertical"
                        style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "8px", maxWidth: "800px", margin: "0 auto" }}
                        onFinish={onFinish}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={10}>
                                <Form.Item label="Ride Image">
                                    <div
                                        {...getRootProps()}
                                        style={{
                                            border: "2px dashed #2671BC",
                                            padding: "40px",
                                            textAlign: "center",
                                            borderRadius: "8px",
                                            backgroundColor: "#f0f8ff",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        <UploadOutlined style={{ fontSize: "20px", color: "#2671BC" }} />
                                        <p style={{ margin: "10px 0", color: "#2671BC" }}>
                                            Drag & drop an image here, or click to select a file
                                        </p>
                                    </div>
                                    {image && (
                                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                                            <img
                                                src={image}
                                                alt="Ride Preview"
                                                style={{
                                                    width: "150px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    marginTop: "10px",
                                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                                }}
                                            />
                                        </div>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={14}>
                                <Form.Item
                                    label="Ride Name"
                                    name="RideName"
                                    rules={[{ required: true, message: "Please input the ride name!" }]}
                                >
                                    <Input placeholder="Enter ride name" />
                                </Form.Item>
                                <Form.Item
                                    label="Description"
                                    name="Description"
                                    rules={[{ required: true, message: "Please input the ride description!" }]}
                                >
                                    <Input.TextArea rows={3} placeholder="Enter ride description" />
                                </Form.Item>
                                <Form.Item
                                    label="Capacity"
                                    name="Capacity"
                                    rules={[{ required: true, message: "Please input the ride capacity!" }]}
                                >
                                    <InputNumber placeholder="Enter ride capacity" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="end">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{
                                    backgroundColor: "#FFB703",
                                    border: "none",
                                    color: "white",
                                    borderRadius: "8px",
                                    marginTop: "20px",
                                }}
                                htmlType="submit"
                            >
                                Save Changes
                            </Button>
                        </Row>
                    </Form>
                </Content>
            </Layout>
        </Layout>
    );
};

export default EditRidePage;