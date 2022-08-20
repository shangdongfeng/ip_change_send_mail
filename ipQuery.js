const fs = require("fs");
const path = require('path');
const { OSUtil, sendEmail, sleep } = require('./utils');

const LOCAL_IPTXT = path.resolve(__dirname, "./localIp.txt");
const LOCAL_LOGS = path.resolve(__dirname, './iplogs.txt');

const readLocalIp = () => {
    const _ip = fs.readFileSync(LOCAL_IPTXT);
    return _ip.toString();
}

const writeIp = (ip) => {
    fs.writeFileSync(LOCAL_IPTXT, ip);
}

const appendFile = (ip) => {
    const _date = new Date();
    const year = _date.getFullYear();
    const month = _date.getMonth() + 1;
    const day = _date.getDate();
    const hour = _date.getHours(); 
    const minute = _date.getMinutes();
    fs.appendFileSync(LOCAL_LOGS, `时间：${year}-${month}-${day} ${hour}:${minute}    ip: ${ip} \n`);
}

let preIpv6 = readLocalIp();

const startup = async () => {
    const currentIpv6 = OSUtil.getIPV6Address();
    if(currentIpv6 !== preIpv6 && currentIpv6) {
        preIpv6 = currentIpv6;
        writeIp(currentIpv6);
        appendFile(currentIpv6);
        await sendEmail(currentIpv6)
    }
} 

// 执行逻辑
(async () => {
    while(true) {
        await startup();
        await sleep(1000 * 60 * 10);
    }
})();