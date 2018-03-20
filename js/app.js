/*opening form for adding new note*/
var form = document.getElementById("formAddNote");
var buttonAddNote = document.getElementById("butAddNote");
buttonAddNote.onclick = function(){
    form.style.display = "block";
    buttonAddNote.style.display = "none";
}

/*main functions for golosFeedback*/
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

/*Loading some existing notes - prototype with searching with author*/
function loadNotes(){
    console.log("here1");
var query = {	
	select_authors: ['golos-test'],
    limit: 100,
};
    console.log("here2");
golos.api.getDiscussionsByCreated(query, function(err, result) {
	//console.log(err, result);
	if ( ! err) {
        console.log("here3");
		result.forEach(function(item) {
			console.log('getDiscussionsByCreated', item.title);
		});
	}
    
	else console.error(err);
    console.log("here4");
});
    console.log("here5");
    /*var query = {	
        select_authors: ['golos-test'],
        limit: 100,
    };
    golos.api.getDiscussionsByCreated(query, function(err, result) {
        console.log("here2");
        //console.log(err, result);
        if ( ! err) {
            result.forEach(function(item) {
                /*var note = document.createElement("div");
                note.className = "row note";
                note.setAttribute("id",item.id);
                note.innerHTML = "<div class='col-lg-10 col-md-10 text'>              <h1>"+item.title+"</h1><p>"+item.body+"</p><button type='button' class='btn btn-light d-flex justify-content-center'>Show comments</button></div><div class='col-lg-2 col-md-2 controls'><div class='name'><h6>"+item.author+"</h6></div><div class='date'><small>"+item.created+"</small></div><div class='likes'><span>14</span><button type='button' class='btn btn-success'><i class='fas fa-thumbs-up'></i></button><button type='button' class='btn btn-danger'><i class='fas fa-thumbs-down'></i></button><span>90</span></div></div>";
                document.getElementById("wrapper").insertBefore(note,document.getElementById("butAddNote"));
                console.log('getDiscussionsByCreated', item.title);
            });
        }
        else console.error(err);
    });*/
}
//document.addEventListener("DOMContentLoaded", loadNotes);
document.getElementById("loadNotes").onclick = loadNotes;
/*Case when user tries to add note without authorization*/
/*getting data from the form*/
document.getElementById("butFormDone").onclick = function(){
    if (wif) {
        var title = document.getElementById("formHeader").value;
        var body = document.getElementById("formText").value;
        var type = getIndexFromName(findCheckedRadio("formRadio",4));
        console.log("title: "+title+" body: "+body+" type: "+type);
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
        var parentAuthor = '';
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
        });
    
    } else {
        auth();
    }
    
};




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

