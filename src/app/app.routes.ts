import { Routes } from '@angular/router';
import { MainComponent } from '@core/pages/main/main.component';
import { SignPageComponent } from '@core/pages/sign-page/sign-page.component';

export const routes: Routes = [
    {
        path: "",
        component: SignPageComponent
    },
    {
        path: ":id/central",
        component: MainComponent
    }
];

