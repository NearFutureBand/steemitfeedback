golos.config.set('websocket', 'wss://ws.testnet.golos.io');
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

/*opening form for adding new note*/
document.getElementsByClassName('btn-add-note')[0].addEventListener('click', function(){
    openAddNoteForm();
});

/*sending note to the database*/
document.getElementsByClassName('frm-add-note')[0].addEventListener('submit', function(e){
    e.preventDefault();
    if(wif){
        sendAddNoteForm();
    }else{
        auth(sendAddNoteForm);
    }
    return false;
});
function sendAddNoteForm(){
    //wif test3 testnet1 5Hvp79CaQrYUD9d33VvdtWY5BhyimS4t5vMDCBJE1WsTUUPuu1F";
    document.querySelector('.lding').style.display = 'block';
    var parentAuthor = '';
    var parentPermlink = 'fb '+findCheckedRadio();
    var author = username;
    var permlink = 'post-' + parentPermlink + '-' + Date.now();
    var title = document.getElementById('formHeader').value;
    var body = document.getElementById('formText').value;
    var jsonMetadata = '';
    console.log('title: '+title+' body: '+body+' tags: '+parentPermlink);
    console.log(window.wif);
    golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
        //console.log(err, result);
        if ( ! err) {
            console.log('comment', result);
        }
        else console.error(err);
    });
    
    document.getElementById('formHeader').value = '';
    document.getElementById('formText').value = '';
    closeAddNoteForm();
    document.querySelector('.lding').style.display = 'none';
    //SHOW MESSAGE ABOUT SUCCESSFUL SENDING
}

/*cancelling of adding form for creating feedback (done)*/
document.getElementsByClassName('btn-add-note-cancel')[0].addEventListener('click',function(){
    closeAddNoteForm();
});


/*NOTES*/
document.addEventListener('DOMContentLoaded', loadNotes);

/*Loading notes (DONE)*/
//gathering notes from the database - from branch 'recently added' - searching with 'author'
function loadNotes(){
    document.querySelector('.lding').style.display = 'block';
    var query = {
        select_tags: ['auto', 'tag'],
        select_authors: ['test3'],
        limit: 100
    };
    golos.api.getDiscussionsByCreated(query, function(err, result) {
        //console.log(err, result);
        
        if ( ! err){
            result.forEach(function(item) {
                console.log(item);
                createNote(formData(item));
            });
        }
        else console.error(err);
    });
    
    //загрузка тестового поста через permlink
    golos.api.getContent('test3', 'post-tag-1522967956841', function(err, result) {
        //console.log(err, result);
        if (!err){
            console.log(result);
            createNote(formData(result));
        }
        else console.error(err);
    });
    
    //создание записей через массив с данными (для работы без интернета)
    /*for(var i=0;i<2;i++){
        data.push(i+1);//0
        data.push('Lorem ipsum dolor sit amet, consectetur');//1
        data.push('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos, praesentium, animi! Cumque ipsam corporis unde a laboriosam sequi accusamus natus doloremque aliquid, suscipit delectus, sint recusandae fugit quasi, expedita velit.');//2
        data.push(2);// 3 count of comments
        data.push('Name Surname');//4 author
        data.push('may-28-2018');//5 created
        data.push(3);//6 likes
        data.push(10);//7 dislikes
        data.push('permlink');
        createNote(data);
        data = [];
    }*/
    
    document.querySelector('.lding').style.display = 'none';
}

/*Remove one note with the given noteId*/
function removeNote(noteId){
    document.getElementById(noteId).remove();
}

/*reload or expand note*/
function reloadNote(noteId,expanded,loading,removeAll){
    
    // on/off loading animation
    if(loading==true){
        document.querySelector('.lding').style.display = 'block';
    }
    
    var permlink = getNotePermlink(noteId);
    var author = getNoteAuthor(noteId);
    
    //remove all - for the expanding mode, remove one - for the reloading mode
    if(removeAll==true){
        removeNotes();
    }else{
        removeNote(noteId);
    }
    
    golos.api.getContent(author, permlink, function(err, result) {
        //console.log(err, result);
        if (!err) {
            console.log(result);
            createNote(formData(result));
            toggleBtnCom(noteId);
            
            //if the note was expanded
            if(expanded==true){
                document.getElementById(noteId).setAttribute('data-opened',1);
                loadComments(noteId);
                createCommentForm(noteId);
            }
        }
        else console.error(err);
    });
    
    if(loading==true){
        document.querySelector('.lding').style.display = 'none';
    }
    
}

/*Removing all the notes in the wrapper*/
function removeNotes(){
    Array.from(document.getElementsByClassName('note')).forEach(function(item){
        item.remove();
    });
}

/*Event of expanding note - action like a button 'Comments'*/
function addEventForNoteHeader(noteId){
    getNoteHeader(noteId).addEventListener('click',function(){
        toggleBtnCom(noteId);
        if(document.getElementById(noteId).getAttribute('data-opened') == '0'){
            reloadNote(noteId,true,true,true);
        }else{
            removeNotes();
            loadNotes();
        }
    });
} 


/*COMMENTS*/
/*Events for buttons inside note to manipulate comments (done)*/
function addEventsForCommentButtons(noteId){
    getBtnShowComment(noteId).addEventListener('click',function(){
        
        if(document.getElementById(noteId).getAttribute('data-opened') == '0'){
            reloadNote(noteId,true,true,true);
        }else{
            removeNotes();
            loadNotes();
        }
    });
}

/*Loading comments from database - (done 0.5)*/
function loadComments(noteId){
    golos.api.getContentReplies(getNoteAuthor(noteId), getNotePermlink(noteId), function(err, result) {
        //console.log(err, result);
        if (!err) {
            result.forEach(function(item) {
                console.log('getContentReplies', item);
                createComment(formDataCom(item,noteId));
            });
        }
        else console.error(err);
    });
    //цикл для работы без интернета
    /*for(var i=0;i<2;i++){
        data.push('c'+(i+1));
        data.push(noteId);
        data.push('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos, praesentium, animi! Cumque ipsam corporis unde a laboriosam sequi accusamus natus doloremque aliquid.');
        data.push('Name Surname');//author
        data.push('may-28-2018');//created
        data.push(3);//likes
        data.push(10);//dislikes
        createComment(data);
        data = [];
    }*/
}

/*Removing all existing comments from note width given ID (done)*/
function hideComments(noteId){
    Array.from(getBlockComments(noteId).children).forEach(function(item){
        item.remove();    
    });
}

/*event for button 'Comment' (btn-add-comment-done) - sending comment to the database (done)*/
function addEventsForComDone(noteId){
    getAddComForm(noteId).addEventListener('submit',function(e){
        e.preventDefault();
        //auth();
        if(wif){
            sendAddComForm(noteId);
        }else{
            auth(sendAddComForm.bind(this, noteId));
        }
        return false;
    });
}
var sendAddComForm = function(noteId){
    document.querySelector('.lding').style.display = 'block';
    var parentAuthor = getNoteAuthor(noteId);
    var parentPermlink = getNotePermlink(noteId);
    var author = username;
    var permlink = 're-' + parentAuthor + '-' + parentPermlink + '-' + Date.now();
    var title = '';
    var body = getTxtareaCom(noteId).value;
    var jsonMetadata = '{}';
    console.log('comment to note '+noteId+'. Body: '+body);
    golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
        //console.log(err, result);
        if (!err) {
            console.log('comment', result);
        }
        else console.error(err);
    });
    getTxtareaCom(noteId).value = '';
    document.querySelector('.lding').style.display = 'none';
}


/*LIKES & DISLIKES*/
/*Events for these buttons in comments (new)*/
function addEventsForNoteLikes(noteId){
    getBtnVoteNote(noteId).forEach(function(item){
        item.addEventListener('click', function(){
            var isLike = Number(item.getAttribute('data-like'));
            voteForNote(noteId,isLike);
            if(wif){
                voteForNote(noteId,isLike);
            }else{
                auth(voteForNote.bind(this, noteId,isLike));
            }
        });
    });
}
var voteForNote = function(noteId,like){
    if(like==1){
        weight = 10000;
    }else{
        weight = -10000;
    }
    setLikeLblNote(noteId,weight/10000);
    golos.broadcast.vote(wif, username, getNoteAuthor(noteId), getNotePermlink(noteId), weight, function(err, result) {
        console.log(err, result);
    });
}

function addEventsForComLikes(noteId, comId){
    getBtnVoteCom(noteId,comId).forEach(function(item){
        item.addEventListener('click', function(){
            var isLike = Number(item.getAttribute('data-like'));
            if(wif){
                voteForCom(noteId,comId,isLike);
            }else{
                auth(voteForCom.bind(this, noteId,comId,isLike));
            }
        });
    });
}
var voteForCom = function(noteId,comId,like){
    if(like==1){
        weight = 10000;
    }else{
        weight = -10000;
    }
    console.log(username);
    golos.broadcast.vote(wif, username, getNoteAuthor(noteId), getComPermlink(noteId,comId), weight, function(err, result){
        console.log(err, result);
    });
}

/*other functions*/
function findUniqueIdForComment(noteId){
    var blockComments = getBlockComments(noteId);
    var flag = false;
    var newId = 0;
    if(blockComments.childElementCount()!=0){
        newId = Number(blockComments.children[blockComments.childElementCount-1].getAttribute('id').substr(1));
    }
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

function findCheckedRadio(){
    let res = '';
    Array.from(getBlockAddNote().getElementsByClassName('form-check-input')).forEach(function(item){
        if(item.checked==true){
            res = item.getAttribute('id').split('-')[1].toString();
        }
    });
    return res;
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
    return document.getElementById(noteId).getElementsByClassName('comments')[0];
}
function getBtnShowComment(noteId){
    return document.getElementById(noteId).getElementsByClassName('btn-show-comments')[0];
}
function getNoteHeader(noteId){
    return document.getElementById(noteId).getElementsByClassName('text')[0].children[0];
}
function getBtnAddComDone(noteId){
    return getBlockFormAddComment(noteId).getElementsByClassName('btn-add-com-done')[0];
}
function getAddComForm(noteId){
    return getBlockFormAddComment(noteId).children[0].children[0].children[0];
}
function getNoteControls(noteId){
    return document.getElementById(noteId).getElementsByClassName('controls')[0];
}
function getBtnVoteNote(noteId){
    return Array.from( getNoteControls(noteId).getElementsByClassName('btn-vote'));
}
function getComment(noteId, comId){
    var comment;
    Array.from(getBlockComments(noteId).children).forEach(function(item){
        console.log(comId+' '+item.getAttribute('id'));
        if(item.getAttribute('id')==comId){
            comment = item;
        }
    });
    return comment;
}
function getBlockAddNote(){
    return document.getElementsByClassName('frm-add-note')[0];
}

function getBtnVoteCom(noteId,comId){
    return Array.from(getComment(noteId,comId).getElementsByClassName('btn-com-vote'));
}

function getTxtareaCom(noteId){
    return getBlockFormAddComment(noteId).getElementsByClassName('txt-add-com')[0];
}
function getLblCommentCount(noteId){
    return getBtnShowComment(noteId).children[0];
}
function getNoteAuthor(noteId){
    return getNoteControls(noteId).getElementsByClassName('name')[0].children[0].innerHTML;
}
function getNotePermlink(noteId){
    return document.getElementById(noteId).getAttribute('data-permlink');
}
function getComPermlink(noteId,comId){
    console.log(getComment(noteId,comId));
    return getComment(noteId,comId).getAttribute('data-permlink');
}
function getNoteLikes(noteId,isLike){
    if (isLike==true){
        return getNoteControls(noteId).getElementsByClassName('btn-vote')[0];
    }
    else return getNoteControls(noteId).getElementsByClassName('btn-vote')[1];
    
}

//Lighting up buttons for voting (note)
function setLikeLblNote(noteId,add){
    let votes;
    //жмём на лайк - работает только если лайк еще не стоит
    if(add>0){
        if(document.getElementById(noteId).getAttribute('data-like')!=1){
            
            //если стоял дизлайк - его убрать
            if(document.getElementById(noteId).getAttribute('data-like')==-1){
                votes = Number(getNoteLikes(noteId,false).nextElementSibling.innerHTML);
                getNoteLikes(noteId,false).nextElementSibling.innerHTML = --votes;
                getNoteLikes(noteId,false).classList.remove('btn-danger');
            }
            votes = Number(getNoteLikes(noteId,true).previousElementSibling.innerHTML);
            getNoteLikes(noteId,true).previousElementSibling.innerHTML = ++votes;
            getNoteLikes(noteId,true).classList.add('btn-success');
            document.getElementById(noteId).setAttribute('data-like',1);
            
        }else{
            
            //нажатие на уже поставленный лайк = отмена лайка
            votes = Number(getNoteLikes(noteId,true).previousElementSibling.innerHTML);
            getNoteLikes(noteId,true).previousElementSibling.innerHTML = --votes;
            getNoteLikes(noteId,true).classList.remove('btn-success');
            document.getElementById(noteId).setAttribute('data-like',0);
        }
        
    }else{//ставим дизлайк
        if(document.getElementById(noteId).getAttribute('data-like')!=-1){
            
            //если стоял лайк - его убрать
            if(document.getElementById(noteId).getAttribute('data-like')==1){
                votes = Number(getNoteLikes(noteId,true).previousElementSibling.innerHTML);
                getNoteLikes(noteId,true).previousElementSibling.innerHTML = --votes;
                getNoteLikes(noteId,true).classList.remove('btn-success');
            }
            votes = Number(getNoteLikes(noteId,false).nextElementSibling.innerHTML);
            getNoteLikes(noteId,false).nextElementSibling.innerHTML = ++votes;
            getNoteLikes(noteId,false).classList.add('btn-danger');
            document.getElementById(noteId).setAttribute('data-like',-1);
        }else{
            
            //нажатие на уже поставленный дизлайк = отмена дизлайка
            votes = Number(getNoteLikes(noteId,false).nextElementSibling.innerHTML);
            getNoteLikes(noteId,false).nextElementSibling.innerHTML = --votes;
            getNoteLikes(noteId,false).classList.remove('btn-danger');
            document.getElementById(noteId).setAttribute('data-like',0);
        }
    }
}

//

/*changing button's label*/
function toggleBtnCom(noteId){
    let thisBtn = getBtnShowComment(noteId);
    if(thisBtn.children[2].classList.contains('hidden')){
        thisBtn.children[0].classList.add('hidden');
        thisBtn.children[1].classList.add('hidden');
        thisBtn.children[2].classList.remove('hidden');
        thisBtn.children[3].classList.remove('hidden');
    }else{
        thisBtn.children[2].classList.add('hidden');
        thisBtn.children[3].classList.add('hidden');
        thisBtn.children[0].classList.remove('hidden');
        thisBtn.children[1].classList.remove('hidden');
    }
}

/*transform info about a note to data for a feedback block*/
function formData(item){
    var data = [];
    data.push(item.id);//0 id
    data.push(item.title);//1 title
    data.push(item.body);//2 body
    data.push(item.children);//3 count of comments
    data.push(item.author);//4 author
    data.push(item.created);// 5 date
    var likes = 0;
    var dislikes = 0;
    item.active_votes.forEach(function(item){
        if(item.percent>0) likes++;
        else dislikes++;
    });
    data.push(likes);//6 likes
    data.push(dislikes);//7 dislikes
    data.push(item.permlink);//8 permlink
    return data;
}

function formDataCom(item, noteId){
    var data = [];
    data.push(item.id);//0 - id
    data.push(noteId);//1 - parent ID
    data.push(item.body);//2 - body
    data.push(item.author);//3 - author
    data.push(item.created);//4 - created (date)
    var likes = 0;
    var dislikes = 0;
    item.active_votes.forEach(function(item){
        if(item.percent>0) likes++;
        else dislikes++;
    });
    data.push(likes);//5 - likes
    data.push(dislikes);//6 - dislikes
    data.push(item.permlink);//7 permlink
    return data;
}

/*forming the note, filling it up and placing into the wrapper to the bottom*/
function createNote(data){
    var note = document.createElement('div');
    note.className = 'row note';
    note.setAttribute('id',data[0]);
    note.setAttribute('data-permlink',data[8]);
    note.setAttribute('data-opened',0);
    note.setAttribute('data-like',0);
    note.innerHTML = "<div class='container body-note tile'><div class='row'><div class='col-lg-9 col-md-9 text'><h3>"+data[1]+"</h3><p>"+data[2]+"</p><div class='buttons'><button type='button' class='btn btn-dark btn-show-comments'><span class='badge badge-light'>"+data[3]+"</span><span class='icon-message-square'></span><span class='icon-arrow-left hidden'></span><span class='hidden'> Back</span></button></div></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[4]+"</h6></div><div class='date'><small>"+data[5]+"</small></div><div class='likes'><span>"+data[6]+"</span><button type='button' class='btn btn-secondary btn-vote' data-like='1'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-secondary btn-vote' data-like='0'><i class='fas fa-thumbs-down'></i></button><span>"+data[7]+"</span></div></div></div></div></div><div class='container comments'></div>";
    document.getElementsByClassName('wrapper')[0].appendChild(note);
    
    addEventsForCommentButtons(data[0]);
    addEventsForNoteLikes(data[0]);
    addEventForNoteHeader(data[0]);
    //setLikeGlow();
    console.log('note has been created: id = '+data[0]);
}

/*forming comment, filling it up, placing inside of the note*/
function createComment(data){
    var comment = document.createElement('div');
    comment.className = 'row comment';
    comment.setAttribute('id',data[0]);
    comment.setAttribute('data-permlink',data[7]);
    comment.innerHTML = "<div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile body-comment'><div class='row'><div class='col-lg-9 col-md-9 text'><p>"+data[2]+"</p></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[3]+"</h6></div><div class='date'><small>"+data[4]+"</small></div><div class='likes'><span>"+data[5]+"</span><button type='button' class='btn btn-success btn-com-vote' data-like='1'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-danger btn-com-vote' data-like='0'><i class='fas fa-thumbs-down'></i></button><span>"+data[6]+"</span></div></div></div></div></div>";
    getBlockComments(data[1]).appendChild(comment);
    console.log("comment has been created: "+data[1]+" "+data[0]);
    addEventsForComLikes(data[1],data[0]);
}
function createCommentForm(noteId){
    var commentForm = document.createElement('div');
    commentForm.className = 'container frm-add-com';
    commentForm.innerHTML = "<div class='row'><div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile'><form><div class='form-group'><textarea class='form-control txt-add-com' id='commentBody' rows='3' placeholder='Type your comment here' required></textarea></div><button type='click' class='btn btn-primary btn-add-com-done'><span class='icon-checkmark'></span> Submit</button></form></div></div>";
    document.getElementById(noteId).appendChild(commentForm);
    addEventsForComDone(noteId);
}//вставлять целиком в конец .note


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

/*script for loading VFX*/
document.onreadystatechange = function () { // loading animation switch-off
	console.log('<f> doc ready');
	if (document.readyState === "complete") {
		document.querySelector('.lding').style.display = 'none';
	}
}