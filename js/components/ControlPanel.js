class ControlPanel {
    constructor(id, author, date, likes, dislikes, myVote, mountPlace) {
        this.id = 'cp-' + id;
        this.author = author;
        this.date = date;
        this.likes = likes;
        this.dislikes = dislikes;
        this.myVote = myVote;
        this.mountPlace = '.' + GFCLASS + ' #' + id + ' .' + mountPlace;
        this.className = 'control-panel';
    }
    getThisEl() {
        return document.querySelector('.' + GFCLASS + ' #'+ this.id + '.' + this.className);
    }
    getDynBlock() {
        return this.getThisEl().querySelector('.vote-buttons');
    }
    
    place() {
        let el = document.createElement('div');
        el.className = this.className;
        el.id = this.id;
        el.innerHTML = 
                '<div class="control-panel-wrapper">'+
                    '<div class="author">'+ this.author +'</div>'+
                    '<div class="avatar">'+
                        '<div class="avatar-holder" style="background-image: url(\'http://www.xn--80aefdbw1bleoa1d.xn--p1ai//plugins/uit/mychat/assets/img/no_avatar.jpg\')"></div>'+
                    '</div>'+
                    '<div class="created">'+ this.date +'</div>'+
                    '<div class="vote-buttons">'+
                        
                    '</div>'+
                '</div>';
        document.querySelector(this.mountPlace).appendChild(el);
        this.restate();
    }
    restate(){
        let el = this.getDynBlock();
        if( el.innerHTML != '') el.innerHTML = '';
        
        el.innerHTML = this.makeDynHTML();
        this.addEventListeners();
    }
    makeDynHTML() {
        let exportHTML = 
            '<button class="btn btn-light vote-like">'+
                'Like '+
                '<span class="badge badge-dark counter">'+ this.likes +'</span>'+
            '</button>'+
            '<button class="btn btn-light vote-dislike">'+
                'Dislike '+
                '<span class="badge badge-dark counter">'+ this.dislikes +'</span>'+
            '</button>';
        return exportHTML;
    }
    remove() {
        this.getThisEl().remove();
    }
    
    addEventListeners() {
        this.getThisEl().querySelector('button.vote-like').addEventListener('click', () => {
            //like
            //если лайк еще не был нажатым
            //this.resetMyVote();
            //this.likes++;
            //this.myVote = 1;
            //если лайк уже был нажатым - this.likes--; this.myVote = 0;
        });
        this.getThisEl().querySelector('button.vote-dislike').addEventListener('click', () => {
            //dislike
            //this.resetMyVote();
            //this.dislikes++;
            //this.myVote = -1;
        });
    }
    
    resetMyVote() {
        if( this.myVote == -1) this.dislikes--;
        if( this.myVote == 1) this.likes--;
    }
}