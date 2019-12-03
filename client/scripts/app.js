// eslint-disable-next-line

const app = {
  server: 'http://52.78.206.149:3000/messages',

  init: function() {  
    this.fetch().then(res => showAllMessages.call(this, res));
  },

  fetch: function() { 
    return window.fetch(this.server)
    .then(res => res.json())
    .then(res => {
      return res;
    });
  },

  send: function(message) {
    return window.fetch(this.server, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => {
      return response.json();
    }).then(json => {
      return json 
    });
  },

  renderMessage: function(message) { // 1개를 렌더 -> res배열의 각 엘리먼트
    let elMessages = document.querySelector('#chats');
    // let elmessageTemplate = document.querySelector('.messageTemplate');
    
    // let elMessage = document.importNode(elmessageTemplate.content, true);
    let elMessage = document.createElement("div");
    elMessage.className = "message";
    let elUser = document.createElement("span")
    elUser.className = "username";
    // let elUser = elMessage.querySelector(".username");
    elUser.textContent = message.username;
    let elContent = document.createElement("div")
    elContent.className = "messageContent"
    // let elContent = elMessage.querySelector(".messageContent");
    elContent.textContent = message.text;
    
    elMessage.appendChild(elUser)
    elMessage.appendChild(elContent)

    elMessages.prepend(elMessage);
  },

  clearMessages: function() {
    let elMessages = document.querySelector('#chats');
    elMessages.innerHTML='';
  }
};

app.init();


/**
 * 서버에 데이터를 요청해서 클라이언트에 보여준다.
 * 데이터를 요청할때는 규약(HTTP)에 맞춰서 요청
 * 데이터를 받으면 js로 dom을 수정(Ajax)
 * 
 * 1. 이미 생성된 메세지를 가져와서 보여준다.
 * ㄴ fetch 이용해서 json 데이터를 받아오고 GET
 *   ㄴ dom을 조작해 html에 appendChild
 *     ㄴ roomName을 받아와 옵션들로 구성, 각 roomName에 해당하는 메세지들을 분류
 * 2. 메세지 생성
 * ㄴ 인풋에 메세지 입력, 버튼을 click event 하면
 *   ㄴ 메세지 내용을 형식에 맞춰 stringify() 후 서버로 POST -> 서버에서 잘 받았다 대답한다.
 */

/**
 * 룹을 arr.length 만큼 돌려서 li를 createElement 를 하고,
 * username, text 를 추가, room name을 data-set으로 추가
 * appendChild
 * 만약 roomname.value가 newRoom이 아니라면 roomname.value의 메세지만 show
 */
function showAllMessages(arr) {
  for (let i = 0; i <arr.length ; i++) {
    this.renderMessage(arr[i])
  }
  createRoomnameOption(arr);
}

/**
 * 메세지들을 받아오면 roomname별로 option 생성
 * 해당 옵션을 선택하면 일치하는 dataset만 필터 -> 일치하지 않으면 display none
 */
function createRoomnameOption(arr) {
  let arrOfRoomname = [];
  for (let i = 0; i < arr.length; i++) {
    if (!arrOfRoomname.includes(arr[i].roomname)) {
      arrOfRoomname.push(arr[i].roomname);
    }
  }

  let elRoomname = document.querySelector("#roomName");
  let elOptionDefault = document.createElement("option")
  elOptionDefault.value = "newRoom";
  elOptionDefault.textContent = "New Room";
  elOptionDefault.className = "RoomnameOption";
  elRoomname.appendChild(elOptionDefault);

  for (let i = 0; i < arrOfRoomname.length; i++) {
    let elOption = document.createElement("option");
    elOption.value = arrOfRoomname[i];
    elOption.textContent = arrOfRoomname[i];
    elOption.className = "RoomnameOption";
    elRoomname.appendChild(elOption);
  }
  elRoomname.addEventListener('change', showRoomNameInput);
}


/**
 * this.value 와 같은 roomname 가진 message들을 가져온다.
 * 나머지는 display none;
 */

function showRoomNameInput() {
  let roomNameInput = document.querySelector('#rommNameInput'); // 룸 입력창

  if(this.value === "newRoom") {
    roomNameInput.style.display = "block";  // 보이게
  }
  else {
    roomNameInput.style.display = "none";
  }

  filterMessage.call(this);
}

function filterMessage() {

  if (this.value === "newRoom") {
    app.clearMessages();
    app.fetch().then(res => showAllMessages.call(app, res));
  }
  else {
    app.clearMessages();
    app.fetch().then(res => sameRoomName(res));
  }
}

function sameRoomName(res) {
  let elRoomname = document.querySelector("#roomName");
  for (let i=0; i<res.length; i=i+1) {
    if (res[i].roomname === elRoomname.value) {
      app.renderMessage(res[i])
    }
  }
}

/**
 * 메세지를 보낸 후,
 * fetch get을 해서
 * 보낸 roomname과 일치하는 메세지들만 표시
 */


let sendBtn = document.querySelector("#sendButton");

sendBtn.onclick = function() {
  app.send(sendMessage())

  let userInput = document.querySelector("#userInput");
  let messageInput = document.querySelector("#messageInput");
  let rommNameInput = document.querySelector("#rommNameInput");
  userInput.value = '';
  messageInput.value = '';
  rommNameInput.value = '';
  /**
   * 메시지를 보내고 다시 fetch해서 새로운 메세지를 출력
   */
  let elRoomname = document.querySelector("#roomName");
  setTimeout(filterMessage.bind(elRoomname), 100) ;
}

function sendMessage() {
  let jsonTarget = {};
  let userInput = document.querySelector("#userInput");
  let messageInput = document.querySelector("#messageInput");
  let rommNameInput = document.querySelector("#rommNameInput");
  jsonTarget["username"] = userInput.value;
  jsonTarget["text"] = messageInput.value;
  
  if (document.querySelector("#roomName").value === "newRoom") {
    jsonTarget["roomname"] = rommNameInput.value;  // 인풋에 넣은것
  }
  else {
    jsonTarget["roomname"] = document.querySelector("#roomName").value  //  현재 선택 되어 있는 value
  }
  // { "username": string, "text": string, "roomname": string, }
  return jsonTarget;
}
