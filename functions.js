function click(elementid,fn){
  var element=document.getElementById(elementid);
  if(element){
    element.addEventListener("click",fn);
  }
}
function redirect(path){
  window.location=path;
  return flase;
}
function loginuser(){
//  redirect("chat.html");
  loginwithgoogle();

}
function loginwithgoogle(){
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  createuser(user.uid,user.displayName,user.email);
//  console.log(user);
}).catch(function(error) {
console.log(error.message);
});
}
function createuser(uid,uname,uemail){
  var database = firebase.database();
  var userRef=database.ref("users");
  var user={
    id:uid,
    name:uname,
    email:uemail
  };

userRef.child(uid).set(user).then(function(){
  redirect("chat.html");
});
}
function  ifUserIsLoggedIn(fn){
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    window.currentUser={
      id:user.uid,
      name:user.displayName,
      email:user.email
    };
    fn();
  } else {
    // No user is signed in.
  }
});
}
function getElement(id){
  return document.getElementById(id);
}
function updateUserData(){
  var usernameElement=getElement("username");
  usernameElement.textContent=window.currentUser.name;
}
function loadmembers(fn){
  var database=firebase.database();
  var usersRef=database.ref("users");
  usersRef.on('value',function(snapshot){
    var users =snapshot.val();
  //  console.log(users);
    fn(users);
  });
}
function renderUser(user){
  var uid=user.id;
  var chat_id=getchatId(window.currentUser.id,uid);
  var name=user.name;
  var html='<div id="'+chat_id+' "class="member">'+name+'</div>';
  return html;
}
function getchatId(id1,id2){
  if(id1>id2){
    return id1+""+id2;
  }
  return id2+""+id1;
}
function onClickMultiple(className, func) {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains(className)) {
            func(event.target);
        }
    });
}
function loadMessages(chat_id,fn){
  var database=firebase.database();
  var chatsRef=database.ref("chats");

  chatsRef.child(chat_id).on('value',function(snapshot){
    var messages =snapshot.val();
  //  console.log(users);
    fn(messages);
  });
}
function rendermessages(message){
  var text=message.text;
  var msgclass="message";
  if(message.sender_id==window.currentUser.id){
    msgclass="by-user";
  }
  var html='<div class="msgclass">'+text+'</div>';
  return html;
}
function sendMessage(chat_id,text){
  var message={
    text: text,
    sender_id: window.currentUser.id
  };

  var database=firebase.database();
  var chatsRef=database.ref("chats");
  var chat=chatsRef.child(chat_id);
  var newmessageid=chatsRef.push().key;
  chat.child(newmessageid).set(message);

}
