import { StockInterface } from "../../../interfaces/IStock"; // Import interface สำหรับ Stock

const apiUrl = "http://localhost:3036";

// Helper function for handling fetch requests
const fetchData = async (url: string, options: RequestInit) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.status === 204 ? true : await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return false;
    }
};

// ฟังก์ชันสำหรับดึงข้อมูลสินค้าทั้งหมด
async function GetStocks() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    return await fetchData(`${apiUrl}/stocks`, requestOptions);
}

// ฟังก์ชันสำหรับดึงข้อมูลสินค้าตาม ID
async function GetStockById(id: number | undefined) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "GET",
    };

    return await fetchData(`${apiUrl}/stocks/${id}`, requestOptions);
}

// ฟังก์ชันสำหรับสร้างสินค้าใหม่
async function CreateStock(data: StockInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return await fetchData(`${apiUrl}/stocks`, requestOptions);
}

// ฟังก์ชันสำหรับอัปเดตข้อมูลสินค้า
async function UpdateStock(data: StockInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return await fetchData(`${apiUrl}/stocks`, requestOptions);
}

// ฟังก์ชันสำหรับลบสินค้าตาม ID
async function DeleteStockByID(id: number | undefined) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "DELETE",
    };

    return await fetchData(`${apiUrl}/stocks/${id}`, requestOptions);
}

// ฟังก์ชันสำหรับลบสินค้าตามชื่อ
async function DeleteStockByName(name: string | undefined) {
    if (name === undefined) return false;

    const requestOptions = {
        method: "DELETE",
    };

    return await fetchData(`${apiUrl}/stocks/${name}`, requestOptions);
}

export { GetStocks, GetStockById, CreateStock, UpdateStock, DeleteStockByID, DeleteStockByName };
