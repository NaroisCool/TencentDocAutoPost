
const axios = require('axios')
const notify = require('./sendNotify')

const h ={"accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-f8b5a12993b6ed888eca31ca1b5b9e3f-3a8b6a99b6ecddc0-01",
    "cookie": process.env.TencentDocCookie,
    "Referer": "https://docs.qq.com/desktop",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}
//TODO 动态获取token
const p = "folder_id=%2F&limit=40&list_type=6&order_type=0&sort_type=2&start=0&xsrf="+process.env.TencentDocCookie.match(/TOK=(\S*);/)[1]+""
axios.post("https://docs.qq.com/cgi-bin/online_docs/doclist",p , {headers:h})
.then((res)=>{
    console.log(res.data)
    arr = res.data.list_info
    for(var i = 0; i < arr.length; i++){
        if(arr[i].doc_url == process.env.DaoZhenUrl.replace(/^https:+/, "")){
            var d_id = arr[i].domain_id
            var p_id = arr[i].pad_id
            var padId = d_id+'$'+p_id
            console.log('已获取到设置文档地址的padid',padId)
            post(padId)
        }

    }

})

function post(padId){
    const header =  {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryqSDreB2wBZrEFB8J",
        "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": process.env.TencentDocCookie,
        "Referer": process.env.DaoZhenUrl,
        "Referrer-Policy": "strict-origin-when-cross-origin"
        }
    const payload = "------WebKitFormBoundaryqSDreB2wBZrEFB8J\r\nContent-Disposition: form-data; name=\"data\"\r\n\r\n{\"global_padid\":\""+padId+"\",\"data\":\"[{\\\"id\\\":\\\"SIMPLE1662714821565l7u9h399\\\",\\\"type\\\":\\\"SIMPLE\\\",\\\"content\\\":\\\""+process.env.NAME+"\\\",\\\"dataType\\\":1,\\\"securityStatus\\\":false},{\\\"id\\\":\\\"SIMPLE1669210457760latot481\\\",\\\"type\\\":\\\"SIMPLE\\\",\\\"content\\\":\\\""+process.env.CLASS+"\\\",\\\"dataType\\\":1,\\\"securityStatus\\\":false},{\\\"id\\\":\\\"SIMPLE1669210476407latotim0\\\",\\\"type\\\":\\\"SIMPLE\\\",\\\"content\\\":\\\""+process.env.NUMBER+"\\\",\\\"dataType\\\":1,\\\"securityStatus\\\":false},{\\\"id\\\":\\\"SIMPLE1669210495369latotx8q\\\",\\\"type\\\":\\\"SIMPLE\\\",\\\"content\\\":\\\""+process.env.IDCard+"\\\",\\\"dataType\\\":6,\\\"securityStatus\\\":false},{\\\"id\\\":\\\"SIMPLE1669210502669latou2vi\\\",\\\"type\\\":\\\"SIMPLE\\\",\\\"content\\\":\\\""+process.env.TEL+"\\\",\\\"dataType\\\":7,\\\"securityStatus\\\":false},{\\\"id\\\":\\\"CHECKBOX1669210517909latouemv\\\",\\\"type\\\":\\\"CHECKBOX\\\",\\\"content\\\":[\\\""+process.env.DaoZhenCheck+"\\\"],\\\"dataType\\\":1,\\\"selectedOptionIds\\\":[\\\"OPTIONlatouoqw\\\"]},{\\\"id\\\":\\\"RADIO1669210573239latovlbv\\\",\\\"type\\\":\\\"RADIO\\\",\\\"content\\\":[\\\""+process.env.TIME+"\\\"],\\\"dataType\\\":1,\\\"selectedOptionIds\\\":[\\\"OPTIONlatovnit\\\"]}]\",\"role\":{\"hideIds\":[]}}\r\n------WebKitFormBoundaryqSDreB2wBZrEFB8J--\r\n"

    axios.post('https://docs.qq.com/form/collect/submit',payload,{headers:header} )
    .then((res) => {
    r = res.statusText+JSON.stringify(res.data)
    notify.sendNotify('导诊活动报名结果',r)
    console.log(`statusCode: ${r}`)
    console.log(res)
    })
    .catch((error) => {
    console.error(error)
    })
}

