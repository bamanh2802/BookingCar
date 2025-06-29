const { MongoClient, ObjectId } = require('mongodb')
const { faker } = require('@faker-js/faker')

const uri = 'mongodb+srv://bookingcar123:m8BTvfrCZBZI9jAB@bookingcar.xzlezim.mongodb.net/'
const dbName = 'BookingCar'

const CAR_TYPES = { VIP: 'VIP', REGULAR: 'Regular' }
const TICKET_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  REJECTED: 'Rejected',
  DONE: 'Done'
}
const TRIP_TITLES = { NOT_STARTED: 'Not Started', COMPLETED: 'Completed' }
const TITLE_TICKET_REQUESTS = {
  BOOK_TICKET: 'Book Ticket',
  CANCEL_TICKET: 'Cancel Ticket',
  REFUND: 'Refund Ticket'
}

async function seed() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)

    // Xóa dữ liệu cũ
    await db.collection('carcompanies').deleteMany({})
    await db.collection('seatmaps').deleteMany({})
    await db.collection('trips').deleteMany({})
    await db.collection('tickets').deleteMany({})
    await db.collection('ticketrequests').deleteMany({})

    // 1. Tạo 5 carCompany (có seatMap mẫu)
    const carCompanies = Array.from({ length: 5 }).map(() => {
      const seatMap = Array.from({ length: 40 }).map((_, idx) => ({
        code: faker.string.alpha({ length: 2, casing: 'upper' }) + (idx + 1),
        floor: faker.helpers.arrayElement([1, 2])
      }))
      return {
        _id: new ObjectId(),
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        hotline: faker.phone.number('09########'),
        type: faker.helpers.arrayElement([CAR_TYPES.REGULAR, CAR_TYPES.VIP]),
        totalSeats: seatMap.length,
        seatMap,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    await db.collection('carcompanies').insertMany(carCompanies)

    // 2. Tạo 20 trip, mỗi trip có seatMap riêng
    const tripList = []
    const seatMapList = []
    for (const company of carCompanies) {
      for (let i = 0; i < 4; i++) {
        const departure = faker.date.soon({ days: 30 })
        const arrival = new Date(departure.getTime() + 2 * 60 * 60 * 1000)
        const type = company.type
        const totalSeats = 40
        // Tạo seatMap cho trip này
        const seats = Array.from({ length: totalSeats }).map((_, idx) => ({
          code: faker.string.alpha({ length: 2, casing: 'upper' }) + (idx + 1),
          floor: faker.helpers.arrayElement([1, 2])
        }))
        const seatMapDoc = {
          _id: new ObjectId(),
          seats,
          totalBookedSeats: 0,
          tripId: null, // sẽ gán sau
          carCompanyId: company._id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        // Tạo trip
        const trip = {
          _id: new ObjectId(),
          startLocation: faker.location.city(),
          endLocation: faker.location.city(),
          startStation: faker.location.streetAddress(),
          endStation: faker.location.streetAddress(),
          startTime: departure,
          endTime: arrival,
          carCompanyId: company._id,
          seatMapId: seatMapDoc._id,
          price: faker.number.int({ min: 100000, max: 500000 }),
          type,
          availableSeats: totalSeats,
          totalSeats,
          status: TRIP_TITLES.NOT_STARTED,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        seatMapDoc.tripId = trip._id
        seatMapList.push(seatMapDoc)
        tripList.push(trip)
      }
    }
    await db.collection('seatmaps').insertMany(seatMapList)
    await db.collection('trips').insertMany(tripList)

    // 4. Tạo ticket cho mỗi trip (5-10 vé/trip)
    const ticketList = []
    for (const trip of tripList) {
      const seatMap = seatMapList.find((s) => s._id.equals(trip.seatMapId))
      const usedSeats = new Set()
      const ticketCount = faker.number.int({ min: 5, max: 10 })
      for (let i = 0; i < ticketCount; i++) {
        let seat
        do {
          seat = faker.helpers.arrayElement(seatMap.seats)
        } while (usedSeats.has(seat.code))
        usedSeats.add(seat.code)
        ticketList.push({
          _id: new ObjectId(),
          userId: new ObjectId(),
          tripId: trip._id,
          requestId: null, // sẽ gán sau
          price: trip.price,
          status: faker.helpers.arrayElement([
            TICKET_STATUS.CONFIRMED,
            TICKET_STATUS.CANCELLED,
            TICKET_STATUS.REFUNDED
          ]),
          passengerName: faker.person.fullName(),
          passengerPhone: faker.phone.number('09########'),
          seats: [{ code: seat.code, floor: seat.floor }],
          type: trip.type,
          createdBy: null,
          commissionPaid: false,
          pickupStation: trip.startStation,
          dropoffStation: trip.endStation,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
    await db.collection('tickets').insertMany(ticketList)

    // 5. Tạo ticketRequest cho mỗi ticket (1-2 request/ticket)
    const ticketRequestList = []
    for (const ticket of ticketList) {
      const requestCount = faker.number.int({ min: 1, max: 2 })
      for (let i = 0; i < requestCount; i++) {
        ticketRequestList.push({
          userId: ticket.userId,
          tripId: ticket.tripId,
          ticketId: ticket._id,
          titleRequest: faker.helpers.arrayElement([
            TITLE_TICKET_REQUESTS.BOOK_TICKET,
            TITLE_TICKET_REQUESTS.CANCEL_TICKET,
            TITLE_TICKET_REQUESTS.REFUND
          ]),
          price: ticket.price,
          seats: ticket.seats,
          passengerName: ticket.passengerName,
          passengerPhone: ticket.passengerPhone,
          type: ticket.type,
          amount: faker.number.int({ min: 0, max: ticket.price }),
          reason: faker.lorem.sentence(),
          status: faker.helpers.arrayElement([
            TICKET_STATUS.PENDING,
            TICKET_STATUS.CONFIRMED,
            TICKET_STATUS.CANCELLED,
            TICKET_STATUS.REFUNDED,
            TICKET_STATUS.REJECTED
          ]),
          createdBy: null,
          pickupStation: ticket.pickupStation,
          dropoffStation: ticket.dropoffStation,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
    await db.collection('ticketrequests').insertMany(ticketRequestList)

    // update requestId cho ticket
    for (const ticket of ticketList) {
      const req = await db.collection('ticketrequests').findOne({ ticketId: ticket._id })
      if (req) {
        await db.collection('tickets').updateOne({ _id: ticket._id }, { $set: { requestId: req._id } })
      }
    }

    console.log('Seed data inserted successfully!')
  } catch (err) {
    console.error('Error seeding data:', err)
  } finally {
    await client.close()
  }
}

seed()
