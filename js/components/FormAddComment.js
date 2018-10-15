class FormAddComment {
    constructor(mountPlace, parentAuthor, parentPermlink) {
        this.className = 'form-add-comment';
        this.textEditor = null;
        this.mountPlace = mountPlace;
        this.parentAuthor = parentAuthor;
        this.parentPermlink = parentPermlink;
        this.jsonMetadata = {tags: [], images: []};
        this.maxCommentSymbols = 2000;
    }
    
    getThisEl() {
        return document.querySelector(`${SFCLASS} .row.${this.className}`);
    }
    
    place() {
        let el = document.createElement('div');
        el.className = `row ${this.className}`;
        el.innerHTML = `
            <div class="col-lg-10 offset-lg-1 col-md-10 offset-md-1">
                <form class="wrapper tile">
                    <div class="form-text">
                        <span class="title">Text</span>
                        <textarea placeholder="My comment is ..." rows="5" id="comment-body"></textarea>
                    </div>
                    <div class="utility">
                        '<button class="btn btn-success send-comment-form" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        `;
        document.querySelector(this.mountPlace).appendChild(el);
        
        this.textEditor = new TextEditor('#comment-body', this.jsonMetadata);
        this.textEditor.place();
    
        this.addStaticEventListeners();
    }
    
    addStaticEventListeners() {
        this.getThisEl().querySelector('form.wrapper').addEventListener('submit', (e) => {
            e.preventDefault();
            auth( () => {
                
                if( this.validate() ) {
                    this.send();
                }
            }, ['posting']);
            return false;
        });
    }
    
    validate() {
        if( this.textEditor.editor.getData().length < this.maxCommentSymbols ) {
            return true;
        } else {
            ErrorController.showError('Form is not valid');
            return false;
        }
    }
    
    send() {
        let parentAuthor = this.parentAuthor;
        let parentPermlink = this.parentPermlink;
        let author = username;
        let permlink = `re-${parentAuthor}-${parentPermlink}-${Date.now()}`;
        let title = '';
        let body = this.textEditor.editor.getData();
        this.jsonMetadata.images = this.textEditor.attachedImages;
        
        steem.broadcast.comment(
            wif.posting,
            parentAuthor,
            parentPermlink,
            author,
            permlink,
            title,
            body,
            JSON.stringify(this.jsonMetadata),
            (err, result) => {
                
                console.log(err, result);
                if ( ! err) {
                    this.textEditor.editor.setData('');
                    this.jsonMetadata = {tags: [], images: []};
                    
                    document.querySelector(this.mountPlace).dispatchEvent(new CustomEvent('reloadFeedback'));
                } else {
                    ErrorController.showError(err.message);
                }
                
            }
        ); 
    }
    
    delete() {
        this.getThisEl().remove();
    }
    
}