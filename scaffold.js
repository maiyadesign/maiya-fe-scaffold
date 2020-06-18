// 生成page
// node scaffold create "evaluationPackage id:number:input name:string:input status:string:select"
//                                  注意： 字段id必须存在
// name:生成字段 string:字段类型 select:生成暂时(input/select/textArea)3种
// 删除page
// node scaffold destroy "evaluationPackage"

const ejs = require('ejs')
const fs = require('fs');
let basepath = '../../src/pages/';

let cptName = process.argv.splice(2);
let handleFile = cptName[0];

let pageName = null;
let pageNameBig = null;
let pageNameTf = null;

let comParams = [];
let comType = [];
let comUi = [];

let toLowerLine = (str) => {
  var temp = str.replace(/[A-Z]/g, function (match) {
    return "_" + match.toLowerCase();
  });
  if (temp.slice(0, 1) === '_') {
    temp = temp.slice(1);
  }
  return temp;
}

let bol = false;
cptName[1].split(' ').forEach((v, index) => {
  if (index === 0) {
    let Tf = toLowerLine(v);
    pageName = v.charAt(0).toLowerCase() + v.slice(1);      // page名字        aaBb
    pageNameBig = v.charAt(0).toUpperCase() + v.slice(1);   // page首字母大写   AaBb
    pageNameTf = Tf.charAt(0).toLowerCase() + Tf.slice(1);  // 转驼峰           aa_bb
  } else {
    let arr = v.split(':');
    if (arr.length < 3) bol = true;
    comParams.push(arr[0]);
    comType.push(arr[1]);
    comUi.push(arr[2]);
  }
});
if (bol) {
  return console.info('------ 请输入正确语法 ------');
}

let writes = [   // fileName 是创建文件夹 files 是创建数组文件
  {
    fileName: `${basepath}${pageName}`,
    files: [
      `${basepath}${pageName}/index.js`,
      `${basepath}${pageName}/index.less`,
      `${basepath}${pageName}/_mock.js`,
      `${basepath}${pageName}/data.d.ts`,
      `${basepath}${pageName}/model.js`,
      `${basepath}${pageName}/service.js`,
      {
        fileName: `${basepath}${pageName}/components`,
        files: [
          `${basepath}${pageName}/components/index.js`,
          `${basepath}${pageName}/components/${pageNameBig}AdvancedSearchForm.js`,
          `${basepath}${pageName}/components/${pageNameBig}Detail.js`,
          `${basepath}${pageName}/components/${pageNameBig}Form.js`,
          `${basepath}${pageName}/components/${pageNameBig}List.js`,
        ],
      },
    ],
  },
];

let reads = [
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/index.js`,
  },
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/index.less`,
  },
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/_mock.js`,
  },
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/data.d.ts`,
  },
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/model.js`,
  },
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/service.js`,
  },
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/components/index.js`,
  },
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/components/TemplateAdvancedSearchForm.js`,
  },
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/components/TemplateDetail.js`,
  },
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/components/TemplateForm.js`,
  },
  {
    [[pageName, pageNameBig, pageNameTf]]: `./template/components/TemplateList.js`,
  },
];

let file = [];

let readFile = function () {
  return new Promise(res => {

    for (let a of reads) {
      let key = Object.keys(a);
      let value = a[key];

      ejs.renderFile(value, { PageList: key[0].split(','), comParams, comType, comUi }, function (err, str) {
        if (err) {
          return 'error';
        }
        file.push(str);
      });
    }
    res(file);
  });
};

let exists = function (file) {
  return new Promise((res, rej) => {
    (async function () {
      fs.existsSync(file) ? null : await mkdir(file);
      res();
    })();
  });
};

let mkdir = function (file) {
  return new Promise((res, rej) => {
    fs.mkdir(file, err => {
      if (err) rej(err);
      res();
    });
  });
};

let writeFile = function (file) {
  return new Promise((res, rej) => {
    (async function () {
      let writesFiles = [];
      let callback = async arr => {
        for (let i = 0; i < arr.length; i++) {
          if (Object.prototype.toString.call(arr[i]) === '[object Object]') {
            await exists(arr[i].fileName);
            let files = arr[i].files;
            for (let j = 0; j < files.length; j++) {
              if (Object.prototype.toString.call(files[j]) !== '[object Object]') {
                await writesFiles.push(files[j]);
              }
            }
            await callback(files);
          }
        }
      };
      await callback(writes);
      for (let [index, item] of writesFiles.entries()) {
        await fs.writeFile(`${item}`, file[index], err => {
          if (err) rej(err);
        });
      }
      res('succ');
    })();
  });
};

async function desFile(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        await desFile(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    }
    fs.rmdirSync(path);
  }
}

let HomeFileExists = function(fileArr) {
  return new Promise((res, rej) => {
    (async function() {
      if (Array.isArray(fileArr)) {
        for (let i = 0; i < fileArr.length; i++) {
          await fs.existsSync(fileArr[i]) ? null : await HomeFileMkdir(fileArr[i]);
        }
      }
      res();
    })();
  });
};
let HomeFileMkdir = function(file) {
  return new Promise((res, rej) => {
    fs.mkdir(file, err => {
      if (err) rej(err);
      res();
    });
  });
};

async function createFile() {
  try {
    await HomeFileExists(['../../src', '../../src/pages']);
    await readFile();
    await writeFile(await readFile());
    return console.log(`创建 ${pageName} 页面成功`);
  } catch (err) {
    console.error(err);
  }
}

async function destroyFile(path) {
  try {
    await desFile(path);
    return console.log(`删除 ${pageName} 页面成功`);
  } catch (err) {
    console.error(err);
  }
}

if (handleFile === 'create') {
  createFile();
}

if (handleFile === 'destroy') {
  destroyFile(basepath + pageName);
}
