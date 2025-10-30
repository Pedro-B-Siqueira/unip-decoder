import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UsersServiceApi } from '@api/users/users.service';
import { CommonModule } from '@angular/common';
import { SignDialogComponent } from '@core/components/sign-dialog/sign-dialog.component';
import { RegisterDialogComponent } from '@core/components/register-dialog/register-dialog.component';
import { SignPageService } from './sign-page.service';
import { Router } from '@angular/router';
import Toast from 'typescript-toastify';

@Component({
  selector: 'app-sign-page',
  imports: [CommonModule, SignDialogComponent, RegisterDialogComponent],
  templateUrl: './sign-page.component.html',
  styleUrl: './sign-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignPageComponent {
  public status: string | null = null;

  public constructor(
    private readonly usersServiceApi: UsersServiceApi,
    private readonly signPageService: SignPageService,
    private readonly router: Router
  ) {}

  public getAllUsers(): any {
    return this.usersServiceApi.search();
  }

  public async login(userId: string): Promise<void> {
    if (userId) {
      await this.signPageService.updateLastLogin(userId);
      localStorage.setItem('session', 'ok');
      new Toast({
        position: 'top-center',
        toastMsg: '🎉 O login foi um sucesso! Seja bem-vindo!',
        pauseOnHover: true,
        autoCloseTime: 2500,
        pauseOnFocusLoss: true,
        type: 'success',
        theme: 'light',
      });
      this.router.navigate([userId + '/central']);
    }
  }

  public async changeStatus(response: string) {
    this.status = response;
  }
}
