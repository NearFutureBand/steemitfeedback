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
                
                document.querySelector('.' + $.GFCLASS).dispatchEvent(new CustomEvent('fbSelectorChange'));
                document.querySelector('.' + $.GFCLASS).dispatchEvent(new CustomEvent('hashChange'));
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
}