<template>
    <div ref="scrollCon" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll" class="tags-outer-scroll-con">
        <div class="close-all-tag-con">
            <el-dropdown @command="handleTagsOption">
              <el-button type="primary">
                标签选项<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="clearAll">关闭所有</el-dropdown-item>
                <el-dropdown-item command="clearOthers">关闭其他</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
            <!--<transition-group name="taglist-moving-animation">
                <el-tag 
                    type="dot"
                    v-for="(item, index) in pageTagsList" 
                    ref="tagsPageOpened"
                    :key="item.name" 
                    :name="item.name" 
                    @on-close="closePage"
                    @click.native="linkTo(item)"
                    :closable="item.name==='home_index'?false:true"
                    :color="item.children?(item.children[0].name===currentPageName?'blue':'default'):(item.name===currentPageName?'blue':'default')"
                >{{ item.title }}</el-tag>
                
            </transition-group>-->
            <span ref="tagsPageOpened" v-for="(item, index) in pageTagsList" :key="index" :class="['tags', item.meta.active ? 'active' : '', item.name == 'shareCenter' ? 'shareTab' : '']" @click="changeTab(item, index)">
                {{item.meta.title}}
                <span class="close" @click.stop="closeTag(item, index)" v-if="item.name != 'shareCenter'">x</span>
            </span>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
export default {
    name: 'tagsPage',
    data () {
        return {
            currentPageName: this.$route.name,
            tagBodyLeft: 0,
            refsTag: [],
            tagsCount: 1
        };
    },
    props: {
        pageTagsList: Array,
        beforePush: {
            type: Function,
            default: (item) => {
                return true;
            }
        }
    },
    computed: {
        title () {
            return this.$store.state.app.currentTitle;
        },
        tagsList () {
            return this.$store.state.app.pageOpenedList;
        }
    },
    methods: {
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        },
        closePage (event, name) {
            let pageOpenedList = this.$store.state.app.pageOpenedList;
            let lastPageObj = pageOpenedList[0];
            if (this.currentPageName === name) {
                let len = pageOpenedList.length;
                for (let i = 1; i < len; i++) {
                    if (pageOpenedList[i].name === name) {
                        if (i < (len - 1)) {
                            lastPageObj = pageOpenedList[i + 1];
                        } else {
                            lastPageObj = pageOpenedList[i - 1];
                        }
                        break;
                    }
                }
            }
            this.$store.commit('removeTag', name);
            this.$store.commit('closePage', name);
            pageOpenedList = this.$store.state.app.pageOpenedList;
            localStorage.pageOpenedList = JSON.stringify(pageOpenedList);
            if (this.currentPageName === name) {
                this.linkTo(lastPageObj);
            }
        },
        linkTo (item) {
            let routerObj = {};
            routerObj.name = item.name;
            if (item.argu) {
                routerObj.params = item.argu;
            }
            if (item.query) {
                routerObj.query = item.query;
            }
            if (this.beforePush(item)) {
                this.$router.push(routerObj);
            }
        },
        handlescroll (e) {
            var type = e.type;
            let delta = 0;
            if (type === 'DOMMouseScroll' || type === 'mousewheel') {
                delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;
            }
            let left = 0;
            if (delta > 0) {
                left = Math.min(0, this.tagBodyLeft + delta);
            } else {
                if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) {
                    if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
                        left = this.tagBodyLeft;
                    } else {
                        left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth - 100);
                    }
                } else {
                    this.tagBodyLeft = 0;
                }
            }
            this.tagBodyLeft = left;
        },
        handleTagsOption (type) {
            if (type === 'clearAll') {
                this.$store.state.app.tagsList = [{
                    name: 'shareCenter',
                    path: '/share/center',
                    meta: {
                        title: '我的共享'
                    }
                }]
                this.$store.state.app.cacheList = []
                this.$router.push({
                    name: 'shareCenter'
                })
            } else {
                if ( this.$store.state.app.tagsList.length == 1) {
                    return false
                }
                let i = 0
                this.$store.state.app.tagsList.forEach((v, index) => {
                    if (v.meta.active) {
                        i = index
                    }
                })
                let data = this.$store.state.app.tagsList[i]
                this.$store.state.app.tagsList = []
                this.$store.state.app.tagsList.push({
                    name: 'shareCenter',
                    path: '/share/center',
                    meta: {
                        title: '我的共享'
                    }
                })
                if (data.name != 'shareCenter') {
                    this.$store.state.app.tagsList.push(data)
                }

                let name = this.$store.state.app.cacheList[i]
                this.$store.state.app.cacheList = []
                this.$store.state.app.cacheList.push(name)
            }
        },
        moveToView (tag) {
            if (tag.offsetLeft < -this.tagBodyLeft) {
                // 标签在可视区域左侧
                this.tagBodyLeft = -tag.offsetLeft + 10;
            } else if (tag.offsetLeft + 10 > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100) {
                // 标签在可视区域
            } else {
                // 标签在可视区域右侧
                this.tagBodyLeft = -(tag.offsetLeft - (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) + 20);
            }
        },
        changeTab(route, index) {
            this.$store.state.app.tagsList.forEach((v) => {
                v.meta.active = false
            })
            this.$store.state.app.tagsList[index].meta.active = true
            this.$router.push({
                path: route.path
            })
        },
        closeTag(route, index) {
            this.$store.state.app.cacheList.splice(index, 1)
            if (this.$store.state.app.tagsList.length > 1) {
                if (index != 0) {
                    this.$store.state.app.tagsList.splice(index, 1)
                    this.$store.state.app.tagsList[index - 1].meta.active = true
                    this.$router.push({
                        path: this.$store.state.app.tagsList[index - 1].path
                    })
                } else {
                    this.$store.state.app.tagsList.splice(index, 1)
                    this.$store.state.app.tagsList[0].meta.active = true
                    this.$router.push({
                        path: this.$store.state.app.tagsList[0].path
                    })
                }
            } else {
                this.$store.state.app.tagsList = []
                this.$router.push({
                    name: 'empty'
                })
            }
        }
    },
    mounted () {
       /** this.refsTag = this.$refs.tagsPageOpened;
        setTimeout(() => {
            this.refsTag.forEach((item, index) => {
                if (this.$route.name === item.name) {
                    let tag = this.refsTag[index].$el;
                    this.moveToView(tag);
                }
            });
        }, 1); // 这里不设定时器就会有偏移bug
        this.tagsCount = this.tagsList.length;*/
    },
    watch: {
        '$route' (to) {
            this.refsTag = this.$refs.tagsPageOpened
            this.currentPageName = to.name;
            this.$nextTick(() => {
                this.pageTagsList.forEach((item, index) => {
                    if (to.name === item.name) {
                        let tag = this.refsTag[index];
                        this.moveToView(tag);
                    }
                });
            });
           // this.tagsCount = this.tagsList.length;
        }
    }
};
</script>
