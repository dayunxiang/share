<style scoped>

</style>

<template>
    <div>
        <div>
             <textarea id="editEditor"></textarea>
        </div>
    </div>
</template>

<script>
import tinymce from 'tinymce';
export default {
    name: 'editEditor',
    props: {
        data: String,
        editorData: String
    },
    data () {
        return {
            spinShow: true
        };
    },
    watch: {
        editorData(content) {

            tinymce.activeEditor.setContent(content)
        }
    },
   
    methods: {
        getContent() {
            let content = tinymce.activeEditor.getContent();
            this.$emit('content', content)
        },
       
    },
    mounted () {
        tinymce.init({
            selector: '#editEditor',
            branding: false,
            elementpath: false,
            height: 250,
            language: 'zh_CN.GB2312',
            menubar: 'edit insert view format table tools',
            theme: 'modern',
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                'searchreplace visualblocks visualchars code fullscreen fullpage',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
            autosave_interval: '20s',
            image_advtab: true,
            table_default_styles: {
                width: '100%',
                borderCollapse: 'collapse'
            }
        }).then(() => {
             tinymce.activeEditor.setContent(this.editorData)
        })
    },
    destroyed () {
        tinymce.get('editEditor').destroy();
    },
    
};
</script>

<style>

</style>
