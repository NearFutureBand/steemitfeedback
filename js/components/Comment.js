class Comment {
    constructor(fbId, id, permlink, body, author, created, GFCLASS) {
        this.id = id;
        this.fbId = fbId;
        this.permlink = permlink;
        this.body = body;
        this.author = author;
        this.created = created;
        this.className = 'comment';
        this.GFCLASS = GFCLASS;
        this.yourVote = 0;
        this.likes = 0;
        this.dislikes;
        this.controlPanel = new ControlPanel('com-' + this.id, this.author, this.created, this.likes, this.dislikes );
    }
    
    getThisEl() {
        return document.querySelector('#com-' + this.fbId + '-' + this.id + '.row.' + this.className);
    }
    place() {
        let el = document.createElement('div');
        el.className = 'row ' + this.className;
        el.setAttribute('id', 'com-' + this.fbId + '-' + this.id);
        
        comment.innerHTML = 
            '<div class="col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile body-comment">'+
                '<div class="row">'+
                    '<div class="col-lg-9 col-md-9 text">'+
                        '<p>' + this.body + '</p>'+
                    '</div>'+
                    this.controlPanel.makeHTML() +
                '</div>'+
            '</div>';
        /*getBlockComments(data[1]).appendChild(comment);
        checkVoteColor(data[1], data[0]);
        addEventsForComLikes(data[1], data[0]);
        console.log("comment has been created: " + data[1] + " " + data[0]);*/
    }
    addEventListeners() {
        
    }
}