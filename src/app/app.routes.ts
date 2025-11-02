import { Routes } from '@angular/router'
import { LoginComponent } from '../app/pages/login/login.component';
import { MainComponent } from './pages/main/main.component';

export const routes: Routes = [
    {path: "", component: MainComponent},
    {path: "login", component: LoginComponent}
];

