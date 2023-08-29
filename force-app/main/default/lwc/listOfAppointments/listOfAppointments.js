import { LightningElement,track,wire,api } from 'lwc';
import TotalAppointments from '@salesforce/apex/DoctorsFetchClass.totalAppointments';
import updateAppointments from '@salesforce/apex/CreateAppointment.updateAppointments';
import deleteAppointment from '@salesforce/apex/CreateAppointment.deleteAppointment';
//import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const COLS =[
{ label: 'Appointment No', fieldName: 'Name' },
{ label: 'AppointmentDateandTime', fieldName: 'AppointmentDateandTime__c' },

 { label: 'Doctor', fieldName: 'Doctor__c' },
{ label: 'Patient ', fieldName: 'Patient__c' },

{ label: 'Status', fieldName: 'Status__c' , editable: true },
{ type:'button',typeAttributes:{label:'Delete',name:'Edit',variant:'brand'}}
];

export default class ListOfAppointments extends LightningElement {
    @track error
     @track recData; 
    @track columns=COLS; 
    draftValues = [];
@api doctorName;
@track rowData;
    // @wire (TotalAppointments)
    // Appointments
    @wire(TotalAppointments)
    wiredAccounts({ error, data }) {
        if (data) {
        let sData = JSON.parse(JSON.stringify(data));
        console.log('sData : ' + JSON.stringify(sData));
        
        sData.forEach(function(item){
            console.log('item : ' + JSON.stringify(item));
            item.Doctor__c =  item.Doctor__c!=undefined ? item.Doctor__r.Name : '';
            item.Patient__c =item.Patient__c!=undefined ? item.Patient__r.Name_Of_The_Patient__c: '';
            });
                // console.log('item : ' + JSON.stringify(item));
                //      = item.Doctor__r.Name;
                //     item.Patient__c = item.Patient__r.Name_Of_The_Patient__c;
                   
                
                this.recData =sData; 
       
        
            
            console.log('recData : ' + JSON.stringify(this.recData));
           //this.columns = COLS;
            this.error = undefined;
          } 
          else if (error) {
            this.error = error;
            this.data = undefined;
        }

}
handleRowSelection(event){
    const selectedRows = event.detail.row;
const rowData = JSON.parse(JSON.stringify(selectedRows));

this.rowData = rowData;
console.log("Rowdata"+ JSON.stringify(this.rowData));

// this.isLandingPage = false;


try {
    // Pass edited fields to the updateContacts Apex controller
    if (window.confirm('Are you sure you want to delete this record?')) {
   deleteAppointment({ appointmentsForDelete: this.rowData.Id });
   //alert("Are you sure to delete this appointment?");
    window.location.reload();
    // Report success with a toast
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Success',
            message: 'Appointment is deleted',
            variant: 'success'
        })
    );
    }
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


async handleSave(event) {
    const updatedFields = event.detail.draftValues;
    console.log('updatedFields : ' + JSON.stringify(updatedFields));

    // Clear all datatable draft values
    this.draftValues = [];

    try {
        // Pass edited fields to the updateContacts Apex controller
        await updateAppointments({ appointmentsForUpdate: updatedFields });
        window.location.reload();
        // Report success with a toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Appointment status is updated',
                variant: 'success'
            })
        );

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