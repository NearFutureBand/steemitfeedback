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
            
            ClassicEditor
            .create( document.querySelector( '#formText' ), {
                    //language: detectLang(),
                    removePlugins: [ 'ImageUpload' ],
                } )
            .then( editor => {
                $.editor = editor;
                
                let but = document.createElement('button');
                but.className = "ck ck-button ck-enabled ck-off attach-image";
                but.innerHTML = '<svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z" fill="#000" fill-rule="nonzero"></path></svg><span class="ck ck-tooltip ck-tooltip_s"><span class="ck ck-tooltip__text">Attach image via GolosImages</span></span><span class="ck ck-button__label">Attach image</span>';
                but.id = "upload";
                but.type = "button";
                document.querySelector('div.ck.ck-toolbar').appendChild(but);
                addEventForBtnUploadImg();
            } )
            .catch( err => {
                console.error( err.stack );
                showError(err.message);
            } );
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
    delete() {
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