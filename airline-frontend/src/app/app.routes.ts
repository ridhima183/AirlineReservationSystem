import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register.component';
import { LoginComponent } from './features/auth/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password.component';
import { FlightSearchComponent } from './features/flights/flight-search.component';
import { BookingComponent } from './features/booking/booking.component';
import { EnquiryComponent } from './features/booking/enquiry.component';
import { AdminComponent } from './features/admin/admin.component';
import { ProfileComponent } from './features/user/profile.component';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { HelpComponent } from './features/help/help.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'flights', component: FlightSearchComponent },
  { path: 'flights/:id/book', component: BookingComponent },
  { path: 'enquiry', component: EnquiryComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
