package controller

import (
	"backend/config"
	"backend/entity"

	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateStock สร้างสินค้าหรือสต็อกใหม่
func CreateStock(c *gin.Context) {
	var stock entity.Stock

	// bind ข้อมูลจาก JSON เข้าตัวแปร stock
	if err := c.ShouldBindJSON(&stock); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// สร้างสินค้าใหม่
	s := entity.Stock{
		ProductName: stock.ProductName,
		Quantity:    stock.Quantity,
		Price:       stock.Price,
		ProductType: stock.ProductType,
	}

	// บันทึกสินค้า
	if err := db.Create(&s).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": s})
}

// GET /stock/:id
func GetStock(c *gin.Context) {
	ID := c.Param("id")
	var stock entity.Stock

	db := config.DB()
	results := db.First(&stock, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if stock.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, stock)
}

// GET /stocks
func ListStocks(c *gin.Context) {
	var stocks []entity.Stock

	db := config.DB()
	results := db.Find(&stocks)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, stocks)
}

// DELETE /stocks/:id
func DeleteStock(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM stocks WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /stocks/:id
func UpdateStock(c *gin.Context) {
	var stock entity.Stock

	stockID := c.Param("id")

	db := config.DB()
	result := db.First(&stock, stockID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&stock); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&stock)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// CountStocks นับจำนวนสินค้าทั้งหมด
func CountStocks(c *gin.Context) {
	var count int64
	db := config.DB()
	if err := db.Model(&entity.Stock{}).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}
