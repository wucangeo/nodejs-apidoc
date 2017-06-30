let fs = require('fs');
let ignoreList = ["initialize"];

//处理一个文件
let handleOne = (file) => {
  var obj = null;
  let preIgnore = false;
  let preIgnoreEnd = false;
  let jsdocOn = false;
  let membersOn = false;
  let lines = [];
  try {
    let json = fs.readFileSync(file, 'utf8');
    let arr = json.split('\n');
    let len = arr.length
    for (let i = 0; i < len; i++) {
      let line = arr[i];
      if (!line) {
        continue;
      }
      let trimLine = line.trim();
      if (!trimLine) {
        continue;
      }
      //排除被屏蔽代码
      if (trimLine.substring(0, 2) === '//') {
        continue;
      }
      if (trimLine.indexOf('@') > 0) {
        jsdocOn = true;
      }
      //如果以下区域被jsdoc管理
      if (trimLine.indexOf('@lends') >= 0) {
        let lendsIndex = trimLine.indexOf("@lends");
        let lendsSubstr = trimLine.substring(lendsIndex, trimLine.length);
        let lendsArr = lendsSubstr.split(' ');
        let label = "";
        for (let i = 0; i < lendsArr.length; i++) {
          if (lendsArr[i].indexOf("L.") >= 0) {
            label = lendsArr[i];
            break;
          }
        }
        //去除prototype
        if (label && label.indexOf(".prototype") >= 0) {
          label = label.replace(".prototype", "");
        }
        obj = {
          label: label,
          methods: [],
          members: []
        };
      }
      if (!obj) {
        continue;
      }
      //处理ignore
      if (trimLine.indexOf('@ignore') >= 0) {
        preIgnore = true;
        preIgnoreEnd = false;
      }
      if (preIgnore) {
        if (line.indexOf('* ') < 0 || line.indexOf('*/') < 0) {
          preIgnoreEnd = true;
        }
      }


      //处理function
      if (trimLine.indexOf(': function') >= 0 || trimLine.indexOf(':function') >= 0) {
        let firstColon = trimLine.indexOf(':');
        let funcName = trimLine.substring(0, firstColon);
        //处理members
        if (funcName === 'initialize') {
          membersOn = true;
        } else {
          membersOn = false;
        }
        //判断是否为jsdoc语法
        if (jsdocOn) {
          jsdocOn = false;
        } else {
          continue;
        }
        //排除内部方法
        if (funcName.substring(0, 1) === "_") {
          continue;
        }
        //排除忽略
        if (preIgnore && preIgnoreEnd) {
          preIgnore = false;
          preIgnoreEnd = false;
          continue;
        }
        //忽略某些函数
        if (ignoreList.includes(funcName)) {
          continue;
        }
        obj.methods.push(funcName);
      }
      //处理members
      else if (membersOn) {
        let regStr = '/this.([^\s]+)|=';
        let matchResult = trimLine.match(regStr);
        if (matchResult) {
          let firstEqual = trimLine.indexOf('=');
          let thisMember = trimLine.substring(0, firstEqual);
          if (thisMember.indexOf('this.') < 0) {
            continue
          }

          //排除忽略
          if (preIgnore && preIgnoreEnd) {
            preIgnore = false;
            preIgnoreEnd = false;
            continue;
          }
          let member = trimLine.substring(5, firstEqual).trim();
          // //排除内部方法
          if (member.substring(0, 1) === "_") {
            continue;
          }
          if (obj.members.includes(member)) {
            continue;
          }
          obj.members.push(member);
        }
      }

    }
  } catch (err) {
    console.log(err)
  }
  return obj;
}
//遍历配置文件
let handleSegment = (config) => {
  if (!config || !config.length || config.length === 0) {
    return null;
  }
  let segs = [];
  config.forEach((seg) => {
    if (seg && seg.list) {
      let classList = handleSegment(seg.list);
      if (classList) {
        let obj = {
          name: seg.name,
          list: classList
        };
        segs.push(obj);
      }
    } else {
      let obj = handleOne(seg);
      if (obj) {
        segs.push(obj);
      }
    }
  }, this);
  //排序
  segs.forEach((seg) => {
    if (!seg) {
      return;
    }
    if (seg.members) {
      seg.members = seg.members.sort();
    }
    if (seg.methods) {
      seg.methods = seg.methods.sort();
    }
  })
  return segs;
}


//加载api路径配置文件
let sourceFiles = JSON.parse(fs.readFileSync('apilist.json', 'utf8'));
if (!sourceFiles || sourceFiles.length === 0) {
  return;
}
let jsAPI = [];
jsAPI = handleSegment(sourceFiles);
var jsonStr = JSON.stringify(jsAPI);
var input = fs.writeFile('apidoc.json', jsonStr, 'utf8', () => {
  console.log("suncc");
});