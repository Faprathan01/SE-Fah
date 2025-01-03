package entity

import "gorm.io/gorm"

type Stock struct {
    gorm.Model
    ProductName  string  `json:"ProductName"`  // ชื่อสินค้า
    Quantity     int     `json:"Quantity"`     // จำนวนสินค้าที่มี
    Price        float64 `json:"Price"`        // ราคา
    ProductType  string  `json:"ProductType"`  // ประเภทสินค้า (เช่น Souvenir, Food, Drink)

 
}
