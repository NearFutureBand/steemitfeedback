golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');


/*FORM FOR ADDING NEW NOTE*/
/*(done)*/
function openAddNoteForm(){
    document.getElementsByClassName('frm-add-note')[0].style.display = 'block';
    document.getElementsByClassName('btn-add-note')[0].style.display = 'none';
    removeNotes();
}

/*(done)*/
function closeAddNoteForm(){
    document.getElementsByClassName('frm-add-note')[0].style.display = 'none';
    document.getElementsByClassName('btn-add-note')[0].style.display = 'block';
    loadNotes();
}

/*opening form for adding new note (done)*/
document.getElementsByClassName('btn-add-note')[0].addEventListener('click', function(){
    if(wif){
        openAddNoteForm();
    }else{
        auth(openAddNoteForm());
    }
});

/*sending note to the database (done 0.8)*/
document.getElementsByClassName('btn-add-note-done')[0].addEventListener('click', function(){
    var title = document.getElementById('formHeader').value;
    var body = document.getElementById('formText').value;
    var type = getIndexFromName(findCheckedRadio('formRadio',4));
    console.log('title: '+title+' body: '+body+' type: '+type);
    //console.log(window.wif);
    /**
    * comment() добавить пост
    * @param {Base58} wif - приватный posting ключ
    * @param {String} parentAuthor - для создания поста, поле пустое
    * @param {String} parentPermlink - главный тег
    * @param {String} author - автор поста
    * @param {String} permlink - url-адрес поста
    * @param {String} title - заголовок поста
    * @param {String} body - текст поста
    * @param {String} jsonMetadata - мета-данные поста (изображения, и т.д.)
    */
    //wif - 5JCwo8Psq8vn6qBhkEPCbSV3TPVTWXkSVJxHK2LfwWfteUm3wdU";
    //      5JCwo8Psq8vn6qBhkEPCbSV3TPVTWXkSVJxHK2LfwWfteUm3wdU
    //var wif = "5JCwo8Psq8vn6qBhkEPCbSV3TPVTWXkSVJxHK2LfwWfteUm3wdU";
    /*var parentAuthor = '';
    var parentPermlink = 'tag';
    var author = 'golos-test';
    var permlink = 'test-url';
    //var title = 'titleTest';
    //var body = 'bodyTest';
    var jsonMetadata = '{}';
    golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
        //console.log(err, result);
        if ( ! err) {
            console.log('comment', result);
        }
        else console.error(err);
    });    */
    closeAddNoteForm();
    //SHOW MESSAGE ABOUT SUCCESSFUL SENDING
});

/*cancelling of adding form for creating feedback (done)*/
document.getElementsByClassName('btn-add-note-cancel')[0].addEventListener('click',function(){
    closeAddNoteForm();
});


/*NOTES*/
document.addEventListener('DOMContentLoaded', loadNotes);
//document.getElementsByClassName('btn-load-notes')[0].addEventListener('click', loadNotes);

/*Loading notes (done 0.5)*/
function loadNotes(){
    //gathering notes from the database
    /*console.log("here1");
    var query = {	
        select_authors: ['golos-test'],
        limit: 100,
    };
    golos.api.getDiscussionsByCreated(query, function(err, result) {
        console.log("here2");
        //console.log(err, result);
        if ( ! err) {
            result.forEach(function(item) {
                console.log("here3");
                var note = document.createElement("div");
                note.className = "row note";
                note.setAttribute("id",item.id);
                note.innerHTML = "<div class='col-lg-10 col-md-10 text'>              <h1>"+item.title+"</h1><p>"+item.body+"</p><div class='buttons d-flex justify-content-center'><button type='button' class='btn btn-light' id='butShowComments'>Show comments</button><button type='button' class='btn btn-light' id='butAddComment'>add comment</button></div></div><div class='col-lg-2 col-md-2 controls'><div class='name'><h6>"+item.author+"</h6></div><div class='date'><small>"+item.created+"</small></div><div class='likes'><span>14</span><button type='button' class='btn btn-success'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-danger'><i class='fas fa-thumbs-down'></i></button><span>90</span></div></div>";
                document.getElementById("wrapper").insertBefore(note,document.getElementById("butAddNote"));
                console.log('getDiscussionsByCreated', item.title);
            });
        }
        else console.error(err);
        console.log("here4");*/
    
    for(var i=0;i<2;i++){
        loadNote(i+1);
    }
}

/*Load only one note - may be applied with parameters (?)*/
function loadNote(noteId){
    var note = createNote(noteId);//сюда будем передавать все параметры для заполнения поста
    document.getElementsByClassName('wrapper')[0].appendChild(note);
    console.log('new note id = '+noteId);
    addEventsForCommentButtons(noteId);
    addEventsForNoteLikes(noteId);
    addEventForNoteHeader(noteId);
}

/*Remove one note with the given noteId*/
function removeNote(noteId){
    document.getElementById(noteId).remove();
}

/*Removing all the notes to open the form for adding new feedback*/
function removeNotes(){
    Array.from(document.getElementsByClassName('note')).forEach(function(item){
        item.remove();
    });
}

/*Opening all the comments and the form, removing all the rest*/
function expandNote(noteId){
    removeNotesExceptOne(noteId);
    loadComments(noteId);
    openCommentForm(noteId);
}

/*Event of expanding note - action like a button 'Comments'*/
function addEventForNoteHeader(noteId){
    var thisHeader = getNoteHeader(noteId);
    thisHeader.addEventListener('click',function(){
        if(thisHeader.getAttribute('data-permission')=='true'){
            expandNote(noteId);
            thisHeader.setAttribute('data-permission','false');
            getBtnShowComment(noteId).innerHTML = 'Hide comments';
        }
    });
    
} 

/*COMMENTS*/
/*Events for buttons inside note to manipulate comments (done)*/
function addEventsForCommentButtons(noteId){
    
    getBtnShowComment(noteId).addEventListener('click',function(){
        if(this.innerHTML == 'Comments'){
            expandNote(noteId);
            this.innerHTML = 'Hide comments'; 
            getNoteHeader(noteId).setAttribute('data-permission','false');
        }else{
            removeNote(noteId);
            loadNotes();
        }
    });
    
    /*getBtnAddComment(noteId).addEventListener('click',function(){
        openCommentForm(noteId);
        this.style.display = 'none';
    });*/
}

/*Loading comments from database - (done 0.5)*/
function loadComments(noteId){
    for(var i=0;i<2;i++){
        createComment('c'+i, noteId);//здесь будем передавать все параметры для заполнения коммента
    }
}

/*Removing all existing comments from note width given ID (done)*/
function hideComments(noteId){
    Array.from(getBlockComments(noteId).children).forEach(function(item){
        item.remove();    
    });
}

/*Inserting form for adding a comment  (done 0.5)*/
function openCommentForm(noteId){
    var commentForm = createCommentForm(noteId);
    document.getElementById(noteId).appendChild(commentForm);
    //событие нажатия на кнопку коммента готово
    addEventsForComDone(noteId);
}

/*event for button 'Comment' (btn-add-comment-done) - sending comment to the database (done)*/
function addEventsForComDone(noteId){    
    getBtnAddComDone(noteId).addEventListener('click',function(){
        var body = getTxtareaCom(noteId).value;
        console.log('comment to note '+noteId+'. Body: '+body);
        createComment(findUniqueIdForComment(noteId),noteId);
        
        var commentCount = Number(getLblCommentCount(noteId).innerHTML);
        getLblCommentCount(noteId).innerHTML = ++commentCount;
        getTxtareaCom(noteId).value = '';
    });
}

/*removing form for adding a comment (done 1/2)*/
function removeAddCommentForm(noteId){
    getBlockFormAddComment(noteId).remove();
    //Show message about successful comment
    getBtnAddComment(noteId).style.display = 'block';
}


/*LIKES & DISLIKES*/
/*Events for these buttons in notes */
function addEventsForNoteLikes(noteId){
    getBtnLikeNote(noteId).addEventListener('click',function(){
        var likes = Number(this.previousElementSibling.innerHTML);
        this.previousElementSibling.innerHTML = ++likes;
        console.log('like to note '+noteId);
    });
    getBtnDislikeNote(noteId).addEventListener('click',function(){
        var dislikes = Number(this.nextElementSibling.innerHTML);
        this.nextElementSibling.innerHTML = ++dislikes;
        console.log('like to note '+noteId);
    });
}

/*Events for these buttons in comments HERE*/
function addEventsForComLikes(noteId, comId){
    getBtnLikeCom(noteId,comId).addEventListener('click',function(){
        var likes = Number(this.previousElementSibling.innerHTML);
        this.previousElementSibling.innerHTML = ++likes;
        console.log('like to note '+noteId+' comment '+comId);
    });
    getBtnDislikeCom(noteId,comId).addEventListener('click',function(){
        var dislikes = Number(this.nextElementSibling.innerHTML);
        this.nextElementSibling.innerHTML = ++dislikes;
        console.log('dislike to note '+noteId+' comment '+comId);
    });
}


/*other functions*/
function findUniqueIdForComment(noteId){
    var blockComments = getBlockComments(noteId);
    var flag = false;
    var newId = Number(blockComments.children[blockComments.childElementCount-1].getAttribute('id').substr(1));
    while(flag==false){
        flag=true;
        for(var i=0; i<blockComments.childElementCount; i++){
            if(Number(blockComments.children[i].getAttribute('id').substr(1)) == newId){
                flag = false;
                newId = (Number(newId)+1);
            }
        }    
    }
    return 'c'+newId;
}

function removeNotesExceptOne(noteId){
    Array.from(document.getElementsByClassName('note')).forEach(function(item){
        if(item.getAttribute('id')!=noteId) item.remove();
    });
}

function findCheckedRadio(name,count){
    for(var i=0;i<count;i++){
        var radioButton = document.getElementById(name+i);
        if(radioButton.checked == true){
            return radioButton.getAttribute("id");  
        }
    }
    return null;
}

/*cuts an index from the given id*/
function getIndexFromName(name){
    var indexLength = name.length - 9;
    return name.slice(-indexLength);
}

function getBlockFormAddComment(noteId){
    return document.getElementById(noteId).children[document.getElementById(noteId).childElementCount-1];
}
function getBlockComments(noteId){
    return document.getElementById(noteId).children[2];
}
function getBtnShowComment(noteId){
    //row.note#noteId -> ...
    return document.getElementById(noteId).children[0].children[2].children[1];
}
/*function getBtnAddComment(noteId){
    return document.getElementById(noteId).children[0].children[2].children[2];
}*/
function getNoteHeader(noteId){
    return document.getElementById(noteId).children[0].children[0];
}
function getBtnAddComDone(noteId){
    return getBlockFormAddComment(noteId).children[0].children[0].children[0].children[1];
}
function getBtnLikeNote(noteId){
    return document.getElementById(noteId).children[1].children[2].children[1];
}
function getBtnDislikeNote(noteId){
    return document.getElementById(noteId).children[1].children[2].children[2];
}
function getComment(noteId, comId){
    var comment = null;
    Array.from(getBlockComments(noteId).children).forEach(function(item){
        if(item.getAttribute('id')==comId){
            comment = item;
        }
    });
    return comment;
}
function getBtnLikeCom(noteId, comId){
    return getComment(noteId,comId).children[1].children[2].children[1];
}
function getBtnDislikeCom(noteId, comId){
    return getComment(noteId,comId).children[1].children[2].children[2];
}
function getTxtareaCom(noteId){
    return getBlockFormAddComment(noteId).children[0].children[0].children[0].children[0].children[0];
}
function getLblCommentCount(noteId){
    return getBtnShowComment(noteId).previousElementSibling;
}

function createNote(noteId){
    var note = document.createElement('div');
    note.className = 'row note';
    note.setAttribute('id',noteId);
    note.innerHTML = "<div class='col-lg-10 col-md-10 tile text'><h1 data-permission='true'>Lorem ipsum dolor sit.</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi necessitatibus sit soluta</p><div class='buttons'><span>24</span><button type='button' class='btn btn-light btn-show-comments'>Comments</button></div></div><div class='col-lg-2 col-md-2 tile controls'><div class='name'><h6>Name Lastname</h6></div><div class='date'><small>13 марта 2018</small></div><div class='likes'><span>14</span><button type='button' class='btn btn-success btn-like'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-danger btn-dislike'><i class='fas fa-thumbs-down'></i></button><span>90</span></div></div><div class='col-lg-12 col-md-12 comments'></div>";
    
    /*note.innerHTML = "<div class='col-lg-10 col-md-10 tile text'><h1>Lorem ipsum dolor sit.</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi necessitatibus sit soluta</p><div class='buttons'><span>24</span><button type='button' class='btn btn-light btn-show-comments'>Comments</button><button type='button' class='btn btn-light btn-add-comment'>Add comment</button></div></div><div class='col-lg-2 col-md-2 tile controls'><div class='name'><h6>Name Lastname</h6></div><div class='date'><small>13 марта 2018</small></div><div class='likes'><span>14</span><button type='button' class='btn btn-success btn-like'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-danger btn-dislike'><i class='fas fa-thumbs-down'></i></button><span>90</span></div></div><div class='col-lg-12 col-md-12 comments'></div>"; - с кнопкой AddComment*/
    
    return note;
}
function createComment(comId, noteId){
    var comment = document.createElement('div');
    comment.className = 'row comment';
    comment.setAttribute('id',comId);
    comment.innerHTML = "<div class='col-lg-8 offset-lg-1 col-md-8 offset-md-1 text tile'><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi necessitatibus sit soluta</p></div><div class='col-lg-2 col-md-2 controls tile'><div class='name'><h6>Name Lastname</h6></div><div class='date'><small>13 марта 2018</small></div><div class='likes'><span>14</span><button type='button' class='btn btn-success btn-com-like'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-danger btn-com-dislike'><i class='fas fa-thumbs-down'></i></button><span>90</span></div></div>";
    getBlockComments(noteId).appendChild(comment);
    addEventsForComLikes(noteId,comId);
}
function createCommentForm(noteId){
    var commentForm = document.createElement('div');
    commentForm.className = 'col-lg-12 col-md-12 frm frm-add-com';
    commentForm.innerHTML = "<div class='row'><div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile'><form><div class='form-group'><textarea class='form-control' id='commentBody' rows='3' placeholder='Type your comment here'></textarea></div><button type='button' class='btn btn-primary btn-add-com-done'>Done</button></form></div></div>";
    return commentForm;
}


/*copied scripts for buttons in nav*/
async function getUrls() {
    if (wif == '') {
        await auth();
    } else {
        golos.api.getContent(username, constPermlik, function(err, result) {
            result.id == 0 ? swal({
                html: document.getElementById('no-records-IPFS').innerHTML
            }) : getPostJson(username, constPermlik, result);
            if (err) swal(err);
        });
    }
}
document.getElementById('golos-urls').onclick = getUrls;
document.getElementById('aboutGolosFeedbackCallBtn').addEventListener('click', () => {
        swal({
            title: document.getElementById('about-html-title').innerHTML,
            html: document.getElementById('about-html').innerHTML,
            type: 'info',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-success btn-lg',
            confirmButtonText: document.getElementById('button-cool').innerHTML,
            position: 'top',
            showCloseButton: true
        });
    }, false);
document.getElementById('integration').addEventListener('click', function(e) {
        swal({
            title: 'About integration!',
            html: document.getElementById('integration-html').innerHTML,
            type: 'info',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-success btn-lg',
            confirmButtonText: '<span class="icon-checkmark"></span> Cool!',
            position: 'top',
            showCloseButton: true
        })
    })

