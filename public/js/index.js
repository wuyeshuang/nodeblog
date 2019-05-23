
$(function() {

	var $loginBox = $('#loginBox');
	var $registerBox = $('#registerBox');
	var $userInfo = $('#userInfo');

	//切换到注册面板
	$loginBox.find('a.colMint').on('click', function() {
		$registerBox.show();
		$loginBox.hide();
	});

	//切换到登录面板
	$registerBox.find('a.colMint').on('click', function() {
		$loginBox.show();
		$registerBox.hide();
	});
	
	$("#username_exist").blur(function(){
		$.ajax({
			url: '/api/user/register',
			type: 'post',
			dataType: 'json',
			data: {username:$(this).val()},
			success: function(result) {
				if (result.res_code == 5) {
					alert("用户名已经存在")
					// $("#username_exist").val("")
				}
			}
		})
	})
	
	//注册
	$('#register_form').on('submit', function(e) {
		e.preventDefault()
		var formData = $(this).serialize()
		$.ajax({
			url: '/api/user/register',
			type: 'post',
			data: formData,
			dataType: 'json',
			success: function(result) {
				if (result.res_code == 1) {
					alert("请输入用户名")
				} else if (result.res_code == 2) {
					alert("请输入密码")
				} else if (result.res_code == 3) {
					alert("两次输入的密码不一致")
				} else if (result.res_code == 4) {
					alert("服务器忙，请稍后再试")
				} else if (result.res_code == 5) {
					alert("用户已存在")
				} else if (result.res_code == 0) {
					alert("注册成功")
 					$("#registerBox").hide()
 					$("#loginBox").show()
					$("#jz_login").val($("#username_exist").val())
				}

			}
		})
	})


	//登录
	$('#login_form').on('submit', function(e) {
			e.preventDefault()
			var formData = $(this).serialize()
			$.ajax({
				url: '/api/user/login',
				type: 'post',
				data: formData,
				dataType: 'json',
				success: function(result) {
					if (result.res_code == 1) {
						alert("用户名不能为空")
					}else if (result.res_code == 2) {
						alert("密码不能为空")
					}else if (result.res_code == 3) {
						alert("用户名或密码错误")
					}else if (result.res_code == 0) {
						// alert("登录成功")
						window.location.href = '/'
					}
	
				}
			})
		})
	

	//退出
	$("#logout").click(function(){
		$.ajax({
			url: '/api/user/logout',
			success: function(result) {
				if (result.res_code == 0) {
					window.location.href = '/'
				}
			
			}
		})
	})
// 	$('#logout').on('click', function() {
// 		$.ajax({
// 			url: '/api/user/logout',
// 			success: function(result) {
// 				if (result.code == 0) {
// 					window.location.reload();
// 				}
// 
// 			}
// 		});
// 	})



})
