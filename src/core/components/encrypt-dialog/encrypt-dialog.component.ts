import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { text } from 'stream/consumers';


@Component({
  selector: 'app-encrypt-dialog',
  standalone: true,
  imports: [CommonModule, MatLabel, MatFormField, FormsModule, MatSelectModule],
  templateUrl: './encrypt-dialog.component.html',
  styleUrls: ['./encrypt-dialog.component.scss'],
})
export class EncryptDialogComponent {
inputText: string = "";
encryptedText: string = "";
selectedMethod: any = "";

cifraDeCesar(text: string, shift: number): string {
  return text.split('').map((char) => {
    if (char.match(/[a-zA-Z]/i)) {
      const ajuste = char === char.toLowerCase() ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - ajuste + shift) % 26) + ajuste)
    }
    return char;
  })
  .join('')
}

encrypt() {
if (this.selectedMethod === 'cifra'){
  this.encryptedText = this.cifraDeCesar(this.inputText, 1);
  }
}


copyText() {
  const textArea = document.createElement('textarea');
  textArea.value = this.encryptedText;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  };
}