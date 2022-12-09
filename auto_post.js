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
    "cookie": process.env.NorthSideCookie,
    "Referer": "https://docs.qq.com/desktop/?u=99d3c99d84b040eaa062b5a5083a886e",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}
const p = "folder_id=%2F&limit=40&list_type=6&order_type=0&sort_type=2&start=0&xsrf=9898ed4cafd43a31"

//获取你的所有表单
axios.post("https://docs.qq.com/cgi-bin/online_docs/doclist?u=99d3c99d84b040eaa062b5a5083a886e",p , {headers:h})
.then((res)=>{
    console.log(res.data.list_info)
    arr = res.data.list_info
    for(var i = 0; i < arr.length; i++){
      //匹配你设置的文档地址，并获取具体的文档padid
        if(arr[i].doc_url == process.env.NorthSideUrl.replace(/^https:+/, "")){
            var d_id = arr[i].domain_id
            var p_id = arr[i].pad_id
            var padId = d_id+'$'+p_id
            console.log('已获取到设置文档地址的padid',padId)
            post(padId)
        }

    }

})

//提交表单
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
        "cookie": process.env.NorthSideCookie,
        "Referer": process.env.NorthSideUrl,
        "Referrer-Policy": "strict-origin-when-cross-origin"
        }
    const payload = "------WebKitFormBoundaryqSDreB2wBZrEFB8J\r\nContent-Disposition: form-data; name=\"data\"\r\n\r\n{\"global_padid\":\""+padId+"\",\"data\":\"[{\\\"id\\\":\\\"blank-1\\\",\\\"type\\\":\\\"SIMPLE\\\",\\\"content\\\":\\\""+process.env.NorthSideP1+"\\\",\\\"dataType\\\":1,\\\"securityStatus\\\":false},{\\\"id\\\":\\\"SIMPLE1648443444768l1a8nyg1\\\",\\\"type\\\":\\\"SIMPLE\\\",\\\"content\\\":\\\""+process.env.NorthSideP2+"\\\",\\\"dataType\\\":1,\\\"securityStatus\\\":false},{\\\"id\\\":\\\"SIMPLE1648443452119l1a8o447\\\",\\\"type\\\":\\\"SIMPLE\\\",\\\"content\\\":\\\""+process.env.NorthSideP3+"\\\",\\\"dataType\\\":1,\\\"securityStatus\\\":false},{\\\"id\\\":\\\"SIMPLE1648443459227l1a8o9ln\\\",\\\"type\\\":\\\"SIMPLE\\\",\\\"content\\\":\\\""+process.env.NorthSideP4+"\\\",\\\"dataType\\\":1,\\\"securityStatus\\\":false}]\",\"role\":{\"hideIds\":[]}}\r\n------WebKitFormBoundaryqSDreB2wBZrEFB8J--\r\n"

    axios.post('https://docs.qq.com/form/collect/submit',payload,{headers:header} )
    .then((res) => {
    r = res.statusText+JSON.stringify(res.data)
    notify.sendNotify('北区核酸协助活动报名结果',r)
    console.log(`statusCode: ${r}`)
    console.log(res)
    })
    .catch((error) => {
    console.error(error)
    })
}

