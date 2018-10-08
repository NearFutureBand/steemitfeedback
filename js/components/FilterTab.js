class FilterTab {
    constructor(name, key, icon) {
        this.name = name;
        this.key = key;
        this.counter = 0;
        this.icon = icon;
        this.active = false;
    }
    
    makeHTML() {
        return '<div class="tab '+ (this.active ? 'active' : '') +'" href="#'+ this.key +'" data-target="'+ this.key +'">'+this.name+' <span class="badge badge-light couter">0</span></div>';
    }
    
    getThisEl() {
        return document.querySelector('.' + GFCLASS + ' div.tab[data-target="'+ this.key +'"]');
    }
    
    /*Events*/
    click() {
        this.active = true;
        return this.key;
    }
    
    
    /*Not Interesting*/
}