/*Navigation bar with tabs with counters for filtering incoming feedbacks*/
class Filter {
    constructor() {
        this.tabs = [];
        this.createFilterTabs();
        this.activeTab = null; //Int 
        this.className = 'filter';
        this.currentFbSelector = [''];
        this.makeTabActive(0);
    }
    
    init() {
        this.place();
    }
    
    getThisEl() {
        return document.querySelector(GFCLASS +' .col-12.'+ this.className);
    }
    getDynBlock() {
        return document.querySelector('.'+ GFCLASS +' .col-12.'+ this.className +' .wrapper.tile');
    }
    makeDynHTML() {
        let exportHTML = '';
        this.tabs.forEach( function(tab) {
            exportHTML += ( tab.makeHTML() );
        });
        return exportHTML;
    }
    
    place() {
        let el = document.createElement('div');
        el.className = 'col-12 ' + this.className;
        el.innerHTML = 
                '<div class="wrapper tile">'+
                    
                '</div>';
        document.querySelector(MP).appendChild(el);
        this.restate();
    }
    
    restate() {
        let el = this.getDynBlock();
        if( el.innerHTML != '') el.innerHTML = '';
        
        this.setCounterAll();
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
                
                document.querySelector('.' + GFCLASS).dispatchEvent(new CustomEvent('reloadFeedbacks'));
                document.querySelector('.' + GFCLASS).dispatchEvent(new CustomEvent('hashChange'));
            });
        }
    }
    
    /*Incapsulated*/
    createFilterTabs() {
        this.tabs.push( new FilterTab('All', 'all', 'icon-radio-unchecked'));
        this.tabs.push( new FilterTab('Ideas', 'idea', 'icon-magic-wand'));
        this.tabs.push( new FilterTab('Problems', 'problem', 'icon-bug'));
        this.tabs.push( new FilterTab('Questions', 'question', 'icon-question'));
        this.tabs.push( new FilterTab('Thanks', 'thank', 'icon-gift'));
    }
    makeTabActive(index) {
        for(let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].active = false;
        }
        this.activeTab = index;
        this.currentFbSelector[0] = this.tabs[index].click();
    }
    incCounter(key) {
        this.getTabByKey(key).counter++;
    }    
    getTabByKey(key) {
        for(let i=0; i<this.tabs.length; i++) {
            if( this.tabs[i].key == key) return this.tabs[i];
        }
    }
    setCounterAll() {
        let sum = 0;
        for(let i=1; i<this.tabs.length; i++) {
            sum += this.tabs[i].counter;
        }
        this.tabs[0].counter = sum;
    }
    resetCounters() {
        for(let i=1; i<this.tabs.length; i++) {
            this.tabs[i].counter = 0;
        }
    }
}