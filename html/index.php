<?php include "../inc/dbinfo.inc"; ?>
<!DOCTYPE html>
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0" charset="utf-8"/>
	<link rel="stylesheet" href="css/foundation.css">
	<link rel="stylesheet" href="css/app.css">
	<title>SCC Student Record System</title>
</head>
<body>
	<ul class="tabs" data-tabs id="indStuScore">
		<li class="tabs-title is-active" id="step1tabButton"><a href="#step1" aria-selected="true">Step 1: Select a student</a></li>
		<li class="tabs-title" id="step2tabButton"><a href="#step2" class="disabled">Step 2: Select report options</a></li>
		<li class="tabs-title" id="step3tabButton"><a href="#step3" class="disabled">Step 3: View reports</a></li>
	</ul>

	<div class="tabs-content" data-tabs-content="indStuScore">

		<div class="tabs-panel is-active" id="step1">
			
			<div class="grid-container">
				<form id='stuSearchForm'>
					<div class="grid-x grid-margin-x">
						<div class="cell large-12">
							<label>Registration number
								<input type="text" name="regno">
							</label>
						</div>

						<div class="cell large-12">
							<label>Chinese name
								<input type="text" name="chname">
							</label>
						</div>

						<div class="cell large-12">
							<label>English name
								<input type="text" name="enname">
							</label>
						</div>

						<div class="cell large-12">
							<label>Class
								<input type="text" name="class">
							</label>
						</div>

						<div class="cell large-12">
							<label>Class number
								<input type="text" name="classno">
							</label>
						</div>
					</div>
				</form>

				<div class="grid-x grid-margin-x">
					<div class="cell large-12 text-center">
						<button type="button" class="button" id="stuSearchBtn">Search</button>
					</div>
					<div class="cell large-12 hide" id="loadingStuSearch">Loading...</div>
				</div>

				<div class="grid-x grid-margin-x hide" id="stuSelection">
					<div class="cell large-12">
						<table class="hover" id="stuSearchResult"></table>
					</div>
					<div class="cell large-12 text-center">
						<button type="button" class="button success" id="toStep2">Continue</button>
					</div>
				</div>
			</div>

		</div>

		<div class="tabs-panel" id="step2">

			<div class="grid-container">
				<div class="grid-x grid-margin-x">
					<div class="callout primary cell large-12" id="stuInfoCallout"></div>
				</div>

				<form id='reportSpecForm'>
					<div class="grid-x grid-margin-x">

						<fieldset class="fieldset cell large-12">
							<legend>Assessments <span data-tooltip class="right" title="You can click on the topmost row or leftmost column to do mass selection.">[ ? ]</span></legend>
							<div class="switch inline-block tiny">
								<input class="switch-input" id="assessmentClassSwitch" type="checkbox" checked>
								<label class="switch-paddle" for="assessmentClassSwitch"></label>
							</div>
							<div class="inline-block blue"> Select all / Select none</div>
							<table id="assessmentClassList" class="scroll"></table>
						</fieldset>

						<fieldset class="fieldset cell large-12">
							<legend>Subjects</legend>
							<div class="switch inline-block tiny">
								<input class="switch-input" id="subjectSwitch" type="checkbox" checked>
								<label class="switch-paddle" for="subjectSwitch"></label>
							</div>
							<div class="inline-block blue"> Select all / Select none</div>
							<div id="subjectList"></div>
						</fieldset>		

						<fieldset class="fieldset cell large-12">
							<legend>Conduct <span data-tooltip class="right" title="You can click on the topmost row or leftmost column to do mass selection.">[ ? ]</span></legend>
							<div class="switch inline-block tiny">
								<input class="switch-input" id="conductClassSwitch" class="assistSwitch" type="checkbox" checked>
								<label class="switch-paddle" for="conductClassSwitch"></label>
							</div>
							<div class="inline-block blue"> Select all / Select none</div>
							<table id="conductClassList" class="scroll"></table>
						</fieldset>

						<fieldset class="fieldset cell large-12">
							<legend>Presentation format</legend>
							<div class="switch inline-block tiny">
								<input class="switch-input" id="formatSwitch" type="checkbox" class="assistSwitch" checked>
								<label class="switch-paddle" for="formatSwitch"></label>
							</div>
							<div class="inline-block blue"> Select all / Select none</div>
							<div id="formatList">
								<div class="inline-block">
									<input name="format[]" type="checkbox" id="formatTable" value="table" class="dataSwitch" checked>
									<label for="formatTable">Table</label>
								</div>
								<div class="inline-block">
									<input name="format[]" type="checkbox" id="formatChart" value="chart" class="dataSwitch" checked>
									<label for="formatChart">Chart</label>
								</div>
							</div>
						</fieldset>

						<fieldset class="fieldset cell large-12">
							<legend>Metric</legend>
							<div id="metricList">
								<div class="inline-block">
									<input name="metric" type="radio" id="metricScore" value="score" class="dataSwitch" checked>
									<label for="metricScore">Score</label>
								</div>
								<div class="inline-block">
									<input name="metric" type="radio" id="metricRank" value="rank" class="dataSwitch">
									<label for="metricRank">Position in form</label>
								</div>
							</div>
						</fieldset>

						<div class="cell large-12 text-center">
							<button type="button" class="button success" id="toStep3">Continue</button>
						</div>

					</div>
				</form>
				
			</div>

		</div>

		<div class="tabs-panel" id="step3">

			<div class="callout primary text-center" id="reportStuInfoCallout"></div>
			<div class="callout alert text-center hide" id="reportLoading">Loading...</div>
			<section id="tableSection" class="hide step3 resetToHide">

				<hr>
				<h2>Tables</h2>

				<section id="scoreTableSection" class="hide step3 resetToHide">
					<h4 id="scoreTableHeading"></h4> 
					<p><i>You can click on the topmost row to sort the data.</i></p>
					<table id="scoreTable" class="scroll"></table>
				</section>

				<section id="improvmentTableSection" class="hide step3 resetToHide">
					<h4>Improvement</h4>
					<table id="improvementTable" class="scroll"></table>
				</section>

				<section id="conductTableSection" class="hide step3 resetToHide">
					<h4>Conduct</h4>
					<table id="conductTable" class="scroll"></table>
				</section>

			</section>

			<section id="chartSection" class="hide step3 resetToHide">

				<hr>
				<h2>Charts</h2>
				<p><i>You can right-click on the charts to save as pictures.</i></p>

				<section id="scoreChartSection" class="hide step3 resetToHide">
					<h4 id="scoreChartHeading"></h4>
					<div class="grid-container">
						<div class="grid-x grid-margin-x">
							<div id="scoreChartContainer" class="cell large-12"></div>
						</div>
					</div>
				</section>

				<section id="conductChartSection" class="hide step3 resetToHide">
					<h4>Conduct</h4>
					<div class="grid-container">
						<div class="grid-x grid-margin-x">
							<div id="conductChartContainer" class="cell large-12"></div>
						</div>
					</div>

				</section>

			</section>

		</div>

	</div>

	<script src="js/vendor/jquery.js"></script>
	<script src="js/vendor/what-input.js"></script>
	<script src="js/vendor/foundation.js"></script>
	<script src="js/app.js"></script>
	<script src="settings/config.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></script>

</body>
</html>