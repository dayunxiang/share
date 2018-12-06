import fetch from '@/utils/fetch';
import axios from 'axios'
//数据字典： api类型  数据类型
export function getType(query) {
  return fetch({
    url: '/webapp/dicDetail/type_enable',
    method: 'get',
    params: query
  })
}


export function download2(params, url, fileName = '下载附件.xlsx', callback, loading) {
  var xhr = new XMLHttpRequest();
  xhr.open('post', url, true);    
  xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8"); 
  xhr.responseType = "blob";  
  xhr.onprogress = function(event) {
    if (event.lengthComputable) {
      let per = (event.loaded / event.total * 100).toFixed(2) + '%'
      loading(per)
    }
  }
  xhr.onload = function () {
    if (this.status === 200) {
      if (window.navigator.msSaveOrOpenBlob) {
        var blob = this.response;
        navigator.msSaveBlob(blob, fileName)
      } else {
        var blob = new Blob([this.response], {type: 'text'}); 
        var a = document.createElement('a');
        a.download = fileName;
        var URL = window.URL || window.webkitURL;
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } 

    } else {
      callback()
    }
  };
  xhr.send(params)
}

export function download(params,url, fileName, callback) {
  axios({
    url: url,
    method: 'post',
    responseType: 'blob',
    data: params
  }).then(resp => {
    if (resp.status === 200) {
      callback()
      if (window.navigator.msSaveOrOpenBlob) {
        var blob = resp.data;
        navigator.msSaveBlob(blob, fileName)
      } else {
        var blob = new Blob([resp.data], {type: 'text'}); 
        var a = document.createElement('a');
        a.download = fileName;
        var URL = window.URL || window.webkitURL;
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } 
    } else {
      callback()
    }
  })
}