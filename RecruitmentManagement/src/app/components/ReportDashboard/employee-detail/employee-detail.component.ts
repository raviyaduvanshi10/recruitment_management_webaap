import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { WorkAllocationService } from '../../../services/work-allocation.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  providers: [DatePipe]
})
export class EmployeeDetailComponent implements OnInit {

  _employeeId: string;
  // employee: Employee;
  employee = [];
  openings: any = [];
  searchText;
  searchText1;
  isLoading = true;
  dataSource = [];
  recruiterId;
  workAllocation: any = [];
  slot: any = [];
  assign: any = [];
  slots = ["09:30AM-11:00AM", "11:00AM-01:00AM", "02:00AM-04:00AM", "04:00AM-06:30AM"]
  // sourcePath = "https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf";
  // fileName = "sample.pdf";
  dataSource1: any = [];
  resumeDoc;
  constructor(private route: ActivatedRoute, private employeeService: EmployeeService, private _location: Location,
    private workAllocationService: WorkAllocationService, private datePipe: DatePipe, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.searchText = this.datePipe.transform(new Date(), 'MMMM, yyyy');
    this._employeeId = this.route.snapshot.params['_id'];
    console.log(this._employeeId);
    // this.getEmployee();
    this.getAssignedWork();
  }

  dateFormat() {
    // this.searchText = this.datePipe.transform(this.searchText1, 'longDate');
    this.searchText = this.datePipe.transform(this.searchText1, 'MMMM, yyyy');
    this.getAssignedWork();
  }

  async getEmployee() {
    this.isLoading = true;
    this.employeeService.getEmployee(this._employeeId).subscribe(data => {
      this.dataSource.push(data);
      this.isLoading = false;
      this.employee.push(data);
      console.log(data);
      const linkSource = `data:application/pdf;base64,${data.docFile_tag}`;
      const downloadLink = document.createElement("a");
      const fileName = "abc.docx";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();

    });
  }
  async getAssignedWork() {
    if (this.searchText == null) {
      alert("Please select valid date. Thankyou !");
      return;
    }
    this.isLoading = true;
    await new Promise(resolve => setTimeout(resolve, 2000));
    var _employeeId = JSON.parse(localStorage.getItem("approvedCredential"))._employeeId;
    console.log(_employeeId);
    this.workAllocationService.getAlocatedList(_employeeId + this.searchText).subscribe(data => {
      this.dataSource1 = data;
      console.log(data);
      this.isLoading = false;
    });
  }


  employeeId(data) {
    const linkSource = `data:application/pdf;base64,${data.docFile_tag}`;
    const downloadLink = document.createElement("a");
    const fileName = "abc.docx";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  anotherArray = this.assign;
  filterListCareUnit(val) {
    console.log(val);
    this.assign = this.anotherArray.filter((unit) => unit.label.indexOf(val) > -1);
  }

  back() {
    this._location.back();
  }

  return() {
    var openingSampleId = document.getElementById("openingSample")
    openingSampleId.style.display = "none"
    var openingListId = document.getElementById("openingList")
    openingListId.style.display = "block"
  }

  displayDoc(role) {
    var openingListId = document.getElementById("openingList")
    openingListId.style.display = "none"
    var openingSampleId = document.getElementById("openingSample")
    openingSampleId.style.display = "block"

    this.employeeService.getDocs(role).subscribe(data => {
      console.log(data);
      let ObjectUrl = URL.createObjectURL(data);
      this.resumeDoc = this.sanitizer.bypassSecurityTrustResourceUrl(ObjectUrl);
    },
      err => console.log(err));
  }

}
