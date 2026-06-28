import { AfterViewInit, Component, DestroyRef, Inject, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { BackendService } from '../../../service/backend.service';
import { Execution } from '../../../model/execution';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { Status } from '../../../model/status';
import { EventBusService } from '../../common/service/event-bus.service';
import { ExecutionLog } from '../../../model/execution-log';
import { EventType } from '../../../model/event-type';

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
  isLoading = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dialog: MatDialog = inject(MatDialog);

  private readonly _backendService = inject(BackendService);
  private readonly _router = inject(Router);
  private readonly _eventBus = inject(EventBusService);
  private readonly _destroyRef = inject(DestroyRef);

  ngAfterViewInit() {
    this.refreshTable();

    this._eventBus.on$<ExecutionLog>(EventType.executionCreated)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(log => {
        if (log?.execution) {
          this.addRowIfNotExists(log.execution);
        }
      });

    this._eventBus.on$<ExecutionLog>(EventType.executionDeleted)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(log => this.deleteRow(log.execution));

    this._eventBus.on$<ExecutionLog>(EventType.executionUpdated)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(log => this.updateRow(log.execution));
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

  isRunning(row: Execution): boolean {
    return row.status === Status.RUNNING;
  }

  isCreated(row: Execution): boolean {
    return row.status === Status.CREATED;
  }

  duplicateExecution(row: Execution) {
    this._backendService.duplicateExecution(row.id)
      .subscribe((id: number) => console.log('execution', id, 'created'));
  }

  copyExecution(row: Execution) {
    this._router.navigate(['execution', row.id]);
  }

  cancel(row: Execution) {
    this._backendService.cancelExecution(row.id)
      .subscribe((id: number) => console.log('execution', id, 'canceled'));
  }

  start(row: Execution) {
    this._backendService.startExecution(row.id)
      .subscribe((id: number) => console.log('execution', id, 'started'));
  }

  delete(row: Execution) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: row.id });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._backendService.deleteExecution(row.id)
          .subscribe(() => this.refreshTable());
      }
    });
  }

  refreshTable() {
    this._backendService.getExecutions()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      });
  }

  private addRowIfNotExists(execution: Execution) {
    const data = this.dataSource.data;
    if (data.every(item => item.id !== execution.id)) {
      data.unshift(execution);
      this.resetDataSource(data);
    }
  }

  private deleteRow(execution: Execution) {
    this.resetDataSource(this.dataSource.data.filter(item => item.id !== execution.id));
  }

  private updateRow(execution: Execution) {
    const data = this.dataSource.data;
    const index = data.findIndex(item => item.id === execution.id);
    if (index >= 0) {
      data[index] = execution;
      this.resetDataSource(data);
    }
  }

  private resetDataSource(data: Execution[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public execId: any
  ) {}
}
