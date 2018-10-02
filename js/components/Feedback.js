class Feedback {
    constructor(id, permlink, type, heading, body, author, date, GFCLASS) {
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
        this.comments = [];
        this.likes = 0;
        this.dislikes = 0;
        this.controlPanel = new ControlPanel('fb-' + this.id, this.author, this.date, this.likes, this.dislikes);
    }
    getThisEl() {
        return document.querySelector('#fb-' + this.id + '.row' + '.' + this.className)
    }
    place() {
        let el = document.createElement('div');
        el.className = 'row ' + this.className;
        el.setAttribute('id', 'fb-' + this.id);
        
        el.innerHTML = 
            '<div class="container body-fb tile">'+
                '<div class="row">'+
                    '<div class="col-lg-9 col-md-9 text">'+
                        '<h3>'+ this.heading +'</h3>'+
                        '<p>'+ (this.expanded ? this.body : this.cutText(this.body)) +'</p>'+
                        '<div class="buttons">'+
                            '<button type="button" class="btn btn-dark btn-show-comments">'+
                                '<span class="badge badge-light">'+ this.comments.length +'</span>'+
                                '<span class="icon-message-square"></span>'+
                                '<span class="icon-arrow-left hidden"></span>'+
                                '<span class="hidden"> Back</span>'+
                            '</button>'+
                        '</div>'+
                    '</div>'+
                    this.controlPanel.makeHTML() + 
                '</div>'+
            '</div>'+
            '<div class="container comments"></div>';
        document.querySelector('.' + this.GFCLASS).appendChild(el);
        
        this.placeComments();
    }
    remove() {
        this.getThisEl().remove();
    }
    expand() {
        this.expanded = true;
        console.log('placing the following feedback: ');
        console.log(this);
        //this.restate();
    }
    
    addEventListeners() {
        let $ = this;
        
        //TODO одинаковые события на разные кнопки
        //Comments button down
        this.getThisEl().querySelector('.btn-show-comments').addEventListener('click', function() {
            document.querySelector('.' + this.GFCLASS)
                .dispatchEvent( new CustomEvent("expandFb", {
                    detail: {
                        $.id
                    }
                }
                ))
        });
        
        this.getThisEl().querySelector('.text>h3').addEventListener('click', function() {
            document.querySelector('.' + this.GFCLASS)
                .dispatchEvent( new CustomEvent("expandFb", {
                    detail: {
                        $.id
                    }
                }
                ))
        });
    }
    
    
    
    /*Not Interested*/
    cutText(text) {
        if( text.length > 400) text = text.slice(0, 399) + '...';
        return text;
    }
}