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
		<a href='/p/0' style="background-color:#444444;height:40px;">Pizza Shop</a>
		<a href='/p/1' style="background-color:#404040;height:40px;">Login</a>
		<a href='/p/0' style="background-color:#404040;height:40px;">Pizza Shop</a>
	</nav>
	<div id='tu' style="height: 0.1em;width:80%;margin:auto;"></div>
	<div style="background-color:#3a3a3a; width:80%;margin:auto;">
		<div style="background-color:#3c3c3c; width:99%;left:0.5%;">
			<div style="background-color:#3f3f3f; width:99%;left:0.5%;">
				<div style="background-color:#414141; width:99%;left:0.5%;">
					<div id="stage" style="background-color:#434343; min-height:450px;width:99%;left:0.5%;">
						<span id="drag" style="position:relative;left:50px;top:50px;">drag me</span>
					</div>
				</div>
			</div>
		</div>

	</div>
		<div id='tu2' style="height: 0.1em;width:96%;margin:auto;"></div>