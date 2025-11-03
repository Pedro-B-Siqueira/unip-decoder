import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { selectedMethod } from '../encrypt-dialog/encrypt-dialog.type';

@Component({
  selector: 'app-decrypt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ClipboardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './decrypt-dialog.component.html',
  styleUrl: './decrypt-dialog.component.scss',
})
export class DecryptDialogComponent {
  public readonly Methods = selectedMethod;
  public readonly MAX_SUGGESTIONS = 6;

  public form: FormGroup;
  public plaintext = '';
  public plaintextCandidates: string[] = [];
  public methodOptions: string[] = Object.values(selectedMethod);

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      method: [null, Validators.required],
      ciphertext: ['', Validators.required],
      shift: [1],
    });

    this.form.get('method')?.valueChanges.subscribe((value) => {
      this.applyCesarValidators(value);
      this.plaintext = '';
      this.plaintextCandidates = [];
    });

    this.applyCesarValidators(this.form.get('method')?.value);
  }

  private applyCesarValidators(method: string) {
    const ctrl = this.form.get('shift');
    if (method === this.Methods.CESAR) ctrl?.setValidators([Validators.required]);
    else ctrl?.setValidators([]);
    ctrl?.updateValueAndValidity();
  }

  private posMod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }

  private async decryptCesar(text: string, shift: number): Promise<string> {
    const k = this.posMod(shift, 26);
    return text
      .split('')
      .map((c) => {
        if (/[a-zA-Z]/.test(c)) {
          const base = c === c.toLowerCase() ? 97 : 65;
          const pos = c.charCodeAt(0) - base;
          return String.fromCharCode(this.posMod(pos - k, 26) + base);
        }
        return c;
      })
      .join('');
  }

  private async reverseText(text: string): Promise<string> {
    return text.split('').reverse().join('');
  }

  private decodeNumericChunk(seq: string, upper = false, max = this.MAX_SUGGESTIONS): string[] {
    const base = upper ? 64 : 96;
    const out: string[] = [];
    const n = seq.length;

    const dfs = (i: number, acc: number[], preferTwo = true) => {
      if (out.length >= max) return;
      if (i === n) {
        out.push(String.fromCharCode(...acc.map((v) => base + v)));
        return;
      }
      if (seq[i] === '0') return;

      const two = () => {
        if (i + 1 < n) {
          const v = parseInt(seq.slice(i, i + 2), 10);
          if (v >= 10 && v <= 26) dfs(i + 2, [...acc, v], preferTwo);
        }
      };
      const one = () => {
        const v = parseInt(seq[i], 10);
        if (v >= 1 && v <= 9) dfs(i + 1, [...acc, v], preferTwo);
      };

      if (preferTwo) { two(); one(); } else { one(); two(); }
    };

    dfs(0, [], true);
    if (out.length < max) dfs(0, [], false);

    return Array.from(new Set(out)).slice(0, max).map((s) => s.toLowerCase());
    }

  private decryptNumericSubstitution(text: string, max = this.MAX_SUGGESTIONS): string[] {
    const parts: Array<{ type: 'num' | 'txt'; v: string }> = [];
    let buf = '';
    let isNum = /\d/.test(text[0] ?? '');

    for (const ch of text) {
      const d = /\d/.test(ch);
      if (d === isNum) buf += ch;
      else {
        parts.push({ type: isNum ? 'num' : 'txt', v: buf });
        buf = ch;
        isNum = d;
      }
    }
    if (buf) parts.push({ type: isNum ? 'num' : 'txt', v: buf });

    let acc: string[] = [''];

    for (const p of parts) {
      if (p.type === 'txt') {
        acc = acc.map((a) => a + p.v);
        continue;
      }

      const choices = this.decodeNumericChunk(p.v, false, max);
      const next: string[] = [];
      for (const a of acc) {
        for (const c of choices) {
          next.push(a + c);
          if (next.length >= max) break;
        }
        if (next.length >= max) break;
      }
      acc = next.length ? next : acc;
    }

    return acc.slice(0, max);
  }

  public async onDecrypt(): Promise<void> {
    this.plaintext = '';
    this.plaintextCandidates = [];

    const method = this.form.get('method')?.value;
    const text = this.form.get('ciphertext')?.value ?? '';

    if (method === this.Methods.CESAR) {
      const shift = this.form.get('shift')?.value ?? 1;
      this.plaintext = await this.decryptCesar(text, shift);
    } else if (method === this.Methods.INVSERSO) {
      this.plaintext = await this.reverseText(text);
    } else if (method === this.Methods.SUBSTITUICAO) {
      this.plaintextCandidates = this.decryptNumericSubstitution(text, this.MAX_SUGGESTIONS);
      this.plaintext = this.plaintextCandidates[0] ?? '';
    }
  }

  public notifyCopied(): void {
    alert('🎉 Texto descriptografado copiado!');
  }
}
