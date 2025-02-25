import {Component, OnInit, signal} from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {TestSelectionComponent} from './test-selection/test-selection.component';
import {TestInfoComponent} from './test-info/test-info.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NrTestExecution} from '../../model/nr-test-execution';

@Component({
  selector: 'app-create',
  imports: [MatTableModule, MatCheckboxModule, TestSelectionComponent, TestInfoComponent, MatExpansionModule, MatButton, RouterLink],
  templateUrl: './create.component.html',
  standalone: true,
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit{

  readonly panel1OpenState = signal(false);
  readonly panel2OpenState = signal(false);
  readonly panel3OpenState = signal(false);
  nrTestExecution:NrTestExecution

  ngOnInit(): void {
    this.nrTestExecution = {}
  }

  handleTitleModified(name: string) {
    this.nrTestExecution.name = name;
    console.log('Title modified: ', this.nrTestExecution);
  }

  handleDescriptionModified(description: string) {
    this.nrTestExecution.description = description;
    console.log('Description modified: ', this.nrTestExecution);
  }
}
