class FormAddComment {
    constructor(mountPlace) {
        this.className = 'form-add-comment';
        this.textEditor = null;
        this.mountPlace = mountPlace;
        this.maxCommentSymbols = 2000;
    }
    
    getThisEl() {
        return document.querySelector('.row.' + this.className);
    }
    
    place() {
        let el = document.createElement('div');
        el.className = 'row ' + this.className;
        el.innerHTML = 
            '<div class="col-lg-10 offset-lg-1 col-md-10 offset-md-1">'+
                '<div class="wrapper tile">'+
                    '<div class="form-text">'+
                        '<span class="title">Text</span>'+
                        '<textarea placeholder="My comment is ..." required rows="5" id="comment-body"></textarea>'+
                    '</div>'+
                    '<div class="utility">'+
                        '<button class="btn btn-success send-comment-form" type="button">Submit</button>'+
                    '</div>'+
                '</div>'+
            '</div>';
        document.querySelector(this.mountPlace).appendChild(el);
        
        this.textEditor = new TextEditor('#comment-body');
        this.textEditor.place();
    
        this.addEventListeners();
        //clearJsonMetadata();
    }
    
    addEventListeners() {
        let $ = this;
        this.getThisEl().querySelector('.send-comment-form').addEventListener('click', function() {
            
            //проверка auth()
            if( $.validate() ) $.send();
        });
    }
    validate() {
        if( this.textEditor.editor.getData().length < this.maxCommentSymbols ) {
            return true;
        }
    }
    
    send() {
        /*let parentAuthor = getAuthor(fbId, '');
        let parentPermlink = getPermlink(fbId, '');
        let author = username;
        let permlink = 're-' + parentAuthor + '-' + parentPermlink + '-' + Date.now();
        let title = '';
        let body = ckeditor.getData();
        
        if( validateSendingData(body)) {
            console.log('comment to note '+fbId+'. Body: '+body);
            golos.broadcast.comment(wif.posting, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata,     function(err, result) {
                //console.log(err, result);
                if (!err) {
                    console.log('comment', result);
                    ckeditor.setData('');
                    removeComments(fbId);
                    loadComments(fbId);
                } else {
                    console.error(err);
                    showError(err.message);
                }
            }); 
        }
        */
    }
    
    
    remove() {
        this.getThisEl().remove();
    }
    
    
}