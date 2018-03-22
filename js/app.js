golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

/*FORM FOR ADDING NEW NOTE*/
/*show form for adding new note*/
function openAddNoteForm(){
    document.getElementsByClassName('frm-add-note')[0].style.display = 'block';
    document.getElementsByClassName('btn-add-note')[0].style.display = 'none';
}

/*closing form for adding new note*/
function closeAddNoteForm(){
    document.getElementsByClassNameById('frm-add-note')[0].style.display = 'none';
    document.getElementsByClassNameById('btn-add-note')[0].style.display = 'block';
}

/*opening form for add new note*/
document.getElementsByClassName('btn-add-note')[0].addEventListener('click', function(){
    if (wif) {
        openAddNoteForm();
    }else{
        auth(openAddNoteForm());
    }
});

/*sending note to the database*/
document.getElementsByClassName('btn-add-note-done')[0].addEventListener('click', function(){
    var title = document.getElementById('formHeader').value;
    var body = document.getElementById('formText').value;
    var type = getIndexFromName(findCheckedRadio('formRadio',4));
    console.log('title: '+title+' body: '+body+' type: '+type);
    console.log(window.wif);
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
});

/*Loading notes*/
function loadNotes(){
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
    var note = document.createElement('div');
    note.className = 'row note';
    note.setAttribute('id',10);
    note.innerHTML = "<div class='col-lg-10 col-md-10 text'><h1>Lorem ipsum dolor sit.</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi necessitatibus sit soluta</p><div class='buttons d-flex justify-content-center'><button type='button' class='btn btn-light btn-show-comments'>Show comments (12)</button><button type='button' class='btn btn-light btn-add-comment'>Add comment</button></div></div><div class='col-lg-2 col-md-2 controls'><div class='name'><h6>Name Lastname</h6></div><div class='date'><small>13 марта 2018</small></div><div class='likes'><span>14</span><button type='button' class='btn btn-success btn-like'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-danger btn-dislike'><i class='fas fa-thumbs-down'></i></button><span>90</span></div></div>";
    document.getElementsByClassName('wrapper')[0].insertBefore(note,document.getElementsByClassName("btn-add-note")[0]);
    
    //event for btn-add-comment
    note.children[0].children[2].children[1].addEventListener('click', function(){
        openCommentForm(note.getAttribute('id'));
        note.children[0].children[2].children[1].style.display = 'none';
    });
    //event for btn-show-comments HERE
    note.children[0].children[2].children[0].addEventListener('click', function(){
        loadComments(note.getAttribute('id'));
        //HERE
        console.log(note.children[0].children[0].children[1].textContent);
    });
    console.log('added note, id = '+note.getAttribute('id'));
}
document.getElementsByClassName('btn-load-notes')[0].addEventListener('click', loadNotes);


/*COMMENTS*/
/*Loading comments from database - IN PROGRESS*/
function loadComments(noteId){
    //заглушка - тут цикл по всем найденным комментам
    console.log('comments for'+noteId);
    var comment = document.createElement('div');
    comment.className = 'row comment';
    comment.setAttribute('id','comment'+noteId);
    comment.innerHTML = "<div class='col-lg-10 offset-lg-1 offset-md-1 col-md-10'><div class='row'><div class='col-lg-10 col-md-10 text'><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi necessitatibus sit soluta</p></div><div class='col-lg-2 col-md-2 controls'><div class='name'><h6>Name Lastname</h6></div><div class='date'><small>13 марта 2018</small></div><div class='likes'><span>14</span><button type='button' class='btn btn-success'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-danger'><i class='fas fa-thumbs-down'></i></button><span>90</span></div></div></div></div>";
    document.getElementsByClassName('wrapper')[0].insertBefore(comment,document.getElementById(noteId).nextElementSibling);
}

/*printing all comments (or some if we add it like parameter)*/
document.getElementsByClassName('btn-show-comments')[0].addEventListener('click',function(){
    console.log('butShowComments, id='+this.parentElement.parentElement.parentElement.getAttribute('id'));
    loadComments(this.parentElement.parentElement.parentElement.getAttribute('id'));
});

/*Inserting form for adding a comment*/
function openCommentForm(noteId){
    console.log('openCommentForm for noteId = '+noteId);
    var commentForm = document.createElement('div');
    commentForm.className = 'row form frm-add-comment';
    commentForm.innerHTML = "<div class='col-lg-12'><form><div class='form-group'><div class='form-group'><textarea class='form-control' id='formCommentText' rows='3' placeholder='Type your comment here'></textarea></div></div><button type='button' class='btn btn-primary btn-add-comment-done'>Comment</button></form></div>";
   document.getElementsByClassName('wrapper')[0].insertBefore(commentForm,document.getElementById(noteId).nextElementSibling);
}

/*giveaway of events to buttons for adding comment */
Array.from(document.getElementsByClassName('btn-add-comment')).forEach(function(item){
    item.addEventListener('click', function(){
        openCommentForm(item.parentElement.parentElement.parentElement.getAttribute('id'));
        item.style.display = 'none';
    });
});

/*sending data from the form for adding comment*/
document.getElementsByClassName('btn-add-comment-done')[0].onclick = function(){
    var body = document.getElementById('formCommentText').value;
    console.log("comment has been added. Body: "+body);
    /*hide form and show button AddForm*/
}


/*other functions*/

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

