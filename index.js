var fs = require("fs");
const OPEN_BRC = '([';
const CLOSE_BRC = '])';
const VAR_IF = 'IF';
const VAR_END = 'END';
const COMMA = ',';
const SPACE = '\t';
const NEXT_LINE = '\n';

const srcFile = 'messageList.html';
// const destFile = process.argv[4];

var writeStream = fs.createWriteStream("file.xls");

fs.readFile(srcFile, "utf8", function (err, contents) {
  initProcess(contents);
});

const initProcess = (contents) => {
  while (true) {
    const value = processContent(contents);
    if (value > 0) {
      contents = contents.slice(value);
    } else {
      break;
    }
  }
};

const extractVars = (contents) => {
  const index = contents.indexOf(OPEN_BRC);
  const comma = contents.indexOf(COMMA, index + 2);
  const res = contents.slice(index + 2, comma);
  const closeBrc = contents.indexOf(CLOSE_BRC, index);
  return [index, res, comma, closeBrc];
};

processContent = (contents) => {
  if (contents.indexOf(OPEN_BRC) >= 1) {
    const [index, res, comma, closeBrc] = extractVars(contents);
    if (res === VAR_END) {
      return closeBrc;
    }
    if (res === VAR_IF) {
      const temp = contents.slice((comma + 1, contents.indexOf(COMMA), index));
      const processIfContent = contents.slice(comma + 1, closeBrc+2);
      processIf(processIfContent);
      return closeBrc;
    }
    const value = contents.slice(comma + 1, closeBrc);
    writeToTheFile(res + SPACE + value + NEXT_LINE);
    return closeBrc;
  } else {
    return 0;
  }
};

const processIf = (content) => {
  if (content.indexOf("([") > 0) {
    initProcess(content);
  }
  writeToTheFile(
    VAR_IF + SPACE + content.slice(0, content.indexOf(COMMA)) + NEXT_LINE
  );
};

const writeToTheFile = (content) => {
  writeStream.write(content, function (err) {
    if(err) console.log(err)
    else return
  });
};
