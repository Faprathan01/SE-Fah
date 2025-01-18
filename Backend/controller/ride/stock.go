package controller

import (
	"backend/config"
	"backend/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateStock สร้างข้อมูล Stock ใหม่
func CreateStock(c *gin.Context) {
	var stock entity.Stock

	// bind ข้อมูลจาก JSON เข้าตัวแปร stock
	if err := c.ShouldBindJSON(&stock); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// สร้าง stock ใหม่
	s := entity.Stock{
		ProductName: stock.ProductName,
		Quantity:    stock.Quantity,
		Price:       stock.Price,
		ProductType: stock.ProductType,
	}

	// บันทึกข้อมูล stock
	if err := db.Create(&s).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": s})
}

// GetStock ดึงข้อมูล Stock โดยใช้ ID
func GetStock(c *gin.Context) {
	id := c.Param("id")
	var stock entity.Stock

	db := config.DB()
	result := db.First(&stock, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, stock)
}

func ListStocks(c *gin.Context) {
    var stocks []entity.Stock

    db := config.DB()
    result := db.Find(&stocks)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, stocks)
}

// UpdateStock อัพเดตข้อมูล Stock
func UpdateStock(c *gin.Context) {
	id := c.Param("id")
	var stock entity.Stock

	db := config.DB()

	// ตรวจสอบว่าข้อมูล stock มีอยู่หรือไม่
	result := db.First(&stock, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Stock not found"})
		return
	}

	// รับข้อมูล JSON และตรวจสอบว่าไม่มีข้อผิดพลาด
	if err := c.ShouldBindJSON(&stock); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดตข้อมูล stock
	if err := db.Save(&stock).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully", "data": stock})
}

// DeleteStock ลบข้อมูล Stock
func DeleteStock(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// ลบข้อมูล stock
	if tx := db.Delete(&entity.Stock{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Stock not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

// CountStocks นับจำนวนสินค้าใน Stock
func CountStocks(c *gin.Context) {
	var count int64

	db := config.DB()
	if err := db.Model(&entity.Stock{}).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": count})
}
