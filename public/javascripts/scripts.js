/* eslint-disable no-undef */
$(document).ready(function() {
  const arr = [];
  $('.modal-footer button, .close').on('click', function () {
    $('.modal').slideUp(500, function () {
      $('.forms').children().children().removeClass('error');
    });
  })

 
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
});
