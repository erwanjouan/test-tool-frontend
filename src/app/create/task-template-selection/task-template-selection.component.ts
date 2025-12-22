import {Component, inject, input, Input, OnChanges, OnInit, output, signal, SimpleChanges} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionChange, SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {BackendService} from '../../../service/backend.service';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {TaskTemplate} from '../../../model/task-template';
import {Execution} from '../../../model/execution';

@Component({
  selector: 'app-task-template-selection',
  imports: [
    MatTableModule, MatCheckboxModule, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle
  ],
  templateUrl: './task-template-selection.component.html',
  standalone: true,
  styleUrl: './task-template-selection.component.scss'
})
export class TaskTemplateSelectionComponent implements OnInit, OnChanges {
  //
  categorySignal = input('')
  @Input()
  execution: Execution;
  readonly panelOpenState = signal(false);

  //
  displayedColumns: string[] = ['select', 'title', 'content'];
  dataSource: MatTableDataSource<TaskTemplate>
  selection = new SelectionModel<TaskTemplate>(true, []);
  onSelectionChange = output<SelectionChange<TaskTemplate>>({alias: 'selectionChanged'});

  private _backendService: BackendService = inject(BackendService);

  ngOnInit(): void {
    this._backendService.getTasksTemplateByCategory(this.categorySignal())
      .subscribe(data => this.dataSource = new MatTableDataSource<TaskTemplate>(data))
    this.selection.changed.subscribe(s => this.onSelectionChange.emit(s));
  }

  ngOnChanges(changes: SimpleChanges): void {
    let change = changes['execution'];
    if (change != null && !change.isFirstChange()) {
      let execution = changes['execution'].currentValue;
      this.applyTaskTemplateSelection(execution);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource === undefined ? 0 : this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: TaskTemplate): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row `;
  }

  private applyTaskTemplateSelection(execution: Execution) {
    if (this.dataSource != null && (this.dataSource.data != null || this.dataSource.data != undefined)) {
      for (let taskTemplate of this.dataSource.data) {
        let taskTemplateId = taskTemplate.id;
        let tasks = execution.tasks;
        if (tasks != null || tasks != undefined) {
          for (let selectedTask of tasks) {
            if (taskTemplateId === selectedTask.taskTemplate.id) {
              this.selection.select(taskTemplate);
            }
          }
        }
      }
    }
  }
}
