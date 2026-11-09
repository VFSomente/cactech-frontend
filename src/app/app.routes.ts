import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { ProductComponent } from './pages/product/product.component';
import { CartComponent } from './pages/cart/cart.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { authGuard } from './pages/services/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: MainComponent, title: 'CacTech — Hardware, PCs e Monitores' },
  { path: 'login', component: LoginComponent, title: 'Entrar — CacTech' },
  { path: 'esqueci-senha', component: ForgotPasswordComponent, title: 'Esqueci a senha — CacTech' },
  { path: 'redefinir-senha', component: ResetPasswordComponent, title: 'Redefinir senha — CacTech' },
  { path: 'product/:id', component: ProductComponent, title: 'Produto — CacTech' },
  { path: 'cart', component: CartComponent, title: 'Carrinho — CacTech' },
  { path: 'favorites', component: FavoritesComponent, title: 'Favoritos — CacTech' },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard], title: 'Finalizar compra — CacTech' },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], title: 'Minha conta — CacTech' },
  { path: 'pedidos', component: OrdersComponent, canActivate: [authGuard], title: 'Meus pedidos — CacTech' }
];
