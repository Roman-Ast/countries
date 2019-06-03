/* eslint-disable no-undef */
$(document).ready(function() {
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
});
