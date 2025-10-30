import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@pipes/pipes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SignDialogService } from './sign-dialog.service';
import { MatRadioModule } from '@angular/material/radio';
import { Subject } from 'rxjs';

@Component({
  selector: 'sign-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    PipesModule,
  ],
  templateUrl: './sign-dialog.component.html',
  styleUrl: './sign-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignDialogComponent implements OnDestroy {
  @Output() public readonly signType: EventEmitter<string> = new EventEmitter();
  @Output() public readonly userId: EventEmitter<string> = new EventEmitter();

  public signForm: FormGroup;
  public hidePassword = signal<boolean>(true);
  private destroy$: Subject<void> = new Subject();

  public constructor(
    private readonly signDialogService: SignDialogService,
    private readonly formBuilder: FormBuilder
  ) {
    this.signForm = this.formBuilder.group({
      loginMethod: ['username'],
      username: [null, Validators.required],
      email: [null, [Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
    this.signForm.get('loginMethod')?.valueChanges.subscribe((value) => {
      this.setEmailValidators(value);
    });

    this.setEmailValidators(this.signForm.get('loginMethod')?.value);
  }

  private setEmailValidators(loginMethod: string) {
    const emailControl = this.signForm.get('email');
    const usernameControl = this.signForm.get('username');

    if (loginMethod === 'email') {
      emailControl?.setValidators([Validators.email, Validators.required]);
      usernameControl?.setValidators(null);
    } else {
      emailControl?.setValidators([Validators.email]);
      usernameControl?.setValidators([Validators.required]);
    }

    emailControl?.updateValueAndValidity();
    usernameControl?.updateValueAndValidity();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public async login() {
    const username = this.signForm.get('username')?.value;
    const email = this.signForm.get('email')?.value;
    const password = this.signForm.get('password')?.value;
    const loginMethod = this.signForm.get('loginMethod')?.value;

    let result;

    if (loginMethod === 'username') {
      result = await this.signDialogService.getUser({ username, password });
    } else {
      result = await this.signDialogService.getUser({ email, password });
    }

    if (result) {
      this.userId.emit(result.id);
    }
    return;
  }

  public async register() {
    this.signType.emit('register');
  }
}
