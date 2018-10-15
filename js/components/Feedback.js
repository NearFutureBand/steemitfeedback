class Feedback {
    constructor(id, permlink, type, heading, body, author, date, commentCount, likes, dislikes, myVote) {
        this.className = 'feedback';
        this.expanded = false;
        this.id = id;
        this.type = type;
        this.permlink = permlink;
        this.body = body;
        this.heading = heading;
        this.date = date;
        this.author = author;
        this.commentCount = commentCount;
        this.comments = [];
        this.controlPanel = new ControlPanel(`fb-${this.id}`, this.author, this.date, this.permlink, likes, dislikes, myVote, 'feedback-wrapper');
        this.commentForm = null;
    }
    
    getThisEl() {
        return document.querySelector(`.${SFCLASS} #fb-${this.id}.col-12.${this.className}`);
    }
    getDynBlock() {
        return this.getThisEl().querySelector('.text');
    }
    
    place() {
        let el = document.createElement('div');
        el.className = `col-12 ${this.className}`;
        el.setAttribute('id', `fb-${this.id}`);
        
        el.innerHTML = `
            <div class="feedback-wrapper tile">
                <div class="text">
                
                </div>
                 
            </div>
            <div class="row comments"></div>
            ${ ((this.permlink == 'empty-feedback-on-the-steemit-feedback-microservice')? '<div class="empty-feedback-cover"></div>' : '')}
        `;
        document.querySelector(MP).appendChild(el);
        this.controlPanel.place();
        this.addStaticEventListeners();
        this.restate();
    }
    restate() {
        let el = this.getDynBlock();
        if( el.innerHTML != '') el.innerHTML = '';
        el.innerHTML = this.makeDynHTML();
        
        this.addDynEventListeners();
        
        if(this.expanded) {
            
            this.removeComments();
            this.removeCommentForm();
            this.getComments();
        }
    }
    makeDynHTML() {
        let exportHTML = `
            <div class="text-block">
                <div class="title">
                    <span class="feedback-title">${(this.expanded? this.heading : this.cutText(this.heading, 'title'))}</span>
                </div>
                <div class="body">${(this.expanded? this.body : this.cutText(this.body, 'body'))}</div>
            </div>
            <div class="utility">
                <button class="btn btn-dark open-comments"><span class="icon-bubbles2"></span> <span class="badge badge-light counter">${this.commentCount}</span></button>
                <button class="btn btn-light type">
                    <span class="badge badge-dark">${this.type}</span>
                </button>
            </div>
        `;
        return exportHTML;
    }
    delete() {
        this.getThisEl().remove();
    }
    
    addDynEventListeners() {
        
        //Comments button down
        this.getThisEl().querySelector('.open-comments').addEventListener('click', () => {
            this.sendExpandFbEvent(this.id);
        });
        
        //Click on the feedback's header
        this.getThisEl().querySelector('.feedback-title').addEventListener('click', () => {
           this.sendExpandFbEvent(this.id);
        });
        
    }
    addStaticEventListeners() {
        this.getThisEl().addEventListener('reloadFeedback', () => {
            this.restate();
        });
    }
    
    getComments() {
        steem.api.getContentReplies(this.author, this.permlink, 1000, (err, result) => {
            console.log(err, result);
            if ( ! err) {
                result.forEach( (item) => {
                    this.createComment(item);
                });
                this.commentCount = this.comments.length;
                this.placeComments();
                this.placeCommentForm();
            } else {
                ErrorController.showError(err.message);
            }
        });
    }
    createComment(data) {
        let votes = this.getVotes(data.active_votes);
        this.comments.push( new Comment(
            this.id, 
            data.id, 
            data.permlink, 
            data.body, 
            data.author, 
            data.created, 
            votes.l,
            votes.d,
            votes.m,
            `.${SFCLASS} #fb-${this.id}.col-12.${this.className} .row.comments`
        ) 
        );
    }
    placeComments() {
        if(this.comments.length != 0) {
            this.comments.forEach( (com) => {
                com.place();
            });
        }
    }
    removeComments() {
        
        if(this.comments.length != 0) {
            this.comments.forEach( (com) => {
                com.delete();
            });
            this.comments = [];
        }
    }
    
    placeCommentForm() {
        if(this.expanded) {
            this.commentForm = new FormAddComment(`${SFCLASS} #fb-${this.id}.col-12.${this.className}`, this.author, this.permlink);
            this.commentForm.place();
        }
    }
    removeCommentForm() {
        if( this.commentForm != null) {
            this.commentForm.delete();
            this.commentForm = null;
        }
        
    }
    
    /*Not Interesting*/
    expand() {
        this.expanded = true;
        this.restate();
    }
    cutText(text, type) {
        if( text.length > 400 && type == 'body') text = `${text.slice(0, 399)}...`;
        if( text.length > 60 && type == 'title') text = `${text.slice(0, 59)}...`;
        return text;
    }
    sendExpandFbEvent(id) {
        if( ! this.expanded) {
            document.querySelector(`.${SFCLASS}`)
                .dispatchEvent( new CustomEvent("expandFb", {
                    detail: {
                        id: id
                    }
                }
            ))
        } else {
            document.querySelector(`.${SFCLASS}`)
                .dispatchEvent( new CustomEvent("reloadFeedbacks", {
                    detail: {
                        id: id
                    }
                }
            ))
        }
    }
    getVotes(votesArray) {
        let likes = 0;
        let dislikes = 0;
        let myVote = 0;
        
        votesArray.forEach( item => {
            if(item.voter == username) {
                if(item.percent > 0) myVote = 1;
                else if(item.percent < 0) myVote = -1;
            }
            
            if(item.percent > 0) likes++;
            else if(item.percent < 0) dislikes++;
        });
        return {l: likes, d: dislikes, m: myVote};
    }
}