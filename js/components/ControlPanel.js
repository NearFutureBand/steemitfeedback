class ControlPanel {
    constructor(id, author, date, likes, dislikes) {
        this.id = id;
        this.author = author;
        this.date = date;
        this.likes = likes;
        this.dislikes = dislikes;
        this.className = 'controls';
    }
    
    makeHTML() {
        return '<div class="col-lg-3 col-md-3 '+ this.className +'" id="ctrl-'+ this.id +'">'+
                   '<div class="controls-wrapper">'+
                       '<div class="name">'+
                           '<h6>'+ this.author +'</h6>'+
                       '</div>'+
                       '<div class="photo">'+
                           '<img src="http://www.xn--80aefdbw1bleoa1d.xn--p1ai//plugins/uit/mychat/assets/img/no_avatar.jpg">'+
                       '</div>'+
                       '<div class="date">'+
                           '<small>'+ this.date +'</small>'+
                       '</div>'+
                       '<div class="likes">'+
                           '<button type="button" class="btn btn-secondary btn-vote" data-like="1">'+
                               '<span class="badge badge-dark">'+ this.likes +'</span>'+
                               '<span class="icon-thumbs-up"></span>'+
                           '</button>'+
                           '<button type="button" class="btn btn-secondary btn-vote" data-like="0">'+
                               '<span class="icon-thumbs-down"></span>'+
                               '<span class="badge badge-dark">'+ this.dislikes +'</span>'+
                           '</button>'+
                       '</div>'+
                   '</div>'+
                '</div>';
    }
}