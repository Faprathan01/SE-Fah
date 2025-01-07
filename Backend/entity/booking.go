// package entity

// import (
// 	"gorm.io/gorm"
// )

// type Booking struct {
// 	gorm.Model
// 	TicketID    uint   `json:"ticket_id"`
// 	Date 		string `json:"date"`
// 	Time        string `json:"time"`

// 	// RideID เป็น FK ที่เชื่อมกับตาราง Ride
// 	RideID uint
// 	Ride   Ride `gorm:"foreignKey:ride_id"`
// }
package entity

import (
	"errors"
	"regexp"

	"gorm.io/gorm"
)

type Booking struct {
	gorm.Model
	TicketID    uint   `json:"ticket_id"`
	Date 		string `json:"date"`
	Time        string `json:"time"`

	// RideID เป็น FK ที่เชื่อมกับตาราง Ride
	RideID uint
	Ride   Ride `gorm:"foreignKey:ride_id"`
}
func ValidateBooking(booking *Booking) (bool, error) {
	// ตรวจสอบว่า TicketID ไม่เป็น 0
	if booking.TicketID == 0 {
		return false, errors.New("Ticket ID is required")
	}

	// ตรวจสอบว่า Date ไม่ว่างเปล่าและมีรูปแบบที่ถูกต้อง (YYYY-MM-DD)
	datePattern := `^\d{4}-\d{2}-\d{2}$`
	matched, _ := regexp.MatchString(datePattern, booking.Date)
	if booking.Date == "" {
		return false, errors.New("Date is required")
	} else if !matched {
		return false, errors.New("Date must be in YYYY-MM-DD format")
	}

	// ตรวจสอบว่า Time ไม่ว่างเปล่าและมีรูปแบบที่ถูกต้อง (HH.MM-HH.MM)
	timePattern := `^\d{2}\.\d{2}-\d{2}\.\d{2}$`
	matched, _ = regexp.MatchString(timePattern, booking.Time)
	if booking.Time == "" {
		return false, errors.New("Time is required")
	} else if !matched {
		return false, errors.New("Time must be in HH.MM-HH.MM format")
	}

	// ตรวจสอบว่า RideID ไม่เป็น 0
	if booking.RideID == 0 {
		return false, errors.New("Ride ID is required")
	}

	// ทุกอย่างถูกต้อง
	return true, nil
}