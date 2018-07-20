var defaultClanTag = '#2UPGPLYQ';

$(document).ready(function () {
		$("button").click(function() {
		var check = /#\w{8}/;
		var tag = $("#clanTagSearch").val();
		if(check.test(tag)){
			defaultClanTag = tag;
			populuateClanPage(defaultClanTag);
		} else {
			alert("bad tag " + $("#clanTagSearch").val() );
		}
	});
	
		$("#troop-trigger").click(function() {
		$("#troop-table").slideToggle();
		});
		$("#spell-trigger").click(function() {
			$("#spell-table").slideToggle();
		});
		
		$("#hero-trigger").click(function() {
			$("#hero-table").slideToggle();
		});
		
		$("#achievement-trigger").click(function() {
			$("#achievement-table").slideToggle();
		});
		
		$("#playerData").on('hide.bs.modal', function () {
			$("#troop-table").slideUp();
			$("#spell-table").slideUp();
			$("#hero-table").slideUp();
			$("#achievement-table").slideUp();
		 });

		
		populuateClanPage(defaultClanTag)
	  

});

//// end of doc ready


function buildModalFromPlayer(playerTag) {
	var uri='player?tag=' + playerTag.replace('#','%23');
	$.getJSON( uri, function(data, staus, result) {
		var player = data;
		var playerTownHall = player['townHallLevel'];
		var troops = player['troops'];
		var spells = player['spells'];
		var heros = player['heroes'];
		var achievements = player['achievements'];
		var role = player['role'];
		if(role == 'admin') {
			role = 'elder'
		}
		
		$('#modal-player-name').html(player['name']);
		$('#table-player-name').html(player['name']);
		$('#modal-player-role').html(role);
		$('#playerLevel').html(player['expLevel']);
		$('#townHallLevel').html(player['townHallLevel']);
		$('#builderHallLevel').html(player['builderHallLevel']);
		$('#playerTrophies').html(player['trophies']);
		$('#playerBestTrophies').html(player['bestTrophies']);
		$('#playerWarStars').html(player['warStars']);
		$('#playerAttackWins').html(player['attackWins']);
		$('#playerDefenseWins').html(player['defenseWins']);
		
		$('.modal-title').text('Player Data Sheet');
		try {
			$('#modal-player-badge').attr("src",player['league']['iconUrls']['medium']);
		}catch(err) {
			$('#modal-player-badge').attr("src",'');
		}
		
		
		$('#troop-data').empty();
		for(var i = 0; i < troops.length; i++) {
			var row = $('<tr>');
			row.append( $('<td>').text(troops[i]['name'] ));
			row.append( $('<td>').html('<b>' + troops[i]['level'] + '</b>/'+ troops[i]['maxLevel'] ));
			row.append( $('<td>').text(troops[i]['village'] ));
			$('#troop-data').append(row);
		}
		$('#spell-data').empty();
		for(var i = 0; i < spells.length; i++) {
			var row = $('<tr>');
			var row = $('<tr>');
			row.append( $('<td>').text(spells[i]['name'] ));
			row.append( $('<td>').html('<b>' + spells[i]['level'] + '</b>/'+ spells[i]['maxLevel'] ));
			row.append( $('<td>').text(spells[i]['village'] ));
			$('#spell-data').append(row);
		}
		
		$('#hero-data').empty();
		for(var i = 0; i < heros.length; i++) {
			var row = $('<tr>');
			var row = $('<tr>');
			row.append( $('<td>').text(heros[i]['name'] ));
			row.append( $('<td>').html('<b>' + heros[i]['level'] + '</b>/'+ heros[i]['maxLevel'] ));
			row.append( $('<td>').text(heros[i]['village'] ));
			$('#hero-data').append(row);
		}
		
		$('#achievement-data').empty();
		
		for(var i = 0; i < achievements.length; i++) {
			var row = $('<tr>');
			var row = $('<tr>');
			row.append( $('<td>').text(achievements[i]['name'] ));
			row.append( $('<td>').text(achievements[i]['stars'] ));
			row.append( $('<td>').text(achievements[i]['value'] + '/'+ achievements[i]['target'] ));
			row.append( $('<td>').text(achievements[i]['info'] ));
			try {
				row.append( $('<td>').text(achievements[i]['completionInfo'] ));
			} catch {
				console.log(err);
				row.append( $('<td>').text('N/A'));
			}
			row.append( $('<td>').text(achievements[i]['village'] ));
			if(achievements[i]['stars'] == 3) {
				row.addClass('success');
			} else if (achievements[i]['stars'] == 2) {
				row.addClass('warning');
			} else if (achievements[i]['stars'] == 1) {
				row.addClass('info');
			} else if (achievements[i]['stars'] == 0) {
				row.addClass('danger');
			}
			
			
			$('#achievement-data').append(row);
		}
		
		$("#playerData").modal();
	
	});
}
//end of modal builder
function getPlayer(playerName) {
	var i;
	var len = memberData['memberList'].length;
	for(i = 0; i < len; i++) {
		var name = memberData['memberList'][i]['name'];
		if(name == playerName) {
			return memberData['memberList'][i];
		}
	}
}

function populuateClanPage(clanTag) {
	var uri='clan?tag=' + clanTag.replace('#','%23');
	$.getJSON( uri, function(data, staus, result) {
		
		$("#clanName").text('Clan '+data["name"]);
		$("#clanBadge").attr({
			'src' : data['badgeUrls']['medium'],
			'align' : 'center'
			})
		$('#description').text(data['description']);
		
		var playerTable = $('#players');
		playerTable.empty();
		var row = $('<tr>');
		for(tag in data['memberList'][0]) {
			if(tag == "previousClanRank" ||
			   tag == "donations" ||
			   tag == "donationsReceived") {
				continue;
			}
			row.append( $('<th style="text-align:left"></th>').text(tag.toLocaleUpperCase()) );
			
		}
		row.append($('<th style="text-align:left"></th>').text('DONATION RATIO') );
		playerTable.append(row);
		
		var tableBody = $('<tbody>');
		for(var i =0; i < data["memberList"].length; i++) {
			var row = $('<tr>');
			var donations = 0;
			var donationRecvd = 0;
			var donationRation = 0;
			for(tag in data["memberList"][i]) {
				if(tag == "previousClanRank") {
					continue;
				} else if (tag == "name") { 
					var playerName = data["memberList"][i]['name'];
					var tableData = $('<td id="playerName" style="vertical-align:middle"></td>').text(playerName);
					var image = document.createElement('img');
					image.setAttribute("src",data["memberList"][i]["league"]['iconUrls']['small'])
					tableData.prepend(image);
					row.append(tableData);
				} else if (tag == "tag") {
					
					row.append($('<td id="playerTag" style="vertical-align:middle"></td>').text(data["memberList"][i][tag]));
				}else if (tag == "donations" ) {
						donations = data["memberList"][i]["donations"];
				} else if (tag == "donationsReceived") {
						donationRecvd = data["memberList"][i]["donationsReceived"];
				} else if(tag == "league") {
					var tableData = $('<td style="vertical-align:middle"></td>').text(data["memberList"][i][tag]['name']);
					row.append(tableData);
				} else if(tag == "role") {
					var role = data["memberList"][i][tag];
					if(role == 'admin') {
						role = 'elder';
					}
					row.append($('<td style="vertical-align:middle"></td>').text(role));
				} else {
					row.append($('<td style="vertical-align:middle"></td>').text(data["memberList"][i][tag]));
				}
			}
			donationRation = donations/donationRecvd;
			row.append($('<td style="vertical-align:middle"></td>').text(  (donationRation).toFixed(2)  ));
			if(donationRation < 0.5) {
				row.addClass("warning");
			}
			$(row).click(function() {
						buildModalFromPlayer($(this).find('#playerTag').text())
					});
			tableBody.append(row);
		}
		playerTable.append(tableBody);
	});
	
	
}






