import { LightningElement ,wire,track} from 'lwc';
import TotalPatients from '@salesforce/apex/DoctorsFetchClass.listOfPatients';

export default class PatientsList extends LightningElement {
    
    
         
     
        //c/doctorAddReviewForm @wire(TotalPatients)
         //patients;
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
    
            { label: 'Patient No', fieldName: 'Name' },
            { label: 'Name', fieldName: 'Name_Of_The_Patient__c' },
             { label: 'Age', fieldName: 'Age__c' },
            { label: 'Gender', fieldName: 'Sex__c' },
            { label: 'Height(inches)', fieldName: 'Height_inches__c' },
            { label: 'Weight(kgs)', fieldName: 'Weight_Kgs__c' },
            { label: 'Diagnosed In', fieldName: 'Diagnosed__c' },
            { label: 'Address', fieldName: 'Address__c' },
            { label: 'Phone', fieldName: 'Phone__c', type: 'phone' },
            { label: 'Email', fieldName: 'Email__c', type: 'email' },
            { label: 'Medical History', fieldName: 'Medical_History__c' },
            { label: 'Insurance information', fieldName: 'Insurance_Information__c' },
       
           // { type:'button',typeAttributes:{label:'view Details',name:'Edit',variant:'brand'}}
        ];

        // fetch Case records from apex method 
        TotalPatients()
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
}