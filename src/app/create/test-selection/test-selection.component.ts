import {Component, effect, input, Input, OnInit, output} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {NrTest} from '../../../model/nr-test';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {RecevabiliteService} from '../../../service/recevabilite.service';

@Component({
  selector: 'app-test-selection',
  imports: [
    MatTableModule, MatCheckboxModule
  ],
  templateUrl: './test-selection.component.html',
  standalone: true,
  styleUrl: './test-selection.component.scss'
})
export class TestSelectionComponent implements OnInit {
  //
  prioriteSignal = input(0)
  //
  displayedColumns: string[] = ['select', 'reference', 'titre', 'description'];
  dataSource: MatTableDataSource<NrTest>
  selection = new SelectionModel<NrTest>(true, []);
  onSelectionChange = output<NrTest[]>({alias: 'selectionChanged'});

  constructor(private recevabiliteService: RecevabiliteService) {
  }

  ngOnInit(): void {
    this.recevabiliteService.getNrTestsByPriorite(this.prioriteSignal())
      .subscribe(data => this.dataSource = new MatTableDataSource<NrTest>(data))
    this.selection.changed.subscribe(s => this.onSelectionChange.emit(s.source.selected));
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
  checkboxLabel(row?: NrTest): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row `;
  }
}
