class ControlPanel {
    constructor(id, author, date, likes, dislikes) {
        this.id = id;
        this.author = author;
        this.date = date;
        this.likes = likes;
        this.dislikes = dislikes;
        this.className = 'control-panel';
    }
    
    makeHTML() {
        let exportHTML = 
            '<div class="'+ this.className +'">'+
                '<div class="control-panel-wrapper">'+
                    '<div class="author">'+ this.author +'</div>'+
                    '<div class="avatar">'+
                        '<div class="avatar-holder" style="background-image: url(\'http://www.xn--80aefdbw1bleoa1d.xn--p1ai//plugins/uit/mychat/assets/img/no_avatar.jpg\')"></div>'+
                    '</div>'+
                    '<div class="created">'+ this.date +'</div>'+
                    '<div class="vote-buttons">'+
                        '<button class="btn btn-light vote-like">Like <span class="badge badge-dark couter">'+ this.likes +'</span></button>'+
                        '<button class="btn btn-light vote-dislike">Dislike <span class="badge badge-dark couter">'+ this.dislikes +'</span></button>'+
                    '</div>'+
                '</div>'+
            '</div>';
        return exportHTML;
    }
}