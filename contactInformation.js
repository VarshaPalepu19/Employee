import { LightningElement , wire,track} from 'lwc';
import getDetails from '@salesforce/apex/UserClass.getDetails';
import getInfo from  '@salesforce/apex/UserClass.getInfo';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import { refreshApex } from '@salesforce/apex';
const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
];
const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Title', fieldName: 'Title' },
    {type:'action',typeAttributes:{rowActions:actions}}
    ];
export default class ContactInformation extends LightningElement {
    error;
    searchValue = '';
    obj='';
    columns=columns;
    refreshTable;
    @track item;
    @track isEditForm = false;
    @track customFormModal = false;
    @track currentRecordId;
    @wire(getDetails)
 wiredUsers({err, data}){
        console.log(data);
        if(data){
        this.item = data;
        }
    };
    @wire(getDetails)
    relations(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }
    handleRowAction(event){
        console.log('Handler');
        let actionName = event.detail.action.name;
      //console.log('actionName ====> ' + actionName);
        console.log(event.detail.row);
        let row = event.detail.row;
       //console.log('row ====> ' + row);
        switch (actionName) {
            case 'view':
                let details=this.template.querySelector('lightning-datatable').getSelectedRows();
                var record={};
                for(let i=0;i<details.length;i++){
                     record=details[i];
                    }
                    this.obj=record;
                  break;
            case 'edit':
                this.editCurrentRecord(row);
                break;
                
    }
}
closeModal() {
    this.customFormModal = false;
}
editCurrentRecord(currentRow) {
    console.log(JSON.stringify(currentRow));
    this.customFormModal = true;
    this.isEditForm = true;
    // assign record id to the record edit form
    this.currentRecordId = currentRow.Id;
    console.log(this.currentRecordId);
}
handleSubmit(event) {
    // prevending default type sumbit of record edit form
    //event.preventDefault();
    this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);
    this.customFormModal = false;
    this.dispatchEvent(new ShowToastEvent({
        title: 'Success',
        message: 'Contact updated Successfully.',
        variant: 'success'
    }),);
}
handleSuccess() {
    return refreshApex(this.refreshTable);
}
    searchKeyword(event) {
        this.searchValue = event.target.value;
    }
    handleSearchKeyword() {
        if (this.searchValue !== '') {
            getInfo({
                    key: this.searchValue
                })
                .then(result => {
                    console.log(result);
                    this.item = result;
                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        variant: 'error',
                        message: error.body.message,
                    });
                    this.dispatchEvent(event);
                    this.item = null;
                });
        } /*else {
            const event = new ShowToastEvent({
                variant: 'error',
                message: 'Search text missing..',
            });
            this.dispatchEvent(event);*/
            //return refreshApex.Apex(this.getDetails);
        }
    }

