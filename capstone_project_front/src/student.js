

var my_workspace;
var my_workspace_xml;
var other_workspace;
var other_workspace_xml = [];

//MSG
var MSG = {
  title: "코드",
  blocks: "블록",
  linkTooltip: "블록을 저장하고 링크를 가져옵니다.",
  runTooltip: "작업 공간에서 블록으로 정의된 프로그램을 실행합니다.",
  badCode: "프로그램 오류:\n%1",
  timeout: "최대 실행 반복을 초과했습니다.",
  trashTooltip: "모든 블록을 버립니다.",
  catLogic: "논리",
  catLoops: "반복",
  catMath: "수학",
  catText: "텍스트",
  catLists: "목록",
  catColour: "색",
  catVariables: "변수",
  catFunctions: "기능",
  listVariable: "목록",
  textVariable: "텍스트",
  httpRequestError: "요청에 문제가 있습니다.",
  linkAlert: "다음 링크로 블록을 공유하세요:\n\n%1",
  hashError: "죄송하지만 '%1'은 어떤 저장된 프로그램으로 일치하지 않습니다.",
  loadError: "저장된 파일을 불러올 수 없습니다. 혹시 블록리의 다른 버전으로 만들었습니까?",
  parseError: "%1 구문 분석 오류:\n%2\n\n바뀜을 포기하려면 '확인'을 선택하고 %1을 더 편집하려면 '취소'를 선택하세요."
};

//category
for (var messageKey in MSG) {
  if (messageKey.indexOf('cat') === 0) {
    Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
  }
}

//get toolbox from html
var toolboxText = document.getElementById('toolbox').outerHTML;
toolboxText = toolboxText.replace(/(^|[^%]){(\w+)}/g, function(m, p1, p2) {return p1 + MSG[p2];});
var toolboxXml = Blockly.Xml.textToDom(toolboxText);

document.addEventListener('DOMContentLoaded',async function(){
    my_workspace = Blockly.inject('content_area',
    {
      toolbox: toolboxXml,
      media: '../media/',
    });

    other_workspace = Blockly.inject('content_area1',
    {
      toolbox: toolboxXml,
      media: '../media/',
    });

    Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');
}, false);

//copy workspace
async function workspace_copy(workspace1, workspace2){
  var xmlDom = Blockly.Xml.workspaceToDom(workspace1);
  workspace2.clear();
  Blockly.Xml.domToWorkspace(xmlDom, workspace2);
}

/*student_tab_event*/
var student = ["student1", "student2", "student3"];
var selected = "user_";

function student_tab_handler(clickedName) {
  clickedName = clickedName.id;
  var befo_clicked;
  //before workspace 작업 처리
  if (document.getElementById("user_student1").classList.contains('tabon')) {

  }
  else if (document.getElementById("user_student2").classList.contains('tabon')) {

  }
  else if (document.getElementById("user_student3").classList.contains('tabon')) {

  }

  // Deselect all tabs and hide all panes.
  for (var i = 0; i < student.length; i++) {
    var name = "user_" + student[i];
    var tab = document.getElementById(name);
    tab.classList.add('taboff');
    tab.classList.remove('tabon');
  }

  // Select the active tab.
  selected = clickedName;
  console.log(selected);
  var selectedTab = document.getElementById(selected);
  selectedTab.classList.remove('taboff');
  selectedTab.classList.add('tabon');

  //after workspace 작업 처리
  if (document.getElementById("user_student1").classList.contains('tabon')) {
    
  }
  else if (document.getElementById("user_student2").classList.contains('tabon')) {
    
  }
  else if (document.getElementById("user_student3").classList.contains('tabon')) {

  }
};
/* //copy my_workspace to other_workspace

*/

/*only one checkbox*/
var looking_work_box;
var authoered_student;

function getCheckboxValue(element)  {
  if(element.value == authoered_student){
    element.checked = false;
    authoered_student = 0;
  }
  else{
    // 선택된 목록 가져오기
    const checkboxes 
        = document.getElementsByName("check_right");
    
    // 선택된 목록에서 value 찾기
    checkboxes.forEach((el) => {
      el.checked = false;
    });
    
    authoered_student = element.value;
    element.checked = true;
    console.log(authoered_student)
  }
}


/*
var button_num = 1;
function make_button(){
    var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = button_num;
    button.className = 'btn-styled';
    button_num+=1;
 
    button.onclick = function() {
        // …
    };
 
    var container = document.getElementById('container');
    container.appendChild(button);
}

document.addEventListener('DOMContentLoaded', make_button, false);
document.addEventListener('DOMContentLoaded', function(){
    var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = "button";
    button.className = 'btn-styled';
 
    button.onclick = function() {
        make_button();
    };
 
    var container = document.getElementById('container');
    container.appendChild(button);
}, false);
*/

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
function  bindClick(el, func) {
  if (typeof el === 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 * @param {Event} event Event created from listener bound to the function.
 */
 function runJs(event) {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = 'checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw MSG['timeout'];
    }
  };

  var code = Blockly.JavaScript.workspaceToCode(my_workspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval(code);
  } catch (e) {
    alert(MSG['badCode'].replace('%1', e));
  }
};

/**
 * Discard all blocks from the workspace.
 */
function discard() {
  var count = my_workspace.getAllBlocks(false).length;
  if (count < 2 ||
      window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
    my_workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

bindClick('trashButton',discard);
bindClick('runButton', runJs);