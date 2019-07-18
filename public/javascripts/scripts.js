/* eslint-disable no-undef */
$(document).ready(function() {
  const arr = [];
  $('.modal-footer button, .close').on('click', function () {
    $('.modal').slideUp(500, function () {
      $('.forms').children().children().removeClass('error');
      $('.forms').children().children().val();
    });
  })

  $('.selectFromDb').on('change', function(e) {
    e.preventDefault();

    const data = {
      type: 'country',
      name: $(this).val()
    };
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/'
    }).done(function(data) {
      if (data.ok) {
        $(location).attr('href', '/find');
      } else {
        alert(
          'Извините мы еще не добавили эти данные в базу, или Вы ввели неверные данные!'
        );
      }
    });
  });

  let valueOfSelect = '';
  $('#inlineFormCustomSelectPref').on('change', function() {
    valueOfSelect = $(this).val();
  });

  $('.btn-outline-success').on('click', function(e) {
    e.preventDefault();

    const data = {
      type: valueOfSelect,
      name: $('.form-control').val()
    };
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/'
    }).done(function(data) {
      if (data.ok) {
        $(location).attr('href', '/find');
      } else {
        alert(
          'Извините мы еще не добавили эти данные в базу, или Вы ввели неверные данные!'
        );
      }
    });
  });

  $('#createRecord').on('click', function(e) {
    e.preventDefault();

    const data = {
      country: $('input[name=country]').val(),
      capital: $('input[name=capital]').val(),
      oficialLanguages: $('input[name=oficialLanguages]').val().split(','),
      cities: $('textarea[name=cities]').val().split(','),
      population: $('input[name=population]').val(),
      square: $('input[name=square]').val(),
      flag: $('input[name=flag]').val(),
      telCode: $('input[name=telCode]').val(),
      geoCoordinats: $('input[name=geoCoordinats]').val().split(','),
      backgroundPic: $('input[name=backgroundPic]').val(),
      other: $('textarea[name=other]').val(),
    }

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/create'
    }).done(function(data) {
      if (data.error) {
        alert(data.error);
        return;
      }
      if (data.ok) {
        $('.modal').slideDown(1000);
        $('.modal-title').html('ОК!');
        $('.modal-body').html('Спасибо! Ваши данные успешено внесены в базу!');
        $('.forms input').val();
      } else {
        for(let i in data.fields){
          if(data.fields[i] === '' || data.fields[i][0] === '')arr.push(i);
        }
        arr.forEach(el => {
          $(`input[name=${el}]`).addClass('error');
          $(`textarea[name=${el}]`).addClass('error');
        })
        $('.modal-title').html('Ошибка');
        $('.modal-body').html('Проверьте заполнение всех полей или попробуйте позже...');
        $('.modal').slideDown(1000);
      }
    });
  })

  $('.btn-register').on('click', function (e) {
    e.preventDefault();

    if ($('#register-name').val().length < 3) {
      alert('Логин должен состоять как минимум из 3 символов!');
    } else if ($('#register-password').val().length < 5) {
      alert('Пароль должен состоять как минимум из 5 символов!');
    }
    else if ($('#register-password').val() !== $('#register-confirm-password').val()) {
      alert('Пароли не соответствуют!');
    } else {
      const data = {
        login: $('#register-name').val(),
        password: $('#register-password').val(),
        confirmPassword: $('#register-confirm-password').val(),
      }

      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/register'
      }).done(function (data) {
        if (!data.ok) {
          alert(data.message);
        } else {
          alert(data.message);
          $(location).attr('href', '/');
        }
      })
    }
    

    
  })

  $('.btn-sign-in').on('click', function (e) {
    e.preventDefault();

    const data = {
      login: $('#login-name').val(),
      password: $('#login-password').val()
    }

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/login'
    }).done(function (data) {
      if (!data.ok) {
        alert(data.message);
      } else {
        $(location).attr('href', '/');
      }
    })
  })

  $('.reg').on('click', function () {
    $('.registration-form').css({'display': 'flex'});
    $('.sign-in-form').css({'display': 'none'});
  })
  $('.sign-in').on('click', function () {
    $('.sign-in-form').css({'display': 'flex'});
    $('.registration-form').css({'display': 'none'});
  })
  $('.logout').on('mouseover', function () {
    $(this).css({'background': 'rgb(212, 25, 25)'});
    $('.logout a:first-child').css({'color': '#fff'});
  })
  $('.logout').on('mouseout', function () {
    $(this).css({'background': ''});
    $('.logout a:first-child').css({'color': 'rgb(212, 25, 25)'});
  })
  
});