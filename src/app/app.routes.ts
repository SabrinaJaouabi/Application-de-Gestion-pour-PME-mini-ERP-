import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

import { InvoicesComponent } from './invoices/invoices/invoices.component';
import { AuthGuard } from './guards/auth.guard';
import { ListComponent } from './products/produits-list/list/list.component';
import { AddComponent } from './products/produits-add/add/add.component';
import { EditComponent } from './products/produits-edit/edit/edit.component';
import { InvoicesListComponent } from './invoices/InvoicesList/invoices-list/invoices-list.component';
import { ListComponentcommande } from './orders/commandes-list/list/list.component';
import { AddComponentcommandes } from './orders/commandes-add/add/add.component';
import { EditComponentcommandes } from './orders/commandes-edit/edit/edit.component';
import { OrdersComponent } from './orders/orders-views/orders.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Routes accessibles aux deux rôles (ADMIN et USER)
  // Liste des produits visible par les deux
  { path: 'products', component: ListComponent, canActivate: [AuthGuard] },

  // ADMIN seulement
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'products/add', component: AddComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'products/edit/:id', component: EditComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },

  // Commandes admin
  { path: 'orders', component: ListComponentcommande, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'orders/add', component: AddComponentcommandes, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'orders/edit/:id', component: EditComponentcommandes, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },

  // Factures admin
  { path: 'invoices', component: InvoicesListComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'invoices/view/:id', component: InvoicesComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },

  // USER seulement
  { path: 'my-orders', component: OrdersComponent, canActivate: [AuthGuard], data: { role: 'ROLE_USER' } },
  { path: 'my-invoices', component: InvoicesListComponent, canActivate: [AuthGuard], data: { role: 'ROLE_USER' } },

  { path: '**', redirectTo: '/login' },
];