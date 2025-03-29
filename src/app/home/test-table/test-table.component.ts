import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {RecevabiliteService} from '../../../service/recevabilite.service';
import {NrExecution} from '../../../model/nr-execution';
import {EventSourceService} from '../../../service/event-source.service';

/**
 * @title Table with filtering
 */
@Component({
  selector: 'app-test-table',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './test-table.component.html',
  standalone: true,
  styleUrl: './test-table.component.scss'
})
export class TestTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'status'];
  dataSource: MatTableDataSource<NrExecution>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  url = 'http://localhost:8080/tnr/api/sse';
  options = { withCredentials: false };
  eventNames=  ['refresh']

  constructor(private _recevabiliteService:RecevabiliteService, private eventSourceService :EventSourceService){
  }

  ngOnInit(): void {
    this.eventSourceService.connectToServerSentEvents(this.url, this.options, this.eventNames)
      .subscribe(messageEvent => {
        this.refresh();
      })
    }

  ngAfterViewInit() {
    this.refresh();
  }

  private refresh() {
    console.log("table refreshed")
    this._recevabiliteService.getExecutions()
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

}
