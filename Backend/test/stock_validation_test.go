package unit

import (
	"testing"
	// "github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"backend/entity"
)

func TestStockValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	// Case: Valid stock data
	t.Run("Validation succeeded", func(t *testing.T) {
		stock := entity.Stock{
			ProductName: "T-shirt",
			Quantity:    50,
			Price:       199.99,
			ProductType: "Souvenir",
		}

		ok, err := entity.ValidateStock(stock)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	// // Invalid cases
	// t.Run("Quantity out of range", func(t *testing.T) {
	// 	stock := entity.Stock{
	// 		ProductName: "T-shirt",
	// 		Quantity:    0, // Invalid quantity
	// 		Price:       199.99,
	// 		ProductType: "Souvenir",
	// 	}

	// 	ok, err := entity.ValidateStock(stock)
	// 	g.Expect(ok).NotTo(BeTrue())
	// 	g.Expect(err).NotTo(BeNil())
	// 	g.Expect(err.Error()).To(ContainSubstring("Quantity must be between 1 and 10000"))
	// })

	// t.Run("Missing ProductName", func(t *testing.T) {
	// 	stock := entity.Stock{
	// 		Quantity:    50,
	// 		Price:       199.99,
	// 		ProductType: "Souvenir",
	// 	}

	// 	ok, err := entity.ValidateStock(stock)
	// 	g.Expect(ok).NotTo(BeTrue())
	// 	g.Expect(err).NotTo(BeNil())
	// 	g.Expect(err.Error()).To(ContainSubstring("ProductName is required"))
	// })

	// t.Run("Missing ProductType", func(t *testing.T) {
	// 	stock := entity.Stock{
	// 		ProductName: "T-shirt",
	// 		Quantity:    50,
	// 		Price:       199.99,
	// 	}

	// 	ok, err := entity.ValidateStock(stock)
	// 	g.Expect(ok).NotTo(BeTrue())
	// 	g.Expect(err).NotTo(BeNil())
	// 	g.Expect(err.Error()).To(ContainSubstring("ProductType is required"))
	// })
}
