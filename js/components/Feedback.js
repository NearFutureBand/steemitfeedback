class Feedback {
    constructor(id, permlink, type, heading, body, author, date, commentCount, likes, dislikes) {
        this.className = 'feedback';
        this.expanded = false;
        this.yourVote = 0;
        this.id = id;
        this.type = type;
        this.permlink = permlink;
        this.body = body;
        this.heading = heading;
        this.date = date;
        this.author = author;
        this.commentCount = commentCount;
        this.comments = [];
        this.likes = likes;
        this.dislikes = dislikes;
        this.controlPanel = new ControlPanel('fb-' + this.id, this.author, this.date, this.likes, this.dislikes);
        this.commentForm = null;
    }
    getThisEl() {
        return document.querySelector('#fb-' + this.id + '.col-12.' + this.className)
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
                this.controlPanel.makeHTML() + 
            '</div>'+
            '<div class="row comments"></div>';
        document.querySelector(MP).appendChild(el);      
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
                    '<span class="feedback-title">'+ this.heading +'</span>'+
                '</div>'+
                '<div class="body">'+ this.body +'</div>'+
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
    
    placeComments() {
        if(this.comments.length != 0) {
            //console.log('placing comments');
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
            this.commentForm = new FormAddComment('#fb-' + this.id + '.col-12.' + this.className);
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
    cutText(text) {
        if( text.length > 400) text = text.slice(0, 399) + '...';
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
}