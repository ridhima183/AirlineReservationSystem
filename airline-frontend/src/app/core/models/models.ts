export interface Customer {
  id?: number;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phoneNumber: string;
}

export interface Flight {
  id?: number;
  flightNumber: string;
  fromCity: string;
  toCity: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  imageUrl?: string;
  cabin: string; // one-way / round-trip
  economyPrice: number;
  businessPrice: number;
  totalSeats: number;
  seatsAvailable: number;
  travelDate?: string;
  returnDate?: string;
  lockedSeats?: string[];
  bookedSeats?: string[];
}

export interface SeatMap {
  flightId: number;
  seatMap: string[][]; // 15 rows x 6 columns, values: AVAILABLE, BOOKED, LOCKED
  totalSeats: number;
  availableSeats: number;
}

export interface Booking {
  id?: number;
  ticketNumber?: string;
  flightId: number;
  customerId: number;
  passengerNames: string;
  seatNumbers: string;
  travelClass: 'economy' | 'business';
  numPassengers: number;
  numAdults?: number;
  numChildren?: number;
  numInfants?: number;
  amountPaid?: number;
  status?: 'BOOKED' | 'WAITLISTED' | 'CANCELLED';
  issueDate?: string;
  tripType?: 'one-way' | 'return';
  returnFlightId?: number;
  refundAmount?: number;
  cancellationDate?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  transactionId?: string;
}

export interface CancelResult {
  booking: Booking;
  refundAmount: number;
  cancellationFee: number;
}

export interface BookingResponse {
  booking: Booking;
  receipt?: Receipt;
  flight?: Flight;
}

export interface Receipt {
  airlineName: string;
  ticketNumber: string;
  transactionId: string;
  flightNumber: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  travelDate: string;
  travelClass: string;
  passengerNames: string;
  seatNumbers: string;
  numAdults: number;
  numChildren: number;
  numInfants: number;
  amountPaid: number;
  status: string;
  issueDate: string;
  tripType: string;
}

export interface FlightSearchCriteria {
  from: string;
  to: string;
  departureDate?: string;
  returnDate?: string;
  tripType: 'one-way' | 'return';
  cabin?: string;
  adults: number;
  children: number;
  infants: number;
}
