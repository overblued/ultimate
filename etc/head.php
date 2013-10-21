<?php require_once 'common.php';?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title><?php echo $title; ?></title>
	<link rel="stylesheet" href="main.css"></link>
	<script src="js/common.js"></script>
	<script src="js/utils.js"></script>
	<script src="js/astar.js"></script>
</head>
<body>
	<header>
		<h1 id='tt'>Ultimate Project</h1>
	</header>
	<br />
	<nav>
		<a id="subtitle">1111111111111111111111</a>
		<a id="subtitle2">2222222222222222222222</a>
		<a id="subtitle3">3333333333333333333333</a>
	</nav>
	<div id='tu' style="height: 0.1em;width:80%;margin:auto;"></div>
	
	<div style="position:relative;background-color:#3e3e3e; width:80%;margin:auto;">
		<div style="position:relative;background-color:#404040; width:99%;height:99%;left:0.4em;">
			<div style="position:relative;background-color:#424242; width:99%;height:99%;left:0.4em;">
				<div style="position:relative;background-color:#444444; width:99%;height:99%;left:0.4em;">
					<div id="stage" style="position:relative;background-color:#464646; min-height:450px;width:99%;left:0.4em;">
						<span id="drag" style="position:relative;left:50px;top:50px;">drag me</span>
					</div>
				</div>
			</div>
		</div>

	</div>
		<div id='tu2' style="height: 0.1em;width:96%;margin:auto;"></div>