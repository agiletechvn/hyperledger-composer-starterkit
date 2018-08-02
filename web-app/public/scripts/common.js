function renderTable(data, columns) {
  var str = '<table class="table table-bordered">';
  str += '<thead><tr>';
  for (var i = 0; i < columns.length; ++i) {
    str += '<th>' + columns[i].label + '</th>';
  }
  str += '</tr></thead>';

  str += '<tbody>';

  for (var ind = 0; ind < data.length; ++ind) {
    str += '<tr>';
    var row = data[ind];
    for (var i = 0; i < columns.length; ++i) {
      var itemData = row[columns[i].key];
      if (columns[i].filter) {
        itemData = columns[i].filter(itemData);
      }
      str += '<td>' + itemData + '</td>';
    }
    str += '</tr>';
  }
  str += '</tbody>';
  str += '</table>';
  return str;
}

function resourceFilter(item) {
  return item
    .replace('resource:org.clp.biznet.Partner#', '')
    .replace('resource:org.clp.biznet.Member#', '')
    .replace('org.clp.biznet.', '');
}

function renderTransactionTable(data) {
  return renderTable(data, [
    { key: 'timestamp', label: 'TimeStamp' },
    { key: 'partner', label: 'Partner', filter: resourceFilter },
    { key: 'member', label: 'Member', filter: resourceFilter },
    { key: 'points', label: 'Points' },
    { key: '$class', label: 'Transaction Name', filter: resourceFilter },
    { key: 'transactionId', label: 'Transaction ID' }
  ]);
}
