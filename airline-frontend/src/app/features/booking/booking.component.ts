import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../core/services/flight.service';
import { BookingService } from '../../core/services/booking.service';
import { SessionService } from '../../core/services/session.service';
import { Flight, Booking, Receipt } from '../../core/models/models';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

<div class="container">

  <div class="hero-card fade-in"
       *ngIf="flight"
       [style.background-image]="'url(' + getFlightImage() + ')'"
       style="background-size:cover;background-position:center;">

    <div class="hero-card-content">
      <h2 class="hero-title">
        {{flight.flightNumber}} |
        {{flight.fromCity}} → {{flight.toCity}}
      </h2>

      <p class="hero-subtitle">
        {{flight.departTime}} - {{flight.arriveTime}}
        | {{flight.duration}}
        | Seats left: {{flight.seatsAvailable}}
      </p>
    </div>

  </div>


  <!-- BOOKING DETAILS -->

  <div class="card"
       *ngIf="flight && !showSeatMap && !confirmed">

    <h3 class="section-title">
      Booking Details
    </h3>


    <div class="grid-2">

      <div>
        <label>Trip Type</label>

        <select [(ngModel)]="booking.tripType">

          <option value="one-way">
            One Way
          </option>

          <option value="return">
            Return
          </option>

        </select>

      </div>



      <div>

        <label>Travel Class</label>

        <select [(ngModel)]="booking.travelClass"
                (change)="onClassChange()">

          <option value="economy">
            Economy - ₹{{flight.economyPrice}}
          </option>

          <option value="business">
            Business - ₹{{flight.businessPrice}}
          </option>

        </select>

      </div>


    </div>



    <div class="grid-3">

      <div>

        <label>Adults (12+)</label>

        <input type="number"
               min="1"
               max="9"
               [(ngModel)]="booking.numAdults"
               (change)="updatePassengerCount()">

      </div>



      <div>

        <label>Children (2-11)</label>

        <input type="number"
               min="0"
               max="9"
               [(ngModel)]="booking.numChildren"
               (change)="updatePassengerCount()">

      </div>



      <div>

        <label>Infants (&lt;2)</label>

        <input type="number"
               min="0"
               max="2"
               [(ngModel)]="booking.numInfants"
               (change)="updatePassengerCount()">

      </div>


    </div>



    <div>

      <label>
        Passenger Full Name(s)
      </label>

      <input [(ngModel)]="booking.passengerNames"
             [placeholder]="'Enter '+booking.numPassengers+' passenger names'">

    </div>



    <p class="total-box">

      <b>
        Estimated Total:
      </b>

      <span class="price-value">₹{{estimatedTotal()}}</span>

    </p>



    <button (click)="proceedToSeatSelection()">
      Proceed to Seat Selection
    </button>



    <p class="error"
       *ngIf="error">

       {{error}}

    </p>


  </div>





  <!-- SEAT MAP -->


  <div class="card"
       *ngIf="showSeatMap && !confirmed">


    <h3 class="section-title">
      Select Seats
    </h3>



    <p>

      Selected:
      <b>
        {{selectedSeats.length}}
      </b>

      of
      {{booking.numPassengers}}

    </p>



    <div class="seat-map-container">


      <div class="cockpit">
        COCKPIT
      </div>



      <div class="seat-rows">


        <div class="seat-row"
             *ngFor="let row of seatMap; let rowIndex=index">


          <div class="seat-number">
            {{rowIndex+1}}
          </div>



          <div class="seat"
             *ngFor="let seat of row.slice(0, 3); let colIndex=index"
               [ngClass]="getSeatClass(rowIndex,colIndex)"
               (click)="toggleSeat(rowIndex,colIndex)">

              <span class="seat-label">
                {{getSeatLabel(colIndex)}}
              </span>

          </div>



          <div class="aisle"></div>



          <div class="seat"
               *ngFor="let seat of row.slice(3, 6); let colIndex=index"
               [ngClass]="getSeatClass(rowIndex,colIndex+3)"
               (click)="toggleSeat(rowIndex,colIndex+3)">


              <span class="seat-label">
                {{getSeatLabel(colIndex+3)}}
              </span>


          </div>


        </div>


      </div>


    </div>




    <button
      (click)="confirmSeats()"
      [disabled]="selectedSeats.length!==booking.numPassengers">

      Confirm Seats
      ({{selectedSeats.length}}/{{booking.numPassengers}})

    </button>



    <button class="secondary"
            (click)="cancelSeatSelection()">

      Back

    </button>


    <p class="error"
       *ngIf="seatError">

       {{seatError}}

    </p>


  </div>

        <!-- PAYMENT SECTION -->

      <div class="card"
           *ngIf="showPayment && !confirmed">

        <h3 class="section-title">
          Payment Details
        </h3>


        <div class="payment-summary">

          <p>
            <b>Flight:</b>
            {{flight?.flightNumber}}
            |
            {{flight?.fromCity}}
            →
            {{flight?.toCity}}
          </p>


          <p>
            <b>Class:</b>
            {{booking.travelClass | titlecase}}
          </p>


          <p>
            <b>Passengers:</b>
            {{booking.passengerNames}}
          </p>


          <p>
            <b>Seats:</b>
            {{selectedSeats.join(', ')}}
          </p>


          <p>
            <b>Total:</b>
            ₹{{estimatedTotal()}}
          </p>

        </div>



        <label>
          Payment Method
        </label>

        <select [(ngModel)]="paymentMethod">

          <option value="credit_card">
            Credit Card
          </option>

          <option value="debit_card">
            Debit Card
          </option>

        </select>



        <input [(ngModel)]="cardNumber"
               placeholder="Card Number">


        <input [(ngModel)]="cardName"
               placeholder="Card Holder Name">


        <input [(ngModel)]="expiryDate"
               placeholder="MM/YY">


        <input [(ngModel)]="cvv"
               type="password"
               placeholder="CVV">



        <button (click)="makePayment()">

          Confirm & Pay ₹{{estimatedTotal()}}

        </button>



        <button class="secondary"
                (click)="goBackToSeats()">

          Back

        </button>



        <p class="error"
           *ngIf="paymentError">

          {{paymentError}}

        </p>


      </div>





      <!-- CONFIRMATION -->

      <div class="card success"
           *ngIf="confirmed">


        <h3>

          Booking Confirmed!

        </h3>



        <div *ngIf="receipt">


          <p>
            Ticket Number:
            <b>
              {{receipt.ticketNumber}}
            </b>
          </p>


          <p>
            Transaction ID:
            {{receipt.transactionId}}
          </p>


          <p>
            Flight:
            {{receipt.flightNumber}}
          </p>


          <p>
            Route:
            {{receipt.route}}
          </p>


          <p>
            Seats:
            {{receipt.seatNumbers}}
          </p>


          <p>
            Amount Paid:
            ₹{{receipt.amountPaid}}
          </p>



        </div>




        <button (click)="printReceipt()">

          Print Receipt

        </button>



        <button class="secondary"
                (click)="goToEnquiry()">

          Manage Booking

        </button>



        <button class="secondary"
                (click)="goHome()">

          Book Another Flight

        </button>


      </div>



</div>


`,
styles: [`

.seat-map-container{
  max-width:520px;
  margin:1rem auto;
  padding:24px 18px 18px;
  border-radius: 34px 34px 18px 18px;
  background: linear-gradient(145deg, #eff9ff, #b7d8eb 50%, #f8fdff);
  box-shadow: inset 0 2px 8px rgba(255,255,255,.9), 0 18px 40px rgba(8,48,79,.2);
  position:relative;
}

.seat-map-container::before { content:'SKYROUTE  •  CABIN'; display:block; text-align:center; color:#42657e; font-size:.64rem; font-weight:800; letter-spacing:.18em; margin-bottom:.75rem; }

.cockpit { margin:0 auto .85rem; width:100px; text-align:center; padding:.35rem; border-radius: 50% 50% 16px 16px; background:linear-gradient(180deg,#325d79,#17374f); color:#dff7ff; font-size:.65rem; font-weight:800; letter-spacing:.08em; box-shadow: inset 0 1px rgba(255,255,255,.28); }


.seat-row{
 display:flex;
 align-items:center;
 gap:6px;
 margin-bottom:7px;
}


.seat{
 width:36px;
 height:34px;
 display:flex;
 justify-content:center;
 align-items:center;
 border:1px solid rgba(24,75,105,.52);
 cursor:pointer;
 border-radius:8px 8px 5px 5px;
 background:linear-gradient(145deg,#fff,#cceaf7);
 box-shadow: inset 0 2px 2px rgba(255,255,255,.9), 0 3px 5px rgba(9,48,78,.16);
 transition:transform .18s ease, background .18s ease;
}

.seat:hover:not(.booked):not(.locked){ transform:translateY(-2px); background:#b9fff4; }


.seat.selected{
 background:linear-gradient(145deg,#159b8e,#0c655e);
 color:white;
}


.seat.booked{
 background:linear-gradient(145deg,#c84c58,#8e1f33);
 color:white;
 cursor:not-allowed;
}


.seat.locked{
 background:linear-gradient(145deg,#ec9c23,#bd6312);
 color:white;
 cursor:not-allowed;
}


.aisle{
 width:26px;
}

.seat-number { width:18px; color:#31536b; font-size:.72rem; font-weight:800; text-align:center; }

.seat-label { font-size:.72rem; font-weight:800; }


.error{
 color:red;
}


.total-box{
 padding:10px;
 background:#e8f4ff;
}


`]
})
export class BookingComponent implements OnInit, OnDestroy {


flight?:Flight;

seatMap:string[][]=[];


booking:Booking={

flightId:0,
customerId:0,
passengerNames:'',
seatNumbers:'',
travelClass:'economy',
numPassengers:1,
numAdults:1,
numChildren:0,
numInfants:0,
tripType:'one-way'

};



selectedSeats:string[]=[];


showSeatMap=false;
showPayment=false;


confirmed?:{
booking:Booking;
receipt?:Receipt;
};



receipt?:Receipt;


error='';
seatError='';
paymentError='';



paymentMethod='credit_card';

cardNumber='';
cardName='';
expiryDate='';
cvv='';


private refreshSubscription?:Subscription;

private sessionToken='';



constructor(

private route:ActivatedRoute,
private router:Router,
private flightService:FlightService,
private bookingService:BookingService,
private session:SessionService

){}




ngOnInit(){


const customer=this.session.getCustomer();


if(!customer){

this.router.navigate(['/login']);
return;

}



this.booking.customerId=customer.id!;


const id=Number(
this.route.snapshot.paramMap.get('id')
);



this.booking.flightId=id;


this.sessionToken=
this.session.getSessionToken()
||
this.session.generateSessionToken();



this.loadFlight(id);



this.refreshSubscription=
interval(5000)
.subscribe(()=>{


if(this.showSeatMap){

this.loadSeatMap(this.booking.flightId);

}


});

}



ngOnDestroy(){

this.refreshSubscription?.unsubscribe();

}




getSeatLabel(index:number):string{

return String.fromCharCode(65+index);

}


getFlightImage(): string {
  if (!this.flight) {
    return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85';
  }
  if (this.flight.imageUrl) {
    return this.flight.imageUrl;
  }
  const aviationImages = [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1504198266285-165a17ff13f6?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1521727857535-28d204d3f5b0?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=85'
  ];
  const identifier = `${this.flight.id ?? ''}${this.flight.flightNumber}${this.flight.fromCity}${this.flight.toCity}`;
  const index = [...identifier].reduce((total, char) => total + char.charCodeAt(0), 0) % aviationImages.length;
  return aviationImages[index];
}


loadFlight(id:number){

this.flightService.getById(id)
.subscribe({

next:(data)=>this.flight=data,

error:()=>this.error="Flight not found"

});


}




loadSeatMap(id:number){

this.flightService.getSeatMap(id)
.subscribe({

next:(data)=>this.seatMap=data.seatMap,

error:()=>{}

});

}





updatePassengerCount(){


this.booking.numPassengers =

(this.booking.numAdults ?? 0)+

(this.booking.numChildren ?? 0)+

(this.booking.numInfants ?? 0);



if(this.selectedSeats.length!==this.booking.numPassengers){

this.selectedSeats=[];

}


}




estimatedTotal():number{


if(!this.flight)
return 0;



const price=

this.booking.travelClass==='business'
?
this.flight.businessPrice
:
this.flight.economyPrice;



return (

price*(this.booking.numAdults??0)

+

price*(this.booking.numChildren??0)*0.75

+

price*(this.booking.numInfants??0)*0.10

);


}




proceedToSeatSelection(){


if(!this.booking.passengerNames){

this.error="Enter passenger names";
return;

}


let names=

this.booking.passengerNames
.split(',')
.filter(x=>x.trim());



if(names.length!==this.booking.numPassengers){

this.error=
`Enter exactly ${this.booking.numPassengers} names`;

return;

}



this.showSeatMap=true;

this.loadSeatMap(this.booking.flightId);


}





cancelSeatSelection(){

this.showSeatMap=false;

this.selectedSeats=[];

}




getSeatClass(row:number,col:number):string{


let status=
this.seatMap[row]?.[col];



let seat=
(row+1)+this.getSeatLabel(col);



if(this.selectedSeats.includes(seat))
return 'selected';



if(status==='BOOKED')
return 'booked';



if(status==='LOCKED')
return 'locked';



return '';

}





toggleSeat(row:number,col:number){


let seat=

(row+1)+this.getSeatLabel(col);



if(this.selectedSeats.includes(seat)){

this.selectedSeats.splice(
this.selectedSeats.indexOf(seat),
1
);

return;

}



if(this.selectedSeats.length>=this.booking.numPassengers){

this.seatError="Seat limit reached";
return;

}



this.selectedSeats.push(seat);


}




confirmSeats(){


if(this.selectedSeats.length!==this.booking.numPassengers){

this.seatError="Select required seats";
return;

}



this.booking.seatNumbers=
this.selectedSeats.join(',');



this.showSeatMap=false;

this.showPayment=true;


}




goBackToSeats(){

this.showPayment=false;

this.showSeatMap=true;

}




makePayment(){

this.paymentError='';

if (!this.cardNumber.trim() || !this.cardName.trim() || !this.expiryDate.trim() || !this.cvv.trim()) {
  this.paymentError='Enter all payment details before confirming the booking';
  return;
}

if (!/^[0-9]{12,19}$/.test(this.cardNumber.replace(/\s/g, ''))) {
  this.paymentError='Enter a valid card number';
  return;
}


this.booking.paymentMethod=
this.paymentMethod;



this.bookingService.book(this.booking)
.subscribe({

next:(response)=>{


this.confirmed=response;

this.receipt=response.receipt;

this.showPayment=false;


},


error:(response)=>{

this.paymentError=response?.error?.error || "Booking could not be completed. Please review the flight and passenger details.";

}


});


}




printReceipt(){

window.print();

}



goToEnquiry(){

this.router.navigate(['/enquiry']);

}



goHome(){

this.router.navigate(['/flights']);

}



onClassChange(){}



}
