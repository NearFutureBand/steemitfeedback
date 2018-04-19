golos.config.set('websocket', 'wss://ws.testnet.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');


/*FORM FOR ADDING NEW NOTE*/

function openAddNoteForm(){
    document.getElementsByClassName('frm-add-note')[0].style.display = 'block';
    document.getElementsByClassName('btn-add-note')[0].style.display = 'none';
    removeNotes();
}
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
    var parentPermlink = 'fb';
    var author = username;
    var title = document.getElementById('formHeader').value;
    var permlink = 'post-' + parentPermlink.split(' ')[0] + '-' + Date.now().toString();
    var body = document.getElementById('formText').value;
    let tagList = {
        tags: [findCheckedRadio()]
    };
    var jsonMetadata = JSON.stringify(tagList);
    
    console.log('title: '+title+' body: '+body+' tags: '+parentPermlink+' '+tagList+' permlink: '+permlink);
    console.log(window.wif);
    golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
        //console.log(err, result);
        if ( ! err) {
            console.log('comment', result);
            golos.api.getContent(author, permlink, function(err, result) {
                //console.log(err, result);
                if (!err) {
                    console.log(result);
                    createNote(formData(result));
                    toggleBtnCom(noteId);
                }
                else console.error(err);
            });
        }
        else console.error(err);
    });
    
    document.getElementById('formHeader').value = '';
    document.getElementById('formText').value = '';
    closeAddNoteForm();
    
    
    
    document.querySelector('.lding').style.display = 'none';
    //SHOW MESSAGE ABOUT SUCCESSFUL SENDING
}

/*cancelling of adding form for creating feedback*/
document.getElementsByClassName('btn-add-note-cancel')[0].addEventListener('click',function(){
    closeAddNoteForm();
});

function getBlockAddNote(){
    return document.getElementsByClassName('frm-add-note')[0];
}


/*NOTES*/
document.addEventListener('DOMContentLoaded', loadNotes);

/*Loading notes*/
//gathering notes from the database
function loadNotes(){
    document.querySelector('.lding').style.display = 'block';
    var query = {
        select_tags: (tagSelector=='all')?['fb']:[tagSelector],
        select_authors: ['test2','test3','test4','test5','test6','test7','test8','test9'],
        limit: 100
    };
    console.log(query.select_tags);
    golos.api.getDiscussionsByCreated(query, function(err, result) {
        console.log(err, result);
        
        if ( ! err){
            result.forEach(function(item) {
                console.log(item);           
                createNote(formData(item));
            });
        }
        else console.error(err);
    });
    
    //загрузка тестового поста через permlink
    golos.api.getContent('test2', 'post-fb-1523961173281', function(err, result) {
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
/*упростить*/
function reloadNote(noteId,expanded,loading,removeAll){
    
    // on/off loading animation
    if(loading==true){
        document.querySelector('.lding').style.display = 'block';
    }
    
    var permlink = getPermlink(noteId,'');
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

/*оптимизировать под reload notes*/
function expandNote(noteId){
    toggleBtnCom(noteId);
    document.getElementById(noteId).setAttribute('data-opened',1);
    loadComments(noteId);
    createCommentForm(noteId);
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
        console.log(document.getElementById(noteId));
        if(document.getElementById(noteId).getAttribute('data-opened') == '0'){
            reloadNote(noteId,true,true,true);
        }else{
            removeNotes();
            loadNotes();
        }
    });
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
function getNoteControls(noteId){
    return document.getElementById(noteId).getElementsByClassName('controls')[0];
}
function getLblCommentCount(noteId){
    return getBtnShowComment(noteId).children[0];
}
function getNoteAuthor(noteId){
    return getNoteControls(noteId).getElementsByClassName('name')[0].children[0].innerHTML;
}



/*COMMENTS*/
/*Events for buttons inside a note to manipulate comments*/
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
    golos.api.getContentReplies(getNoteAuthor(noteId), getPermlink(noteId,''), function(err, result) {
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
    var parentPermlink = getPermlink(noteId,'');
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

function getAddComForm(noteId){
    return getBlockFormAddComment(noteId).children[0].children[0].children[0];
}
function getBtnAddComDone(noteId){
    return getBlockFormAddComment(noteId).getElementsByClassName('btn-add-com-done')[0];
}
function getComControls(noteId,comId){
    return getComment(noteId,comId).getElementsByClassName('controls')[0];
}
function getComAuthor(noteId, comId){
    console.log(getComControls(noteId,comId).querySelector('.name'))
    return getComControls(noteId,comId).querySelector('.name').children[0].innerHTML;
}
function getComment(noteId, comId){
    var comment;
    Array.from(getBlockComments(noteId).children).forEach(function(item){
        if(item.getAttribute('id')==comId){
            comment = item;
        }
    });
    return comment;
}
function getTxtareaCom(noteId){
    return getBlockFormAddComment(noteId).getElementsByClassName('txt-add-com')[0];
}
function getPermlink(noteId,comId){
    let result;
    if(comId){
        result = getComment(noteId,comId).getAttribute('data-permlink');
    }else{
        result = document.getElementById(noteId).getAttribute('data-permlink');
    }
    return result;
}


/*LIKES & DISLIKES*/
/*Events for these buttons in comments*/
//следующие 4 функции очень похожи
function addEventsForNoteLikes(noteId){
    //console.log(getNoteControls(noteId));
    getBtnsVote(noteId,'').forEach(function(item){
        item.addEventListener('click', function(){
            var isLike = Number(item.getAttribute('data-like'));
            if(wif){
                voteForNote(noteId,isLike);
            }else{
                auth(voteForNote.bind(this, noteId,isLike));
            }
        });
    });
}
var voteForNote = function(noteId,like){
    let weight;
    (like == 1)? weight = 10000 : weight = -10000;
    weight = updateVoteState(noteId,'',weight/10000);
    golos.broadcast.vote(wif, username, getNoteAuthor(noteId), getPermlink(noteId,''), weight, function(err, result) {
        console.log(err, result);
    });
}

function addEventsForComLikes(noteId, comId){
    getBtnsVote(noteId,comId).forEach(function(item){
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
    let weight;
    (like == 1)? weight = 10000 : weight = -10000;
    weight = updateVoteState(noteId,comId,weight/10000);
    golos.broadcast.vote(wif, username, getComAuthor(noteId,comId), getPermlink(noteId,comId), weight, function(err, result){
        console.log(err, result);
    });
}


/*NAV TABS*/

var tagSelector='all';
Array.from(document.getElementById('navbarSupportedContent').getElementsByClassName('tab')).forEach(function(item){
    item.addEventListener('click',function(){
        Array.from(document.getElementById('navbarSupportedContent').getElementsByClassName('tab')).forEach(function(item){
            if(item.classList.contains('active')) item.classList.remove('active');
        });
        item.classList.add('active');
        tagSelector = item.getAttribute('data-target');
        removeNotes();
        loadNotes();
    });
});


/*------------------------------------------*/
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


//returns array of voting buttons
function getBtnsVote(noteId,comId){
    if(comId){
        return Array.from(getComment(noteId,comId).getElementsByClassName('btn-com-vote'));
    }else{
        return Array.from( getNoteControls(noteId).getElementsByClassName('btn-vote'));
    }
}


//getting current state of voting for this note or comment
function getVoteState(noteId,comId){
    let state;
    if(comId){
        state = Number(getComment(noteId,comId).getAttribute('data-like'));
    }else{
        state = Number(document.getElementById(noteId).getAttribute('data-like'));
    }
    return state;
}

//getting state of voting when feedback of comment loads from the base
//also can return real state if somebody is signed in
function getVoteStateOnload(object){
    let result=0;
    if(wif){
        object.active_votes.forEach(function(item){
            if(item.voter==username){
                result = item.percent;
            }
        });
    }else{
        result = 0;
    }
    return result;
}

/*новые функции*/
function getBtnVote(noteId, comId, isLike){
    let btn;
    if(comId){
        btn = getComControls(noteId,comId).getElementsByClassName('btn-com-vote')[1-isLike];
    }else{
        btn = getNoteControls(noteId).getElementsByClassName('btn-vote')[1-isLike];
    }
    return btn;
}
function updateVoteState(noteId,comId,vote){
    let state = getVoteState(noteId,comId);
    let res;
    
    //setting up new state depending on the pressed button
    if(vote == -1 && state != -1) res = -1;
    if(vote == 1 && state != 1) res = 1
    if(vote*state>0) res = 0;
    
    if(comId){
        getComment(noteId,comId).setAttribute('data-like',res);
    }else{
        document.getElementById(noteId).setAttribute('data-like',res);
    }
    setLblVote(noteId,comId,state,res);
    checkVoteColor(noteId,comId);
    return res*10000;
}
function setLblVote(noteId,comId,val0,val){
    let likes;
    let dislikes;
    let label;
    if(val==0 || val0==0){//одиночные изменения
        
        //нажатие на дизлайк
        if(val == -1 || val0 == -1) label = getBtnVote(noteId,comId,0).nextElementSibling;
        //нажатие на лайк
        if(val == 1 || val0 == 1) label = getBtnVote(noteId,comId,1).previousElementSibling;
        
        likes = Number(label.innerHTML);
        
        //изменение числа
        if(val==0) likes--;
        if(val0==0) likes++;
        label.innerHTML = likes;
        
    }else if(val != 0 && val0 != 0){
        //двойное изменение
        likes = Number(getBtnVote(noteId,comId,1).previousElementSibling.innerHTML);
        dislikes = Number(getBtnVote(noteId,comId,0).nextElementSibling.innerHTML);
        if(val==1){
            //нажатие на лайк
            likes++;
            dislikes--;
        }else{
            //нажатие на дизлайк
            likes--;
            dislikes++;
        }
        getBtnVote(noteId,comId,1).previousElementSibling.innerHTML = likes;
        getBtnVote(noteId,comId,0).nextElementSibling.innerHTML = dislikes;
    }
}
//non-optimized
function checkVoteColor(noteId,comId){
    let state = getVoteState(noteId,comId);
    if(state == -1){
        if(getBtnVote(noteId,comId,1).classList.contains('btn-success')){
            getBtnVote(noteId,comId,1).classList.remove('btn-success');   
        }
        getBtnVote(noteId,comId,0).classList.add('btn-danger');
    }else if(state == 0){
        if(getBtnVote(noteId,comId,1).classList.contains('btn-success')){
            getBtnVote(noteId,comId,1).classList.remove('btn-success');   
        }
        if(getBtnVote(noteId,comId,0).classList.contains('btn-danger')){
            getBtnVote(noteId,comId,0).classList.remove('btn-danger');   
        }
    }else if(state == 1){
        if(getBtnVote(noteId,comId,0).classList.contains('btn-danger')){
            getBtnVote(noteId,comId,0).classList.remove('btn-danger');   
        }
        getBtnVote(noteId,comId,1).classList.add('btn-success');
    }
}
/*--новые функции*/

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
/*Packing data for creating new note - all instructions here*/
function formData(object){
    var data = [];
    data.push(object.id);//0 id
    data.push(object.title);//1 title
    data.push(object.body);//2 body
    data.push(object.children);//3 count of comments
    data.push(object.author);//4 author
    data.push(object.created);// 5 date
    
    //эти строки повторяются в formDataCom
    let likes = 0;
    let dislikes = 0;
    object.active_votes.forEach(function(item){
        if(item.percent>0) likes++;
        else if(item.percent<0) dislikes++;
    });
    data.push(likes);//6 likes
    //их нужно вынести в функцию
    
    
    data.push(dislikes);//7 dislikes
    data.push(object.permlink);//8 permlink
    
    data.push(getVoteStateOnload(object)/10000);//9 vote of this user
    return data;
}
function formDataCom(object, noteId){
    var data = [];
    data.push(object.id);//0 - id
    data.push(noteId);//1 - parent ID
    data.push(object.body);//2 - body
    data.push(object.author);//3 - author
    data.push(object.created);//4 - created (date)
    let likes = 0;
    let dislikes = 0;
    object.active_votes.forEach(function(item){
        if(item.percent>0) likes++;
        else if(item.percent<0) dislikes++;
    });
    data.push(likes);//5 - likes
    data.push(dislikes);//6 - dislikes
    data.push(object.permlink);//7 permlink
    data.push(getVoteStateOnload(object)/10000);// 8 vote of this user
    return data;
}


/*forming the note, filling it up and placing into the wrapper to the bottom*/
function createNote(data){
    var note = document.createElement('div');
    note.className = 'row note';
    note.setAttribute('id',data[0]);
    note.setAttribute('data-permlink',data[8]);
    note.setAttribute('data-opened',0);
    note.setAttribute('data-like',data[9]);
    note.innerHTML = "<div class='container body-note tile'><div class='row'><div class='col-lg-9 col-md-9 text'><h3>"+data[1]+"</h3><p>"+data[2]+"</p><div class='buttons'><button type='button' class='btn btn-dark btn-show-comments'><span class='badge badge-light'>"+data[3]+"</span><span class='icon-message-square'></span><span class='icon-arrow-left hidden'></span><span class='hidden'> Back</span></button></div></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[4]+"</h6></div><div class='date'><small>"+data[5]+"</small></div><div class='likes'><span>"+data[6]+"</span><button type='button' class='btn btn-secondary btn-vote' data-like='1'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-secondary btn-vote' data-like='0'><i class='fas fa-thumbs-down'></i></button><span>"+data[7]+"</span></div></div></div></div></div><div class='container comments'></div>";
    document.getElementsByClassName('wrapper')[0].appendChild(note);
    checkVoteColor(data[0],'');
    
    addEventsForCommentButtons(data[0]);
    addEventsForNoteLikes(data[0]);
    addEventForNoteHeader(data[0]);
    
    console.log('note has been created: id = '+data[0]);
    
}
/*forming comment, filling it up, placing inside of the note*/
function createComment(data){
    var comment = document.createElement('div');
    comment.className = 'row comment';
    comment.setAttribute('id',data[0]);
    comment.setAttribute('data-permlink',data[7]);
    comment.setAttribute('data-like',data[8]);
    comment.innerHTML = "<div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile body-comment'><div class='row'><div class='col-lg-9 col-md-9 text'><p>"+data[2]+"</p></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>"+data[3]+"</h6></div><div class='date'><small>"+data[4]+"</small></div><div class='likes'><span>"+data[5]+"</span><button type='button' class='btn btn-secondary btn-com-vote' data-like='1'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-secondary btn-com-vote' data-like='0'><i class='fas fa-thumbs-down'></i></button><span>"+data[6]+"</span></div></div></div></div></div>";
    getBlockComments(data[1]).appendChild(comment);
    checkVoteColor(data[1],data[0]);
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


/*copied scripts for buttons in nav (UNIQUE FOR THE GOLOSFEEDBACK)*/
async function getUrls() {
    if (wif == '') {
        await auth();
        /* ---- changes only for the GolosFeedback -----*/
        removeNotes();
        loadNotes();
        /* ---- changes only for the GolosFeedback -----*/
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