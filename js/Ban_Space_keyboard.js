// 禁止input中输入某些按键
// 这里的两个input分别禁止的是空格(32)和除了数字和删除键(backspace)外的键
// 代码适用React和jquery

onInputKeyUp: function(e) {
	if (!e) var e = window.event;
	// 48-57和96-105为数字键,8为退格键,190和110为小数点
	// 37和39为左右方向键,17为ctrl键,67为C键,86为V键,9为Tab键
	// 46为Delete键
	if (((e.keyCode >= 48) && (e.keyCode <= 57)) ||
		((e.keyCode >= 96) && (e.keyCode <= 105)) ||
		e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 39 ||
		e.keyCode == 17 || e.keyCode == 67 || e.keyCode == 86 ||
		e.keyCode == 9 || e.keyCode == 46
	) {
		return true;
	} else {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
},