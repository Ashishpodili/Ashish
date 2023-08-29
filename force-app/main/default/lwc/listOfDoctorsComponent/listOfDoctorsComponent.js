import { LightningElement,wire,track} from 'lwc';
import findDoctors from '@salesforce/apex/DoctorsFetchClass.findDoctors';
import { publish, MessageContext } from 'lightning/messageService';
import DOCTORDETAILS from '@salesforce/messageChannel/DoctorMessageChannel__c';
import LightningAlert from 'lightning/alert';
export default class ListOfDoctorsComponent extends LightningElement {
    @track searchKey = '';
    @track selectedDoctor;
   
     doctorId;
    @wire(findDoctors, {searchKey:'$searchKey'})
    doctors;
    handleKeyChange(event) {
        
       this.searchKey = event.target.value;
        
    }
     // wired message context
     @wire(MessageContext)
     messageContext;
      // Publishes the selected Id on the DOCTORDETAILS.
      handleSelect(event){
        this.doctorId = event.detail;
        this.selectedDoctor = this.doctors.data.find(
            (doctor) => doctor.Id === this.doctorId
       );

       console.log(this.doctorId);
    console.log(JSON.stringify(this.selectedDoctor.Status__c));
          if(this.selectedDoctor.Status__c == "Available"){
            
            const message = {recordId: this.doctorId};
            // explicitly pass doctortId to the parameter recordId
            publish(this.messageContext, DOCTORDETAILS, message);
           // alert("The doctor status is:"+this.selectedDoctor.Status__c);
            console.log("message is Published");
            console.log("message is Published"+message.recordId);
    }
    else{

    
        
        const message = {recordId: null};
        // explicitly pass doctortId to the parameter recordId
        publish(this.messageContext, DOCTORDETAILS, message);
       // alert("The doctor status is:"+this.selectedDoctor.Status__c);
        console.log("message is Published");
        console.log("message is Published"+message.recordId);
        console.log("The doctor status is:",this.selectedDoctor.Status__c);
        LightningAlert.open({
            message: this.selectedDoctor.Name + ' is not available to book an Appointment with him.',
            theme: 'info', // a gray theme intended for Info states
            label: 'Info!', // this is the header text
        });
        //alert(this.selectedDoctor.Name + " is not available to book an Appointment with him.");
    }
    }
       
     
    
    
   
}