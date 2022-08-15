const os = require('os');
const nodemailer = require('nodemailer');
const { resolve } = require('path');

class OSUtil {
    /**
     * 获取系统ipv4 地址
     * @return {string | (() => AddressInfo) | (() => (AddressInfo | {})) | (() => (AddressInfo | string | null))}
     */
    static getIPV4Address() {
        const interfaces = os.networkInterfaces();
        for (const devName in interfaces) {
            //
            //console.log(devName)
            const iface = interfaces[devName];
            //console.log(iface)
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                //console.log(alias)
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
        return null;
    }


    /**
     * 获取系统的ipv6地址
     * @return {string|(() => AddressInfo)|(() => (AddressInfo | {}))|(() => (AddressInfo | string | null))|null}
     */
    static getIPV6Address() {
        const interfaces = os.networkInterfaces();
        for (const devName in interfaces) {
            //
            const iface = interfaces[devName];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                //console.log(alias)
                if (alias.family === 'IPv6' && alias.address !== '::1' && !alias.internal && !alias.address.startsWith("fe")) {
                    return alias.address;
                }
            }
        }
        return null;
    }

}

let mailTransport = nodemailer.createTransport({
    host: 'smtp.qq.email',
    service:'qq',
    secure: true,   //安全方式发送,建议都加上
    auth: {
        user: '1184118891@qq.com',
        pass: 'fujyxvblfwglbahd'
    }
});

const sendEmail = (ip) => {
    let options = {
        from: ' "ip监听机器人" <1184118891@qq.com>',
        to: '<1184118891@qq.com>',
        bcc: '密送',
        subject: 'ip地址已变更',
        html: `<h1>${ip}</h1>`
    };
    return new Promise(resolve => {
        mailTransport.sendMail(options, function(err) {
            resolve()
            if(err) {
                console.log("send err!");
            } else {
                console.log("send success!");
            }
        });   
    })
}

const sleep = (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(time);
        }, time);
    })
}

module.exports = {
    OSUtil,
    sendEmail,
    sleep,
}