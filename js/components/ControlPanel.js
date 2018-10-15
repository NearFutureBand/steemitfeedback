class ControlPanel {
    constructor(id, author, date, permlink, likes, dislikes, myVote, mountPlace) {
        this.id = `cp-${id}`;
        this.author = author;
        this.date = date;
        this.permlink = permlink;
        this.likes = likes;
        this.dislikes = dislikes;
        this.myVote = myVote;
        this.mountPlace = `.${SFCLASS} #${id} .${mountPlace}`;
        this.className = 'control-panel';
    }
    getThisEl() {
        return document.querySelector(`.${SFCLASS} #${this.id}.${this.className}`);
    }
    getDynBlock() {
        return this.getThisEl().querySelector('.vote-buttons');
    }
    
    place() {
        let el = document.createElement('div');
        el.className = this.className;
        el.id = this.id;
        el.innerHTML = `
            <div class="control-panel-wrapper">
                <div class="author-and-date">
                    <span class="author">${this.author}</span>
                    <span class="created">${this.date}</span>
                </div>
                <div class="avatar">
                    <div class="avatar-holder" style="background-image: url(\'http://www.xn--80aefdbw1bleoa1d.xn--p1ai//plugins/uit/mychat/assets/img/no_avatar.jpg\')"></div>
                </div>
                <div class="vote-buttons">
                        
                </div>
            </div>
        `;
        document.querySelector(this.mountPlace).appendChild(el);
        this.restate();
    }
    restate(){
        let el = this.getDynBlock();
        if( el.innerHTML != '') el.innerHTML = '';
        
        el.innerHTML = this.makeDynHTML();
        this.addDynEventListeners();
    }
    makeDynHTML() {
        let exportHTML = `
            <button class="btn ${( (this.myVote == 1) ? 'btn-success' : 'btn-light')} vote-like">
                <span class="icon-thumbs-up"></span>
                <span class="badge badge-dark counter">${this.likes}</span>
            </button>
            <button class="btn ${( (this.myVote == -1) ? 'btn-danger' : 'btn-light')} vote-dislike">
                <span class="icon-thumbs-down"></span>
                <span class="badge badge-dark counter">${this.dislikes}</span>
            </button>
        `;
        return exportHTML;
    }
    delete() {
        if(this.getThisEl() != null ) this.getThisEl().remove();
    }
    
    addDynEventListeners() {
        this.getThisEl().querySelector('button.vote-like').addEventListener('click', () => {
            
            auth( () => {
                
                steem.broadcast.vote(wif.posting, username, this.author, this.permlink, (this.myVote == 1)? 0 : 10000, (err, result) => {
                    console.log(err, result);
                    if ( ! err) {
                        if( this.myVote == 1) {
                            this.likes--;
                            this.myVote = 0;
                        } else {
                            this.resetMyVote();
                            this.likes++;
                            this.myVote = 1;
                        }
                        
                        this.restate();
                    } else {
                        ErrorController.showError(err.message);
                    }
                });
            }, ['posting']);
        });
        
        this.getThisEl().querySelector('button.vote-dislike').addEventListener('click', () => {
            
            auth( () => {
                
                steem.broadcast.vote(wif.posting, username, this.author, this.permlink, (this.myVote == -1)? 0 : -10000, (err, result) => {
                    console.log(err, result);
                    if ( ! err) {
                        if( this.myVote == -1) {
                            this.dislikes--;
                            this.myVote = 0;                           
                        } else {
                            this.resetMyVote();
                            this.dislikes++;
                            this.myVote = -1;
                        }
                        
                        this.restate();
                    } else {
                        ErrorController.showError(err.message);
                    }
                });
            }, ['posting']);
        });
    }
    
    resetMyVote() {
        if( this.myVote == -1) this.dislikes--;
        if( this.myVote == 1) this.likes--;
    }
}