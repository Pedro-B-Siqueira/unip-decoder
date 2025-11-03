import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '@core/components/header/header.component';
import { MainService } from './main.service';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { EncryptDialogComponent } from '@core/components/encrypt-dialog/encrypt-dialog.component';
import { DecryptDialogComponent } from '@core/components/decrypt-dialog/decrypt-dialog.component';
import { MatIconModule } from '@angular/material/icon';

dayjs.extend(timezone);
dayjs.extend(utc);

@Component({
  selector: 'app-main',
  imports: [CommonModule, HeaderComponent, EncryptDialogComponent, DecryptDialogComponent, MatIconModule],
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
      alert('❓ Sua sessão expirou! Faça login novamente.');
    }

    const logged = localStorage.getItem('session') === 'ok';
    if (!logged) this.router.navigate(['']);
  }
}
