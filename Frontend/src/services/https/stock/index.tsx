import { StockInterface } from "../../../interfaces/IStock";

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

// Get all stock items
async function GetStocks() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    return await fetchData(`${apiUrl}/stocks`, requestOptions);
}

// Get stock by ID
async function GetStockById(id: number | undefined) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "GET",
    };

    return await fetchData(`${apiUrl}/stock/${id}`, requestOptions);
}

// Create new stock item
async function CreateStock(data: StockInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return await fetchData(`${apiUrl}/stocks`, requestOptions);
}

// Update stock item
async function UpdateStock(id: number | undefined, data: StockInterface) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return await fetchData(`${apiUrl}/stocks/${id}`, requestOptions);
}

// Delete stock by ID
async function DeleteStockByID(id: number | undefined) {
    if (id === undefined) return false;

    const requestOptions = {
        method: "DELETE",
    };

    return await fetchData(`${apiUrl}/stocks/${id}`, requestOptions);
}

// Delete stock by name
async function DeleteStockByName(name: string | undefined) {
    if (name === undefined) return false;

    const requestOptions = {
        method: "DELETE",
    };

    return await fetchData(`${apiUrl}/stocks/${name}`, requestOptions);
}

export { GetStocks, GetStockById, CreateStock, UpdateStock, DeleteStockByID, DeleteStockByName };
