
exports.install = function (Vue, options) {
    Vue.prototype.handleSuccess = function (){
        this.$notify({
		      title: '成功',
		      message: "操作成功",
		      type: 'success',
		      duration: 2000
	    });
    };

    Vue.prototype.handleError = function (error){
    	console.log(error)
    };

    Vue.prototype.cateOptions = [
        { code: '1', name: '年度问题' },
        { code: '2', name: '专项问题' }
    ]


    Vue.prototype.dstrbuStatusOptions = [
        { code: '0', name: '未下发' },
        { code: '1', name: '已下发' },
        { code: '2', name: '已退回' },
    ]

    Vue.prototype.dstrbuStatusOption = [
        { code: '0', name: '未下发' },
        { code: '1', name: '已下发' }
    ]

    Vue.prototype.setTagTitle = function (){
        var tagTextList = document.querySelector('.tag-title').querySelectorAll('.el-select__tags-text')
        tagTextList.forEach( (item) => {
          item.setAttribute('title', item.innerText)
        })
    };

    Vue.prototype.validatePass = (rule, value, callback) => {
      const patt = /^\s+$/g
      if(value.match(patt)) {
        callback(new Error('输入值不能全为空格'));
      } else {
        callback()
      }
    };
    
    //flag '1' 日常监督管理上传
        


};
