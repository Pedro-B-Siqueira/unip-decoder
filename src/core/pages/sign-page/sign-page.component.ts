import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UsersServiceApi } from '@api/users/users.service';
import { CommonModule } from '@angular/common';
import { SignDialogComponent } from '@core/components/sign-dialog/sign-dialog.component';
import { RegisterDialogComponent } from '@core/components/register-dialog/register-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-page',
  imports: [
    CommonModule,
    SignDialogComponent,
    RegisterDialogComponent,
  ],
  templateUrl: './sign-page.component.html',
  styleUrl: './sign-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignPageComponent {
  public status: string| null = null

  public constructor(
    private readonly usersServiceApi: UsersServiceApi,
    private readonly router: Router,
  ) {}

  public getAllUsers(): any {
    return this.usersServiceApi.search()
  }

  public async changeStatus(response: string) {
    this.status = response
    if (this.status === 'success') {
      alert("Bem-vindo ao sistema!")
      this.router.navigate(['/central'])
    }
  }
}

