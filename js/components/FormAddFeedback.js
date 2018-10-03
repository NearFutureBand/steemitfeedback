class FormAddFeedback {
    constructor(GFCLASS, tabs) {
        this.className = 'frm-add-fb';
        this.GFCLASS = GFCLASS;
        this.tabs = tabs;
        this.opened = false;
        this.editor = null;
        this.dataToSend = {};
    }
    
    place() {
        let $ = this;
        if(!this.opened) {
            this.opened = true;
            let el = document.createElement('div');
            el.className = 'row ' + this.className;
            el.innerHTML = 
                '<div class="col-lg-12 tile">'+
                    '<form>'+
                        '<div class="form-group">'+
                            '<label for="formHeader">Header</label>'+
                            '<input type="text" class="form-control" id="formHeader" name="inptHeader" aria-describedby="formHeader" required>'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label for="formTex">Text</label>'+
                            '<textarea class="form-control" id="formText" name="txtBody" rows="3"></textarea>'+
                        '</div>'+
                        '<div class="form-check">'+
                            '<input class="form-check-input" type="radio" name="exampleRadios" id="radio-'+ this.tabs[1].key +'" value="option1" checked>'+
                            '<label class="form-check-label" for="formRadio0">'+ this.tabs[1].name +'</label>'+
                        '</div>'+
                        '<div class="form-check">'+
                            '<input class="form-check-input" type="radio" name="exampleRadios" id="radio-'+ this.tabs[2].key +'" value="option2">'+
                            '<label class="form-check-label" for="formRadio1">'+ this.tabs[2].name +'</label>'+
                        '</div>'+
                        '<div class="form-check">'+
                            '<input class="form-check-input" type="radio" name="exampleRadios" id="radio-'+ this.tabs[3].key +'" value="option3">'+
                            '<label class="form-check-label" for="formRadio2">'+ this.tabs[3].name +'</label>'+
                        '</div>'+
                        '<div class="form-check">'+
                            '<input class="form-check-input" type="radio" name="exampleRadios" id="radio-'+ this.tabs[4].key +'" value="option3">'+
                            '<label class="form-check-label" for="formRadio3">'+ this.tabs[4].name +'</label>'+
                        '</div>'+
                        '<button type="submit" class="btn btn-success btn-add-fb-done mr-2">'+
                            '<span class="icon-checkmark"></span> Submit'+
                        '</button>'+
                        '<button type="button" class="btn btn-danger btn-add-fb-cancel ml-2">'+
                            '<span class="icon-cross"></span> Cancel'+
                        '</button>'+
                    '</form>'+
                '</div>';
            document.querySelector('.' + this.GFCLASS).appendChild(el);
            
            //setting up CkEditor
            
            this.addEventListeners();
        }
    }
        
    
    validate() {
        
    }
    
    send() {
    
        //if( validateSendingData(body, title) ) {
        //addToJsonMetadata([findCheckedRadio()], "tags");
    
        //console.log(jsonMetadata);
        //console.log('title: '+title+' body: '+body+' tags: '+parentPermlink+' permlink: '+permlink+' json: '+jsonMetadata);
        //console.log(window.wif);
        
        /*golos.broadcast.comment(wif.posting,
                                '',
                                'fb',
                                username,
                                urlLit( title, 0 ) + '-' + Date.now().toString(),
                                document.getElementById('formHeader').value,
                                ckeditor.getData(),
                                jsonMetadata,
                                function(err, result) {
                                    if ( ! err) {
                                        document.getElementById('formHeader').value = '';
                                        ckeditor.setData('');
                                        closeAddFbForm();
                                        removeFbs();
                                        loadFbs();
                                        console.log('sent');
                                    } else {
                                        console.error(err);
                                        showError(err.message);
                                    }
                                });
        }*/
    }
    remove() {
        if (this.opened) {
            this.opened = false;
            this.getThisEl().remove();
            document.querySelector('.' + this.GFCLASS).dispatchEvent(new CustomEvent('formAddFbDelete'));
        }
    }
    getThisEl() {
        return document.querySelector('.row.' + this.className);
    }
    addEventListeners() {
        let $ = this;
        this.getThisEl().querySelector(' .btn-add-fb-done').addEventListener('click', function(){
            console.log('sending add-fb-form');
            /*if( $.validate()) {
                $.send();
            }*/
            
        });
        this.getThisEl().querySelector(' .btn-add-fb-cancel').addEventListener('click', function(){
            $.delete();
        });
    }
    
}