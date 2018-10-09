class FormAddFeedback {
    constructor(tabs) {
        this.className = 'form-add-feedback';
        this.tabs = tabs;
        this.opened = false;
        this.chosenType = 1;
        this.textEditor = null;
        this.dataToSend = {};
    }
    
    getThisEl() {
        return document.querySelector('.' + GFCLASS + ' .col-12.' + this.className);
    }
    getDynBlock() {
        return this.getThisEl().querySelector('.form-type');
    }
    
    place() {
        let $ = this;
        if(!this.opened) {
            this.opened = true;
            let el = document.createElement('div');
            el.className = 'col-12 ' + this.className;
            el.innerHTML =
                '<div class="wrapper tile">'+
                    '<div class="form-title">'+
                        '<span class="title">Header</span>'+
                        '<input type="text" placeholder="My title is ..." required>'+
                    '</div>'+
                    '<div class="form-text">'+
                        '<span class="title">Text</span>'+
                        '<textarea placeholder="My feedback is ..." required rows="5" id="feedback-body"></textarea>'+
                    '</div>'+
                    '<div class="form-type">'+
                        
                    '</div>'+
                    '<div class="utility">'+
                        '<button class="btn btn-success button-send-form" type="submit">Submit</button>'+
                        '<button class="btn btn-danger button-cancel-form" type="button">Cancel</button>'+
                    '</div>'+
                '</div>';
            document.querySelector(MP).appendChild(el);
            
            this.textEditor = new TextEditor('#feedback-body');
            this.textEditor.place();
            this.restate();
        }
    }
    restate() {
        let el = this.getDynBlock();
        if( el.innerHTML != '') el.innerHTML = '';
        
        el.innerHTML = this.makeDynHTML();
        this.addEventListeners();
    }
    
    makeDynHTML() {
        let exportHTML = '';
        
        for( let i = 1; i < this.tabs.length; i++) {
            exportHTML += (
                    '<div class="check">'+
                        '<input type="radio" name="type" value="'+ this.tabs[i].key +'" '+ ((i == this.chosenType)? 'checked' : '') +'>'+
                        '<span class="label">'+ this.tabs[i].name +'</span>'+
                    '</div>');
        }
        return exportHTML;
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
        }
    }
    
    addEventListeners() {
        let $ = this;
        this.getThisEl().querySelector(' .button-send-form').addEventListener('click', function(){
            console.log('sending add-fb-form');
            /*if( $.validate()) {
                $.send();
            }*/
            
        });
        this.getThisEl().querySelector(' .button-cancel-form').addEventListener('click', function(){
            $.remove();
            document.querySelector('.' + GFCLASS).dispatchEvent(new CustomEvent('reloadFeedbacks'));
        });
    }
    
}