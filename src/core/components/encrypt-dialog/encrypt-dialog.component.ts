import { CommonModule } from '@angular/common';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { selectedMethod } from './encrypt-dialog.type';
import { ClipboardModule } from '@angular/cdk/clipboard';
import Toast from 'typescript-toastify';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-encrypt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatLabel,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    ClipboardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './encrypt-dialog.component.html',
  styleUrls: ['./encrypt-dialog.component.scss'],
})
export class EncryptDialogComponent {
  public encryptForm: FormGroup;
  public inputText: string = '';
  public encryptedText: string = '';
  public selectOptions: string[] = Object.values(selectedMethod);

  public constructor(private readonly formBuilder: FormBuilder) {
    this.encryptForm = this.formBuilder.group({
      selectedMethod: [null, Validators.required],
      commonText: ['', Validators.required],
      jumpLetters: [1],
    });
    this.encryptForm.get('selectedMethod')?.valueChanges.subscribe((value) => {
      this.setCesarValidators(value);
    });

    this.setCesarValidators(this.encryptForm.get('selectedMethod')?.value);
  }

  private setCesarValidators(cryptographyType: string) {
    const jumpLettersControl = this.encryptForm.get('jumpLetters');

    if (cryptographyType === 'Cesar') {
      jumpLettersControl?.setValidators([Validators.required]);
    } else {
      jumpLettersControl?.setValidators([]);
    }

    jumpLettersControl?.updateValueAndValidity();
  }

  private async cifraDeCesar(text: string, mudanca: number): Promise<string> {
    return text
      .split('')
      .map((caracter) => {
        if (caracter.match(/[a-zA-Z]/i)) {
          const ajuste = caracter === caracter.toLowerCase() ? 97 : 65;
          return String.fromCharCode(((caracter.charCodeAt(0) - ajuste + mudanca) % 26) + ajuste);
        }
        return caracter;
      })
      .join('');
  }

  public async encrypt(): Promise<void> {
    if (this.encryptForm.get('selectedMethod')?.value === selectedMethod.CESAR) {
      this.encryptedText = await this.cifraDeCesar(
        this.encryptForm.get('commonText')?.value,
        this.encryptForm.get('jumpLetters')?.value ?? 1
      );
    }
  }

  public copyText(): void {
    new Toast({
      position: 'bottom-right',
      toastMsg: '🎉 Texto criptografado copiado!',
      pauseOnHover: true,
      autoCloseTime: 1500,
      pauseOnFocusLoss: true,
      type: 'info',
      theme: 'light',
    });
  }
}
