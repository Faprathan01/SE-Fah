package entity

import (
	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Stock struct {
	gorm.Model
	ProductName string  `json:"ProductName" valid:"required~ProductName is required"`
	Quantity    int     `json:"Quantity" valid:"int,range(1|10000)~Quantity must be between 1 and 10000"`
	Price       float64 `json:"Price" valid:"float,range(0|99999)~Price must be between 0 and 99999"`
	ProductType string  `json:"ProductType" valid:"required~ProductType is required"`
}

func ValidateStock(stock Stock) (bool, error) {
	// Validate the struct using govalidator
	ok, err := govalidator.ValidateStruct(stock)
	return ok, err
}
