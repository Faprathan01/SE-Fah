package entity

import (
	"errors"
	"regexp"

	"gorm.io/gorm"
)
     
type Ride struct {
    gorm.Model 
	RideName    string    `json:"RideName"`
	Description string    `json:"Description"`
	Capacity    int       `json:"capacity"`  
	Image       string    `json:"Image"`

	
	Bookings [] Booking `gorm:"foreignKey:ride_id"`
    
}

// ฟังก์ชัน ValidateRide สำหรับตรวจสอบความถูกต้องของข้อมูลเครื่องเล่น
func ValidateRide(ride *Ride) (bool, error) {
	// ตรวจสอบชื่อเครื่องเล่น
	if ride.RideName == "" {
		return false, errors.New("RideName is required")
	}

	// ตรวจสอบคำอธิบายเครื่องเล่น
	if ride.Description == "" {
		return false, errors.New("Description is required")
	}

	// ตรวจสอบความจุเครื่องเล่น
	if ride.Capacity <= 0 {
		return false, errors.New("Capacity must be greater than 0")
	}

	// ตรวจสอบรูปแบบของชื่อภาพ (Image)
	imagePattern := `\.(jpg|jpeg|png|gif)$`
	match, _ := regexp.MatchString(imagePattern, ride.Image)
	if !match {
		return false, errors.New("Image must be in JPG, JPEG, PNG, or GIF format")
	}

	// หากข้อมูลถูกต้อง
	return true, nil
}