import { Routes } from '@angular/router'
import { LoginComponent } from '../app/pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { ProductComponent } from './pages/product/product.component';
import { CartComponent } from './pages/cart/cart.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

export const routes: Routes = [
    {path: "", component: MainComponent},
    {path: "login", component: LoginComponent},
    {path: "product/:id", component: ProductComponent},
    { path: 'cart', component: CartComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'checkout', component: CheckoutComponent}



];

