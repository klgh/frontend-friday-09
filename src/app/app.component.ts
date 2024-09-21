import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class AppComponent {
  ageForm: FormGroup;
  age: { years: number; months: number; days: number } | null = null;

  constructor(private fb: FormBuilder) {
    this.ageForm = this.fb.group({
      day: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
      month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      year: [
        '',
        [Validators.required, Validators.max(new Date().getFullYear())],
      ],
    });
  }

  /**
   * Calculates the age based on the date provided in the ageForm.
   *
   * This method performs the following steps:
   * 1. Validates the form to ensure it is not invalid.
   * 2. Extracts the day, month, and year from the form values.
   * 3. Creates a birthDate object and compares it with the current date.
   * 4. If the birthDate is in the future or invalid, sets an error on the form.
   * 5. Calculates the difference in years, months, and days between the current date and the birthDate.
   * 6. Adjusts the months and days if they are negative.
   * 7. Updates the age property with the calculated years, months, and days.
   *
   * @returns {void}
   */
  calculateAge() {
    if (this.ageForm.invalid) {
      return;
    }

    const { day, month, year } = this.ageForm.value;

    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    if (birthDate > currentDate || isNaN(birthDate.getTime())) {
      this.ageForm.setErrors({ invalidDate: true });
      return;
    }

    // Check if birthDate is in the future
    if (birthDate > currentDate) {
      this.age = { years: 0, months: 0, days: 0 };
    } else {
      let years = currentDate.getFullYear() - birthDate.getFullYear();
      let months = currentDate.getMonth() - birthDate.getMonth();
      let days = currentDate.getDate() - birthDate.getDate();

      if (days < 0) {
        months--;
        days += new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        ).getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      this.age = { years, months, days };
    }

    if (this.age.months < 0) {
      this.age.years--;
      this.age.months += 12;
    }

    this.age = {
      years: this.age.years,
      months: this.age.months,
      days: this.age.days,
    };
  }
}
