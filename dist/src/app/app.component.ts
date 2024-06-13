import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  valorInput!: string;
  isVisible: boolean = false;
  isVisible2: boolean = true;

  toggleVisibility() {
    this.isVisible = true
    this.isVisible2 = false
  }

  toggleVisibility2() {
    this.isVisible = false
    this.isVisible2 = true
  }


}
