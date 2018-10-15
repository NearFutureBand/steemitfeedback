class FormAddFeedback {
    constructor(tabs, domain) {
        this.className = 'form-add-feedback';
        this.tabs = tabs;
        this.opened = false;
        this.chosenType = 'idea';
        this.textEditor = null;
        this.jsonMetadata = {tags: [], images: []};
        this.maxFeedbackSymbols = 5000;
        this.maxTitleSymbols = 400;
        this.domain = domain;
    }
    
    getThisEl() {
        return document.querySelector(`.${SFCLASS} .col-12.${this.className}`);
    }
    getDynBlock() {
        return this.getThisEl().querySelector('.form-type');
    }
    
    place() {
        if( ! this.opened) {
            this.opened = true;
            let el = document.createElement('div');
            el.className = `col-12 ${this.className}`;
            el.innerHTML = `
                <form class="wrapper tile">
                    <div class="form-title">
                        <span class="title">Header</span>
                        <input type="text" placeholder="My title is ..." required>
                    </div>
                    <div class="form-text">
                        <span class="title">Text</span>
                        <textarea placeholder="My feedback is ..." rows="5" id="feedback-body"></textarea>
                    </div>
                    <div class="form-type">
                        
                    </div>
                    <div class="utility">
                        <button class="btn btn-success button-send-form" type="submit">Submit</button>
                        <button class="btn btn-danger button-cancel-form" type="button">Cancel</button>
                    </div>
                </form>
            `;
            document.querySelector(MP).appendChild(el);
            this.addStaticEventListeners();
            
            this.textEditor = new TextEditor('#feedback-body', this.jsonMetadata);
            this.textEditor.place();
            this.restate();
        }
    }
    restate() {
        let el = this.getDynBlock();
        if( el.innerHTML != '') el.innerHTML = '';
        
        el.innerHTML = this.makeDynHTML();
        this.addDynEventListeners();
    }
    delete() {
        if (this.opened) {
            this.opened = false;
            this.getThisEl().remove();
        }
    }
    
    makeDynHTML() {
        let exportHTML = '';
        
        this.tabs.forEach( (tab, i) => {
            if( i > 0) {
                exportHTML += (`
                    <div class="check">
                        <input type="radio" name="type" value="${tab.key}" ${((tab.key == this.chosenType)? 'checked' : '')}>
                        <span class="label">${tab.key}</span>
                    </div>
                `);
            }
        });
        
        return exportHTML;
    }
    
    validate() {
        if( 
            this.textEditor.editor.getData().length < this.maxFeedbackSymbols
            && this.getTitle().value.length < this.maxTitleSymbols
          ) {
            return true;
        } else {
            return false;
        }
    }
    send() {
        let parentAuthor = '';
        let parentPermlink = 'fb';
        let author = username;
        let title = this.getTitle().value;
        let permlink = this.urlLit( title, 0 ) + '-' + Date.now().toString();
        let body = this.textEditor.editor.getData();
        this.jsonMetadata.tags = [this.domain, this.chosenType];
        this.jsonMetadata.images = TextEditor.attachedImages;
        
        console.log(this.jsonMetadata);
        console.log('title: '+title+' body: '+body+' tags: '+parentPermlink+' permlink: '+permlink+' json: '+ JSON.stringify(this.jsonMetadata));
        console.log(window.wif);
        
        steem.broadcast.comment(
            wif.posting,
            '', /*parentAuthor*/
            'fb', /*parentPermlink*/
            username, /*Author*/
            this.urlLit( title, 0 ) + '-' + Date.now().toString(), /*Permlink*/
            this.getTitle().value, /*Title*/
            this.textEditor.editor.getData(), /*Body*/
            JSON.stringify(this.jsonMetadata),
            (err, result) => {
                if ( ! err) {
                    this.getTitle.value = '';
                    this.textEditor.editor.setData('');
                    this.jsonMetadata = {tags: [], images: []};
                    document.querySelector(`.${SFCLASS}`).dispatchEvent( new CustomEvent('reloadFeedbacks'));
                    console.log(result);
                } else {
                    console.error(err);
                    ErrorController.showError(err.message);
                }
            });
    }
    
    addStaticEventListeners() {
        this.getThisEl().querySelector(' form.wrapper').addEventListener('submit', (e) => {
            e.preventDefault();
            auth( () => {
                if( this.validate() ) this.send();
            }, ['posting']);
            return false;
        });
        
        this.getThisEl().querySelector(' .button-cancel-form').addEventListener('click', () => {
            this.delete();
            document.querySelector(`.${SFCLASS}`).dispatchEvent(new CustomEvent('reloadFeedbacks'));
        });
        
    }
    addDynEventListeners() {
        Array.from( this.getThisEl().querySelectorAll('.form-type input[type="radio"]')).forEach( (inp) => {
            inp.addEventListener('click', () => {
                this.chosenType = inp.value;
            });
        })
    }
    
    getTitle() {
        return this.getThisEl().querySelector('.form-title>input');
    }
    
    /*Translates russian letters to translit form*/
    urlLit(w, v) { // cyrilic-to-translit-function
        let tr = 'a b v g d e ["zh","j"] z i y k l m n o p r s t u f h c ch sh ["shh","shch"] ~ y ~ e yu ya ~ ["jo","e"]'.split(' ');
        let ww = '';
        let cc, ch;
        w = w.toLowerCase();
        for (i = 0; i < w.length; ++i) {
            cc = w.charCodeAt(i);
            ch = (cc >= 1072 ? tr[cc - 1072] : w[i]);
            if (ch.length < 3) ww += ch;
            else ww += eval(ch)[v];
        }
        return (ww.replace(/[^a-zA-Z0-9\-]/g, '-').replace(/[-]{2,}/gim, '-').replace(/^\-+/g, '').replace(/\-+$/g, ''));
    }
}