<?php
//	$title = "Project Ultimate";
?>

<?php
	function getHead($ttl){
		global $title;
		if (isset($ttl)){
			$title = $ttl;
		}
		require 'head.php';
	}
?>
