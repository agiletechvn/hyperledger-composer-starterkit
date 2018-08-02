var apiUrl = location.protocol + '//' + location.host + '/api/';
var partner = localStorage.getItem('partner');

if (partner) {
  partner = JSON.parse(partner);
}

$(function() {
  if (partner) {
    showLoggedPartner(partner);
  } else {
    $('#signInEl').removeClass('d-none');
  }
});

function showLoggedPartner(data) {
  $('#signOutEl,#signInEl').addClass('d-none');
  $('#signOutEl')
    .removeClass('d-none')
    .click(function() {
      localStorage.removeItem('partner');
      window.reload();
    });

  //update heading
  $('.heading').html(function() {
    var str = '<h2><b> ' + data.name + ' </b></h2>';
    str = str + '<h2><b> ' + data.id + ' </b></h2>';

    return str;
  });

  //update dashboard
  $('.dashboards').html(function() {
    var str = '';
    str =
      str +
      '<h5>Total points allocated to customers: ' +
      data.pointsGiven +
      ' </h5>';
    str =
      str +
      '<h5>Total points redeemed by customers: ' +
      data.pointsCollected +
      ' </h5>';
    return str;
  });

  //update earn points transaction
  $('.points-allocated-transactions').html(
    renderTransactionTable(data.earnPointsResults)
  );

  //update use points transaction
  $('.points-redeemed-transactions').html(
    renderTransactionTable(data.usePointsResults)
  );

  //remove login section
  document.getElementById('loginSection').style.display = 'none';
  //display transaction section
  document.getElementById('transactionSection').style.display = 'block';
}

//check user input and call server
$('.sign-in-partner').click(function() {
  //get user input data
  var formPartnerId = $('.partner-id input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData =
    '{' +
    '"partnerid" : "' +
    formPartnerId +
    '", ' +
    '"cardid" : "' +
    formCardId +
    '"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'partnerData',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = 'block';
    },
    success: function(data) {
      //remove loader
      document.getElementById('loader').style.display = 'none';

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {
        partner = data;
        localStorage.setItem('partner', JSON.stringify(partner));
        showLoggedPartner(partner);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert('Error: Try again');
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);

      location.reload();
    }
  });
});
