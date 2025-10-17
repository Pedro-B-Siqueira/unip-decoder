import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { selectedMethod } from './encrypt-dialog.type';
import { ClipboardModule } from '@angular/cdk/clipboard';
import Toast from 'typescript-toastify';

@Component({
  selector: 'app-encrypt-dialog',
  standalone: true,
  imports: [CommonModule, MatLabel, MatFormField, FormsModule, MatSelectModule, ClipboardModule],
  templateUrl: './encrypt-dialog.component.html',
  styleUrls: ['./encrypt-dialog.component.scss'],
})
export class EncryptDialogComponent {
  public inputText: string = '';
  public selectedMethod: selectedMethod | null = null;
  public encryptedText: string = '';

  public constructor() {}

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
    if (this.selectedMethod === selectedMethod.CESAR) {
      this.encryptedText = await this.cifraDeCesar(this.inputText, 1);
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
