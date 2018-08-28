var regno;

$(document).foundation();

$(document).ready(function(){

	$('#step2tabButton a').attr('href', '#');
	$('#step3tabButton a').attr('href', '#');

	/** stuSearchBtn **/
	$("#stuSearchBtn").click(function(){ 

		// show loading
		$('#loadingStuSearch').removeClass('hide');

		var data = $('#stuSearchForm').serializeArray(); // convert to an array first
		data.push({name: 'curYear', value: config.curYear});
		$.post('ajax/ajax_student_search.php', $.param(data), function (response) {
			
			var table = document.getElementById("stuSearchResult");
			// Reset the table first
			table.innerHTML = '<thead><tr>' +
			'<td></td>' + 
			'<td>Registration number</td>' +
			'<td>Chinese name</td>' +
			'<td>English name</td>' +
			'<td>Gender</td>' +
			'<td>Class</td>' +
			'<td>Class no.</td>' +
			'</tr></thead>';

			var tbody = document.createElement('tbody');
			for (var i=0; i<response.length; i++){
				var row = tbody.insertRow(i);
				j=0;
				// add radiobox, checked if it is the first row
				var cell = row.insertCell(j++);
				cell.innerHTML = '<input type="radio" name="selectedStu" value="' +
				response[i].regno + '"' + (i==0 ? ' checked':'') + '>';

				for (var key in response[i]){
					var cell = row.insertCell(j++);
					cell.innerHTML = response[i][key];
				}
			}
			table.appendChild(tbody);

			// Clicking on the row would select the radiobox
			$('#stuSearchResult tr').click(function() {
				$(this).find('input').prop("checked", true);
			});

			// Disable or enable the continue button
			if (response.length==0){
				$('#toStep2').addClass('disabled');
			} else {
				$('#toStep2').removeClass('disabled');
			}

			// Show the student selection part
			$('#stuSelection').removeClass('hide');
			$('#loadingStuSearch').addClass('hide');

		});
	});
	
	/** toStep2 **/
	$("#toStep2").click(function(){

		if (!$(this).is('.disabled')){

			// Change to page 2
			$('#step2tabButton a').removeClass('disabled');
			$('#step2tabButton a').attr('href', '#step2');
			$('#indStuScore').foundation('selectTab', 'step2', false);

			// Show loading messages
			$('#stuInfoCallout').html('Loading...');
			$('#classList').html('Loading...');
			$('#subjectList').html('Loading...');
			$('#assessmentList').html('Loading...');

			regno = $('input[name=selectedStu]:checked').val(); // set the global variable regno
			
			// update callout on page 2
			var data = {
				'regno': regno,
				'chname': '',
				'enname': '',
				'class': '',
				'classno': '',
				'curYear': config.curYear
			}
			$.post('ajax/ajax_student_search.php', data, function(response){
				$('#stuInfoCallout').html(`<b>${response[0].chname} ${response[0].class} (${response[0].classno})</b> is currently selected. 
											If this is incorrect, you may go back to Step 1.`);
				$('#reportStuInfoCallout').html(`<h5>Report for ${response[0].class} (${response[0].classno}) ${response[0].chname}</h5>`);
			});


			/* return assessment-class and conduct-class history */

			// return assessment list
			var getAssessmentList = new Promise(function(resolve, reject){
				$.post('ajax/ajax_assessment_available.php', null, function (response) {
					$('#assessmentClassList').html('Loading...');
					resolve(response);
				});
			});

			// return class list
			var data = {'regno': regno};
			var getClassList = new Promise(function(resolve, reject){
				$.post('ajax/ajax_class_available.php', data, function(response){
					resolve(response);
				});
			});
			
			// return conduct list
			var getConductList = new Promise(function(resolve, reject){
				$.post('ajax/ajax_conduct_available.php', null, function (response) {
					$('#conductClassList').html('Loading...');
					resolve(response);
				});
			});

			// construct assessment-class table
			Promise.all([getAssessmentList, getClassList]).then(function(values){

				$('#assessmentClassList').html('');

				var assessmentList = values[0];
				var classList = values[1];

				var table = document.getElementById("assessmentClassList");
				var thead = document.createElement('thead');
				var row = thead.insertRow(0);
				row.innerHTML = '<th></th>';

				for (var i=0; i<assessmentList.length; i++){
					row.innerHTML += `<th>
										<input type="checkbox" 
										id="assessmentClassSwitch_assessment${assessmentList[i].timeseq}" 
										data-timeseq="${assessmentList[i].timeseq}" 
										class="assistSwitch" 
										checked>
										<label for="assessmentClassSwitch_assessment${assessmentList[i].timeseq}">
											<b>${assessmentList[i].meaning}</b>
										</label>
									</th>`;
				}

				table.appendChild(thead);

				var tbody = document.createElement('tbody');
				for (var i=0; i<classList.length; i++){
					var row = tbody.insertRow(i);
					var schyear = String(classList[i].schyear).slice(-2) + '-' + String(classList[i].schyear + 1).slice(-2);
					row.innerHTML = `<th>
										<input type="checkbox" 
											id="assessmentClassSwitch_class${classList[i].std_hist_id}" 
											data-std-hist-id="${classList[i].std_hist_id}" 
											class="assistSwitch" 
											checked>
										<label for="assessmentClassSwitch_class${classList[i].std_hist_id}">
											<b>${classList[i].class} (${schyear})</b>
										</label>
									</th>`;
					for (var j=0; j<assessmentList.length; j++){
						row.innerHTML += `<td>
											<input type="checkbox" 
											name="assessmentClass[${classList[i].std_hist_id}][${assessmentList[j].timeseq}]" 
											id="assessmentClass_${classList[i].std_hist_id}_${assessmentList[j].timeseq}"
											class="dataSwitch" 
											data-std-hist-id="${classList[i].std_hist_id}" 
											data-timeseq="${assessmentList[j].timeseq}" checked>
										</td>`;
					}					
				}

				table.appendChild(tbody);

				// bind switches to change events
				$('#assessmentClassList input.assistSwitch').change(function(){
					var timeseq = $(this).attr('data-timeseq');
					var std_hist_id = $(this).attr('data-std-hist-id');
					if (timeseq !== undefined){  									// it is an assessment switch
						$(`#assessmentClassList input[data-timeseq=${timeseq}]`).prop('checked', $(this).prop("checked"));
					} else { 														// else it is an class switch
						$(`#assessmentClassList input[data-std-hist-id=${std_hist_id}]`).prop('checked', $(this).prop("checked"));
					}
				});

			});

			// construct conduct-class table
			Promise.all([getConductList, getClassList]).then(function(values){

				$('#conductClassList').html('');

				var conductList = values[0];
				var classList = values[1];

				var table = document.getElementById("conductClassList");
				var thead = document.createElement('thead');
				var row = thead.insertRow(0);
				row.innerHTML = '<th></th>';

				for (var i=0; i<conductList.length; i++){
					row.innerHTML += `<th>
										<input type="checkbox" 
										id="conductClassSwitch_conduct${conductList[i].timeseq}" 
										data-timeseq="${conductList[i].timeseq}" 
										class="assistSwitch" 
										checked>
										<label for="conductClassSwitch_conduct${conductList[i].timeseq}">
											<b>${conductList[i].meaning}</b>
										</label>
									</th>`;
				}

				table.appendChild(thead);

				var tbody = document.createElement('tbody');
				for (var i=0; i<classList.length; i++){
					var row = tbody.insertRow(i);
					var schyear = String(classList[i].schyear).slice(-2) + '-' + String(classList[i].schyear + 1).slice(-2);
					row.innerHTML = `<th>
										<input type="checkbox" 
											id="conductClassSwitch_class${classList[i].std_hist_id}" 
											data-std-hist-id="${classList[i].std_hist_id}" 
											class="assistSwitch" 
											checked>
										<label for="conductClassSwitch_class${classList[i].std_hist_id}">
											<b>${classList[i].class} (${schyear})</b>
										</label>
									</th>`;
					for (var j=0; j<conductList.length; j++){
						row.innerHTML += `<td>
											<input type="checkbox" 
											name="conductClass[${classList[i].std_hist_id}][${conductList[j].timeseq}]" 
											id="conductClass_${classList[i].std_hist_id}_${conductList[j].timeseq}"
											class="dataSwitch" 
											data-std-hist-id="${classList[i].std_hist_id}" 
											data-timeseq="${conductList[j].timeseq}" checked>
										</td>`;
					}					
				}

				table.appendChild(tbody);

				// bind switches to change events
				$('#conductClassList input.assistSwitch').change(function(){
					var timeseq = $(this).attr('data-timeseq');
					var std_hist_id = $(this).attr('data-std-hist-id');
					if (timeseq !== undefined){  									// it is an conduct switch
						$(`#conductClassList input[data-timeseq=${timeseq}]`).prop('checked', $(this).prop("checked"));
					} else { 														// else it is an class switch
						$(`#conductClassList input[data-std-hist-id=${std_hist_id}]`).prop('checked', $(this).prop("checked"));
					}
				});

			});

			/* return subjects */
			var data = {
				'code': config.subjectList.map(x => x.code),
				'regno': regno
			}
			$.post('ajax/ajax_subject_available.php', data, function(response){
				$('#subjectList').html('');
				for (var i=0; i<config.subjectList.length; i++){
					if ( response[config.subjectList[i].code] > 0 ){
						$('#subjectList').append(`<div class="inline-block">
													<input name="subject[]" 
													type="checkbox" 
													id="checkboxSubject${config.subjectList[i].code}"
													class="dataSwitch"  
													value="${config.subjectList[i].code}" 
													checked>
													<label for="checkboxSubject${config.subjectList[i].code}">${config.subjectList[i].html}</label>
												</div>`);
					}
				}
			});
		}
	});
	
	/** toStep3 **/
	$("#toStep3").click(function(){

		// Change to page 3
		$('#step3tabButton a').removeClass('disabled');
		$('#step3tabButton a').attr('href', '#step3');
		$('#indStuScore').foundation('selectTab', 'step3', false); 

		$('#reportLoading').removeClass('hide'); // show loading...
		$('.step3.resetToHide').addClass('hide'); // Hide all tables / charts first

		var data = $('#reportSpecForm').serialize();

		var getScore = new Promise(function(resolve, reject){
			if ($("#assessmentClassList input:checked.dataSwitch").length != 0 && $("#subjectList input:checked.dataSwitch").length != 0){
				$.post('ajax/ajax_score_search.php', data, function (response) {
					resolve(response);
				});
			} else {
				resolve(null);
			}
		});

		var getConduct = new Promise(function(resolve, reject){
			if ($("#conductClassList input:checked.dataSwitch").length != 0){
				$.post('ajax/ajax_conduct_search.php', data, function (response) {
					resolve(response);
				});
			} else {
				resolve(null);
			}
		});

		Promise.all([getScore, getConduct]).then(function(values){

			var scoreArr = values[0];
			var conductArr = values[1];
			
			// if there are academic records to show
			if ($("#assessmentClassList input:checked.dataSwitch").length != 0 && $("#subjectList input:checked.dataSwitch").length != 0) {

				// academic table
				if ($('#formatTable').prop('checked')) {
					
					if ($('#metricScore').prop('checked')) $('#scoreTableHeading').html('Score');
					if ($('#metricRank').prop('checked')) $('#scoreTableHeading').html('Rank');

					$('#scoreTableSection').removeClass('hide');
					$('#scoreTable').html('');

					var table = document.getElementById("scoreTable");
					var thead = document.createElement('thead');
					var row = thead.insertRow(0);
					row.innerHTML = '<th>Subjects</th>';

					for (var i=0; i<scoreArr.length; i++){
						var schyear = String(scoreArr[i].schyear).slice(-2) + '&#8209;' + String(scoreArr[i].schyear + 1).slice(-2); // non-breaking hyphen
						row.innerHTML += `<th>${scoreArr[i].class}\n(${schyear})\n${scoreArr[i].meaning}</th>`;
					}
					table.appendChild(thead);

					var tbody = document.createElement('tbody');
					$("#subjectList input.dataSwitch:checked").each(function(i, obj){
						var row = tbody.insertRow(i);
						var subjcode = $(this).val();
						var displayname = $(this).next('label').html()
						row.innerHTML = '<th>' + displayname + '</th>';		 // next label shows the display name of subject
						for (var j=0; j<scoreArr.length; j++){
							var score = scoreArr[j][subjcode] == null ? '' : scoreArr[j][subjcode];
							row.innerHTML += `<td>${score}</td>`;
						}
					});
					table.appendChild(tbody);

					makeSortable(document.getElementById("scoreTable"));

				}

				// academic chart
				if ($('#formatChart').prop('checked')) {
					
					if ($('#metricScore').prop('checked')) $('#scoreChartHeading').html('Score');
					if ($('#metricRank').prop('checked')) $('#scoreChartHeading').html('Rank');

					$('#scoreChartSection').removeClass('hide');
					$('.scoreChart').remove();
					
					$("#subjectList input.dataSwitch:checked").each(function(i, obj){

						var subjcode = $(this).val();
						var displayname = $(this).next('label').html();
						$('#scoreChartContainer').append(`<canvas id="scoreChart${i}" class="cell large-12 scoreChart"><canvas>`);
						var ctx = document.getElementById(`scoreChart${i}`).getContext('2d');

						var chart = new Chart(ctx, {
							type: 'line',	
							data: {
								labels: scoreArr.map(a => a.class + ' ' + a.meaning),
								datasets: [{
									label: $('#metricScore').prop('checked') ? "Score" : "Rank",
									backgroundColor: 'rgb(255, 99, 132)',
									borderColor: 'rgb(255, 99, 132)',
									fill: false,
									lineTension: 0.3,
									data: scoreArr.map(a => a[subjcode]) 
								}]
							},
							options: {
								scales: {
									yAxes: [{
										ticks: {
											reverse: $('#metricRank').prop('checked')  // if it is rank, high value is bad
										}
									}]
								},
								legend: {
									display: false
								},
								title: {
									text: displayname,
									display: true
								},
								hover: {
									intersect: false
								},
								tooltips: {
									intersect: false
								}
							}
						});
					});
				}
			}

			// if need to show conduct
			if ($("#conductClassList input:checked.dataSwitch").length != 0) {

				// conduct table
				if ($('#formatTable').prop('checked')) {
					
					$('#conductTableSection').removeClass('hide');
					$('#conductTable').html('');

					var table = document.getElementById("conductTable");
					var thead = document.createElement('thead');
					var row = thead.insertRow(0);
					row.innerHTML = '';

					for (var i=0; i<conductArr.length; i++){
						var schyear = String(conductArr[i].schyear).slice(-2) + '&#8209;' + String(conductArr[i].schyear + 1).slice(-2); // non-breaking hyphen
						row.innerHTML += `<th>${conductArr[i].class}\n(${schyear})\n${conductArr[i].meaning}</th>`;

					}
					table.appendChild(thead);

					var tbody = document.createElement('tbody');
					var row = tbody.insertRow(0);
						
					for (var i=0; i<conductArr.length; i++){
						var conduct = conductArr[i].conduct == null ? '' : conductArr[i].conduct;
						row.innerHTML += `<td>${conduct}</td>`;
					}
					table.appendChild(tbody);

				}

				// conduct chart
				if ($('#formatChart').prop('checked')) {
					
					$('#conductChartSection').removeClass('hide');
					$('#conductChart').remove();
					$('#conductChartContainer').append('<canvas id="conductChart" class="cell large-12"><canvas>');

					var ctx = document.getElementById('conductChart').getContext('2d');

					var chart = new Chart(ctx, {
						type: 'line',	
						data: {
							labels: conductArr.map(a => a.class + ' ' + a.meaning),
							datasets: [{
								label: "Conduct",
								backgroundColor: 'rgb(255, 99, 132)',
								borderColor: 'rgb(255, 99, 132)',
								fill: false,
								lineTension: 0.3,
								data: conductArr.map(a => a.conduct === null ? null : config.conductGrade.indexOf(a.conduct)) 
							}]
						},
						options: {
							scales: {
								yAxes: [{
									ticks: {
										min: 0,
										max: config.conductGrade.length - 1,
										stepSize: 1,
										callback: function(label, index, labels) {
											return config.conductGrade[label];
										}
									}
								}]
							},
							legend: {
								display: false
							},
							title: {
								text: 'Conduct',
								display: true
							},
							hover: {
								intersect: false
							},
							tooltips: {
								intersect: false,
								callbacks: {
				                    label: function(tooltipItems, data) { 
				                        return config.conductGrade[tooltipItems.yLabel];
				                    }
				                }
							}
						}
					});

				}
			}

			// finally show the table and/or charts section
			if ($('#formatTable').prop('checked')) $('#tableSection').removeClass('hide');
			if ($('#formatChart').prop('checked')) $('#chartSection').removeClass('hide');

			// Hide loading
			$('#reportLoading').addClass('hide');

		});

	});

	/** Switches **/
	$('#assessmentClassSwitch').change(function(){
		$("#assessmentClassList input").prop('checked', $(this).prop("checked"));
	});
	$('#conductClassSwitch').change(function(){
		$("#conductClassList input").prop('checked', $(this).prop("checked"));
	});
	$('#subjectSwitch').change(function(){
		$("#subjectList input.dataSwitch").prop('checked', $(this).prop("checked"));
	});
	$('#formatSwitch').change(function(){
		$("#formatList input.dataSwitch").prop('checked', $(this).prop("checked"));
	});

	function sortTable(table, col, reverse) {
		var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
			tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
			i;
		tr = tr.sort(function (a, b) { // sort rows
			a = a.cells[col].innerHTML;
			b = b.cells[col].innerHTML;

			// if there are empty cells, put them at the lowest place
			if (a === '') return 1;   // 1 means swap
			if (b === '') return -1;  // -1 means not swap

			// if both are numbers
			if (isFinite(a) && isFinite(b)){
				if (parseFloat(a) < parseFloat(b)) return -1 * reverse;
				if (parseFloat(b) < parseFloat(a)) return 1 * reverse;
				if (parseFloat(b) === parseFloat(a)) return 0;
			} else {
				// if there are strings
				if (a < b) return -1 * reverse;
				if (b < a) return 1 * reverse;
				if (b === a) return 0;
			}
		});
		for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order

		$(table).find("thead th span").html(''); // clear arrows
		$(table).find(`thead th span:eq(${col})`).html(reverse == 1 ? '‎▲' : '▼'); // add arrows

	}

	function makeSortable(table) {
		var th = table.tHead, i;
		th && (th = th.rows[0]) && (th = th.cells);
		if (th) i = th.length;
		else return; // if no `<thead>` then do nothing
		while (--i >= 0) (function (i) {
			var dir = -1;
			th[i].addEventListener('click', function () {sortTable(table, i, (dir = -1 * dir))});
		}(i));
		$(table).find("thead th").addClass('clickable');
		$(table).find("thead th").append("<span class='red'></span>")
	}


});
