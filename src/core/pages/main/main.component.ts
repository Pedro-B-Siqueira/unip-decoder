import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '@core/components/header/header.component';
import { MainService } from './main.service';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Toast from 'typescript-toastify';

dayjs.extend(timezone);
dayjs.extend(utc);

@Component({
  selector: 'app-main',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  public constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly mainService: MainService
  ) {}

  public async ngOnInit(): Promise<void> {
    const userId = this.route.snapshot.paramMap.get('id');

    if (!userId) {
      this.router.navigate(['']);
      return;
    }

    const user = await this.mainService.getUser(userId);

    if (!user) {
      this.router.navigate(['']);
      return;
    }

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const todayInUserTimeZone = dayjs().tz(userTimeZone).format('YYYY-MM-DD');
    const lastLoginFormatted = dayjs(user.last_login).format('YYYY-MM-DD');

    if (todayInUserTimeZone > lastLoginFormatted) {
      localStorage.removeItem('session');
      new Toast({
        position: 'top-center',
        toastMsg: '❓ Sua sessão expirou! Faça login novamente.',
        pauseOnHover: true,
        autoCloseTime: 3000,
        pauseOnFocusLoss: true,
        type: 'warning',
        theme: 'dark',
      });
    }

    const logged = localStorage.getItem('session') === 'ok';
    if (!logged) this.router.navigate(['']);
  }
}
