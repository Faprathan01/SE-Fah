package controller

import (
	"net/http"
	
	"backend/config"

	"backend/entity"

	"github.com/gin-gonic/gin"
)

// POST /bookings - สร้างการจองใหม่
func CreateBooking(c *gin.Context) {
	var booking entity.Booking

	// Bind incoming JSON request to the booking variable
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า RideID ที่เชื่อมโยงมีอยู่ในระบบหรือไม่
	var ride entity.Ride
	if err := config.DB().First(&ride, booking.RideID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ride not found"})
		return
	}

	// // ตรวจสอบว่า CordID ที่ระบุมีอยู่ในระบบหรือไม่
	// var ticket entity.Cord
	// if err := config.DB().First(&Cord, booking.CordID ).Error; err != nil {
	// 	c.JSON(http.StatusNotFound, gin.H{"error": "Cord not found"})
	// 	return
	// }

	// ตรวจสอบจำนวนที่นั่งที่ถูกจองไปแล้วในวันที่และเวลาที่เลือก
	var bookingCount int64
	if err := config.DB().Model(&entity.Booking{}).
		Where("ride_id = ? AND date = ? AND time = ?", booking.RideID, booking.Date, booking.Time).
		Count(&bookingCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// เช็คว่ามีที่นั่งพอหรือไม่
	if bookingCount >= int64(ride.Capacity) {
		c.JSON(http.StatusConflict, gin.H{"error": "No available slots for this ride at the selected date and time"})
		return
	}

	// สร้างข้อมูลการจองใหม่
	newBooking := entity.Booking{
		TicketID: booking.TicketID,
		Date:     booking.Date,
		Time:     booking.Time,
		RideID:   booking.RideID,
		Ride:     ride, // เชื่อมโยงข้อมูล Ride
	}

	// บันทึกการจองใหม่ลงในฐานข้อมูล
	if err := config.DB().Create(&newBooking).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลการจองที่สร้างขึ้น
	c.JSON(http.StatusCreated, gin.H{"message": "Booking created successfully", "data": newBooking})
}

// GET /bookings/:id - ดึงข้อมูลการจองตาม ID พร้อมข้อมูลเกี่ยวกับ Ride
func GetBookingWithRide(c *gin.Context) {
	ID := c.Param("id")
	var booking entity.Booking

	// ดึงข้อมูลการจองตาม ID พร้อมเชื่อมโยงข้อมูล Ride
	if err := config.DB().Preload("Ride").First(&booking, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// ส่งข้อมูลการจองที่พบ
	c.JSON(http.StatusOK, booking)
}

// GET /bookings - ดึงข้อมูลการจองทั้งหมด
func ListBookings(c *gin.Context) {
	var bookings []entity.Booking

	// ดึงข้อมูลการจองทั้งหมดพร้อมข้อมูลเกี่ยวกับ Ride
	if err := config.DB().Preload("Ride").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No bookings found"})
		return
	}

	// ส่งข้อมูลการจองทั้งหมด
	c.JSON(http.StatusOK, bookings)
}

// DELETE /bookings/:id - ลบการจองตาม ID
func DeleteBooking(c *gin.Context) {
	id := c.Param("id")
	var booking entity.Booking

	// ตรวจสอบการจองที่ต้องการลบ
	if err := config.DB().First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// ลบการจอง
	if err := config.DB().Delete(&booking).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking deleted successfully"})
}

// PUT /bookings/:id - อัปเดตการจองตาม ID
func UpdateBooking(c *gin.Context) {
	id := c.Param("id")
	var booking entity.Booking

	// ตรวจสอบการจองที่ต้องการอัปเดต
	if err := config.DB().First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// Bind incoming JSON request to the booking variable
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตการจอง
	if err := config.DB().Save(&booking).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking updated successfully", "data": booking})
}

// GET /bookings/count - นับจำนวนการจองทั้งหมด
func CountBookings(c *gin.Context) {
	var count int64
	if err := config.DB().Model(&entity.Booking{}).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": count})
}
