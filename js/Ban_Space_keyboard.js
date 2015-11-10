// 禁止input中输入某些按键
// 这里的两个input分别禁止的是空格(32)和除了数字和删除键(backspace)外的键
// 代码适用React和jquery

onInputKeyUp: function (input_id) {
    $('#' + input_id).keydown(
        function (e) {
            if (!e) var e = window.event;
            if (input_id == 'new_user_id'){
                if (((e.keyCode >= 48) && (e.keyCode <= 57)) || ((e.keyCode >= 96) && (e.keyCode <= 105)) || e.keyCode == 8 || e.keyCode == 0) {
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                };
            }else{
                if (e.keyCode == 32) {
                    e.preventDefault();
                    e.stopPropagation();
                };
            };
    });