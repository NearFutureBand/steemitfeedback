class Feedback {
    constructor(id, permlink, type, heading, body, author, date, commentCount, likes, dislikes) {
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
        this.controlPanel = new ControlPanel('fb-' + this.id, this.author, this.date, likes, dislikes, 0, 'feedback-wrapper');
        this.commentForm = null;
    }
    getThisEl() {
        return document.querySelector('#fb-' + this.id + '.col-12.' + this.className);
    }
    getDynBlock() {
        return this.getThisEl().querySelector('.text');
    }
    place() {
        let el = document.createElement('div');
        el.className = 'col-12 ' + this.className;
        el.setAttribute('id', 'fb-' + this.id);
        
        el.innerHTML = 
            '<div class="feedback-wrapper tile">'+
                '<div class="text">'+
                
                '</div>'+
                 
            '</div>'+
            '<div class="row comments"></div>';
        document.querySelector(MP).appendChild(el);  
        this.controlPanel.place();
        this.restate();
    }
    restate() {
        let el = this.getDynBlock();
        if( el.innerHTML != '') el.innerHTML = '';
        
        el.innerHTML = this.makeDynHTML();
        this.addEventListeners();
        this.placeComments();
        this.placeCommentForm();
    }
    makeDynHTML() {
        let exportHTML =
            '<div class="text-block">'+
                '<div class="title">'+
                    '<span class="feedback-title">'+ (this.expanded? this.heading : this.cutText(this.heading, 'title')) +'</span>'+
                '</div>'+
                '<div class="body">'+ (this.expanded? this.body : this.cutText(this.body, 'body')) +'</div>'+
            '</div>'+
            '<div class="utility">'+
                '<button class="btn btn-dark open-comments">Comments <span class="bagde badge-light counter">'+ this.commentCount +'</span></button>'+
            '</div>';
        return exportHTML;
    }
    remove() {
        this.getThisEl().remove();
    }
    expand() {
        this.expanded = true;
        //getContentReplies - get comments entities to show them
        //update commentCount variable
        //this.restate();
        //this.place();
        this.restate();
    }
    
    getComments() {
        golos.api.getContentReplies(this.author, this.permlink, 1000, (err, result) => {
            console.log(err, result);
            if ( ! err) {
                result.forEach( (item) => {
                    this.createComment(item);
                });
            } else {
                console.error(err);
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
            votes.likes, 
            votes.dislikes, 
            0,
            '#fb-' + this.id + '.col-12.' + this.className + '.row.comments'
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
            this.comments.forEach( function(com) {
                com.remove();
            });
            this.comments = [];
        }
    }
    
    addEventListeners() {
        let $ = this;
        //Comments button down
        this.getThisEl().querySelector('.open-comments').addEventListener('click', function() {
            $.sendExpandFbEvent($.id);
        });
        
        //Click on the feedback's header
        this.getThisEl().querySelector('.feedback-title').addEventListener('click', function() {
           $.sendExpandFbEvent($.id);
        });
    }
    
    placeCommentForm() {
        if(this.expanded == true) {
            this.commentForm = new FormAddComment('#fb-' + this.id + '.col-12.' + this.className, this.author, this.permlink);
            this.commentForm.place();
        }
    }
    removeCommentForm() {
        if( this.commentForm != null) {
            this.commentForm().getThisEl().remove();
            this.commentForm = null;
        }
        
    }
    
    /*Not Interesting*/
    cutText(text, type) {
        if( text.length > 400 && type == 'body') text = text.slice(0, 399) + '...';
        if( text.length > 60 && type == 'title') text = text.slice(0, 59) + '...';
        return text;
    }
    sendExpandFbEvent(id) {
        if( this.expanded == false) {
            document.querySelector('.' + GFCLASS)
                .dispatchEvent( new CustomEvent("expandFb", {
                    detail: {
                        id: id
                    }
                }
            ))
        } else {
            document.querySelector('.' + GFCLASS)
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
        votesArray.forEach( function( item ) {
            if(item.percent > 0) likes++;
            else if(item.percent < 0) dislikes++;
        });
        return {l: likes, d: dislikes};
    }
}