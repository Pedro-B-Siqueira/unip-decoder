import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
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
import { MatRadioModule } from '@angular/material/radio';
import { Subject } from 'rxjs';
import { RegisterDialogService } from './register-dialog.service';
import { Users } from '@core/api/users/users.type';

@Component({
  selector: 'app-register-dialog',
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
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterDialogComponent implements OnDestroy, OnInit {
  @Output() public readonly signType: EventEmitter<string> = new EventEmitter();

  public registerForm: FormGroup;
  public hidePassword = signal<boolean>(true);
  private destroy$: Subject<void> = new Subject();

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly registerDialogService: RegisterDialogService
  ) {
    this.registerForm = this.formBuilder.group({
      username: [null, Validators.required],
      email: [null, [Validators.email, Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).+$'),
        ],
      ],
    });
  }

  ngOnInit(): void {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl) {
      passwordControl.markAsTouched();
      passwordControl.updateValueAndValidity();
    }
  }

  public async ngOnDestroy(): Promise<void> {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public passwordHasUppercase(): boolean {
    return /[A-Z]/.test(this.registerForm.get('password')?.value);
  }

  public passwordHasLowercase(): boolean {
    return /[a-z]/.test(this.registerForm.get('password')?.value);
  }

  public passwordHasNumber(): boolean {
    return /\d/.test(this.registerForm.get('password')?.value);
  }

  public passwordHasSpecialChar(): boolean {
    return /[\w\s]/.test(this.registerForm.get('password')?.value);
  }

  public async save() {
    if (this.registerForm.valid) {
      try {
        const migration = await this.registerDialogService.save(
          this.registerForm.value as unknown as Users
        );

        if (migration) {
          this.signType.emit('');
          alert(
            'Sua conta foi cadastrada! Use seus dados para fazer login quando entrar novamente.'
          );
          return;
        } else {
          console.error('Erro desconhecido ao salvar o usuário.');
          alert('Ocorreu um erro ao tentar cadastrar o usuário. Tente novamente.');
        }
      } catch (error) {
        console.error('Houve um erro ao fazer o cadastro:', error);
        alert('Ocorreu um erro ao tentar cadastrar o usuário. Tente novamente.');
      }
    } else {
      console.error('Formulário inválido.');
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  public async goBack() {
    this.signType.emit('');
  }
}
