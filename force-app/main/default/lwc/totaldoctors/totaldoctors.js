import { LightningElement,wire,track } from 'lwc';

import TotalDoctors from '@salesforce/apex/DoctorsFetchClass.listOfDoctors';
    const COLS = [
       // { label: 'S.No', value: 'dataWithRowNumbers' },
        {
            label: 'Doctor Picture',
            type: 'customPictureType',
            typeAttributes: {
                pictureUrl: { fieldName: 'ProfilePicLink__c' }
            },
            cellAttributes: { alignment: 'center' }
        },
        { label: 'Name', fieldName: 'Name' },
        { label: 'Speciality', fieldName: 'Speciality__c' },
        
        { label: 'Phone', fieldName: 'Phone__c', type: 'Phone' },
        { label: 'Email', fieldName: 'Email__c', type: 'Email' },
        { label: 'Status', fieldName: 'Status__c' }
    ];
    export default class Totaldoctors extends LightningElement {
        columns = COLS;
    
        @wire(TotalDoctors)
        doctors;
        /*@track dataWithRowNumbers;

        connectedCallback() {
            this.calculateRowNumbers();
        }
    
        calculateRowNumbers() {
            const number = for(i=1; i<=this.doctors.length; i++) {
                
                
            };
            console.log("Row No  "+this.dataWithRowNumbers);
        }*/
        }
    