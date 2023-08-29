import { LightningElement,track,wire,api } from 'lwc';
import totalAppointments from '@salesforce/apex/DoctorsFetchClass.listOfAppointments';
import getDoctor from '@salesforce/apex/DoctorsFetchClass.getDoctor';
import updateAppointments from '@salesforce/apex/CreateAppointment.updateAppointments';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation'
import { refreshApex } from '@salesforce/apex';
const COLS =[
{ label: 'Appointment No', fieldName: 'Name' },
{ label: 'AppointmentDateandTime', fieldName: 'AppointmentDateandTime__c' },

 { label: 'Doctor', fieldName: 'Doctor__c' },
{ label: 'Patient ', fieldName: 'Patient__c' },

{ label: 'Status', fieldName: 'Status__c' , editable: true },
{ type:'button',typeAttributes:{label:'Patient Details',name:'Edit',variant:'brand'}}
];

export default class TotalAppointments extends NavigationMixin(LightningElement) {
    @track error
    @api recData; 
   @track columns=COLS; 
   draftValues = [];
   @track sData; 
   @track doctor;
@api doctorName;
@track wiredResult;
@track confirmed;
 @track Active;
@track Completed;
@track rowData;
@track confirmedcount;
@track ActiveCount;
@track completedCount;
  
//doctor
@wire (getDoctor,{doctorname:'$doctorName'})
   wiredDoctors
   //(data,error) {
     
//      if (data) {
//          this.doctor =JSON.parse(JSON.stringify(data));
//          console.log("The doctor data:"+JSON.stringify(this.doctor));
//          //console.log("name of the doctor:"+JSON.stringify(this.doctor.Name));
//          this.error = undefined;
//     } else if (error) {
//         this.error = error;
//         this.doctor = undefined;
//      }
//  }
   // Appointments
   @wire(totalAppointments,{recordId:'$doctorName'})
   wiredAppointments(result) {
    this.wiredResult = result;
       if (result.data) {
       this.sData = JSON.parse(JSON.stringify(result.data));
       console.log('sData : ' + JSON.stringify(this.sData));
       
       this.sData.forEach(function(item){
           console.log('item : ' + JSON.stringify(item));
           item.Doctor__c =  item.Doctor__c!=undefined ? item.Doctor__r.Name : '';
           item.Patient__c =item.Patient__c!=undefined ? item.Patient__r.Name_Of_The_Patient__c: '';
           });
               // console.log('item : ' + JSON.stringify(item));
               //      = item.Doctor__r.Name;
               //     item.Patient__c = item.Patient__r.Name_Of_The_Patient__c;
                  
                this.confirmed = this.sData.filter(item => item.Status__c === 'confirmed');
                this.Active = this.sData.filter((item) => item.Status__c == 'Active');
                this.Completed = this.sData.filter((item) => item.Status__c == 'completed');
                this.recData = this.sData.length > 0 ? this.sData : [];
                this.confirmedcount =  this.confirmed.length > 0 ? this.confirmed.length : [];
               console.log('confirmedCount :'+this.confirmedCount);
               this.ActiveCount =  this.Active.length > 0 ? this.Active.length : [];
               console.log('Activecount :'+this.ActiveCount);
               this.completedCount =  this.Completed.length > 0 ? this.Completed.length : [];
               console.log('completedCount :'+this.ActiveCount);
               //this.recData = this.confirmed.length > 0 ? this.confirmed : [];
              // this.recData = this.sData ; 
               this.error = undefined;
              
               //this.confirmedcount = this.confirmed.length;
               //console.log('confirmedCount : ' + JSON.stringify(this.this.confirmedcount));
           
           console.log('recData : ' + JSON.stringify(this.recData));
           
          //this.columns = COLS;
           this.error = undefined;
         } 
         else if (result.error) {
           this.error = result.error;
           this.sData  = undefined;
       }
}
handleRowSelection(event){
    const selectedRows = event.detail.row;
const rowData = JSON.parse(JSON.stringify(selectedRows));

this.rowData = rowData;
this.patientId = this.rowData.Patient__r.Id;
console.log("Rowdata"+ JSON.stringify(this.rowData));
console.log("PatientId"+ JSON.stringify(this.rowData.Patient__r.Id));
console.log("PatientId"+ JSON.stringify(this.patientId));
     this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
        recordId: this.patientId,
        objectApiName: 'Patient__c',
        actionName: 'view'
    }
});
}

 handleStatusConfirmed(){
   
    this.recData = this.confirmed.length > 0 ? this.confirmed : [];
    
 }

 handleStatusActive(){
   
    this.recData = this.Active.length > 0 ? this.Active : [];
   
}
 handleStatusCompleted(){
    this.recData = this.Completed.length > 0 ? this.Completed : [];
  
}
async handleSave(event) {
    const updatedFields = event.detail.draftValues;
    console.log('updatedFields : ' + JSON.stringify(updatedFields));
  
    // Clear all datatable draft values
    this.draftValues = [];

    try {
        // Pass edited fields to the updateContacts Apex controller
        await updateAppointments({ appointmentsForUpdate: updatedFields });
        
        // Report success with a toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Appointment status is updated',
                variant: 'success'
            })
        );
        await refreshApex(this.wiredResult);
        // Display fresh data in the datatable
        //await refreshApex(this.sData);
        
    } catch (error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error while updating or refreshing records',
                message: error.body.message,
                variant: 'error'
            })
        );
    }
}
}