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