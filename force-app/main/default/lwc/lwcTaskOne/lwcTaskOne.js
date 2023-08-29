import { LightningElement,track,api } from 'lwc';
//Import apex method 
import {deleteRecord} from 'lightning/uiRecordApi';
//import { refreshApex } from '@salesforce/apex';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Case from '@salesforce/schema/Case'
import CaseNumber from '@salesforce/schema/Case.CaseNumber'

import AccountName from '@salesforce/schema/Case.AccountId'
import CaseOrigin from '@salesforce/schema/Case.Origin'

import Priority from '@salesforce/schema/Case.Priority'

import CaseReason from '@salesforce/schema/Case.Reason'

import Status from '@salesforce/schema/Case.Status'
import Type from '@salesforce/schema/Case.Type'

import Subject from '@salesforce/schema/Case.Subject'

import fetchCases from '@salesforce/apex/LwcTaskClass.fetchCases';

export default class LwcTaskOne extends LightningElement {
@track  recordId ;
@track rowData;
@track isCaseEdit= false;
@track isLandingPage = true;
@track isCaseDetailPage = false;
@track isCaseCreate = false;
@track fields=[CaseNumber,CaseOrigin,Priority,CaseReason,Status,Type,AccountName,Subject];
@track error;
  // JS Properties 
 pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
 @track records; //All records available in the data table
 @track columns; //columns information available in the data table
totalRecords = 0; //Total no.of records
@track pageSize; //No.of records to be displayed per page
@track totalPages; //Total no.of pages
@track pageNumber = 1; //Page number    
@track recordsToDisplay = []; //Records to be displayed on the page
    

    get DisableFirst() {
        return this.pageNumber == 1;
    }

    get DisableLast() {
        return this.pageNumber == this.totalPages;
    }
   
    // connectedCallback method called when the element is inserted into a document
    connectedCallback() {
        // set datatable columns info
       
        this.columns = [
            { label: 'Case Number',  fieldName: 'CaseNumber'},
            { label: 'Priority', fieldName: 'Priority'},
            { label: 'Origin', fieldName: 'Origin' },
            { label: 'Type',fieldName: 'Type'},
            { label: 'Status',fieldName: 'Status'},
            { label: 'Subject',fieldName: 'Subject'},
            { type:'button',typeAttributes:{label:'view Details',name:'Edit',variant:'brand'}}
        ];

        // fetch Case records from apex method 
        fetchCases()
            .then((result) => {
                if (result != null) {
                    console.log('RESULT--> ' + JSON.stringify(result));
                    this.records = result;
                    this.error = undefined;
                    this.totalRecords = result.length; // update total records count                 
                    this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
                    this.paginationHelper(); // call helper menthod to update pagination logic 
                }
            })
            .catch((error) => {
                console.log('error while fetch Cases: ' + JSON.stringify(error));
                this.records= undefined;
            });
    }

    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        if( this.pageSize!= null){
            this.paginationHelper();
        }
       
    }

    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }

    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }

    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }

    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }


    // JS function to handel pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }

        // set records to display on current page 
           // Ex:(i=(pageNumber=1-1)*pageSize=5; i<(pageNumber=1*pageSize=5); i++)
               // (i=0; i<5; i++)
               // if page number =2 and page size = 10 it will start i=10; i<20 ; i++)
               // in the page 1 in this scenario it will left the 10 records like wise..(i=0; i<10; i++)
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            //it will these record into the recordsToDisplay
            this.recordsToDisplay.push(this.records[i]);
            console.log("Records to display====>"+JSON.stringify(this.recordsToDisplay));
        }
    }
    // on selection of row in landing page
    handleRowSelection(event){
        const selectedRows = event.detail.row;
    const rowData = JSON.parse(JSON.stringify(selectedRows));
   
    this.rowData = rowData;
    console.log("Rowdata"+ JSON.stringify(this.rowData));
   
    // this.isLandingPage = false;
   
    this.isCaseDetailPage = true;
    this.isLandingPage = false;
   
    }
    // for creating the Create case
    handleCaseCreation(){
     
     this.isCaseCreate = true;
       
    }
    // functionality after record is successfully created
    handleSuccess(event){ 
        this.recordId = event.detail.id;
          console.log("recordId: " + this.recordId);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: ' Record Created Successfully: '+this.recordId,
                    variant: 'success'
                })
            );
             
            this.isCaseCreate = false;;
           setTimeout(() =>{
            window.location.reload();
           },1500)
           
          // refreshApex(this.records);
          this.isLandingPage=true;
     }
     // cancelling the create case page
     hanleCaseCancel(){
        console.log("Cancelling Create Case")
        this.isCaseCreate = false;
        this.isLandingPage=true;
     }
     // back to landing page from detail page
    handleBackToMainPage(){
        this.isCaseDetailPage=false;
        this.isLandingPage = true;
       
    }
    // (Cancelling the page)closing the case record page
    handleDialogClose(){
        this.isCaseCreate=false;
        this.isLandingPage = true;
    }
    // for deleting the Case record
     handleDeleteCaseRecord(event) {
      this.recordId = event.detail.id;
        console.log("deleteCaseRecord"+ this.recordId);
         deleteRecord(this.rowData.Id)
             .then(() => {
                  this.dispatchEvent(
                      new ShowToastEvent({
                          title: 'Success',
                          message: ' Record deleted Succseefully: ' +this.rowData.Id,
                          variant: 'success'
                      })
                  );
                   
                  this.isCaseDetailPage=false;
                  
                  setTimeout(() =>{
                    window.location.reload();
                   },1500)
                // refreshApex(this.records);
                this.isLandingPage=true;
             })
             .catch(error => {
                 this.dispatchEvent(
                    new ShowToastEvent({
                         title: 'Error deleting record',
                         message: error.body.message,
                         variant: 'error'
                     })
                  );
             });
    // 
}
// show the page for edit case 
handleEditCaseRecord(){
    console.log("Edit Case Record")
   
    this.isCaseDetailPage = false;
    this.isCaseEdit=true;  
}
// Cancelling the edit case 
hanleCancel(){
    console.log("edit case record cancelled");
    this.isCaseEdit=false; 
    this.isCaseDetailPage = true; 
    
}
// edit is submit close this page
hanleSubmit(){
 this.isCaseEdit=false;
}
// functionality after the edit case
handleEditSuccess(event){
    this.recordId = event.detail.id;
   this.dispatchEvent(
    new ShowToastEvent({
        title: 'Success',
        message: ' Record Updated Successfully: '+this.recordId,
        variant: 'success'
    })
);
this.isCaseEdit=false;
setTimeout(() =>{
    window.location.reload();
   },1500)
   this.isLandingPage = true; 
}

}