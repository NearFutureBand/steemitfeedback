/*
    makeDynHTML() - returns HTML code of the exemplar that will be constantly changing
    getThisEl() - returns js variable of the exemplar by using querySelector
    place() - places the exemplar to the DOM structure, it is executing only one time
    restate() - rebuilds the structure of the exemplar with updated dynamic parameters
    
*/

class FilterTab {
    constructor(name, key, icon, GFCLASS) {
        this.name = name;
        this.key = key;
        this.counter = 0;
        this.icon = icon;
        this.active = false;
        this.GFCLASS = GFCLASS;
    }
    
    makeHTML() {
        return '<a class="nav-link tab '+ (this.active ? 'active' : '') +'" href="#'+ this.key +'" data-target="'+ this.key +'">'+
                    '<span class="'+ this.icon +'"></span> '+ this.name +
                    ' <span class="tab-label"> ('+ this.counter +') </span>' +
                '</a>';
    }
    
    getThisEl() {
        return document.querySelector('.' + this.GFCLASS + ' a.nav-link.tab[data-target="'+ this.key +'"]');
    }
    
    /*Events*/
    click() {
        this.active = true;
        return this.key;
    }
}

/*Navigation bar with tabs with counters for filtering incoming feedbacks*/
class Filter {
    constructor(GFCLASS) {
        this.GFCLASS = GFCLASS;
        this.tabs = [];
        this.createFilterTabs(this.GFCLASS);
        this.activeTab = null;
        this.className = 'nav-filter';
        this.currentFbSelector = [''];
        this.makeTabActive(0);
    }
    
    init() {
        this.place();
    }
    
    makeDynHTML() {
        let exportHTML = '';
        this.tabs.forEach( function(tab) {
            exportHTML += ('<li class="nav-item">'+ tab.makeHTML() + '</li>');
        });
        return exportHTML;
    }
    
    place() {
        let el = document.createElement('div');
        el.className = 'row ' + this.className;
        el.innerHTML = 
            '<div class="col-12">'+
                '<nav class="navbar navbar-expand-lg tabs">'+
                    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavFeedbackTabs" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">'+
                        '<span class="navbar-toggler-icon"></span>'+
                    '</button>'+
                    '<div class="collapse navbar-collapse d-flex justify-content-center" id="navbarNavFeedbackTabs">'+
                        '<div class="container">'+
                            '<div class="row">'+
                                '<div class="col-12 tabs">'+
                                    '<ul class="nav nav-tabs">'+
                                        
                                    '</ul>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</nav>'+
            '</div>';
        document.querySelector('.' + this.GFCLASS).appendChild(el);
        this.restate();
    }
    
    restate() {
        let el = this.getDynBlock();
        if( el.innerHTML != '') el.innerHTML = '';
        el.innerHTML = this.makeDynHTML();
        this.addEvntClk();
    }
    
    /*Events*/
    addEvntClk() {
        let $ = this;
        for( let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].getThisEl().addEventListener('click', function() {
                $.makeTabActive(i);
                console.log($.currentFbSelector);
                $.restate();
            });
        }
    }
    
    /*Incapsulated*/
    getThisEl() {
        return document.querySelector('.'+ this.GFCLASS +' .row.'+ this.className);
    }
    getDynBlock() {
        return document.querySelector('.'+ this.GFCLASS +' .row.'+ this.className +' ul.nav.nav-tabs');
    }
    createFilterTabs(GFCLASS) {
        this.tabs.push( new FilterTab('All', 'all', 'icon-radio-unchecked', GFCLASS));
        this.tabs.push( new FilterTab('Ideas', 'idea', 'icon-magic-wand', GFCLASS));
        this.tabs.push( new FilterTab('Problems', 'problem', 'icon-bug', GFCLASS));
        this.tabs.push( new FilterTab('Questions', 'question', 'icon-question', GFCLASS));
        this.tabs.push( new FilterTab('Thanks', 'thank', 'icon-gift', GFCLASS));
    }
    makeTabActive(index) {
        for(let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].active = false;
        }
        this.activeTab = index;
        this.currentFbSelector[0] = this.tabs[index].click();
    }
    incCounter(index) {
        
    }
    getTabByKey(key) {
        for( let i = 0; i < this.tabs.length; i++) {
            if( this.tabs[i].key == key) return this.tabs[i];
        }
        console.log('getTabByKey function error: not found element with this key');
        return null;
    }
    
}

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
                        '<p>'+ this.body +'</p>'+
                        '<div class="buttons">'+
                            '<button type="button" class="btn btn-dark btn-show-comments">'+
                                '<span class="badge badge-light">'+ this.comments.length +'</span>'+
                                '<span class="icon-message-square"></span>'+
                                '<span class="icon-arrow-left hidden"></span>'+
                                '<span class="hidden"> Back</span>'+
                            '</button>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-lg-3 col-md-3 controls">'+
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
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="container comments"></div>';
        console.log('.' + this.GFCLASS);
        document.querySelector('.' + this.GFCLASS).appendChild(el);
        /*<div class="row fb" id="381" data-permlink="thank-1537600262697" data-opened="0" data-like="0"><div class="container body-fb tile"><div class="row"><div class="col-lg-9 col-md-9 text"><h3>thank</h3><p></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget mi dapibus, consequat mauris eget, rutrum diam. Vivamus in velit at libero vestibulum faucibus vel vitae enim. Suspendisse feugiat, enim vel aliquet volutpat, sem risus molestie neque, non faucibus nisl massa sit amet purus. Aenean pharetra, nibh sit amet venenatis pretium, elit libero tempus mauris, bibendum imperdiet diam ...</p><div class="buttons"><button type="button" class="btn btn-dark btn-show-comments"><span class="badge badge-light">0</span><span class="icon-message-square"></span><span class="icon-arrow-left hidden"></span><span class="hidden"> Back</span></button></div></div><div class="col-lg-3 col-md-3 controls"><div class="controls-wrapper"><div class="name"><h6>test4</h6></div><div class="photo"><img src="http://www.xn--80aefdbw1bleoa1d.xn--p1ai//plugins/uit/mychat/assets/img/no_avatar.jpg"></div><div class="date"><small>September 22nd 2018, 7:11:24 am</small></div><div class="likes"><button type="button" class="btn btn-secondary btn-vote" data-like="1"><span class="badge badge-dark">0</span><span class="icon-thumbs-up"></span></button><button type="button" class="btn btn-secondary btn-vote" data-like="0"><span class="icon-thumbs-down"></span><span class="badge badge-dark">0</span></button></div></div></div></div></div><div class="container comments"></div></div>*/
    }
}
class Comment {
    
}
class ControlPanel {
    
}

class GolosFeedback {
    constructor() {
        this.className = 'golos-feedback-container';
        this.initBootstrapStructure();
        this.navbar2 = new Filter(this.className);
        this.feedbacks = [];
        this.feedbacks.push( new Feedback(0,'blablabla','idea' ,'title','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','author', '28-04-2018', this.className));
        this.feedbacks.push( new Feedback(1,'eeeeeeeeeee','thank' ,'feedback here','Aliquam eget mi dapibus, consequat mauris eget, rutrum diam.','Vasya', '03-06-2018', this.className));
    }
    
    init() {
        this.navbar2.init();
        this.feedbacks[0].place();
        this.feedbacks[1].place();
    }
    
    initBootstrapStructure() {
        this.getThisEl().classList.add('container');
    }
    
    getThisEl() {
        return document.querySelector('.' + this.className);
    }
}

var GF = new GolosFeedback();
GF.init();
