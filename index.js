let fs = require('fs');

//处理一个文件
let handleOne = (file) => {
    var obj = null;
    let preIgnore = false;
    let membersOn = false;
    let lines = [];
    try {
        let json = fs.readFileSync(file, 'utf8');
        let arr = json.split('\n');
        let len = arr.length
        for (let i = 0; i < len; i++) {
            let line = arr[i];

            //回调
            if (!line) {
                continue;
            }
            let trimLine = line.trim();
            if (!trimLine) {
                continue;
            }
            //如果以下区域被jsdoc管理
            if (trimLine.indexOf('@lends') >= 0) {
                obj = {
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
            }

            //处理function
            if (trimLine.indexOf(': function') >= 0 || trimLine.indexOf(':function') >= 0) {
                let firstColon = trimLine.indexOf(':');
                let funcStr = trimLine.substring(0, firstColon);
                obj.methods.push(funcStr);
                if (preIgnore) {
                    preIgnore = false;
                    continue;
                }
                //处理members
                if (funcStr === 'initialize' || funcStr === 'initialize') {
                    membersOn = true;
                } else {
                    membersOn = false;
                }
            }
            //处理members
            else if (membersOn) {
                let regStr = '/this.([^\s]+)|=';
                let matchResult = trimLine.match(regStr);
                if (matchResult) {
                    let firstEqual = trimLine.indexOf('=');
                    let member = trimLine.substring(5, firstEqual).trim();
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
            segs.push(obj);
        }
    }, this);
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