var form = document.formUpload;

uploadField = form.fileToUpload;

uploadField.onchange = function() {
    if(uploadField.files[0].size > 0){
       alert("File is too big!");
       uploadField.value = "";
    };
};