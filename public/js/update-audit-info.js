$(document).ready(function(){
  function loadInfo(){
    $.ajax({
      async: true,
      url: 'audit-info/',
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log(data.text);
        var auditInfo = $('#audit-info').empty();


        var auditTemplate = $('#auditTemplate');

        auditTemplate.find('.trans-hash').text(data.auditInfo.transactionHash);
        auditTemplate.find('.block-hash').text(data.auditInfo.blockHash);
        auditTemplate.find('.block-number').text(data.auditInfo.blockNumber);

        auditTemplate.find('.from').text(data.auditInfo.from);
        auditTemplate.find('.to').text(data.auditInfo.to);
        auditTemplate.find('.gas-used').text(data.auditInfo.gasUsed);

        auditInfo.append(auditTemplate.html());
      }
    });
  }

  loadInfo();
});
