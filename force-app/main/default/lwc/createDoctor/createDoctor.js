import { LightningElement ,track,wire} from 'lwc';
import DOCTOR_OBJECT from '@salesforce/schema/Doctor__c';
import { createRecord } from 'lightning/uiRecordApi';
import NAME from '@salesforce/schema/Doctor__c.Name';

import SPECIALITY from '@salesforce/schema/Doctor__c.Speciality__c';

import PHONE from '@salesforce/schema/Doctor__c.Phone__c';

import EMAIL from '@salesforce/schema/Doctor__c.Email__c';

import AVAILABILITY from '@salesforce/schema/Doctor__c.Availability__c';

import PROFILELINK from '@salesforce/schema/Doctor__c.ProfilePicLink__c';


import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
export default class CreateDoctor extends LightningElement {
   
//import createCaseRecord from '@salesforce/apex/CaseController.createCaseRecord';
    doctorcreatebutton = true;
    createDoctorform = false;
    @track Name = '';
    @track Email = '';
    @track Speciality ='';
    @track Phone = '';
    @track profilelink = '';
    @track options= [];
    @track selectedCategories = [];
   
    @wire(getObjectInfo, { objectApiName: DOCTOR_OBJECT })

  doctorInfo;

  @wire(getPicklistValues,
    {
        recordTypeId: '$doctorInfo.data.defaultRecordTypeId',
        fieldApiName: AVAILABILITY
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
    handleopenformToCreateDoctor(){
        this.createDoctorform = true;
        this.doctorcreatebutton = false;
    }
    handlebackToCreateDoctor(){
        this.createDoctorform = false;
       this.doctorcreatebutton = true;
    }
    handleNameChange(event) {
        this.Name = event.target.value;
        console.log(this.Name);
    }

    handleEmailChange(event) {
        this.Email = event.target.value;
        console.log(this.Email);
    }
    handleSpecialityChange(event) {
        this.Speciality = event.target.value;
        console.log(this.Speciality);
    }

    handlePhoneChange(event) {
        this.Phone = event.target.value;
        console.log(this.Phone);
    }
    handleProfileLinkChange(event) {
        this.profilelink = event.target.value;
        console.log(this.profilelink);
    }

    handleCategoryChange(event) {
        this.selectedCategories = event.target.value;
        console.log(this.selectedCategories);
    }

   

    createDoctor() {
        
            const fields = {};

            fields[NAME.fieldApiName] = this.Name;
        
            fields[EMAIL.fieldApiName] = this.Email;
        
            fields[PHONE.fieldApiName] = this.Phone;
        
            fields[PROFILELINK.fieldApiName] = this.profilelink;
        
            fields[SPECIALITY.fieldApiName] = this.Speciality;
        
            fields[AVAILABILITY.fieldApiName] = this.selectedCategories.join(';');
            console.log("The fields data are:" +JSON.stringify(fields));
            
            // Add other fields and their values here
        
        const recordInput = {apiName: DOCTOR_OBJECT.objectApiName, fields};
        createRecord(recordInput)
            .then(result => {
                this.createDoctorform = false;
                this.doctorcreatebutton = true;
               
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Doctor created Successfully',
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


