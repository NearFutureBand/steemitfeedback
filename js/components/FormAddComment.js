class FormAddComment {
    constructor(mountPlace, parentAuthor, parentPermlink) {
        this.className = 'form-add-comment';
        this.textEditor = null;
        this.mountPlace = mountPlace;
        this.parentAuthor = parentAuthor;
        this.parentPermlink = parentPermlink;
        this.jsonMetadata = {};
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
        this.getThisEl().querySelector('.send-comment-form').addEventListener('click', () => {
            auth(function () {
                if( this.validate() ) this.send();
            }, ['posting']);
        });
    }
    validate() {
        if( this.textEditor.editor.getData().length < this.maxCommentSymbols ) {
            return true;
        } else {
            console.log('something wrong');
            return false;
        }
    }
    
    send() {
        let parentAuthor = this.parentAuthor;
        let parentPermlink = this.parentPermlink;
        let author = username;
        let permlink = 're-' + parentAuthor + '-' + parentPermlink + '-' + Date.now();
        let title = '';
        let body = this.textEditor.editor.getData();
        
        
        golos.broadcast.comment(wif.posting, parentAuthor, parentPermlink, author, permlink, title, body, JSON.stringify(this.jsonMetadata), (err, result) => {
            //console.log(err, result);
            if (!err) {
                console.log('comment', result);
                this.textEditor.editor.setData('');
                
                //restate feedback
                
            } else {
                console.error(err);
                ErrorController.showError(err.message);
            }
        }); 
    }
    
    remove() {
        this.getThisEl().remove();
    }
    
}