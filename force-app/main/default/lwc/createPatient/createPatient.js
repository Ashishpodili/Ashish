import { LightningElement,track,wire } from 'lwc';
import PATIENT_OBJECT from '@salesforce/schema/Patient__c';
import { createRecord } from 'lightning/uiRecordApi';
import NAME from '@salesforce/schema/Patient__c.Name_Of_The_Patient__c';
import EMAIL from '@salesforce/schema/Patient__c.Email__c';
import ADDRESS from '@salesforce/schema/Patient__c.Address__c';
import AGE from '@salesforce/schema/Patient__c.Age__c';
import DOB from '@salesforce/schema/Patient__c.Date_Of_Birth__c';
import DIAGNOSED from '@salesforce/schema/Patient__c.Diagnosed__c';
import HEIGHT from '@salesforce/schema/Patient__c.Height_inches__c';
import INSURANCEINFO from '@salesforce/schema/Patient__c.Insurance_Information__c';
import MEDICALHIST from '@salesforce/schema/Patient__c.Medical_History__c';
import PHONE from '@salesforce/schema/Patient__c.Phone__c';
import SEX from '@salesforce/schema/Patient__c.Sex__c';
import WEIGHT from '@salesforce/schema/Patient__c.Weight_Kgs__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
export default class CreatePatient extends LightningElement {
    @track name='';
    @track address='';
    @track age='';
    @track dob='';
    @track email='';
    @track diagnosed='';
    @track height='';
    @track insurance='';
    @track medicalhis='';
    @track phone='';
    @track sex=[];
    @track options=[];
    @track weight='';
    @track patientcreatebutton = true;
    @track createpatientform = false;



    @wire(getObjectInfo, { objectApiName: PATIENT_OBJECT })

    patientInfo;
  
    @wire(getPicklistValues,
      {
          recordTypeId: '$patientInfo.data.defaultRecordTypeId',
          fieldApiName: SEX
      })
      doctorAvailabilityvalues({data,error}){
          if(data){
           this.options = data.values;
           console.log(this.options);
          }
          else if(error){
         console.log('error====> ' +  JSON.stringify(error));
          }
      }
    handleopenformToCreatePatient(){
        this.createpatientform = true;
        this.patientcreatebutton = false;
    }
    handlebackToCreatePatient(){
        this.createpatientform = false;
       this.patientcreatebutton = true;
    }
    handleNameChange(event) {
        this.name = event.target.value;
        console.log(this.name);
    }

    handleEmailChange(event) {
        this.email = event.target.value;
        console.log(this.Email);
    }
    handleAgeChange(event) {
        this.age = event.target.value;
        console.log(this.age);
    }

    handleAddressChange(event) {
        this.address = event.target.value;
        console.log(this.address);
    }
    handlePhoneChange(event) {
        this.phone = event.target.value;
        console.log(this.phone);
    }

    handleHeightChange(event) {
        this.height = event.target.value;
        console.log(this.height);
    }

    handleWeightChange(event) {
        this.weight = event.target.value;
        console.log(this.weight);
    }
    
    handleSexChange(event) {
        this.sex = event.target.value;
        console.log(this.sex);
    }
    handleInsuranceChange(event) {
        this.insurance = event.target.value;
        console.log(this.insurance);
    }
    handleDiagnosedChange(event) {
        this.diagnosed = event.target.value;
        console.log(this.diagnosed);
    }
    handleDobChange(event) {
        this.dob = event.target.value;
        console.log(this.dob);
    }
    handleMedHisChange(event) {
        this.medicalhis = event.target.value;
        console.log(this.medicalhis);
    }
    createPatient() {
        
            const fields = {};

            fields[NAME.fieldApiName] = this.name;
        
            fields[ADDRESS.fieldApiName] = this.address;
            fields[EMAIL.fieldApiName] = this.email;

            fields[AGE.fieldApiName] = this.age;

            fields[DOB.fieldApiName] = this.dob;

            fields[DIAGNOSED.fieldApiName] = this.diagnosed;

            fields[HEIGHT.fieldApiName] = this.height;

            fields[INSURANCEINFO.fieldApiName] = this.insurance;

            fields[MEDICALHIST.fieldApiName] = this.phone;
        
            fields[PHONE.fieldApiName] = this.profilelink;
        
            fields[SEX.fieldApiName] = this.sex;
        
            fields[WEIGHT.fieldApiName] = this.weight;
            console.log("The fields data are:" +JSON.stringify(fields));
            
            // Add other fields and their values here
        
        const recordInput = {apiName: PATIENT_OBJECT.objectApiName, fields};
        createRecord(recordInput)
            .then(result => {
                this.createpatientform = false;
                this.patientcreatebutton = true;
               
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Patient created Successfully',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }
}



    
