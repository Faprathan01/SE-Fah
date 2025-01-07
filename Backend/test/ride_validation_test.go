package unit

import (
	"testing"
	. "github.com/onsi/gomega"
	"backend/entity"
)

func TestRideValidation(t *testing.T) {
	g := NewGomegaWithT(t) // สร้าง Gomega instance สำหรับใช้ assertion

	// กรณี: ข้อมูลเครื่องเล่นถูกต้อง
	t.Run("valid ride", func(t *testing.T) {
		ride := entity.Ride{
			RideName:    "Ferris Wheel",     // ชื่อเครื่องเล่นที่ถูกต้อง
			Description: "A large Ferris wheel", // คำอธิบายเครื่องเล่น
			Capacity:    10,                  // ความจุที่ถูกต้อง
			Image:       "ferris_wheel.jpg",  // รูปภาพเครื่องเล่น
		}

		// เรียกฟังก์ชัน ValidateRide เพื่อทำการตรวจสอบ
		ok, err := entity.ValidateRide(&ride)

		// ตรวจสอบว่าการตรวจสอบต้องผ่านสำเร็จ (ok = true และไม่มี error)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	// กรณี: ชื่อเครื่องเล่นว่าง
	t.Run("missing RideName", func(t *testing.T) {
		ride := entity.Ride{
			RideName:    "",                  // ชื่อเครื่องเล่นว่าง
			Description: "A large Ferris wheel",
			Capacity:    10,
			Image:       "ferris_wheel.jpg",
		}

		ok, err := entity.ValidateRide(&ride)

		// ตรวจสอบว่าการตรวจสอบต้องล้มเหลว (ok = false)
		g.Expect(ok).To(BeFalse())
		// ตรวจสอบว่า error message ต้องบอกว่า "RideName is required"
		g.Expect(err).To(Not(BeNil()))
		g.Expect(err.Error()).To(ContainSubstring("RideName is required"))
	})

	// กรณี: ความจุเครื่องเล่นเป็นศูนย์
	t.Run("invalid Capacity", func(t *testing.T) {
		ride := entity.Ride{
			RideName:    "Ferris Wheel",
			Description: "A large Ferris wheel",
			Capacity:    0, // ความจุเป็นศูนย์
			Image:       "ferris_wheel.jpg",
		}

		ok, err := entity.ValidateRide(&ride)

		// ตรวจสอบว่าการตรวจสอบต้องล้มเหลว (ok = false)
		g.Expect(ok).To(BeFalse())
		// ตรวจสอบว่า error message ต้องบอกว่า "Capacity must be greater than 0"
		g.Expect(err).To(Not(BeNil()))
		g.Expect(err.Error()).To(ContainSubstring("Capacity must be greater than 0"))
	})

	// กรณี: ไม่มีคำอธิบายเครื่องเล่น
	t.Run("missing Description", func(t *testing.T) {
		ride := entity.Ride{
			RideName:    "Ferris Wheel",
			Description: "", // ไม่มีคำอธิบายเครื่องเล่น
			Capacity:    10,
			Image:       "ferris_wheel.jpg",
		}

		ok, err := entity.ValidateRide(&ride)

		// ตรวจสอบว่าการตรวจสอบต้องล้มเหลว (ok = false)
		g.Expect(ok).To(BeFalse())
		// ตรวจสอบว่า error message ต้องบอกว่า "Description is required"
		g.Expect(err).To(Not(BeNil()))
		g.Expect(err.Error()).To(ContainSubstring("Description is required"))
	})

}
