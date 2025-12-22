import {AfterViewInit, Component, Inject, inject, ViewChild} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {BackendService} from '../../../service/backend.service';
import {Execution} from '../../../model/execution';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Status} from '../../../model/status';

/**
 * @title Table with filtering
 */
@Component({
  selector: 'app-execution-table',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconButton, MatTooltip, MatIcon],
  templateUrl: './execution-table.component.html',
  standalone: true,
  styleUrl: './execution-table.component.scss'
})
export class ExecutionTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'status', 'start-time', 'end-time', 'action'];
  dataSource: MatTableDataSource<Execution>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // confirmation popup
  public dialog: MatDialog = inject(MatDialog)

  private _backendService: BackendService = inject(BackendService);
  private _router: Router = inject(Router);
  isLooading: boolean = true;

  ngAfterViewInit() {
    this._backendService.getExecutions()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isCompleted(row: Execution): boolean {
    return row.status === Status.COMPLETED || row.status === Status.ERROR || row.status === Status.CANCELLED;
  }

  duplicateExecution(row: Execution) {
    this._backendService.duplicateExecution(row.id)
      .subscribe((id: number) => console.log('execution', id, 'created'))
  }

  copyExecution(row: Execution) {
    this._router.navigate(['create', row.id]);
  }

  isRunning(row: Execution): boolean {
    return row.status == Status.RUNNING
  }

  cancel(row: Execution) {
    this._backendService.cancelExecution(row.id)
      .subscribe((id: number) => console.log('execution', id, 'canceled'))
  }

  isCreated(row: Execution): boolean {
    return row.status == Status.CREATED
  }

  start(row: Execution) {
    this._backendService.startExecution(row.id)
      .subscribe((id: number) => console.log('execution', id, 'started'))
  }

  delete(row: Execution) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: row.id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this._backendService.deleteExecution(row.id)
          .subscribe((id: number) => this.refreshTable())
      }
    });
  }

  refreshTable() {
    this._backendService.getExecutions()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLooading = false
      })
  }
}


@Component({
  selector: 'confirm-dialog.component',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatButton,
    MatDialogClose
  ]
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public execId: any) {
  }

}
