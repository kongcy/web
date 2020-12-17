import axios from 'axios'
const imSDK = {
    init() {
        return new Promise((reslove, reject) => {
            axios.get('/newapi/nck/qtalk_nav.qunar').then(res => {
                if (res.status === 200) {
                    global.startalkNav = res.data;
                    axios.get('/package/qtapi/nck/rsa/get_public_key.do').then(res => {
                        if (res.status === 200) {
                            global.startalkKeys = res.data;
                            import('@/sdk/imSdk/entry').then((res) => {
                                const { baseaddess: {domain, xmpp, xmppmport, fileurl, javaurl, socketurl} = {} } = startalkNav
                                let sdk = new QtalkSDK({
                                  debug: false,
                                  xmpp: '',
                                  // 链接配置
                                  connect: { 
                                    host: socketurl
                                  },
                                  maType: 6 // 平台类型web端：6
                                });
                                reslove(sdk);
                            });
                        }
                    })
                }
            }, (error) => {
                reject('即时通讯服务错误！');
            })
        })
    }
}
export default imSDK;