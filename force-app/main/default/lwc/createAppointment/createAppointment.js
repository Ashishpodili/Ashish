import { LightningElement,track,wire,api } from 'lwc';

import getPatients from '@salesforce/apex/DoctorsFetchClass.listOfPatients'
import createAppointment from '@salesforce/apex/CreateAppointment.createAppointment'
import {NavigationMixin} from 'lightning/navigation'
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
 
export default class CreateAppointment extends NavigationMixin(LightningElement) {
     @track  error
     @api doctor;
     @track patientOptions=[]
     @track appointmentid
     @track  patientname
     @track appointmentDateTime
     @api  doctorName;
       
     
   @track showbutton = true;
   @track isbookappointmentform = false;
   
   

    @wire(getPatients)

     wiredPatientOptions({ error, data }) {

         if (data) {

             this.patientOptions = data.map(patient => ({ label: patient.Name_Of_The_Patient__c, value: patient.Id }));
                  
        } else if (error) {

            console.error('Error retrieving doctor options:', error);

       }

     }
     handleNameChange(event) {

         this.patientname=event.target.value
        console.log('Patient name changed',this.patientname);
     }
     handleCreateAppointment(){
        this.showbutton = false;
        this.isbookappointmentform = true;
     }
     handleCloseAppointment(){
        this.showbutton = true;
        this.isbookappointmentform = false;
     }

    handleFormSubmit(event) {
        const recordId = event.target.Id;
        console.log('The recordId is:', recordId);
      
        createAppointment({patientname: this.patientname, doctorId: this.doctor, appdatetime:this.appointmentDateTime})               
               .then(result=>{
                  
                    this.appointmentid=result.Id;
                    console.log('after save' + this.appointmentid);
                    console.log('Appointment created successfully!');
                    console.log('the doctor name is now ' + this.doctor);
                    console.log('the patientname now ' + this.patientname);
                    console.log('the appointmentdate ' + this.appointmentDateTime);
        
                    
                    const toastEvent = new ShowToastEvent({
                      title:'Success!',
                      message:'Your Appointment booked  successfully',
                      variant:'success'
                    });
                    this.dispatchEvent(toastEvent);

                    this[NavigationMixin.Navigate]({
                        type: 'standard__recordPage',
                        attributes: {
                            recordId: this.appointmentid,
                            objectApiName: 'Appointment__c',
                            actionName: 'view'
                        }
                    });
                })
                .catch(error=>{
                   this.error=error.message;
                   console.log(this.error);
                  
                
                });
              }
            
            
            
            
           
      
    handleDateChange(event) {

        this.appointmentDateTime=event.target.value
       
        console.log('AppointmentDate',this.appointmentDateTime);
    }   
    

     
}