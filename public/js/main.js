function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var LOCAL_SITE_NAME = 'localhost:8000';
// var LOCAL_SITE_NAME = 'modultrade.local';

function recaptchaCallback() {
    $('#form-register .group-recaptcha').removeClass('has-error');
}

$(document).ready(function () {

    var action = getParameterByName('action');
    var data = getParameterByName('data');
    if (action && data) {
        var confirm_url = '';
        if (location.host.indexOf(LOCAL_SITE_NAME) !== -1) {
            confirm_url = 'http://localhost:4244/api/main/confirm/' + action + '/' + data;
        } else {
            confirm_url = '/api/main/confirm/' + action + '/' + data;
        }
        $.ajax({
            url: confirm_url
        }).done(function (res) {
            res.user.token = res.token;
            window.localStorage.setItem('user', JSON.stringify(res.user));
            $('#form-loading').hide();
            $('#form-send-finish').show();
        }).fail(function() {
            $('#form-loading').hide();
            $('#form-send-error').show();
        });
    }
    
    window.contactForm = new ContactForm();
    window.register = new RegisterForm();
    window.login = new LoginForm();
    window.reset = new ResetForm();
    window.resetPasswordFormTop = new SubscribeForm();

});

var ContactForm = (function () {
	function ContactForm() {
		if (location.host.indexOf(LOCAL_SITE_NAME) !== -1) {
			this.url = 'http://localhost:4244/api/main/contactus';
		} else {
			this.url = '/api/main/contactus';
		}
		var self = this;
		$('#form-contact button').on('click', function () {
			self.send();
		});
		$('#form-contact input').on('keyup', function (e) {
			$(e.target).parent().removeClass('has-error');
		});
		$('#form-contact textarea').on('keyup', function (e) {
			$(e.target).parent().removeClass('has-error');
		});
		$('.form-contact-title').hide();
	}

	ContactForm.prototype.getFormData = function () {
		return $('#form-contact').serialize();
	};

	ContactForm.prototype.loading = function () {
		var $form = $('#form-contact');
		$form
			.removeClass('form-animated-loading-errors')
			.addClass('form-animated-loading')
			.find('[name]').attr('disabled', false);
		$form.find('button').attr('disabled', false);

	};

	ContactForm.prototype.unLoading = function () {
		var $form = $('#form-contact');
		$form.removeClass('form-animated-loading')
			.addClass('form-animated-loading-errors')
			.find('[name]')
			.removeAttr('disabled');
		$form.find('button').removeAttr('disabled');
		setTimeout(function () {
			$form.removeClass('form-animated-loading-errors');
		}, 500);
	};
	ContactForm.prototype.success = function () {
		var $form = $('#form-contact');
		this.hideErrors()
		$form.removeClass('form-animated-loading')
			.removeClass('form-animated-loading-errors')
			.addClass('form-animated');
			$('#form-send').show();
		setTimeout(function () {
			$('#form-send-circle').addClass('form-send-circle-animated');
			setTimeout(function () {
				$('#form-send-check').addClass('form-send-check-animated');
				$('.form-contact-title').show().addClass('form-contact-title-animate');
				$form[0].reset();
				$form.hide();
			}, 900);
		}, 500);
	};
	ContactForm.prototype.hideErrors = function (errors) {
		$('#form-contact .group').removeClass('has-error');
		$('#form-contact .group-textarea').removeClass('has-error');
	};
	ContactForm.prototype.showErrors = function (errors) {
		this.hideErrors();
		if (errors) {
			for (var p in errors) {
				var $group = $('#contact-form-group-' + p);
				$group.find('.error').text(errors[p]);
				$group.addClass('has-error');
			}
		}
	};
	ContactForm.prototype.send = function () {
		var self = this;
		var data = this.getFormData();
		this.loading();
		$.post(this.url, data)
			.done(function () {
				self.success();
			}).fail(function (d) {
			self.unLoading();
			if (d.responseJSON && d.responseJSON.errors) {
				self.showErrors(d.responseJSON.errors);
			}
		});
	};
	return ContactForm;
})();

var RegisterForm = (function () {
    function RegisterForm() {
        if (location.host.indexOf(LOCAL_SITE_NAME) !== -1) {
            this.url = 'http://localhost:4244/api/main/register';
        } else {
            this.url = '/api/main/register';
        }
        var self = this;
        $('#form-register button').on('click', function () {
            self.send();
        });
        $('#form-register input').on('keyup', function (e) {
            $(e.target).parent().removeClass('has-error');
        });
        $('#form-register .check-group input').on('click', function (e) {
            $('#form-register .check-group input').parent().parent().removeClass('has-error');
        });
    }

	RegisterForm.prototype.getFormData = function () {
		return $('#form-register').serialize();
	};

	RegisterForm.prototype.loading = function () {
		var $form = $('#form-register');
		$form
			.removeClass('form-animated-loading-errors')
			.addClass('form-animated-loading')
			.find('[name]').attr('disabled', true);
		$form.find('button').attr('disabled', true);
                $('#btn-register').hide();
                $('#btn-loader').show();

	};

	RegisterForm.prototype.unLoading = function () {
		var $form = $('#form-register');
		$form.removeClass('form-animated-loading')
			.addClass('form-animated-loading-errors')
			.find('[name]')
			.removeAttr('disabled');
		$form.find('button').removeAttr('disabled');
                $('#btn-register').show();
                $('#btn-loader').hide();
		setTimeout(function () {
			$form.removeClass('form-animated-loading-errors');
		}, 500);
	};
	RegisterForm.prototype.success = function (d) {
		var $form = $('#form-register');
		this.hideErrors()
		$form.removeClass('form-animated-loading')
		.removeClass('form-animated-loading-errors')
		.addClass('form-animated');
                $form.hide();
		$('#form-send-register').show();
                _kmq.push(['identify', d.email]);
                _kmq.push(['record', 'Signed up']);
		window.localStorage.setItem('user', JSON.stringify(d));
		var url = window.location.origin;
	};
	RegisterForm.prototype.hideErrors = function (errors) {
		$('#form-register .group').removeClass('has-error');
		$('#form-register .group-textarea').removeClass('has-error');
	};
        RegisterForm.prototype.showErrors = function (errors) {
            this.hideErrors();
            if (errors) {
                for (var p in errors) {
                    var $group = $('#form-register-group-' + p);
                    $group.find('.error').text(errors[p]);
                    $group.addClass('has-error');
                }
            }
            grecaptcha.reset();
        };
	RegisterForm.prototype.send = function () {
		var self = this;
		var data = this.getFormData();
		this.loading();
		// $.post(this.url, data)
		// 	.beforeSend(function(request) {
		// 		request.setRequestHeader("user", 'qweqweqweqw');
		// 	})
		// 	.done(function (d) {
		// 		self.success(d.user);
		// 	}).fail(function (d) {
		// 	self.unLoading();
		// 	if (d.responseJSON && d.responseJSON.errors) {
		// 		self.showErrors(d.responseJSON.errors);
		// 	}
		// });
		var user = JSON.parse(JSON.stringify(window.localStorage.user || ''));
		$.ajax({
			url: this.url,
			method: 'POST',
			headers: {
				authorization: user && user.token,
			},
			data: data
		})
		.done(function (d) {
			self.success(d.user);
		}).fail(function (d) {
			self.unLoading();
			if (d.responseJSON && d.responseJSON.errors) {
				self.showErrors(d.responseJSON.errors);
			}
		});
	};
	return RegisterForm;
})();

var LoginForm = (function () {
	function LoginForm() {
		var pathname = window.location.pathname;
		if (window.localStorage.user && window.localStorage.user.confirmed && (pathname === '/login.html' || pathname === '/register.html')) {
			window.location.replace(window.location.origin + '/dashboard/');
		}
		if (location.host.indexOf(LOCAL_SITE_NAME) !== -1) {
			this.url = 'http://localhost:4244/api/auth/login';
		} else {
			this.url = '/api/auth/login';
		}
		var self = this;

		$('#form-login button').on('click', function () {
			self.send();
		});
		$('#form-login input').on('keyup', function (e) {
			$(e.target).parent().removeClass('has-error');
		});
	}
	LoginForm.prototype.getFormData = function () {
		return $('#form-login').serialize();
	};

	LoginForm.prototype.loading = function () {
		var $form = $('#form-login');
		$form
			.removeClass('form-animated-loading-errors')
			.addClass('form-animated-loading')
			.find('[name]').attr('disabled', true);
		$form.find('button').attr('disabled', true);
                $('#btn-sign').hide();
                $('#btn-loader').show();

	};

	LoginForm.prototype.unLoading = function () {
		var $form = $('#form-login');
		$form.removeClass('form-animated-loading')
			.addClass('form-animated-loading-errors')
			.find('[name]')
			.removeAttr('disabled');
		$form.find('button').removeAttr('disabled');
		setTimeout(function () {
			$form.removeClass('form-animated-loading-errors');
		}, 500);
                $('#btn-sign').show();
                $('#btn-loader').hide();
	};
	LoginForm.prototype.success = function (d) {
		var $form = $('#form-login');
		this.hideErrors()
		$form.removeClass('form-animated-loading')
		.removeClass('form-animated-loading-errors')
		.addClass('form-animated');
		$('#form-send-login').show();
                _kmq.push(['identify', d.user.email]);
                _kmq.push(['record', 'log in']);
                d.user.token = d.token;
		window.localStorage.setItem('user', JSON.stringify(d.user));
		var url = window.location.origin;
		window.location.replace(url + '/dashboard/');
	};
	LoginForm.prototype.hideErrors = function (errors) {
		$('#form-login .group').removeClass('has-error');
		$('#form-login .group-textarea').removeClass('has-error');
	};
	LoginForm.prototype.showErrors = function (errors) {
		this.hideErrors();
		for (var p in errors) {
			var $group = $('#form-login-group-' + p);
                        $group.find('.error').text(errors[p]);
                        if (p === 'password' && typeof errors['url'] !== 'undefined' ) {
                            $group.find('.error').append(' <a href="' + errors['url'] + '"> Resend link now </a>');
                        }			
			$group.addClass('has-error');
		}
		if (typeof errors === 'string') {
			var $group = $('#form-login-group-email');
			$group.find('.error').text(errors);
			$group.addClass('has-error');
		}
	};
	LoginForm.prototype.send = function () {
		var self = this;
		var data = this.getFormData();
		this.loading();
		$.post(this.url, data)
			.done(function (d) {
				self.success(d.user);
			}).fail(function (d) {
			self.unLoading();
			if (d.responseJSON && d.responseJSON.errors) {
				self.showErrors(d.responseJSON.errors);
			}
		});
	};
	return LoginForm;
})();

var ResetForm = (function () {
	function ResetForm() {
		if (location.host.indexOf(LOCAL_SITE_NAME) !== -1) {
			this.url = 'http://localhost:4244/api/main/reset';
		} else {
			this.url = '/api/main/reset';
		}
		var self = this;

		$('#form-reset button').on('click', function () {
			self.send();
		});
		$('#form-reset input').on('keyup', function (e) {
			$(e.target).parent().removeClass('has-error');
		});
		this.id = getParameterByName('id') || '';
		this.code = getParameterByName('code') || '';
		if (this.id && this.code) {
			$('#form-reset-group-email').hide();
			$('#form-new-password').show();
		}
	}
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	ResetForm.prototype.getFormData = function () {
		return $('#form-reset').serialize();
	};

	ResetForm.prototype.loading = function () {
		var $form = $('#form-reset');
		$form
			.removeClass('form-animated-loading-errors')
			.addClass('form-animated-loading')
			.find('[name]').attr('disabled', true);
		$form.find('button').attr('disabled', true);

	};

	ResetForm.prototype.unLoading = function () {
		var $form = $('#form-reset');
		$form.removeClass('form-animated-loading')
			.addClass('form-animated-loading-errors')
			.find('[name]')
			.removeAttr('disabled');
		$form.find('button').removeAttr('disabled');
		setTimeout(function () {
			$form.removeClass('form-animated-loading-errors');
		}, 500);
	};
	ResetForm.prototype.success = function (data) {
		var $form = $('#form-reset');
		this.hideErrors()
		$form.removeClass('form-animated-loading')
		.removeClass('form-animated-loading-errors')
		.addClass('form-animated');
		$('#form-reset').hide();
		if (data && data.user) {
                    data.user.token = data.token;
	            window.localStorage.setItem('user', JSON.stringify(data.user));
		    $('#form-send-reset-success').show();
		} else {
		    $('#form-send-reset').show();
		}
	};
	ResetForm.prototype.hideErrors = function (errors) {
		$('#form-reset .group').removeClass('has-error');
		$('#form-reset .group-textarea').removeClass('has-error');
	};
	ResetForm.prototype.showErrors = function (errors) {
		this.hideErrors();
		if (errors) {
			for (var p in errors) {
				var $group = $('#form-reset-group-' + p);
				$group.find('.error').text(errors[p]);
				$group.addClass('has-error');
			}
		}
	};
	ResetForm.prototype.send = function () {
		var self = this;
		var data = this.getFormData();
		data += '&id='+this.id+'&data='+this.code;
		this.loading();
		$.post(this.url, data)
			.done(function (d) {
				self.success(d);
			}).fail(function (d) {
			self.unLoading();
			if (d.responseJSON && d.responseJSON.errors) {
				self.showErrors(d.responseJSON.errors);
			}
		});
	};
	return ResetForm;
})();

var FormAction = function () {
	var self = this;

	self.getFormSelector = function (values) {
		return $(self.getFormId() + ' ' + ((typeof values === 'string') ? values : values.join(' ')));
	};
	self.getFormData = function () {
		return $(self.getFormId()).serialize();
	};
	self.hideErrors = function () {
		self.getFormSelector('.login-input-div').removeClass('has-error');
	};
	self.success = function () {
		self.hideErrors();
		$(self.getFormId()).hide();
		self.showSuccessMessage(true);
	};

	self.unload = function () {
		self.hideErrors();
		$(self.getFormId()).hide();
		self.showSuccessMessage(false);
	};

	self.isDev = function () {
		return location.host.indexOf(LOCAL_SITE_NAME) !== -1;
	};
	self.setUrl = function () {
		self.url = self.isDev() ? self.URL_DEV : self.URL_PROD;
	};
	self.send = function () {
		var data = self.getFormData();
		$.post(self.url, data).done(
			function () {
				self.success.apply(null, arguments);
			}
		).fail(
			function (d) {
				if (d.responseJSON && d.responseJSON.errors) {
					self.fail.apply(null, arguments);
				}
			});
	};
	self.show = function () {
		self.getFormSelector('').show();
	};
	self.subscribeOnSend = function () {
		var $button = self.getFormSelector('button');

		$button.on('click', function () {
			self.send();
		});

		$(self.getFormId() + ' input').on('keyup', function (e) {
			$(e.target).parent().removeClass('has-error');
			self.showSuccessMessage(false)
		});
	};

	self.getFormId = function () {
		return self.formId;
	};

	self.showErrors = function (errors) {
		self.hideErrors();
		if (errors) {
			for (var p in errors) {
				var $group = $(self.getFormId() + '-group-' + p);
				$group.find('.error-p').text(errors[p]);
				$group.addClass('has-error');
			}
		}
	};

	self.showSuccessMessage = function (value) {
		var $message = $(self.getFormId() + '-success-message');
		if (value) {
			$message.show();
		} else {
			$message.hide();
		}
	};

	self.clearInputData = function () {
		self.getFormSelector(' input').each(function () {
			$(this).val('');
		});
	};

	return self;
};

var SubscribeForm = (function () {
	function SubscribeForm() {
		if (location.host.indexOf(LOCAL_SITE_NAME) !== -1) {
			this.url = 'http://localhost:4244/api/main/subscribe';
		} else {
			this.url = '/api/main/subscribe';
		}
		var self = this;
		$('#form-subscribe button').on('click', function () {
			self.send();
		});
		$('#form-subscribe input').on('keyup', function (e) {
			$(e.target).parent().removeClass('has-error');
		});
	}

	SubscribeForm.prototype.getFormData = function () {
		return $('#form-subscribe').serialize();
	};

	SubscribeForm.prototype.loading = function () {
		var $form = $('#form-subscribe');
		$form
			.removeClass('form-animated-loading-errors')
			.addClass('form-animated-loading')
			.find('[name]').attr('disabled', false);
		$form.find('button').attr('disabled', false);

	};

	SubscribeForm.prototype.unLoading = function () {
		var $form = $('#form-subscribe');
		$form.removeClass('form-animated-loading')
			.addClass('form-animated-loading-errors')
			.find('[name]')
			.removeAttr('disabled');
		$form.find('button').removeAttr('disabled');
		setTimeout(function () {
			$form.removeClass('form-animated-loading-errors');
		}, 500);
	};
	SubscribeForm.prototype.success = function () {
		var $form = $('#form-subscribe');
		this.hideErrors()
		$form.removeClass('form-animated-loading')
			.removeClass('form-animated-loading-errors')
			.addClass('form-animated');
		$('#form-send').show();
		setTimeout(function () {
			$('#form-send-circle').addClass('form-send-circle-animated');
			setTimeout(function () {
				$('#form-send-check').addClass('form-send-check-animated');
				$('.form-subscribe-title').addClass('form-subscribe-title-animate');
				$form[0].reset();
			}, 900);
		}, 500);
	};
	SubscribeForm.prototype.hideErrors = function (errors) {
		$('#form-subscribe .group').removeClass('error');
	};
	SubscribeForm.prototype.showErrors = function (errors) {
		this.hideErrors();
		if (errors) {
			for (var p in errors) {
				var $group = $('#form-subscribe');
				$group.find('.error').text(errors[p]);
				$group.addClass('has-error');
			}
		}
	};
	SubscribeForm.prototype.send = function () {
		var self = this;
		var data = this.getFormData();
		this.loading();
		$.post(this.url, data)
			.done(function () {
				self.success();
			}).fail(function (d) {
				self.unLoading();
				if (d.responseJSON && d.responseJSON.errors) {
					self.showErrors(d.responseJSON.errors);
				}
			});
	};
	return SubscribeForm;
})();
