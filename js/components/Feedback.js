class Feedback {
    constructor(id, permlink, type, heading, body, author, date, commentCount, GFCLASS) {
        this.className = 'fb';
        this.expanded = false;
        this.yourVote = 0;
        this.GFCLASS = GFCLASS;
        this.id = id;
        this.type = type;
        this.permlink = permlink;
        this.body = body;
        this.heading = heading;
        this.date = date;
        this.author = author;
        this.commentCount = commentCount;
        this.comments = [];
        this.likes = 0;
        this.dislikes = 0;
        this.controlPanel = new ControlPanel('fb-' + this.id, this.author, this.date, this.likes, this.dislikes);
        this.commentForm = null;
    }
    getThisEl() {
        return document.querySelector('#fb-' + this.id + '.row' + '.' + this.className)
    }
    getDynBlock() {
        return this.getThisEl().querySelector('.text');
    }
    place() {
        let el = document.createElement('div');
        el.className = 'row ' + this.className;
        el.setAttribute('id', 'fb-' + this.id);
        
        el.innerHTML = 
            '<div class="container body-fb tile">'+
                '<div class="row">'+
                    '<div class="col-lg-9 col-md-9 text">'+
                        
                    '</div>'+
                    this.controlPanel.makeHTML() + 
                '</div>'+
            '</div>'+
            '<div class="container comments"></div>';
        document.querySelector('.' + this.GFCLASS).appendChild(el);      
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
            '<h3>'+ this.heading +'</h3>'+
            '<p>'+ (this.expanded ? this.body : this.cutText(this.body)) +'</p>'+
            '<div class="buttons">'+
                '<button type="button" class="btn btn-dark btn-show-comments">'+
                    '<span class="badge badge-light">'+ this.commentCount +'</span>'+
                    '<span class="icon-message-square"></span>'+
                    '<span class="icon-arrow-left hidden"></span>'+
                    '<span class="hidden"> Back</span>'+
                '</button>'+
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
        
        //TODO одинаковые события на разные кнопки
        //Comments button down
        this.getThisEl().querySelector('.btn-show-comments').addEventListener('click', function() {
            $.sendExpandFbEvent($.id);
        });
        
        //Click on the feedback's header
        this.getThisEl().querySelector('.text>h3').addEventListener('click', function() {
           $.sendExpandFbEvent($.id);
        });
    }
    
    placeCommentForm() {
        if(this.expanded == true) {
            this.commentForm = new FormAddComment(this.GFCLASS);
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
            document.querySelector('.' + this.GFCLASS)
                .dispatchEvent( new CustomEvent("expandFb", {
                    detail: {
                        id: id
                    }
                }
            ))
        } else {
            document.querySelector('.' + this.GFCLASS)
                .dispatchEvent( new CustomEvent("reloadFeedbacks", {
                    detail: {
                        id: id
                    }
                }
            ))
        }
    }
}