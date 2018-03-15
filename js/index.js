
var form = document.getElementById("formAddNote");
var buttonAddNote = document.getElementById("butAddNote");
buttonAddNote.onclick = function(){
    form.style.display = "block";
    buttonAddNote.style.display = "none";
}
document.getElementById("butFormDone").onclick = function(){
    //form.style.display = "none";
}
