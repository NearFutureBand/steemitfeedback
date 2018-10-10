class Comment {
    constructor(fbId, id, permlink, body, author, created, likes, dislikes, myVote, mountPlace) {
        this.id = id;
        this.fbId = fbId;
        this.permlink = permlink;
        this.body = body;
        this.author = author;
        this.created = created;
        this.className = 'comment';
        this.myVote = 0;
        this.likes = 0;
        this.dislikes;
        this.controlPanel = new ControlPanel('com-' + this.id, this.author, this.created, this.likes, this.dislikes, this.myVote, 'comment-wrapper');
    }
    
    getThisEl() {
        return document.querySelector('#com-' + this.fbId + '-' + this.id + '.row.' + this.className);
    }
    place() {
        let el = document.createElement('div');
        el.className = 'col-lg-10 offset-lg-1 col-md-10 offset-md-1 ' + this.className;
        el.setAttribute('id', 'com-' + this.fbId + '-' + this.id);
        
        el.innerHTML = 
            '<div class="comment-wrapper tile">'+
                '<div class="text">'+
                    '<div class="text-block">'+
                        '<div class="body">'+ this.body +'</div>'+
                    '</div>'+
                '</div>'+
            
            '</div>';
        document.querySelector(this.mountPlace).appendChild(el);
        this.controlPanel.place();
        this.restate();
    }
    remove() {
        this.getThisEl().remove();
    }
    addEventListeners() {
        
    }
}