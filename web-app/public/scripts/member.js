var apiUrl = location.protocol + '//' + location.host + '/api/';
var user = localStorage.getItem('user');
var balances = localStorage.getItem('balances');

balances = balances ? JSON.parse(balances) : {};

if (user) {
  user = JSON.parse(user);
  user.currencies = balances[user.accountNumber.toString()];
}

function updateBalance(user) {
  balances[user.accountNumber.toString()] = user.currencies;
  localStorage.setItem('balances', JSON.stringify(balances));
}

$(function() {
  if (user) {
    showLoggedUser(user);
  } else {
    $('#loginSection').show();
    $('#signInEl').removeClass('d-none');
  }
});

//check user input and call server
$('.sign-in-member').click(function() {
  updateMember();
});

function showLoggedUser(data) {
  $('#headingSection').show();
  $('#loginSection').hide();
  $('#signOutEl,#signInEl').addClass('d-none');
  $('#signOutEl')
    .removeClass('d-none')
    .click(function() {
      // update currencies
      updateBalance(user);
      localStorage.removeItem('user');
      window.reload();
    });

  // default balance
  if (data.currencies !== 0 && !data.currencies) {
    data.currencies = 500;
    user.currencies = data.currencies;
    updateBalance(user);
  }

  //update heading
  $('.heading').html(function() {
    var str = '<h2><b>' + data.firstName + ' ' + data.lastName + '</b></h2>';
    str = str + '<h2><b>' + data.accountNumber + '</b></h2>';
    str = str + '<h2><b>' + data.points + '</b></h2>';

    return str;
  });

  //update wallet heading
  $('#walletHeading').html(function() {
    var str = '<p><b>' + data.firstName + ' ' + data.lastName + '</b></p>';
    str += '<p><b>' + data.accountNumber + '</b></p>';
    str += '<p><b>' + data.points + '</b></p>';

    str += '<p><b>' + data.currencies + '$</b></p>';

    str += '<p><b>' + data.currencies + ' VPoint</b></p>';

    var walletAddress =
      'bea90e7af711c43e47fa8bc0466154b0e13ff37aafdc7e444936d4918dd4a8b4';
    str +=
      '<p><b><a target="_blank" href="http://173.212.251.237:8000/api/balance/' +
      walletAddress +
      '">' +
      walletAddress +
      '</a></b></p>';

    return str;
  });

  //update partners dropdown for earn points transaction
  $('.earn-partner select').html(function() {
    var str = '<option value="" disabled="" selected="">select</option>';
    var partnersData = data.partnersData;
    for (var i = 0; i < partnersData.length; i++) {
      str =
        str +
        '<option partner-id=' +
        partnersData[i].id +
        '> ' +
        partnersData[i].name +
        '</option>';
    }
    return str;
  });

  //update partners dropdown for use points transaction
  $('.use-partner select').html(function() {
    var str = '<option value="" disabled="" selected="">select</option>';
    var partnersData = data.partnersData;
    for (var i = 0; i < partnersData.length; i++) {
      str =
        str +
        '<option partner-id=' +
        partnersData[i].id +
        '> ' +
        partnersData[i].name +
        '</option>';
    }
    return str;
  });

  //update earn points transaction
  $('.points-allocated-transactions').html(
    renderTransactionTable(data.earnPointsResult)
  );

  //update use points transaction
  $('.points-redeemed-transactions').html(
    renderTransactionTable(data.usePointsResults)
  );

  //remove login section and display member page
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('transactionSection').style.display = 'block';
}

function getCardId() {
  var formCardId = $('.card-id input').val();
  if (!formCardId) {
    formCardId = prompt('Enter your form card id:', '123456789');
    $('.card-id input').val(formCardId);
  }

  return formCardId;
}

function updateMember() {
  //get user input data
  var formAccountNum = user
    ? user.accountNumber
    : $('.account-number input').val();
  var formCardId = getCardId();

  //create json data
  var inputData =
    '{' +
    '"accountnumber" : "' +
    formAccountNum +
    '", ' +
    '"cardid" : "' +
    formCardId +
    '"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'memberData',
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
        // update user to database
        user = data;
        localStorage.setItem('user', JSON.stringify(data));
        user.currencies = balances[user.accountNumber.toString()];
        // update
        showLoggedUser(user);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert('Error: Try again');
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
    complete: function() {}
  });
}

$('.earn-points-30').click(function() {
  earnPoints(30);
});

$('.earn-points-80').click(function() {
  earnPoints(80);
});

$('.earn-points-200').click(function() {
  earnPoints(200);
});

//check user input and call server
$('.earn-points-transaction').click(function() {
  var formPoints = $('.earnPoints input').val();
  earnPoints(formPoints);
});

function earnPoints(formPoints) {
  //get user input data
  var formAccountNum = user.accountNumber;
  var formCardId = getCardId();
  var formPartnerId = $('.earn-partner select')
    .find(':selected')
    .attr('partner-id');

  //create json data
  var inputData =
    '{' +
    '"accountnumber" : "' +
    formAccountNum +
    '", ' +
    '"cardid" : "' +
    formCardId +
    '", ' +
    '"points" : "' +
    formPoints +
    '", ' +
    '"partnerid" : "' +
    formPartnerId +
    '"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'earnPoints',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = 'block';
      document.getElementById('infoSection').style.display = 'none';
    },
    success: function(data) {
      document.getElementById('loader').style.display = 'none';
      document.getElementById('infoSection').style.display = 'block';

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {
        //update member page and notify successful transaction
        updateMember();
        // update balances
        user.currencies += parseInt(formPoints);
        updateBalance(user);
        // show alert
        alert('Transaction successful');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Error: Try again');
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });
}

$('.use-points-50').click(function() {
  usePoints(50);
});

$('.use-points-150').click(function() {
  usePoints(100);
});

$('.use-points-200').click(function() {
  usePoints(150);
});

//check user input and call server
$('.use-points-transaction').click(function() {
  var formPoints = $('.usePoints input').val();
  usePoints(formPoints);
});

function usePoints(formPoints) {
  //get user input data
  var formAccountNum = user.accountNumber;
  var formCardId = getCardId();
  var formPartnerId = $('.use-partner select')
    .find(':selected')
    .attr('partner-id');

  //create json data
  var inputData =
    '{' +
    '"accountnumber" : "' +
    formAccountNum +
    '", ' +
    '"cardid" : "' +
    formCardId +
    '", ' +
    '"points" : "' +
    formPoints +
    '", ' +
    '"partnerid" : "' +
    formPartnerId +
    '"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'usePoints',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = 'block';
      document.getElementById('infoSection').style.display = 'none';
    },
    success: function(data) {
      document.getElementById('loader').style.display = 'none';
      document.getElementById('infoSection').style.display = 'block';

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {
        //update member page and notify successful transaction
        updateMember();
        // update balances
        user.currencies -= parseInt(formPoints);
        updateBalance(user);
        alert('Transaction successful');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Error: Try again');
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
    complete: function() {}
  });
}
