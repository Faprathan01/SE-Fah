package unit

import (
    "testing"
   	// "github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"backend/entity"
)

func TestBookingValidation(t *testing.T) {
    g := NewGomegaWithT(t) // สร้าง Gomega instance สำหรับใช้ assertion

    // กรณี: ข้อมูลการจองถูกต้อง
    t.Run("valid booking", func(t *testing.T) {
        booking := entity.Booking{
            TicketID: 1,           // มีรหัสบัตรที่ถูกต้อง
            Date:     "2025-01-10", // วันที่ในรูปแบบ YYYY-MM-DD
            Time:     "08.00-08.45", // เวลาถูกต้องตามรูปแบบ HH.MM-HH.MM
            RideID:   2,           // มีรหัสเครื่องเล่นที่ถูกต้อง
        }

        // เรียกฟังก์ชัน ValidateBooking เพื่อทำการตรวจสอบ
        ok, err := entity.ValidateBooking(&booking)

        // ตรวจสอบว่าการตรวจสอบต้องผ่านสำเร็จ (ok = true และไม่มี error)
        g.Expect(ok).To(BeTrue())
        g.Expect(err).To(BeNil())
    })

    // กรณี: รูปแบบเวลาผิด
    t.Run("invalid Time format", func(t *testing.T) {
        booking := entity.Booking{
            TicketID: 1,
            Date:     "2025-01-10",
            Time:     "8:00-8:45", // เวลาผิดรูปแบบ (ใช้ ":" แทน ".")
            RideID:   2,
        }

        ok, err := entity.ValidateBooking(&booking)

        // ตรวจสอบว่าการตรวจสอบต้องล้มเหลว (ok = false)
        g.Expect(ok).To(BeFalse())
        // ตรวจสอบว่า error message ต้องมีคำอธิบายที่ถูกต้อง
        g.Expect(err).To(Not(BeNil()))
        g.Expect(err.Error()).To(ContainSubstring("Time must be in HH.MM-HH.MM format"))
    })

    // กรณี: ไม่ได้ใส่วันที่
    t.Run("missing Date", func(t *testing.T) {
        booking := entity.Booking{
            TicketID: 1,
            Date:     "", // วันที่ว่างเปล่า
            Time:     "08.00-08.45",
            RideID:   2,
        }

        ok, err := entity.ValidateBooking(&booking)

        // ตรวจสอบว่าการตรวจสอบต้องล้มเหลว (ok = false)
        g.Expect(ok).To(BeFalse())
        // ตรวจสอบว่า error message ต้องระบุว่า "Date is required"
        g.Expect(err).To(Not(BeNil()))
        g.Expect(err.Error()).To(ContainSubstring("Date is required"))
    })

    // กรณี: รูปแบบวันที่ผิด
    t.Run("invalid Date format", func(t *testing.T) {
        booking := entity.Booking{
            TicketID: 1,
            Date:     "2025/01/10", // รูปแบบผิด (ใช้ "/" แทน "-")
            Time:     "08.00-08.45",
            RideID:   2,
        }

        ok, err := entity.ValidateBooking(&booking)

        // ตรวจสอบว่าการตรวจสอบต้องล้มเหลว (ok = false)
        g.Expect(ok).To(BeFalse())
        // ตรวจสอบว่า error message ต้องบอกว่ารูปแบบวันที่ผิด
        g.Expect(err).To(Not(BeNil()))
        g.Expect(err.Error()).To(ContainSubstring("Date must be in YYYY-MM-DD format"))
    })

    // กรณี: ไม่มีรหัสบัตร
    t.Run("missing TicketID", func(t *testing.T) {
        booking := entity.Booking{
            TicketID: 0, // ไม่มีรหัสบัตร (ค่า 0)
            Date:     "2025-01-10",
            Time:     "08.00-08.45",
            RideID:   2,
        }

        ok, err := entity.ValidateBooking(&booking)

        // ตรวจสอบว่าการตรวจสอบต้องล้มเหลว (ok = false)
        g.Expect(ok).To(BeFalse())
        // ตรวจสอบว่า error message ต้องบอกว่า "Ticket ID is required"
        g.Expect(err).To(Not(BeNil()))
        g.Expect(err.Error()).To(ContainSubstring("Ticket ID is required"))
    })

    // กรณี: ไม่มีรหัสเครื่องเล่น
    t.Run("missing RideID", func(t *testing.T) {
        booking := entity.Booking{
            TicketID: 1,
            Date:     "2025-01-10",
            Time:     "08.00-08.45",
            RideID:   0, // ไม่มีรหัสเครื่องเล่น (ค่า 0)
        }

        ok, err := entity.ValidateBooking(&booking)

        // ตรวจสอบว่าการตรวจสอบต้องล้มเหลว (ok = false)
        g.Expect(ok).To(BeFalse())
        // ตรวจสอบว่า error message ต้องบอกว่า "Ride ID is required"
        g.Expect(err).To(Not(BeNil()))
        g.Expect(err.Error()).To(ContainSubstring("Ride ID is required"))
    })
}
